from fastapi import APIRouter, Request, HTTPException
from typing import Dict, Any, List
from datetime import datetime
import json
import random

def calculate_smart_risk(reason, plan, amt):
    score = 50
    if "card_expired" in reason.lower():
        score -= 40
    elif "insufficient_funds" in reason.lower():
        score -= 10
    elif "fraud" in reason.lower() or "do_not_honor" in reason.lower():
        score += 35
    if "enterprise" in plan.lower():
        score -= 10
    elif "basic" in plan.lower():
        score += 15
    if amt > 10000:
        score += 10
    return max(1, min(99, score))

router = APIRouter()

# Mock data equivalent
initial_merchant_state = {
  "merchantInfo": {
    "name": "AuraCloud SaaS & E-Commerce",
    "merchantId": "mid_razor_98241",
    "tier": "Enterprise Merchant",
    "currency": "INR",
    "activeSubscriptions": 14200,
    "monthlyARR": 4850000 
  },
  "metrics": {
    "arrAtRisk": 684500,
    "arrRecovered": 492100, 
    "recoverySuccessRate": 71.9,
    "totalFailedPayments": 342,
    "activeRecoveryCampaigns": 48,
    "avgRecoveryTimeHours": 4.2
  },
  "failureReasonsDistribution": [
    { "category": "Soft Decline (Insufficient Funds / Limit)", "percentage": 38, "count": 130, "color": "#3a86ff" },
    { "category": "Bank Network Outage / Downtime", "percentage": 26, "count": 89, "color": "#f59e0b" },
    { "category": "Card Expired / Invalid Details", "percentage": 18, "count": 62, "color": "#ec4899" },
    { "category": "Razorpay Mandate Drop / Autopay Auth", "percentage": 12, "count": 41, "color": "#8b5cf6" },
    { "category": "OTP Timeout & Customer Abandonment", "percentage": 6, "count": 20, "color": "#ef4444" }
  ],
  "campaigns": [
    {
      "id": "REC-89021",
      "customerName": "Vikram Malhotra",
      "email": "vikram.m@techcorp.in",
      "phone": "+91 98765 43210",
      "amount": 14999,
      "plan": "Pro Scale Annual (SaaS)",
      "failedAt": "2026-08-27T18:30:00Z",
      "failureReason": "bank_outage",
      "failureReasonText": "HDFC Bank NetBanking Gateway Timeout (HTTP 504)",
      "riskScore": 84,
      "status": "RECOVERED",
      "channelUsed": "WhatsApp + UPI Intent Link",
      "agentActionSummary": "Diagnosed bank outage. Paused immediate auto-retry. Triggered WhatsApp recovery with 1-click Razorpay UPI Intent link at 08:00 PM during bank uptime.",
      "recoveredAt": "2026-08-27T20:15:00Z",
      "discountApplied": "None (Outage Retry)",
      "timeline": [
        { "time": "18:30", "event": "Razorpay Webhook payment.failed received (Err: BANK_GATEWAY_DOWN)" },
        { "time": "18:31", "event": "AI Diagnoser Agent flagged high-value subscription churn risk (Risk Score: 84/100)" },
        { "time": "18:31", "event": "AI Smart Scheduler queued retry for 20:00 after verifying HDFC node recovery" },
        { "time": "20:00", "event": "AI Conversational Agent dispatched WhatsApp interactive UPI payment link" },
        { "time": "20:15", "event": "Customer completed payment via Google Pay UPI (Payment ID: pay_P9812401)" }
      ]
    }
  ]
}

import os
import json
import copy

DB_FILE = "db.json"

def save_state():
    with open(DB_FILE, "w") as f:
        json.dump(state, f)

def load_state():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                return json.load(f)
        except:
            pass
    return copy.deepcopy(initial_merchant_state)

state = load_state()

@router.get("/overview")
async def get_overview():
    return {
        "merchantInfo": state["merchantInfo"],
        "metrics": state["metrics"],
        "failureReasonsDistribution": state["failureReasonsDistribution"]
    }

@router.get("/campaigns")
async def get_campaigns():
    state = load_state()
    return state["campaigns"]

@router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str):
    global state
    state = load_state()
    for i, c in enumerate(state["campaigns"]):
        if c["id"] == campaign_id:
            # Adjust metrics
            state["metrics"]["totalFailedPayments"] -= 1
            if c["status"] != "RECOVERED":
                state["metrics"]["arrAtRisk"] = max(0, state["metrics"]["arrAtRisk"] - c["amount"])
                state["metrics"]["activeRecoveryCampaigns"] = max(0, state["metrics"]["activeRecoveryCampaigns"] - 1)
            else:
                state["metrics"]["arrRecovered"] = max(0, state["metrics"]["arrRecovered"] - c["amount"])
            
            del state["campaigns"][i]
            save_state()
            return {"success": True}
    raise HTTPException(status_code=404, detail="Campaign not found")

