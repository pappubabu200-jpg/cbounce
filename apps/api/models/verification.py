from sqlalchemy import Column, String, Integer, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base
import uuid, enum

class JobTypeEnum(str, enum.Enum):
    single = "single"
    bulk = "bulk"

class JobStatusEnum(str, enum.Enum):
    queued = "queued"
    processing = "processing"
    complete = "complete"
    failed = "failed"

class StatusEnum(str, enum.Enum):
    valid = "valid"
    invalid = "invalid"
    risky = "risky"
    disposable = "disposable"
    unknown = "unknown"

class VerificationJob(Base):
    __tablename__ = "verification_jobs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    type = Column(Enum(JobTypeEnum))
    status = Column(Enum(JobStatusEnum), default=JobStatusEnum.queued)
    total_count = Column(Integer, default=0)
    processed_count = Column(Integer, default=0)
    credits_used = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

class VerificationResult(Base):
    __tablename__ = "verification_results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("verification_jobs.id"))
    email = Column(String, nullable=False)
    status = Column(Enum(StatusEnum))
    score = Column(Integer, default=0)
    mx_valid = Column(Boolean, default=False)
    is_disposable = Column(Boolean, default=False)
    is_role_account = Column(Boolean, default=False)
    smtp_response = Column(String, nullable=True)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())
