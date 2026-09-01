import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Mail, 
  ExternalLink, 
  Copy, 
  Bot, 
  Cpu, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function RecoverySimulator({ onSimulate, onRecoverPayment, onNavigateToCustomerPortal }) {
  const [formData, setFormData] = useState({
    customerName: "Kumar Abhishek",
    email: "kumar.abhishek@gmail.com",
    phone: "+91 98765 43210",
    amount: 14999,
    plan: "Pro Scale Annual (SaaS)",
    failureReason: "bank_outage",
    rawErrorMessage: "HDFC Bank NetBanking Gateway Timeout (HTTP 504)",
    paymentMethod: "card"
  });

  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const presetScenarios = [
    {
      name: "Bank Network Outage (HDFC / ICICI Node)",
      reason: "bank_outage",
      rawError: "HDFC NetBanking Gateway Timeout (HTTP 504)",
      amount: 14999,
      method: "netbanking"
    },
    {
      name: "Soft Decline (Insufficient Card Balance)",
      reason: "insufficient_funds",
      rawError: "Card Payment Declined: Insufficient Funds / Credit Limit",
      amount: 4999,
      method: "card"
    },
    {
      name: "Expired Credit Card Details",
      reason: "card_expired",
      rawError: "Visa Credit Card Expired (08/26)",
      amount: 28500,
      method: "card"
    },
    {
      name: "NPCI Mandate Re-Authorization Dropped",
      reason: "mandate_failed",
      rawError: "NPCI E-Mandate Execution Failed: Customer Auth Required",
      amount: 12000,
      method: "mandate"
    }
  ];

  const handleApplyPreset = (scenario) => {
    setFormData(prev => ({
      ...prev,
      failureReason: scenario.reason,
      rawErrorMessage: scenario.rawError,
      amount: scenario.amount,
      paymentMethod: scenario.method
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSimulationResult(null);

    try {
      const res = await fetch('/api/simulate-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSimulationResult(data.fullEngineResult);
        if (onSimulate) onSimulate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#131A2F] border border-slate-800/80 rounded-sm shadow-sm p-6 ">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-sm bg-[#3a86ff]/15 text-[#3a86ff] border border-[#3a86ff]/30">
            <Zap className="w-6 h-6 fill-[#3a86ff]" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono tracking-tight text-white flex items-center gap-2">
              Razorpay Webhook & Payment Failure Simulator
              <span className="text-xs bg-[#3a86ff]/20 text-[#3a86ff] px-2.5 py-0.5 rounded-full border border-[#3a86ff]/30 font-mono">
                Judge & Evaluator Sandbox
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Trigger a simulated <code className="text-[#3a86ff]">payment.failed</code> webhook and watch the multi-agent AI engine diagnose, strategize, and recover the subscription in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Left Simulator Controls / Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset & Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#131A2F] border border-slate-800/80 rounded-sm shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 font-mono tracking-widest uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#3a86ff]" />
              Select Failure Preset Scenario
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {presetScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(sc)}
                  className={`p-3 rounded-sm text-left border transition-all text-xs flex items-center justify-between cursor-pointer ${
                    formData.failureReason === sc.reason
                      ? 'bg-[#3a86ff]/20 border-[#3a86ff] text-white shadow-md'
                      : 'bg-[#131A2F]/60 border-slate-800/80 text-slate-300 hover:border-slate-800/80/80'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{sc.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">₹{sc.amount.toLocaleString('en-IN')}</div>
                  </div>
                  {formData.failureReason === sc.reason && (
                    <CheckCircle2 className="w-4 h-4 text-[#3a86ff]" />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-[#131A2F] border border-slate-800/80 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm bg-[#131A2F] border border-slate-800/80 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Failed Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm bg-[#131A2F] border border-slate-800/80 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subscription / Invoice Plan</label>
                <input
                  type="text"
                  value={formData.plan}
                  onChange={e => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-[#131A2F] border border-slate-800/80 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Raw Webhook Gateway Error</label>
                <input
                  type="text"
                  value={formData.rawErrorMessage}
                  onChange={e => setFormData({ ...formData, rawErrorMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-[#131A2F] border border-slate-800/80 text-xs text-white focus:outline-none focus:border-[#00d2ff] font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-sm bg-gradient-to-r from-[#3a86ff] via-[#00d2ff] to-[#10b981] text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Bot className="w-4 h-4 animate-spin" /> Running AI Diagnostic Pipelines...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Dispatch Razorpay Webhook Event
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Real-Time AI Multi-Agent Execution Output */}
        <div className="lg:col-span-7">
          {simulationResult ? (
            <div className="space-y-4">
              {/* Agent Pipeline Step-by-Step Execution */}
              <div className="bg-[#131A2F] border border-slate-800/80 rounded-sm shadow-sm p-5 bg-[#131A2F] border border-slate-800/80 rounded-sm shadow-sm-glow space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3a86ff] uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-4 h-4" /> Multi-Agent AI Pipeline Execution Output
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    Campaign Created: {simulationResult.campaignId}
                  </span>
                </div>

                {/* Live Step Execution Log */}
                <div className="space-y-2 p-3 bg-slate-950/80 rounded-sm border border-slate-800/80 font-mono text-xs max-h-48 overflow-y-auto">
                  {simulationResult.executionLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300 border-b border-slate-900 pb-1 last:border-0">
                      <span className="text-slate-400 text-[10px]">{log.time}</span>
                      <span className="text-[#3a86ff] font-bold text-[10px] bg-[#3a86ff]/10 px-1 rounded">{log.step}</span>
                      <span className="flex-1">{log.text}</span>
                    </div>
                  ))}
                </div>

                {/* Diagnosis Summary Card */}
                <div className="p-4 rounded-sm bg-[#131A2F]/90 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Diagnosis Category:</span>
                    <span className="font-bold text-amber-400">{simulationResult.diagnosis.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Calculated Churn Risk:</span>
                    <span className="font-bold text-rose-400">{simulationResult.diagnosis.churnRiskScore}/100</span>
                  </div>
                  <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/80/80">
                    <span className="text-slate-400">Agent Recommendation: </span>
                    {simulationResult.diagnosis.recommendation}
                  </div>
                </div>

                {/* WhatsApp & Email Outreach Preview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    Generated Personalized Outreach Script
                  </h4>
                  
                  <div className="p-3.5 rounded-sm bg-[#0b2b1a]/60 border border-emerald-500/30 text-xs text-emerald-200 space-y-1 font-sans">
                    <div className="font-bold text-emerald-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> WhatsApp Outreach Script (Channel: {simulationResult.retryStrategy.primaryChannel})
                    </div>
                    <p className="whitespace-pre-line text-slate-200">
                      {simulationResult.dunningContent.whatsappText.replace('{{RECOVERY_LINK}}', simulationResult.recoveryLink.url)}
                    </p>
                  </div>
                </div>

                {/* Razorpay Smart Recovery Link & Action */}
                <div className="p-4 rounded-sm bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900 border border-[#00d2ff]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#3a86ff]" />
                      Razorpay Smart Recovery Link Ready
                    </span>
                    <button
                      onClick={() => handleCopyLink(simulationResult.recoveryLink.url)}
                      className="text-xs text-[#3a86ff] hover:text-white flex items-center gap-1 bg-[#3a86ff]/10 hover:bg-[#3a86ff]/20 px-2 py-1 rounded transition-colors"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </button>
                  </div>

                  <div className="text-xs font-mono bg-slate-950 p-2.5 rounded-sm border border-slate-800/80 text-slate-300 truncate">
                    {simulationResult.recoveryLink.url}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onNavigateToCustomerPortal(simulationResult.campaignId)}
                      className="flex-1 py-2.5 px-4 rounded-sm bg-[#3a86ff] hover:bg-[#00c0eb] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      Open Simulated Customer Payment Screen
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#131A2F] border border-slate-800/80 rounded-sm shadow-sm p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="p-4 rounded-sm bg-[#131A2F] text-slate-400 border border-slate-800/80">
                <Bot className="w-10 h-10 text-[#3a86ff]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Ready for Webhook Simulation</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Select a failure preset scenario on the left or enter custom details and click <strong>"Dispatch Razorpay Webhook Event"</strong> to initiate the AI pipeline.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
