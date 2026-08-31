from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.decisions import AuditLogRecord
from app.db import repository

router = APIRouter()

@router.get("/{batch_id}", response_model=List[AuditLogRecord])
def get_audit_trail(batch_id: str):
    logs = repository.get_audit_logs(batch_id)
    if not logs:
        raise HTTPException(status_code=404, detail="Audit logs not found for batch")
    return logs
