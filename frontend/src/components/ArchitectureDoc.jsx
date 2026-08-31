import React from 'react';
import { 
  FileText, 
  Layers, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  GitBranch, 
  CheckCircle2, 
  Code, 
  Award,
  Video,
  ExternalLink
} from 'lucide-react';

export default function ArchitectureDoc() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Pitch Header */}
      <div className="rz-card p-6 bg-gradient-to-r from-[#131b36] via-[#1c2541] to-[#0b132b] border border-[#00d2ff]/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 font-mono">
              Razorpay AI Builder Internship 2026 Submission
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
              Track 3: AI Revenue Recovery — <span className="text-[#00d2ff]">SmartRecovery</span>
            </h2>
            <p className="text-xs text-slate-300">
              Autonomous Multi-Agent Payment Failure Diagnosis, Smart Retry Scheduling & Dunning Engine for Razorpay Merchants
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-right hidden sm:block">
            <div className="text-xs text-slate-400">Target Role Stipend</div>
            <div className="text-xl font-black text-emerald-400">₹75,000 / mo</div>
            <div className="text-[10px] text-slate-400">Bangalore (In-Person)</div>
          </div>
        </div>
      </div>

      {/* Grid 2 Cols: Architecture Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Problem & Solution */}
        <div className="rz-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00d2ff]" />
            1. Problem Statement & Business Opportunity
          </h3>
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              Subscription and recurring payment businesses built on Razorpay suffer from an average <strong className="text-rose-400">20-30% involuntary ARR churn</strong> caused by transient payment failures (bank outages, soft declines, expired card tokens, and dropped NPCI mandate authorizations).
            </p>
            <p>
              Traditional dunning systems rely on static, rigid email blasts sent at fixed intervals, ignoring bank uptime telemetry, failure root causes, and user payment preferences.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-emerald-400">SmartRecovery Solution:</strong>
              <p className="text-[11px] text-slate-400">
                An autonomous agent network that ingests Razorpay webhooks, diagnoses real failure causes, delays retries during bank outages, and dispatches high-converting WhatsApp/UPI Intent recovery links.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Multi-Agent Architecture */}
        <div className="rz-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            2. Multi-Agent System Architecture
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-[#00d2ff] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00d2ff]"></span>
                Agent 1: Failure Diagnoser & Risk Scoring
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Classifies gateway errors into Bank Outage, Soft Decline, Card Expiry, or Mandate Drop. Calculates customer churn risk score (0-100).
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Agent 2: Smart Retry & Uptime Router
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Monitors issuer bank node health. Defers auto-retry execution during downtime to prevent redundant decline fees.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Agent 3: Conversational Dunning & Incentive Bot
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Generates personalized WhatsApp/Email scripts with optional dynamic discount incentives (REV5OFF) for high churn risk customers.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                Agent 4: Razorpay Payment Link Dispatcher
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Issues instant 1-tap UPI Intent & Magic Checkout recovery portals.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook & Data Flow Diagram */}
      <div className="rz-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-amber-400" />
          3. Razorpay Webhook Ingestion & Execution Workflow
        </h3>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-3">
          <div className="flex items-center gap-2 text-[#00d2ff] font-bold">
            <span>[Razorpay Gateway]</span> ──(Webhook: payment.failed)──► <span>[SmartRecovery Ingestion API]</span>
          </div>
          <div className="pl-6 border-l-2 border-slate-800 space-y-2">
            <div>│</div>
            <div>├─► <strong>Diagnoser Agent:</strong> Classifies failure error code & calculates churn risk</div>
            <div>├─► <strong>Smart Scheduler:</strong> Evaluates bank uptime & queues optimal retry timestamp</div>
            <div>├─► <strong>Conversational Agent:</strong> Crafts WhatsApp/Email copy + dynamic promo code</div>
            <div>└─► <strong>Link Generator:</strong> Issues single-tap UPI Intent payment URL</div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold pt-2">
            <span>[Customer Click]</span> ──(1-Tap UPI / Magic Checkout)──► <span>[Subscription ARR Recovered 🎉]</span>
          </div>
        </div>
      </div>

      {/* Submission Checklist for Candidate */}
      <div className="rz-card p-6 space-y-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          4. Submission Checklist for Razorpay AI Internship Evaluation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1. Public GitHub Repo
            </div>
            <p className="text-[11px] text-slate-400">
              Clean modular code with standard <code className="text-[#00d2ff]">README.md</code>, setup instructions & architecture diagram.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 2. 5-Minute Pitch Video
            </div>
            <p className="text-[11px] text-slate-400">
              Demonstrate the live judge simulator triggering failure events & recovering ARR instantly.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. Form Submission
            </div>
            <p className="text-[11px] text-slate-400">
              Select <strong>Track 3: AI Revenue Recovery</strong> in the Razorpay form and paste your GitHub & Loom video link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
