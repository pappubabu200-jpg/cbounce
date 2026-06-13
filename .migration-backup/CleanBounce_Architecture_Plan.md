# CleanBounce AI — Production SaaS Architecture Plan
**Senior SaaS Architect Review | June 2026**

---

## Executive Summary

CleanBounce is migrating from a Streamlit prototype to a production-grade SaaS platform. This document defines the full architecture across repo structure, frontend, backend, database, API, auth, billing, multi-tenancy, and a phased scaling roadmap. The guiding principle: **ship fast, scale without rewrites.**

---

## 1. Repository Structure

Use a **monorepo** managed with `pnpm workspaces` (or Turborepo). Keeps frontend, backend, and shared types in sync without cross-repo coordination overhead.

```
cleanbounce/
├── apps/
│   ├── web/                  # Next.js frontend
│   └── api/                  # FastAPI backend
├── packages/
│   ├── shared-types/         # Zod schemas, TypeScript types (shared)
│   └── email-core/           # Pure Python verification logic (pip package)
├── infra/
│   ├── docker/
│   ├── terraform/
│   └── nginx/
├── scripts/                  # DB migrations, seed data, CI helpers
├── docs/                     # Architecture docs, API specs
├── .github/workflows/        # CI/CD pipelines
├── docker-compose.yml        # Local dev full stack
└── README.md
```

**Why monorepo:** API types stay in sync with frontend. Refactors touch one PR. Simpler CI.

---

## 2. Frontend Folder Structure (`apps/web/`)

```
apps/web/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages (no auth required)
│   │   ├── page.tsx              # Homepage
│   │   ├── pricing/
│   │   ├── integrations/
│   │   └── blog/
│   ├── (auth)/                   # Auth flow pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Protected app shell
│   │   ├── layout.tsx            # Sidebar + topbar shell
│   │   ├── dashboard/
│   │   ├── verify/               # Single email verification
│   │   ├── bulk/                 # Bulk verification
│   │   ├── leadshield/           # LeadShield™ config
│   │   ├── analytics/
│   │   ├── api-keys/
│   │   ├── billing/
│   │   └── settings/
│   └── (admin)/                  # Internal admin panel
│       ├── users/
│       ├── orgs/
│       └── transactions/
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── marketing/                # Homepage sections
│   ├── dashboard/                # App-specific components
│   └── shared/                   # Navbar, Footer, etc.
├── hooks/                        # Custom React hooks
├── lib/
│   ├── api.ts                    # API client (typed fetch wrapper)
│   ├── auth.ts                   # Supabase Auth helpers
│   └── utils.ts
├── store/                        # Zustand global state
├── types/                        # Frontend-only TypeScript types
└── public/
```

---

## 3. Backend Folder Structure (`apps/api/`)

```
apps/api/
├── main.py                       # FastAPI app entry point
├── config.py                     # Settings via pydantic-settings
├── dependencies.py               # FastAPI DI (get_db, get_current_user)
│
├── routers/
│   ├── auth.py                   # /auth/*
│   ├── verify.py                 # /verify/*
│   ├── bulk.py                   # /bulk/*
│   ├── leadshield.py             # /leadshield/*
│   ├── analytics.py              # /analytics/*
│   ├── credits.py                # /credits/*
│   ├── billing.py                # /billing/* (Stripe webhooks)
│   ├── api_keys.py               # /api-keys/*
│   ├── organizations.py          # /orgs/*
│   └── admin.py                  # /admin/* (internal)
│
├── services/
│   ├── email_verifier.py         # Core SMTP/DNS verification logic
│   ├── bulk_processor.py         # Queue + ThreadPoolExecutor
│   ├── leadshield.py             # Risk scoring engine
│   ├── credit_service.py         # Debit/credit logic
│   ├── billing_service.py        # Stripe integration
│   └── analytics_service.py     # Aggregation queries
│
├── models/
│   ├── user.py                   # SQLAlchemy ORM models
│   ├── organization.py
│   ├── verification.py
│   ├── credit.py
│   ├── billing.py
│   └── api_key.py
│
├── schemas/
│   ├── verify.py                 # Pydantic request/response schemas
│   ├── bulk.py
│   ├── billing.py
│   └── ...
│
├── db/
│   ├── session.py                # SQLAlchemy engine + session
│   └── migrations/               # Alembic migration files
│
├── workers/
│   ├── bulk_worker.py            # Celery/ARQ background jobs
│   └── webhook_worker.py        # Stripe event processor
│
├── middleware/
│   ├── rate_limit.py
│   ├── api_key_auth.py
│   └── logging.py
│
└── tests/
    ├── unit/
    └── integration/
```

