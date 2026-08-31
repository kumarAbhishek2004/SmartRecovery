from datetime import datetime, timedelta
from app.schemas.events import FailedPaymentEvent
from app.schemas.decisions import RecoveryDecision
from app.core.guardrails import Guardrails
from app.core.classifier import FailureClassifier

class PolicyEngine:
    """
    Decides the recovery action for a failed payment based on rules.
    """
    
    @staticmethod
    def decide(event: FailedPaymentEvent) -> RecoveryDecision:
        # 1. Check Guardrails
        if Guardrails.is_cooldown_active(event):
            return RecoveryDecision(
                action_taken="no_op",
                rationale="Customer is in active cooldown period.",
                confidence=1.0
            )
            
        if Guardrails.is_retry_limit_exceeded(event):
            return RecoveryDecision(
                action_taken="escalate",
                rationale=f"Max retry limit ({Guardrails.MAX_RETRIES}) reached.",
                confidence=1.0,
                escalation_status="requires_human_review"
            )
            
        # 2. Classification
        classification = FailureClassifier.classify(event)
        
        # 3. Decision Logic
        if classification == "insufficient_funds":
            # Retry after 24 hours
            return RecoveryDecision(
                action_taken="retry",
                rationale="Insufficient funds. Scheduling retry.",
                confidence=0.9,
                retry_scheduled_at=datetime.utcnow() + timedelta(days=1)
            )
            
        elif classification == "upi_mandate_expired":
            # Remind customer to renew mandate
            return RecoveryDecision(
                action_taken="remind",
                rationale="UPI mandate expired. Sending reminder to customer.",
                confidence=0.95
            )
            
        elif classification == "bank_decline":
            # Retry after 48 hours for general bank declines
            return RecoveryDecision(
                action_taken="retry",
                rationale="Bank decline detected. Scheduling delayed retry.",
                confidence=0.8,
                retry_scheduled_at=datetime.utcnow() + timedelta(days=2)
            )
            
        elif classification == "user_action_required":
            # Remind customer
            return RecoveryDecision(
                action_taken="remind",
                rationale="User action required (e.g. 2FA). Sending reminder.",
                confidence=0.9
            )
            
        elif classification == "unknown":
            # Unknown issues are automatically escalated
            return RecoveryDecision(
                action_taken="escalate",
                rationale="Unknown failure reason. Escalating for manual review.",
                confidence=0.5,
                escalation_status="unknown_failure_code"
            )
            
        # Fallback
        return RecoveryDecision(
            action_taken="stop",
            rationale="No applicable rule matched. Stopping automated recovery.",
            confidence=1.0
        )
