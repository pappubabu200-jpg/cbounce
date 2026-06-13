"""
CleanBounce Pro v2.1 - Ported to FastAPI
"""
import re
import dns.resolver
import smtplib
import socket
import time
import random
import uuid
import json
import hashlib
import os
from typing import Dict, List, Optional
from collections import defaultdict

try:
    import redis
    redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"), decode_responses=True)
    redis_client.ping()
except:
    redis_client = None

class CleanBounceEngineV2:
    def __init__(self, timeout: int = 10, use_cache: bool = True):
        self.timeout = timeout
        self.use_cache = use_cache
        self.disposable_domains = self._load_disposable_domains()

        self.role_accounts = {
            'admin', 'administrator', 'info', 'contact', 'support', 'sales',
            'help', 'billing', 'noreply', 'no-reply', 'postmaster', 'webmaster',
            'abuse', 'security', 'marketing', 'team', 'office', 'mail', 'hr',
            'jobs', 'careers', 'press', 'media', 'partners', 'legal', 'finance',
            'hello', 'hi', 'test', 'demo', 'enquiries'
        }

        self.accept_all_domains = {
            'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com',
            'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
            'icloud.com', 'me.com', 'mac.com', 'protonmail.com',
            'proton.me', 'aol.com'
        }

        self.typo_corrections = {
            'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com',
            'gmil.com': 'gmail.com', 'gamil.com': 'gmail.com',
            'gnail.com': 'gmail.com', 'yaho.com': 'yahoo.com',
            'yahooo.com': 'yahoo.com', 'hotmial.com': 'hotmail.com',
            'outlok.com': 'outlook.com', 'icloud.co': 'icloud.com'
        }

        self.helo_domain = 'cbounce.io'
        self.from_email = '<>'

        self.dns_resolver = dns.resolver.Resolver(configure=False)
        self.dns_resolver.nameservers = ['8.8.8.8', '1.1.1.1', '9.9.9.9']
        self.dns_resolver.timeout = 3
        self.dns_resolver.lifetime = 3

        self.domain_last_check = defaultdict(float)
        self.domain_delays = {
            'gmail.com': 0, 'yahoo.com': 0,
            'outlook.com': 3.0, 'hotmail.com': 3.0, 'icloud.com': 2.0
        }

    def _load_disposable_domains(self) -> set:
        try:
            disposable_path = os.path.join(os.path.dirname(__file__), 'disposable_domains.txt')
            with open(disposable_path, 'r') as f:
                return set(line.strip() for line in f)
        except:
            return {
                '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
                'tempmail.com', 'throwaway.email', 'yopmail.com',
                'temp-mail.org', 'getnada.com', 'maildrop.cc',
                'sharklasers.com', 'fakeinbox.com', 'trashmail.com',
                'mytrashmail.com', 'mailnesia.com', 'tempinbox.com',
                'dispostable.com', 'tempmailaddress.com', 'spamgourmet.com',
                'guerrillamailblock.com', 'grr.la', 'spam4.me',
                'mailnull.com', 'throwam.com', 'getairmail.com',
            }

    def verify(self, email: str, check_smtp: bool = True, check_catch_all: bool = False) -> Dict:
        email = email.lower().strip()

        if self.use_cache and redis_client:
            cache_key = f"verify:{hashlib.md5(email.encode()).hexdigest()}:{check_smtp}"
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    return json.loads(cached)
            except:
                pass

        result = self._verify_internal(email, check_smtp, check_catch_all)

        if self.use_cache and redis_client and result.get('status') != 'retry':
            try:
                redis_client.setex(cache_key, 3600, json.dumps(result))
            except:
                pass

        return result

    def _verify_internal(self, email: str, check_smtp: bool, check_catch_all: bool) -> Dict:
        start_time = time.time()

        result = {
            'email': email,
            'valid': False,
            'status': 'invalid',
            'score': 0,
            'reason': '',
            'confidence': 0.0,
            'details': {
                'syntax_valid': False,
                'typo_detected': False,
                'suggestion': None,
                'disposable': False,
                'role_account': False,
                'mx_valid': False,
                'mx_records': [],
                'smtp_valid': False,
                'smtp_code': None,
                'catch_all': False,
                'greylisted': False,
                'accept_all': False,
            },
        }

        # Layer 1: Syntax
        syntax = self._check_syntax(email)
        if not syntax['valid']:
            result['reason'] = syntax['error']
            result['response_time'] = round(time.time() - start_time, 3)
            return result

        result['details']['syntax_valid'] = True
        result['score'] += 10

        local, domain = email.rsplit('@', 1)
        result['details']['domain'] = domain
        result['details']['local_part'] = local

        # Layer 2: Typo
        typo = self._check_typo(domain)
        if typo:
            result['details']['typo_detected'] = True
            result['details']['suggestion'] = f"{local}@{typo}"
            result['score'] -= 5

        # Layer 3: Disposable
        if domain in self.disposable_domains:
            result['details']['disposable'] = True
            result['reason'] = 'Disposable email'
            result['status'] = 'invalid'
            result['score'] = 0
            result['response_time'] = round(time.time() - start_time, 3)
            return result

        result['score'] += 10

        # Layer 4: Role account
        if local.lower() in self.role_accounts:
            result['details']['role_account'] = True
            result['status'] = 'role'
            result['score'] -= 10
        else:
            result['score'] += 5

        # Layer 5: MX records
        mx_records = self._get_mx_records(domain)
        if not mx_records:
            result['reason'] = 'No MX records'
            result['response_time'] = round(time.time() - start_time, 3)
            return result

        result['details']['mx_valid'] = True
        result['details']['mx_records'] = mx_records[:3]
        result['score'] += 20

        # Layer 6: Accept-all domains (Gmail etc)
        if domain in self.accept_all_domains:
            result['details']['accept_all'] = True
            result['valid'] = True
            result['status'] = 'valid'
            result['score'] += 50
            result['reason'] = 'Major provider — accepted'
            result['confidence'] = 0.85
            return self._finalize(result, start_time)

        # Layer 7: SMTP
        if check_smtp:
            self._rate_limit_domain(domain)
            smtp = self._smtp_check(email, mx_records[0])
            result['details']['smtp_valid'] = smtp.get('valid', False)
            result['details']['smtp_code'] = smtp.get('smtp_code')
            result['details']['greylisted'] = smtp.get('greylisted', False)

            if smtp['status'] == 'valid':
                result['valid'] = True
                result['status'] = 'valid'
                result['score'] += 45
                result['reason'] = 'Mailbox verified'
                result['confidence'] = 0.95
            elif smtp['status'] == 'invalid':
                result['valid'] = False
                result['status'] = 'invalid'
                result['reason'] = smtp.get('reason', 'Mailbox not found')
            elif smtp['status'] == 'retry':
                result['status'] = 'unknown'
                result['reason'] = smtp.get('reason', 'Greylisted')
                result['score'] += 20
                result['confidence'] = 0.5
        else:
            result['valid'] = True
            result['status'] = 'valid'
            result['score'] += 30
            result['reason'] = 'MX valid — SMTP not checked'
            result['confidence'] = 0.7

        # Layer 8: Catch-all
        if check_catch_all and result['valid'] and mx_records:
            is_catchall = self._check_catch_all(domain, mx_records[0])
            result['details']['catch_all'] = is_catchall
            if is_catchall:
                result['score'] -= 20
                result['confidence'] *= 0.7
                result['status'] = 'accept_all'

        return self._finalize(result, start_time)

    def _finalize(self, result, start_time):
        result['score'] = max(0, min(100, result['score']))
        result['response_time'] = round(time.time() - start_time, 3)

        if result['status'] == 'valid' and result['score'] >= 90:
            result['deliverability'] = 'excellent'
        elif result['status'] == 'valid':
            result['deliverability'] = 'good'
        elif result['status'] == 'accept_all':
            result['deliverability'] = 'risky'
        elif result['status'] == 'role':
            result['deliverability'] = 'fair'
        else:
            result['deliverability'] = 'poor'

        return result

    def _check_syntax(self, email: str) -> Dict:
        if not email or '@' not in email:
            return {'valid': False, 'error': 'Missing @'}
        if email.count('@') != 1:
            return {'valid': False, 'error': 'Multiple @'}
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, email):
            return {'valid': False, 'error': 'Invalid syntax'}
        local, domain = email.rsplit('@', 1)
        if len(local) > 64 or len(email) > 254:
            return {'valid': False, 'error': 'Too long'}
        if local.startswith('.') or local.endswith('.') or '..' in local:
            return {'valid': False, 'error': 'Invalid local part'}
        return {'valid': True, 'error': ''}

    def _check_typo(self, domain: str) -> Optional[str]:
        return self.typo_corrections.get(domain.lower())

    def _get_mx_records(self, domain: str) -> List[str]:
        if redis_client:
            try:
                cached = redis_client.get(f"mx:{domain}")
                if cached:
                    return json.loads(cached)
            except:
                pass
        try:
            answers = self.dns_resolver.resolve(domain, 'MX')
            mx_list = sorted([(r.preference, str(r.exchange).rstrip('.')) for r in answers])
            result = [mx[1] for mx in mx_list]
            if redis_client:
                try:
                    redis_client.setex(f"mx:{domain}", 86400, json.dumps(result))
                except:
                    pass
            return result
        except:
            return []

    def _rate_limit_domain(self, domain: str):
        delay = self.domain_delays.get(domain, 0.5)
        last = self.domain_last_check[domain]
        elapsed = time.time() - last
        if elapsed < delay:
            time.sleep(delay - elapsed)
        self.domain_last_check[domain] = time.time()

    def _smtp_check(self, email: str, mx_host: str, timeout: int = 10) -> Dict:
        server = None
        try:
            server = smtplib.SMTP(timeout=timeout)
            server.connect(mx_host, 25)
            server.ehlo(self.helo_domain)
            server.mail(self.from_email)
            code, message = server.rcpt(email)
            server.quit()
            msg = message.decode('utf-8', errors='ignore').lower() if isinstance(message, bytes) else str(message).lower()
            if code == 250:
                return {'valid': True, 'status': 'valid', 'reason': 'Mailbox exists', 'smtp_code': code, 'greylisted': False}
            elif code == 550 or 'user unknown' in msg:
                return {'valid': False, 'status': 'invalid', 'reason': 'Mailbox not found', 'smtp_code': code, 'greylisted': False}
            elif code in [451, 421, 452] or 'greylist' in msg:
                return {'valid': None, 'status': 'retry', 'reason': f'Greylisted', 'smtp_code': code, 'greylisted': True}
            else:
                return {'valid': None, 'status': 'unknown', 'reason': f'SMTP {code}', 'smtp_code': code, 'greylisted': False}
        except smtplib.SMTPServerDisconnected:
            return {'valid': None, 'status': 'retry', 'reason': 'Disconnected', 'smtp_code': None, 'greylisted': False}
        except smtplib.SMTPConnectError:
            return {'valid': None, 'status': 'unknown', 'reason': 'Connection refused', 'smtp_code': None, 'greylisted': False}
        except socket.timeout:
            return {'valid': None, 'status': 'retry', 'reason': 'Timeout', 'smtp_code': None, 'greylisted': False}
        except Exception as e:
            return {'valid': None, 'status': 'unknown', 'reason': str(e)[:50], 'smtp_code': None, 'greylisted': False}
        finally:
            if server:
                try: server.close()
                except: pass

    def _check_catch_all(self, domain: str, mx_host: str) -> bool:
        tests = [
            f"test-{uuid.uuid4().hex[:8]}@{domain}",
            f"bounce-{int(time.time())}@{domain}",
            f"z{random.randint(100000,999999)}@{domain}"
        ]
        accepts = 0
        for test_email in tests:
            r = self._smtp_check(test_email, mx_host, timeout=5)
            if r.get('smtp_code') == 250:
                accepts += 1
            time.sleep(2)
        return accepts >= 2


# Global instance
verifier = CleanBounceEngineV2()

async def check_email(email: str, check_smtp: bool = False) -> dict:
    """FastAPI compatible async wrapper"""
    result = verifier.verify(email, check_smtp=check_smtp)
    details = result.get('details', {})
    return {
        'email': result.get('email'),
        'status': result.get('status', 'unknown'),
        'score': result.get('score', 0),
        'valid': result.get('valid', False),
        'reason': result.get('reason', ''),
        'deliverability': result.get('deliverability', 'poor'),
        'confidence': result.get('confidence', 0),
        'response_time': result.get('response_time', 0),
        'mx_valid': details.get('mx_valid', False),
        'is_disposable': details.get('disposable', False),
        'is_role_account': details.get('role_account', False),
        'catch_all': details.get('catch_all', False),
        'typo_suggestion': details.get('suggestion'),
        'smtp_code': details.get('smtp_code'),
    }
