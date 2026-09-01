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

    </div>
  );
}