---

## 4. Database Schema

### Core Tables (PostgreSQL)

#### `organizations`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | |
| slug | TEXT UNIQUE | URL-safe identifier |
| plan | ENUM | free / starter / pro / enterprise |
| created_at | TIMESTAMPTZ | |

#### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | Matches Supabase Auth UID |
| org_id | UUID FK → organizations | |
| email | TEXT UNIQUE | |
| role | ENUM | owner / admin / member / viewer |
| created_at | TIMESTAMPTZ | |

#### `credits`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK | |
| balance | INTEGER | Current credits |
| updated_at | TIMESTAMPTZ | |

#### `credit_transactions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK | |
| user_id | UUID FK | Who triggered it |
| type | ENUM | purchase / consumption / refund / bonus |
| amount | INTEGER | Positive = add, negative = debit |
| ref_id | UUID | Points to verification_jobs.id or invoice |
| created_at | TIMESTAMPTZ | |

#### `verification_jobs`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK | |
| user_id | UUID FK | |
| type | ENUM | single / bulk |
| status | ENUM | queued / processing / complete / failed |
| total_count | INTEGER | |
| processed_count | INTEGER | |
| result_url | TEXT | S3/R2 signed URL for bulk results |
| credits_used | INTEGER | |
| created_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |

#### `verification_results`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| job_id | UUID FK | |
| email | TEXT | |
| status | ENUM | valid / invalid / risky / disposable / unknown |
| score | INTEGER | 0–100 LeadShield risk score |
| mx_valid | BOOLEAN | |
| is_disposable | BOOLEAN | |
| is_role_account | BOOLEAN | |
| smtp_response | TEXT | |
| checked_at | TIMESTAMPTZ | |

#### `api_keys`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK | |
| user_id | UUID FK | Created by |
| name | TEXT | Label |
| key_hash | TEXT | bcrypt hash of the key |
| key_prefix | TEXT | First 8 chars shown in UI |
| scopes | TEXT[] | verify, bulk, leadshield, analytics |
| last_used_at | TIMESTAMPTZ | |
| is_active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

#### `subscriptions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK | |
| stripe_customer_id | TEXT | |
| stripe_subscription_id | TEXT | |
| plan | ENUM | |
| status | ENUM | active / past_due / canceled / trialing |
| current_period_end | TIMESTAMPTZ | |
| cancel_at_period_end | BOOLEAN | |

#### `leadshield_configs`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| org_id | UUID FK | |
| risk_threshold | INTEGER | Block above this score |
| block_disposable | BOOLEAN | |
| block_role_accounts | BOOLEAN | |
| custom_blocklist | TEXT[] | |
| widget_key | TEXT UNIQUE | Public embed key |
| allowed_domains | TEXT[] | CORS whitelist |

---

## 5. API Design

### Base URL
```
https://api.cleanbounce.ai/v1/
```

### Authentication Methods
- **Dashboard users:** Bearer JWT (from Supabase Auth)
- **API consumers:** `X-API-Key: cb_live_xxxx` header

### Endpoints

#### Verification
```
POST   /v1/verify/single          # Verify one email
POST   /v1/verify/bulk            # Upload + start bulk job
GET    /v1/verify/bulk/{job_id}   # Poll job status
GET    /v1/verify/bulk/{job_id}/results  # Download results
```

#### LeadShield™
```
POST   /v1/leadshield/check       # Real-time risk check (widget)
GET    /v1/leadshield/config      # Get org config
PUT    /v1/leadshield/config      # Update config
GET    /v1/leadshield/stats       # Blocked/passed counts
```

#### Analytics
```
GET    /v1/analytics/overview     # Totals, trends
GET    /v1/analytics/breakdown    # By status, domain, date range
GET    /v1/analytics/export       # CSV export
```

#### Credits & Billing
```
GET    /v1/credits/balance
GET    /v1/credits/transactions
POST   /v1/billing/checkout       # Create Stripe session
GET    /v1/billing/portal         # Stripe customer portal URL
POST   /v1/billing/webhook        # Stripe webhook receiver
```

#### API Keys
```
GET    /v1/api-keys
POST   /v1/api-keys               # Returns full key once only
DELETE /v1/api-keys/{id}
PATCH  /v1/api-keys/{id}          # Rename, toggle scopes
```

#### Organizations
```
GET    /v1/orgs/me
PATCH  /v1/orgs/me
GET    /v1/orgs/members
POST   /v1/orgs/members/invite
DELETE /v1/orgs/members/{user_id}
PATCH  /v1/orgs/members/{user_id}/role
```

