from typing import List, Dict
from app.schemas.events import FailedPaymentEvent
from app.schemas.decisions import AuditLogRecord

# In-memory data stores for the MVP
batches: Dict[str, List[FailedPaymentEvent]] = {}
audit_logs: Dict[str, List[AuditLogRecord]] = {}

def store_batch(batch_id: str, events: List[FailedPaymentEvent]):
    batches[batch_id] = events
    
def get_batch(batch_id: str) -> List[FailedPaymentEvent]:
    return batches.get(batch_id, [])

def store_audit_logs(batch_id: str, logs: List[AuditLogRecord]):
    audit_logs[batch_id] = logs

def get_audit_logs(batch_id: str) -> List[AuditLogRecord]:
    return audit_logs.get(batch_id, [])
