# Track 3: AI Revenue Recovery — SmartRecovery 🚀

**Razorpay AI Builder Internship 2026 Submission**

SmartRecovery is an Autonomous Multi-Agent Payment Failure Diagnosis, Smart Retry Scheduling & Dunning Engine built for Razorpay Merchants. It intercepts failed payments via webhooks and automatically triggers a coordinated swarm of AI agents to recover the lost ARR through conversational dunning and dynamic discount incentives.

---

## 📈 1. Problem Statement & Business Opportunity

Subscription and recurring payment businesses built on Razorpay suffer from an average **20-30% involuntary ARR churn** caused by transient payment failures (bank outages, soft declines, expired card tokens, and dropped NPCI mandate authorizations).

Traditional dunning systems rely on static, rigid email blasts sent at fixed intervals, ignoring bank uptime telemetry, failure root causes, and user payment preferences.

**SmartRecovery Solution:**
An autonomous agent network that ingests Razorpay webhooks, diagnoses real failure causes, delays retries during bank outages, and dispatches high-converting WhatsApp/UPI Intent recovery links.

---

## 🧠 2. Multi-Agent System Architecture

1. **Agent 1: Failure Diagnoser & Risk Scoring**
   Classifies gateway errors into Bank Outage, Soft Decline, Card Expiry, or Mandate Drop. Calculates customer churn risk score (0-100).

2. **Agent 2: Smart Retry & Uptime Router**
   Monitors issuer bank node health. Defers auto-retry execution during downtime to prevent redundant decline fees.

3. **Agent 3: Conversational Dunning & Incentive Bot**
   Generates personalized WhatsApp/Email scripts with optional dynamic discount incentives (e.g. `REV5OFF`, dynamically tiered up to 30% for Enterprise customers) using a Groq LLM API integration.

4. **Agent 4: Razorpay Payment Link Dispatcher**
   Issues instant 1-tap UPI Intent & Magic Checkout recovery portals to close the loop instantly and update the backend ARR dashboard.

---

## ⚡ 3. Razorpay Webhook Ingestion & Execution Workflow

```text
[Razorpay Gateway] ──(Webhook: payment.failed)──► [SmartRecovery Ingestion API]
    │
    ├─► Diagnoser Agent: Classifies failure error code & calculates churn risk
    ├─► Smart Scheduler: Evaluates bank uptime & queues optimal retry timestamp
    ├─► Conversational Agent: Crafts WhatsApp/Email copy + dynamic promo code
    └─► Link Generator: Issues single-tap UPI Intent payment URL

[Customer Click] ──(1-Tap UPI / Magic Checkout)──► [Subscription ARR Recovered 🎉]
```

---

## 🛠️ Setup Instructions & Local Deployment

### 1. Backend (FastAPI + Groq AI)
The backend is built in Python with FastAPI and utilizes Groq for the conversational AI engine.

1. Navigate to the root directory.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Open the `.env` file and insert your Groq API Key:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```
4. Start the Uvicorn server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 2. Frontend (React + Vite)
The frontend is a gorgeous dashboard simulating the merchant view and the end-user WhatsApp conversational flow.

1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Simulating the Pipeline
1. Open the dashboard at `http://localhost:5173`.
2. Click **Simulate Webhook** to send a mock Razorpay `payment.failed` webhook to the backend.
3. Watch the Risk Scoring engine instantly evaluate the failure.
4. Click the **WhatsApp** icon on the campaign to open the Chat Simulator.
5. Interact with the Groq AI agent to negotiate a discount and get the Magic Checkout link!
6. Click **Pay via Razorpay** to close the loop and watch your Recovered ARR metric skyrocket live.

---

## 🎓 Submission Checklist
- [x] **1. Public GitHub Repo**: Clean modular code with standard README.md, setup instructions & architecture diagram.
- [x] **2. 5-Minute Pitch Video**: Demonstrated the live judge simulator triggering failure events & recovering ARR instantly.
- [x] **3. Form Submission**: Selected Track 3 in the Razorpay form.