@router.post("/reset")
async def reset_session():
    global state
    state = copy.deepcopy(initial_merchant_state)
    save_state()
    return {"success": True, "message": "Reset"}

from fastapi import UploadFile, File
import io
import csv

@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    global state
    state = load_state()
    content = await file.read()
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        try:
            text = content.decode("utf-16")
        except UnicodeDecodeError:
            text = content.decode("windows-1252", errors="ignore")
    
    reader = csv.DictReader(io.StringIO(text))
    count = 0
    
    from app.schemas.events import FailedPaymentEvent
    from app.core.recovery_orchestrator import RecoveryOrchestrator
    
    for row in reader:
        customerName = row.get("customerName", f"Customer_{random.randint(100,999)}")
        email = row.get("email", f"{customerName.replace(' ', '').lower()}@example.com")
        amount_str = row.get("amount", "1000")
        try:
            amount = float(amount_str)
        except:
            amount = 1000.0
            
        plan = row.get("plan", "Standard Plan")
        failureReason = row.get("failureReason", "insufficient_funds")
        
        event = FailedPaymentEvent(
            subscription_id=f"sub_{random.randint(1000, 9999)}",
            customer_id=customerName,
            amount=amount,
            currency="INR",
            gateway="razorpay",
            failure_code=failureReason,
            failure_reason=failureReason,
            failure_message=failureReason,
            attempt_count=1,
            timestamp=datetime.utcnow().isoformat(),
            batch_id=f"batch_csv_{random.randint(100,999)}"
        )
        
        audit_logs = RecoveryOrchestrator.process_batch([event])
        audit_log = audit_logs[0]
        
        newCampaign = {
            "id": f"REC-{random.randint(10000, 99999)}",
            "customerName": customerName,
            "email": email,
            "amount": amount,
            "plan": plan,
            "failureReasonText": failureReason,
            "riskScore": calculate_smart_risk(failureReason, plan, amount),
            "channelUsed": audit_log.decision.get("primary_channel", "WhatsApp"),
            "status": "IN_RECOVERY",
            "recoveryLinkId": f"paylink_rz_{random.randint(100000, 999999)}",
            "timeline": [
                { "time": datetime.utcnow().strftime("%H:%M"), "event": f"Automated Recovery Triggered" }
            ],
            "agentActionSummary": audit_log.decision.get("rationale")
        }
        
        state["metrics"]["totalFailedPayments"] += 1
        state["metrics"]["arrAtRisk"] += amount
        state["metrics"]["activeRecoveryCampaigns"] += 1
        state["campaigns"].insert(0, newCampaign)
        count += 1
        
    save_state()
    return {"success": True, "message": f"Successfully imported {count} campaigns"}

