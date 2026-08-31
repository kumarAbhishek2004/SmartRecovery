import random
import uuid
from datetime import datetime, timedelta
from app.schemas.events import FailedPaymentEvent

def generate_synthetic_batch(num_records: int = 50, batch_id: str = None) -> list[FailedPaymentEvent]:
    if not batch_id:
        batch_id = f"batch_{uuid.uuid4().hex[:8]}"
        
    failure_codes = [
        "insufficient_funds",
        "upi_mandate_expired",
        "bank_decline",
        "user_action_required",
        "unknown_error"
    ]
    
    channel_prefs = ["email", "sms", "whatsapp"]
    records = []
    base_time = datetime.utcnow()
    
    for _ in range(num_records):
        failure_code = random.choices(
            failure_codes, 
            weights=[0.4, 0.2, 0.2, 0.1, 0.1], 
            k=1
        )[0]
        
        attempt_count = random.randint(1, 4)
        is_cooldown = random.choice([True, False, False])
        
        cooldown_until = None
        if is_cooldown:
            cooldown_until = base_time + timedelta(hours=random.randint(1, 24))
            
        record = FailedPaymentEvent(
            subscription_id=f"sub_{uuid.uuid4().hex[:8]}",
            customer_id=f"cust_{uuid.uuid4().hex[:8]}",
            amount=round(random.uniform(99.0, 999.0), 2),
            currency="INR",
            failure_code=failure_code,
            failure_message=f"Payment failed due to {failure_code.replace('_', ' ')}",
            attempt_count=attempt_count,
            last_success_at=base_time - timedelta(days=30),
            channel_preference=random.choice(channel_prefs),
            cooldown_until=cooldown_until,
            batch_id=batch_id,
            timestamp=base_time
        )
        records.append(record)
        
    return records
