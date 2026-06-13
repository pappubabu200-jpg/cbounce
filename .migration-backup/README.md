# ⚡ cbounce.io

> Production-grade email verification & LeadShield™ SaaS platform.

## Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + SQLAlchemy + Alembic
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (JWT)
- **Billing**: Stripe
- **Queue**: ARQ (Redis)
- **Email**: Resend

## Quick Start

```bash
# 1. Install deps
cd apps/web && pnpm install
cd ../api && pip install -r requirements.txt

# 2. Setup env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 3. Run dev
docker compose up
```

## Structure
```
cbounce/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # FastAPI backend
├── packages/
│   └── shared/     # Shared types & utils
└── infra/          # Docker, nginx, terraform
```