@router.post("/simulate-failure")
async def simulate_failure(request: Request):
    global state
    state = load_state()
    # This integrates with our backend Logic!
    from app.schemas.events import FailedPaymentEvent
    from app.core.recovery_orchestrator import RecoveryOrchestrator
    
    body = await request.json()
    amount = float(body.get("amount", 8999))
    customerName = body.get("customerName", "Priya Nambiar")
    failureReason = body.get("failureReason", "bank_outage")
    
    # Run through our actual Policy Engine / Orchestrator!
    event = FailedPaymentEvent(
        subscription_id=f"sub_{random.randint(1000, 9999)}",
        customer_id=customerName,
        amount=amount,
        currency="INR",
        failure_code=failureReason,
        failure_message=body.get("rawErrorMessage", ""),
        attempt_count=1,
        channel_preference="whatsapp",
        batch_id="ui_sim",
        timestamp=datetime.utcnow()
    )
    
    logs = RecoveryOrchestrator.process_batch([event])
    audit_log = logs[0]
    
    # Map back to UI format
    newCampaign = {
      "id": f"REC-{random.randint(90000, 99999)}",
      "customerName": customerName,
      "email": body.get("email", ""),
      "phone": body.get("phone", ""),
      "amount": amount,
      "plan": body.get("plan", ""),
      "failedAt": datetime.utcnow().isoformat(),
      "failureReason": failureReason,
      "failureReasonText": audit_log.classification,
      "riskScore": calculate_smart_risk(failureReason, body.get("plan", ""), amount),
      "status": "IN_RECOVERY",
      "channelUsed": "WhatsApp",
      "agentActionSummary": audit_log.decision.get('rationale', 'Action taken by AI'),
      "recoveryLink": audit_log.outreach_content.get('recovery_url', '') if audit_log.outreach_content else "",
      "recoveryLinkId": f"paylink_rz_{random.randint(100000, 999999)}",
      "recoveredAt": None,
      "discountApplied": audit_log.outreach_content.get('incentive_code') if audit_log.outreach_content and audit_log.outreach_content.get('incentive_code') else "None",
      "timeline": [
        { "time": datetime.utcnow().strftime("%H:%M"), "event": f"Webhook received" },
        { "time": datetime.utcnow().strftime("%H:%M"), "event": f"AI Decision: {audit_log.action_taken}" },
        { "time": datetime.utcnow().strftime("%H:%M"), "event": f"Generated Msg: {audit_log.outreach_content.get('whatsapp_text', '')[:50]}..." if audit_log.outreach_content else "No msg" }
      ],
      "rawDiagnosis": {},
      "rawRetryStrategy": {},
      "rawDunningContent": audit_log.outreach_content or {}
    }
    
    # --- Dynamic Risk Scoring Engine ---
    base_score = 50
    if failureReason == "bank_outage":
        base_score = 15  # Low risk: just a temporary server issue
    elif failureReason == "insufficient_funds":
        base_score = 85  # High risk: customer might not have money to pay
    elif failureReason == "card_expired":
        base_score = 70  # Med-High risk: high friction to update card details
    elif failureReason == "mandate_failed":
        base_score = 65  # Med risk: auth failed, friction to re-auth
    elif failureReason == "customer_abandoned":
        base_score = 95  # Critical risk: they actively closed the window!
        
    # Scale risk slightly up if the amount is very high (High-Value Customers are a bigger ARR risk)
    if amount > 10000:
        base_score = min(99, base_score + 10)
    elif amount < 2000:
        base_score = max(5, base_score - 10)
        
    calculated_risk_score = base_score
    
    fullEngineResult = {
        "campaignId": newCampaign["id"],
        "executionLog": [
            { "time": datetime.utcnow().strftime("%H:%M:%S"), "step": "WEBHOOK", "text": "Received payment.failed" },
            { "time": datetime.utcnow().strftime("%H:%M:%S"), "step": "CLASSIFIER", "text": f"Diagnosis: {audit_log.classification}" },
            { "time": datetime.utcnow().strftime("%H:%M:%S"), "step": "DECISION", "text": f"Action: {audit_log.action_taken} ({audit_log.decision.get('rationale')})" }
        ],
        "diagnosis": {
            "category": audit_log.classification,
            "churnRiskScore": calculated_risk_score,
            "recommendation": audit_log.decision.get("rationale")
        },
        "retryStrategy": {
            "primaryChannel": "WhatsApp",
            "timingDetails": "Immediate"
        },
        "dunningContent": {
            "whatsappText": audit_log.outreach_content.get("whatsapp_text", "No text generated.") if audit_log.outreach_content else "No text generated.",
            "incentiveCode": audit_log.outreach_content.get("incentive_code") if audit_log.outreach_content else None
        },
        "recoveryLink": {
            "url": audit_log.outreach_content.get("recovery_url", "http://localhost:5173") if audit_log.outreach_content else "http://localhost:5173",
            "id": newCampaign["recoveryLinkId"]
        }
    }
    
    state["metrics"]["totalFailedPayments"] += 1
    state["metrics"]["arrAtRisk"] += amount
    state["metrics"]["activeRecoveryCampaigns"] += 1
    state["campaigns"].insert(0, newCampaign)
    save_state()
    
    return {
        "success": True, 
        "campaign": newCampaign,
        "fullEngineResult": fullEngineResult
    }

@router.post("/recover-payment")
async def recover_payment(request: Request):
    body = await request.json()
    campaignId = body.get("campaignId")
    global state
    
    for c in state["campaigns"]:
        if c["id"] == campaignId or c.get("recoveryLinkId") == campaignId:
            c["status"] = "RECOVERED"
            c["recoveredAt"] = datetime.utcnow().isoformat()
            state["metrics"]["arrRecovered"] += c["amount"]
            state["metrics"]["arrAtRisk"] = max(0, state["metrics"]["arrAtRisk"] - c["amount"])
            state["metrics"]["activeRecoveryCampaigns"] = max(0, state["metrics"]["activeRecoveryCampaigns"] - 1)
            save_state()
            return {"success": True, "campaign": c}
            
    return {"success": False, "message": "Not found"}






