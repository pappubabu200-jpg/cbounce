from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from .base import Base
import uuid

class LeadShieldConfig(Base):
    __tablename__ = "leadshield_configs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), unique=True)
    risk_threshold = Column(Integer, default=70)
    block_disposable = Column(Boolean, default=True)
    block_role_accounts = Column(Boolean, default=False)
    widget_key = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