### Response Format (consistent)
```json
{
  "success": true,
  "data": { ... },
  "meta": { "credits_used": 1, "credits_remaining": 4999 },
  "error": null
}
```

### Rate Limits
| Plan | Single Verify | Bulk | LeadShield |
|------|--------------|------|------------|
| Free | 10/min | 500/day | 50/min |
| Starter | 60/min | 10k/day | 200/min |
| Pro | 300/min | unlimited | 1000/min |
| Enterprise | Custom | Custom | Custom |

---

## 6. Authentication Architecture

### Strategy: Supabase Auth + Custom RBAC

```
Browser / API Client
       │
       ▼
Supabase Auth (JWT issuer)
       │  JWT in Authorization header
       ▼
FastAPI middleware
  ├─ Validates JWT signature (Supabase public key)
  ├─ Extracts user_id
  ├─ Loads user + org from DB
  └─ Injects into request context
       │
       ▼
Route handler (has user, org, role)
```

### Auth Flows

**Email/Password signup:**
1. Frontend calls Supabase `signUp()`
2. Supabase sends verification email
3. On confirm → Supabase triggers webhook → FastAPI creates `user` + `organization` + `credits` rows
4. Frontend redirects to dashboard

**API Key auth (for programmatic access):**
1. User creates key in dashboard → FastAPI generates `cb_live_` prefixed key → stores bcrypt hash
2. API consumer sends `X-API-Key` header
3. Middleware hashes incoming key → compares to DB → loads org context

### RBAC Roles
| Role | Permissions |
|------|------------|
| Owner | Full access, billing, delete org |
| Admin | All except billing and org delete |
| Member | Verify, bulk, view analytics |
| Viewer | Read-only analytics |

### Session Management
- JWT expiry: 1 hour (Supabase default)
- Refresh token: 30 days (handled automatically by Supabase JS client)
- API keys: never expire unless manually revoked

---

## 7. Billing Architecture

### Stack: Stripe + Supabase + FastAPI

```
User clicks "Upgrade"
       │
       ▼
POST /v1/billing/checkout
       │  Creates Stripe Checkout Session
       ▼
Stripe-hosted checkout page
       │  Payment complete
       ▼
Stripe → POST /v1/billing/webhook
       │  Event: checkout.session.completed
       │        invoice.paid
       │        customer.subscription.deleted
       ▼
FastAPI webhook handler
  ├─ Updates subscriptions table
  ├─ Tops up credits (if credit purchase)
  └─ Sends confirmation email (via Resend)
```

### Plans & Credits Model

| Plan | Monthly Price | Credits/mo | Overage |
|------|-------------|------------|---------|
| Free | $0 | 200 | — |
| Starter | $29 | 10,000 | $0.003/email |
| Pro | $79 | 50,000 | $0.0018/email |
| Enterprise | Custom | Custom | Negotiated |

**Credit pack add-ons** (one-time Stripe purchase):
- 10k credits — $25
- 50k credits — $99
- 200k credits — $299

### Key Stripe Events to Handle
- `checkout.session.completed` → activate subscription
- `invoice.paid` → monthly credit refresh
- `invoice.payment_failed` → send dunning email, grace period
- `customer.subscription.deleted` → downgrade to free, keep data 90 days

### Idempotency
All webhook handlers check `stripe_event_id` in a processed events table before executing. Prevents duplicate credit grants on retries.

---

## 8. Team / Organization Architecture

### Multi-Tenant Model: **Org-scoped, shared database**

Every database query is scoped by `org_id`. No separate schemas or databases per tenant at MVP.

```
Organization (1)
  ├── Users (many) — with roles
  ├── Credits (1)
  ├── Subscription (1)
  ├── API Keys (many)
  ├── Verification Jobs (many)
  └── LeadShield Config (1)
```

### Invite Flow
1. Admin enters invitee email → FastAPI generates signed invite token
2. Email sent via Resend with magic link
3. Invitee signs up (or logs in) → token binds them to the org
4. Default role: Member (configurable)

### Enterprise: Multiple Orgs / SSO
- Enterprise accounts can have sub-orgs (for agencies managing multiple clients)
- SSO via Supabase SAML support (plug-in when needed, no code rewrite)

---

## 9. Scaling Roadmap

### Phase 1 — MVP (Months 1–3)
**Goal:** Feature parity with Streamlit version + public launch

**Infrastructure:**
- Single Railway / Render deployment
- Supabase managed PostgreSQL
- Supabase Auth
- Stripe Checkout
- Vercel for Next.js frontend

