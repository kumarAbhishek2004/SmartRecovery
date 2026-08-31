from fastapi import APIRouter, HTTPException
from app.db import repository

router = APIRouter()

@router.get("/{batch_id}")
def get_metrics(batch_id: str):
    logs = repository.get_audit_logs(batch_id)
    if not logs:
        raise HTTPException(status_code=404, detail="Metrics not found for batch")
        
    total_failed = 0.0
    total_recovered = 0.0
    action_counts = {}
    failure_counts = {}
    guardrails_triggered = 0
    
    for log in logs:
        amount = log.input_event.get("amount", 0)
        total_failed += amount
        
        action = log.action_taken
        action_counts[action] = action_counts.get(action, 0) + 1
        
        failure_code = log.input_event.get("failure_code", "unknown")
        failure_counts[failure_code] = failure_counts.get(failure_code, 0) + 1
        
        # Determine if guardrail was triggered (cooldown or max retry)
        rationale = log.decision.get("rationale", "")
        if "cooldown" in rationale.lower() or "limit" in rationale.lower() or "escalat" in rationale.lower():
            guardrails_triggered += 1
        
        if action == "retry":
            total_recovered += amount
            
    recovery_rate = (total_recovered / total_failed * 100) if total_failed > 0 else 0
    
    return {
        "total_failed_amount": total_failed,
        "recovered_amount": total_recovered,
        "recovery_rate": round(recovery_rate, 2),
        "action_breakdown": action_counts,
        "failure_reason_breakdown": failure_counts,
        "guardrails_triggered": guardrails_triggered,
        "total_events": len(logs)
    }
