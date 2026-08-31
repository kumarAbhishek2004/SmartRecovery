from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FailedPaymentEvent(BaseModel):
    subscription_id: str
    customer_id: str
    amount: float
    currency: str = "INR"
    failure_code: str
    failure_message: str
    attempt_count: int
    last_success_at: Optional[datetime] = None
    channel_preference: str = "email"
    cooldown_until: Optional[datetime] = None
    batch_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
