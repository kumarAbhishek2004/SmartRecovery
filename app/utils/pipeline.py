import csv
import io
import uuid
from datetime import datetime
from typing import List
from app.schemas.events import FailedPaymentEvent

class DataTransformer:
    @staticmethod
    def transform_csv(csv_content: str, batch_id: str = None) -> List[FailedPaymentEvent]:
        if not batch_id:
            batch_id = f"batch_{uuid.uuid4().hex[:8]}"
            
        reader = csv.DictReader(io.StringIO(csv_content.strip()))
        headers = [h.lower().strip() for h in (reader.fieldnames or [])]
        
        # Map headers
        col_map = {
            "customer": ["customer_id", "user", "client", "customer"],
            "amount": ["amount", "price", "amt", "value", "cost"],
            "failure": ["error", "reason", "failure_code", "status", "message"]
        }
        
        mapped_headers = {}
        for expected, possibilities in col_map.items():
            for h in headers:
                if any(p in h for p in possibilities):
                    mapped_headers[expected] = h
                    break
        
        events = []
        for row in reader:
            # Extract basic fields safely using mapped headers
            cust_id = row.get(mapped_headers.get("customer", ""), f"cust_{uuid.uuid4().hex[:8]}")
            raw_amount = row.get(mapped_headers.get("amount", ""), "0")
            try:
                amount = float(raw_amount.replace("$", "").replace(",", ""))
            except ValueError:
                amount = 0.0
                
            raw_failure = row.get(mapped_headers.get("failure", ""), "unknown").lower()
            
            # Map failure reason to strict enum
            if "fund" in raw_failure or "balance" in raw_failure:
                failure_code = "insufficient_funds"
            elif "decline" in raw_failure or "bank" in raw_failure:
                failure_code = "bank_decline"
            elif "expire" in raw_failure or "mandate" in raw_failure:
                failure_code = "upi_mandate_expired"
            elif "action" in raw_failure or "auth" in raw_failure or "2fa" in raw_failure:
                failure_code = "user_action_required"
            else:
                failure_code = "unknown_error"
                
            event = FailedPaymentEvent(
                subscription_id=f"sub_{uuid.uuid4().hex[:8]}", # imputed
                customer_id=cust_id,
                amount=amount,
                currency="INR",
                failure_code=failure_code,
                failure_message=raw_failure[:50] if raw_failure else "Unknown failure",
                attempt_count=1, # Default assumption for raw data
                channel_preference="email", # imputed
                batch_id=batch_id,
                timestamp=datetime.utcnow()
            )
            events.append(event)
            
        return events
