from fastapi import APIRouter, HTTPException, Request
from app.schemas.events import FailedPaymentEvent
from app.core.recovery_orchestrator import RecoveryOrchestrator
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/razorpay")
async def razorpay_webhook(request: Request):
    """
    Simulates a production-grade webhook listener for Razorpay.
    """
    payload = await request.json()
    event_type = payload.get("event")
    
    # We only process failed or halted events
    if event_type not in ["payment.failed", "subscription.halted", "subscription.pending"]:
        return {"status": "ignored", "message": f"Event type {event_type} not handled"}
        
    try:
        # Extract data from Razorpay's nested payload
        if event_type == "payment.failed":
            payment_entity = payload["payload"]["payment"]["entity"]
            amount = payment_entity.get("amount", 0) / 100.0 # Razorpay sends amount in paise
            failure_code = payment_entity.get("error_code", "unknown_error")
            failure_message = payment_entity.get("error_description", "")
            customer_id = payment_entity.get("customer_id", f"cust_{uuid.uuid4().hex[:8]}")
        else:
            # For subscription events
            sub_entity = payload["payload"]["subscription"]["entity"]
            amount = sub_entity.get("charge_amount", 0) / 100.0
            failure_code = "subscription_halted" if event_type == "subscription.halted" else "pending"
            failure_message = "Subscription status change"
            customer_id = sub_entity.get("customer_id", f"cust_{uuid.uuid4().hex[:8]}")

        # Normalize to our internal schema
        internal_event = FailedPaymentEvent(
            subscription_id=f"sub_{uuid.uuid4().hex[:8]}",
            customer_id=customer_id,
            amount=amount,
            currency="INR",
            failure_code=failure_code,
            failure_message=failure_message,
            attempt_count=1,
            channel_preference="whatsapp",
            batch_id=f"webhook_{uuid.uuid4().hex[:8]}",
            timestamp=datetime.utcnow()
        )
        
        # Instantly run through recovery engine
        logs = RecoveryOrchestrator.process_batch([internal_event])
        
        # In a real app we'd save to DB, here repository handles it during orchestrator/ingest flow.
        # Wait, orchestrator doesn't store in repo. We should store it.
        from app.db import repository
        repository.store_batch(internal_event.batch_id, [internal_event])
        
        return {"status": "success", "action_taken": logs[0].action_taken}
        
    except Exception as e:
        print(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail="Error processing webhook")
