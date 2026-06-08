from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base
import uuid, enum

class PlanEnum(str, enum.Enum):
    free = "free"
    starter = "starter"
    pro = "pro"
    scale = "scale"
    enterprise = "enterprise"

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    plan = Column(Enum(PlanEnum), default=PlanEnum.free)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
