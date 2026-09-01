import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  Zap,
  Layers,
  Clock
} from 'lucide-react';

const recoveryChartData = [
  { name: 'Mon', recovered: 4000, risk: 2400 },
  { name: 'Tue', recovered: 3000, risk: 1398 },
  { name: 'Wed', recovered: 9800, risk: 2000 },
  { name: 'Thu', recovered: 3908, risk: 2780 },
  { name: 'Fri', recovered: 4800, risk: 1890 },
  { name: 'Sat', recovered: 3800, risk: 2390 },
  { name: 'Sun', recovered: 4300, risk: 3490 },
];

export default function Dashboard({ data, onTabChange, onTriggerSimulator }) {
  if (!data || !data.metrics) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading SmartRecovery Telemetry...
      </div>
    );
  }

  const { metrics, failureReasonsDistribution, merchantInfo } = data;

  const formattedARRRisk = `â‚¹${(metrics.arrAtRisk / 100000).toFixed(2)} Lakhs`;
  const formattedARRRecovered = `â‚¹${(metrics.arrRecovered / 100000).toFixed(2)} Lakhs`;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action */}
      <div className="rz-card p-6 bg-gradient-to-r from-[#131b36] via-[#1c2541] to-[#0b132b] relative overflow-hidden">
        <div className="scanline"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/30">
                Razorpay Merchant Partner
              </span>
              <span className="text-xs text-slate-400 font-mono">{merchantInfo.merchantId}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              SmartRecovery <span className="text-[#00d2ff] glow-cyan">Command Center</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Autonomous multi-agent payment recovery for {merchantInfo.name}. Autonomous dunning, smart retry scheduling & instant UPI intent link generation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  await fetch('/api/webhooks/razorpay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      event: "payment.failed",
                      payload: {
                        payment: {
                          entity: {
                            amount: 499900,
                            email: "demo.webhook@razorpay.com",
                            contact: "+919876543210",
                            error_description: "insufficient_funds"
                          }
                        }
                      }
                    })
                  });
                  window.location.reload();
                } catch (e) { console.error(e) }
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer border border-slate-600"
            >
              <Activity className="w-4 h-4 text-emerald-400" /> Simulate Webhook
            </button>
            <button
              onClick={async () => {
                try {
                  await fetch('/api/admin/fast-forward', { method: 'POST' });
                  window.location.reload();
                } catch (e) { console.error(e) }
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer border border-slate-600"
            >
              <Clock className="w-4 h-4 text-[#00d2ff]" /> Fast Forward (3 Days)
            </button>
            <button
              onClick={onTriggerSimulator}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3a86ff] to-[#00d2ff] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              Launch AI Simulator
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ARR Recovered */}
        <div className="rz-card p-5 border-l-4 border-l-[#10b981] relative">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Recovered ARR</span>
            <div className="p-2 rounded-lg bg-[#10b981]/15 text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">{formattedARRRecovered}</div>
            <div className="flex items-center text-xs text-[#10b981] font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +14.2% this month
            </div>
          </div>
        </div>

        {/* Card 2: ARR at Risk */}
        <div className="rz-card p-5 border-l-4 border-l-[#f59e0b] relative">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>ARR at Risk</span>
            <div className="p-2 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">{formattedARRRisk}</div>
            <div className="text-xs text-slate-400 mt-1">
              {metrics.activeRecoveryCampaigns} active dunning loops
            </div>
          </div>
        </div>

        {/* Card 3: Recovery Rate */}
        <div className="rz-card p-5 border-l-4 border-l-[#00d2ff] relative">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Recovery Rate</span>
            <div className="p-2 rounded-lg bg-[#00d2ff]/15 text-[#00d2ff]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#00d2ff] tracking-tight">{metrics.recoverySuccessRate}%</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">
              Industry avg: 35% (SmartRecovery: +36.9%)
            </div>
          </div>
        </div>

        {/* Card 4: Avg Recovery Time */}
        <div className="rz-card p-5 border-l-4 border-l-[#8b5cf6] relative">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Recovery Time</span>
            <div className="p-2 rounded-lg bg-[#8b5cf6]/15 text-[#8b5cf6]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">{metrics.avgRecoveryTimeHours} Hours</div>
            <div className="text-xs text-slate-400 mt-1">
              Smart Retry schedule vs 72h manual
            </div>
          </div>
        </div>
      </div>

      {/* Live Analytics Chart */}
      <div className="rz-card p-6 border border-[#00d2ff]/20 bg-gradient-to-b from-[#131b36] to-[#0b132b]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#10b981]" />
          7-Day Revenue Recovery Analytics
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recoveryChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
              <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Recovered (₹)" />
              <Line type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="At Risk (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Section: Distribution & Agent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Failure Root Causes */}
        <div className="lg:col-span-2 rz-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00d2ff]" />
                Razorpay Payment Failure Diagnostic Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Categorized in real time by SmartRecovery Failure Analysis Agent
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              Total Failures: {metrics.totalFailedPayments}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {failureReasonsDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-200">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">{item.count} events</span>
                    <span className="font-bold font-mono text-sm" style={{ color: item.color }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Autonomous Multi-Agent Core Status */}
        <div className="rz-card p-6 space-y-4 bg-gradient-to-b from-[#131b36] to-[#0b132b]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Autonomous Agent Fleet
          </h3>

          <div className="space-y-3">
            {/* Agent 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Failure Diagnoser Agent
                </span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 font-bold">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">
                Ingests Razorpay webhooks, inspects gateway error logs & classifies root causes.
              </p>
            </div>

            {/* Agent 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping"></span>
                  Smart Retry & Uptime Router
                </span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-[#00d2ff] font-bold">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">
                Monitors issuer bank uptime APIs to avoid retrying during bank outages.
              </p>
            </div>

            {/* Agent 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                  Conversational Dunning Bot
                </span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-purple-400 font-bold">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">
                Generates personalized WhatsApp/Email outreach with dynamic coupon incentives.
              </p>
            </div>

            {/* Agent 4 */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  Razorpay Link Dispatcher
                </span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-amber-400 font-bold">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">
                Issues instant 1-tap UPI Intent & Magic Checkout recovery links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
