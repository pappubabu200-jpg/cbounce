from sqlalchemy import Column, Integer, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .base import Base
import uuid, enum

class TxTypeEnum(str, enum.Enum):
    purchase = "purchase"
    consumption = "consumption"
    refund = "refund"
    bonus = "bonus"

class Credit(Base):
    __tablename__ = "credits"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), unique=True)
    balance = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CreditTransaction(Base):
    __tablename__ = "credit_transactions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    type = Column(Enum(TxTypeEnum))
    amount = Column(Integer, nullable=False)
    ref_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