**Architecture decisions:**
- No queue — bulk jobs run synchronously with ThreadPoolExecutor (up to 5k emails)
- SQLite → PostgreSQL migration done
- Redis not yet needed
- Single FastAPI instance

**What to skip:** SSO, advanced analytics, sub-orgs, webhooks to customers

---

### Phase 2 — Growth (Months 4–9)
**Goal:** Handle 100+ concurrent users, 10M+ verifications/month

**Infrastructure upgrades:**
- Add Redis (Upstash) for rate limiting + job queues
- Replace sync bulk processing with ARQ (async Redis queue) or Celery
- Add background worker Dyno/container
- Add CDN (Cloudflare) in front of API for caching MX lookups
- Object storage (Cloudflare R2) for bulk result CSV files

**Feature unlocks:**
- Customer-facing webhooks (Stripe-style delivery with retries)
- Usage-based billing (metered Stripe billing)
- Advanced analytics with date range filters
- Team audit logs

---

### Phase 3 — Enterprise (Month 10+)
**Goal:** Land $1k+/month accounts, SOC2 readiness

**Infrastructure upgrades:**
- Dedicated read replica for analytics queries
- Multi-region deployment (US + EU) for GDPR
- Horizontal scaling of API via load balancer
- PgBouncer connection pooling

**Feature unlocks:**
- SSO / SAML (Supabase built-in)
- Custom data retention policies
- Priority support SLA
- On-premise / VPC deployment option
- SLA uptime guarantee page
- Sub-org management for agencies

**Compliance:**
- SOC 2 Type I audit
- GDPR DPA template
- Data Processing Agreements

---

## 10. Recommended Development Order

### Sprint 0 (1 week) — Foundation
- Set up monorepo, Docker Compose local dev
- PostgreSQL schema + Alembic migrations
- Supabase Auth project configured
- FastAPI skeleton with health check
- Next.js project scaffolded with shadcn/ui

### Sprint 1 (2 weeks) — Auth + Core Verification
- Supabase signup/login flow in Next.js
- User + Org creation on signup (webhook)
- `POST /v1/verify/single` endpoint live
- API key generation + authentication middleware
- Credits table seeded with free tier balance

### Sprint 2 (2 weeks) — Bulk + Credits
- Bulk upload flow (CSV → job → results)
- Credit deduction service
- Dashboard: verification history, credit balance
- Basic usage analytics page

### Sprint 3 (2 weeks) — Billing
- Stripe integration (Checkout + webhooks)
- Pricing page with plan selection
- Credit pack purchases
- Subscription management (upgrade/downgrade/cancel)

### Sprint 4 (1 week) — LeadShield™
- LeadShield config page
- `/v1/leadshield/check` endpoint
- Embeddable widget JS snippet
- Risk score display in dashboard

### Sprint 5 (1 week) — Polish + Launch Prep
- Team invite flow
- API docs page (auto-generated from FastAPI OpenAPI)
- Onboarding checklist for new signups
- Error monitoring (Sentry)
- Uptime monitoring (Better Uptime)

### Sprint 6+ — Growth Features
- Customer webhooks
- Advanced analytics
- Audit logs
- Zapier/Make.com integration

---

## Key Technology Decisions Summary

| Concern | Choice | Reason |
|---------|--------|--------|
| Auth | Supabase Auth | Fast, handles email + OAuth + SAML |
| Database | PostgreSQL on Supabase | Managed, scales, RLS available |
| Backend | FastAPI | Fast dev, auto docs, async |
| Frontend | Next.js App Router | SSR for marketing, SPA for dashboard |
| Styling | Tailwind + shadcn/ui | Speed without custom CSS |
| Background jobs | ARQ (Redis) | Lightweight, Python-native |
| File storage | Cloudflare R2 | Cheap, fast, S3-compatible |
| Email | Resend | Developer-friendly, reliable |
| Billing | Stripe | Industry standard |
| Hosting (MVP) | Railway or Render | Zero DevOps, fast deploys |
| Monitoring | Sentry + Better Uptime | Coverage without complexity |

---

## Migration Path: Streamlit → Production

1. **Keep Streamlit running** as internal tool during migration — do not shut it down
2. **Migrate database** first: SQLite → PostgreSQL with a one-time data export script
3. **Port business logic** from `core/verification.py` and `utils/` into FastAPI services as-is — don't rewrite, just rewrap
4. **Build API first**, dashboard second — validate correctness before building UI
5. **Soft launch** with existing users on new stack before public announcement
6. **Retire Streamlit** once new dashboard hits feature parity + 30-day stability

---

*Document version: 1.0 | Architecture designed for 0 → $1M ARR without infrastructure rewrites.*
