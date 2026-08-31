from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RecoveryDecision(BaseModel):
    action_taken: str  # retry, remind, escalate, no_op, stop
    rationale: str
    confidence: float
    retry_scheduled_at: Optional[datetime] = None
    escalation_status: Optional[str] = None

class ActionExecutionResult(BaseModel):
    success: bool
    message: str
    executed_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLogRecord(BaseModel):
    subscription_id: str
    batch_id: str
    input_event: dict
    classification: str
    decision: dict
    action_taken: str
    action_result: dict
    outreach_content: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    final_state: str
