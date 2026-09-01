from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Initialize Groq client
# It will automatically pick up GROQ_API_KEY from the environment
try:
    client = Groq()
except Exception as e:
    client = None
    print(f"Failed to initialize Groq client: {e}")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    campaign_id: str
    customer_name: str
    amount: float
    plan: str
    failure_reason: str
    message_history: List[ChatMessage]

@router.post("/chat/negotiate")
async def negotiate_chat(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    # Determine dynamic discount authority based on the customer's plan
    plan_lower = request.plan.lower()
    if "enterprise" in plan_lower:
        max_discount = "30%"
    elif "pro" in plan_lower or "scale" in plan_lower:
        max_discount = "20%"
    elif "basic" in plan_lower or "standard" in plan_lower:
        max_discount = "5%"
    else:
        max_discount = "10%"

    system_prompt = f"""You are a professional, empathetic, and highly effective AI Revenue Recovery Agent working for Razorpay SmartRecovery.
You are chatting with {request.customer_name} on WhatsApp.
Their recent payment of ₹{request.amount} for the '{request.plan}' plan failed due to: {request.failure_reason}.

Your Goal: 
1. Empathize with their situation.
2. Persuade them to update their payment method or pay the outstanding balance.
3. If they express financial hardship, hesitate, or ask for a discount, you are authorized to offer up to a {max_discount} discount (using promo code REV5OFF) on this payment to retain them. Do not offer more than {max_discount}.

Rules:
- Keep responses short, punchy, and conversational (like a real WhatsApp message). Maximum 2-3 sentences.
- Use emojis naturally but sparingly.
- Be extremely polite and helpful.
- DO NOT sound like a robotic AI.
- If they agree to pay, you MUST provide exactly this payment link: https://rzp.io/l/recovery
"""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Add the conversation history
    for msg in request.message_history:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="openai/gpt-oss-20b", 
            temperature=0.7,
            max_tokens=150
        )
        
        ai_response = chat_completion.choices[0].message.content
        return {"reply": ai_response}
        
    except Exception as e:
        print(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

