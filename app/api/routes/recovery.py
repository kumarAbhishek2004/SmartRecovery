from fastapi import APIRouter, HTTPException
from typing import List
from app.db import repository
from app.core.recovery_orchestrator import RecoveryOrchestrator
from app.schemas.decisions import AuditLogRecord

router = APIRouter()

@router.post("/{batch_id}", response_model=List[AuditLogRecord])
def run_recovery(batch_id: str):
    events = repository.get_batch(batch_id)
    if not events:
        raise HTTPException(status_code=404, detail="Batch not found")
        
    audit_logs = RecoveryOrchestrator.process_batch(events)
    repository.store_audit_logs(batch_id, audit_logs)
    
    return audit_logs
