from app.schemas.events import FailedPaymentEvent

class FailureClassifier:
    """
    Maps raw failure data into standardized buckets.
    """
    
    @staticmethod
    def classify(event: FailedPaymentEvent) -> str:
        # Rule-based classification based on failure code and message
        failure_code = event.failure_code.lower()
        message = event.failure_message.lower()
        
        if "insufficient" in failure_code or "funds" in message:
            return "insufficient_funds"
        
        if "expired" in failure_code or "mandate" in message:
            return "upi_mandate_expired"
            
        if "decline" in failure_code or "bank" in message:
            return "bank_decline"
            
        if "action" in failure_code or "required" in message:
            return "user_action_required"
            
        return "unknown"
