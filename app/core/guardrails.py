from datetime import datetime
from app.schemas.events import FailedPaymentEvent

class Guardrails:
    MAX_RETRIES = 3
    
    @staticmethod
    def is_cooldown_active(event: FailedPaymentEvent) -> bool:
        if not event.cooldown_until:
            return False
        # If cooldown_until is in the future, it's active
        return datetime.utcnow() < event.cooldown_until.replace(tzinfo=None)

    @staticmethod
    def is_retry_limit_exceeded(event: FailedPaymentEvent) -> bool:
        return event.attempt_count >= Guardrails.MAX_RETRIES
