from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379"
    SUPABASE_JWT_SECRET: str
    SUPABASE_URL: str
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    RESEND_API_KEY: str = ""
    SENTRY_DSN: str = ""
    S3_BUCKET: str = "cbounce-results"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
