from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import time
import random
import uuid
import json
import os
from pathlib import Path

router = APIRouter()
DB_PATH = Path(os.getcwd()) / "db.json"

def save_state(state):
    with open(DB_PATH, "w") as f:
        json.dump(state, f, indent=4)

def load_state():
    if not DB_PATH.exists():
        return {"campaigns": []}
    with open(DB_PATH, "r") as f:
        return json.load(f)

@router.post("/razorpay")
async def razorpay_webhook(request: Request):
    """
    Simulates receiving a real payment.failed webhook from Razorpay's servers.
    """
    try:
        # In a real app, we would verify the razorpay signature here
        payload = await request.json()
        
        # We only care about failed payments
        if payload.get("event") != "payment.failed":
            return {"status": "ignored", "reason": "Event not actionable"}
            
        payment_data = payload.get("payload", {}).get("payment", {}).get("entity", {})
        
        # Extract data from the Razorpay Webhook
        amount = payment_data.get("amount", 0) / 100 # Razorpay sends amounts in paise
        customer_email = payment_data.get("email", "unknown@example.com")
        customer_phone = payment_data.get("contact", "+919999999999")
        failure_reason = payment_data.get("error_description", "bank_decline")
        
        def calculate_smart_risk(reason, plan, amt):
            score = 50
            # Gateway Reason
            if "card_expired" in reason.lower():
                score -= 40
            elif "insufficient_funds" in reason.lower():
                score -= 10
            elif "fraud" in reason.lower() or "do_not_honor" in reason.lower():
                score += 35
            
            # Plan Type
            if "enterprise" in plan.lower():
                score -= 10
            elif "basic" in plan.lower():
                score += 15
                
            # Amount
            if amt > 10000:
                score += 10
                
            return max(1, min(99, score))
            
        # 1. Run through AI Risk Engine (Smart)
        risk_score = calculate_smart_risk(failure_reason, "Custom Webhook Plan", amount)
        
        # 2. Create an autonomous campaign
        new_campaign = {
            "id": f"REC-{random.randint(10000, 99999)}",
            "customerName": customer_email.split('@')[0].capitalize(),
            "amount": amount,
            "plan": "Custom Webhook Plan",
            "failureReasonText": failure_reason,
            "riskScore": risk_score,
            "channelUsed": "WhatsApp",
            "status": "IN_RECOVERY",
            "agentActionSummary": f"Webhook detected failure. AI Risk Score: {risk_score}/100. Initiating auto-recovery sequence.",
            "discountApplied": "None yet",
            "timeline": [
                {
                    "time": time.strftime("%H:%M"),
                    "event": "Automated Webhook ingestion"
                },
                {
                    "time": time.strftime("%H:%M"),
                    "event": "AI Risk Engine scored payment failure"
                }
            ]
        }
        
        # 3. Save to database
        state = load_state()
        state["campaigns"].insert(0, new_campaign)
        save_state(state)
        
        return {"status": "success", "message": "Webhook ingested and campaign created", "campaign_id": new_campaign["id"]}

    except Exception as e:
        print(f"Webhook Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid webhook payload")
