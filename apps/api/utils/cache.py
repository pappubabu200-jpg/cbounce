from core.engine import verifier

def cached_verify(email: str, check_smtp: bool = True, check_catch_all: bool = False) -> dict:
    return verifier.verify(email, check_smtp=check_smtp, check_catch_all=check_catch_all)
