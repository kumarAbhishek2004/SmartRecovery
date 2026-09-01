import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  ShieldCheck, TrendingUp, AlertTriangle, RefreshCw, CheckCircle2, 
  DollarSign, Activity, ArrowUpRight, Zap, Layers, Clock, Terminal, Cpu
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

  const formattedARRRisk = `₹${(metrics.arrAtRisk / 100000).toFixed(2)} L`;
  const formattedARRRecovered = `₹${(metrics.arrRecovered / 100000).toFixed(2)} L`;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Sidebar: Command & Metrics */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Terminal Header */}
        <div className="bg-[#131b36] border border-slate-800 rounded-sm p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[#00d2ff] mb-1">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-80">System Status</span>
              </div>
              <h1 className="text-lg font-bold text-slate-100 leading-tight">SmartRecovery<br/>Engine</h1>
            </div>
            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded-sm">ONLINE</span>
          </div>
          
          <div className="space-y-1 mt-4 border-t border-slate-800/50 pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-mono">MERCHANT_ID</span>
              <span className="text-slate-300 font-mono">{merchantInfo.merchantId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-mono">ORG_NAME</span>
              <span className="text-slate-300">{merchantInfo.name}</span>
            </div>
          </div>
          
          <button 
            onClick={onTriggerSimulator}
            className="mt-5 w-full py-2 bg-[#3a86ff] hover:bg-[#2b6cb0] text-white text-xs font-bold font-mono rounded-sm transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(58,134,255,0.3)]"
          >
            <Zap className="w-3.5 h-3.5" /> INJECT FAILURE EVENT
          </button>
        </div>

        {/* Metrics Stack */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="bg-[#131b36] border-l-2 border-l-rose-500 border border-slate-800/80 rounded-sm p-3">
            <div className="text-[10px] text-slate-400 font-mono uppercase">ARR at Risk</div>
            <div className="text-xl font-mono text-white mt-1">{formattedARRRisk}</div>
            <div className="text-[10px] text-rose-400 mt-1 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" /> Critical
            </div>
          </div>

          <div className="bg-[#131b36] border-l-2 border-l-emerald-500 border border-slate-800/80 rounded-sm p-3">
            <div className="text-[10px] text-slate-400 font-mono uppercase">ARR Recovered</div>
            <div className="text-xl font-mono text-emerald-400 mt-1">{formattedARRRecovered}</div>
            <div className="text-[10px] text-emerald-500/80 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12.4% MoM
            </div>
          </div>

          <div className="bg-[#131b36] border-l-2 border-l-[#00d2ff] border border-slate-800/80 rounded-sm p-3">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Recovery Rate</div>
            <div className="text-xl font-mono text-[#00d2ff] mt-1">{metrics.recoveryRate}%</div>
            <div className="text-[10px] text-[#00d2ff]/70 mt-1 flex items-center">
              <Activity className="w-3 h-3 mr-1" /> Optimizing...
            </div>
          </div>

          <div className="bg-[#131b36] border-l-2 border-l-amber-500 border border-slate-800/80 rounded-sm p-3">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Active Campaigns</div>
            <div className="text-xl font-mono text-amber-400 mt-1">{metrics.activeCampaigns}</div>
            <div className="text-[10px] text-amber-500/80 mt-1 flex items-center">
              <Layers className="w-3 h-3 mr-1" /> In Progress
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Main Chart */}
        <div className="bg-[#131b36] border border-slate-800 rounded-sm p-5 shadow-sm flex-1 min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
              Telemetry: 7-Day Revenue Recovery
            </h3>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-[10px] font-mono bg-[#0b132b] text-slate-300 rounded-sm">1D</button>
              <button className="px-2 py-1 text-[10px] font-mono bg-[#3a86ff]/20 text-[#3a86ff] border border-[#3a86ff]/30 rounded-sm">7D</button>
              <button className="px-2 py-1 text-[10px] font-mono bg-[#0b132b] text-slate-300 rounded-sm">30D</button>
            </div>
          </div>
          
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recoveryChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#475569" tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={(value) => `₹${value}`} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b132b', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} iconType="square" />
                <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5 }} name="Recovered (₹)" />
                <Line type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={false} name="At Risk (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sub-panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Active Agents Module */}
          <div className="bg-[#131b36] border border-slate-800 rounded-sm p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Agent Subsystems
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-[#0b132b]/50 rounded-sm transition-colors border-l-2 border-l-transparent hover:border-l-purple-500">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-[#0b132b] rounded-sm">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Failure Diagnoser</div>
                    <div className="text-[10px] text-slate-400">Classifies & scores churn risk</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-500 font-mono">IDLE</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-[#0b132b]/50 rounded-sm transition-colors border-l-2 border-l-transparent hover:border-l-[#3a86ff]">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-[#0b132b] rounded-sm">
                    <Clock className="w-3.5 h-3.5 text-[#3a86ff]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Smart Retry Router</div>
                    <div className="text-[10px] text-slate-400">Uptime-aware scheduling</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-emerald-500 font-mono">SYNCED</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-[#0b132b]/50 rounded-sm transition-colors border-l-2 border-l-transparent hover:border-l-emerald-500">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-[#0b132b] rounded-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Incentive Dunning Bot</div>
                    <div className="text-[10px] text-slate-400">Groq-powered conversational AI</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-500 font-mono">READY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics Panel */}
          <div className="bg-[#131b36] border border-slate-800 rounded-sm p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Root Cause Diagnostics
                </span>
                <span className="text-[10px] text-slate-500 font-mono">LAST 24H</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Automated breakdown of top payment failure reasons driving involuntary churn.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Insufficient Funds</span>
                  <span className="font-mono text-slate-400">45%</span>
                </div>
                <div className="w-full bg-[#0b132b] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Bank Node Downtime</span>
                  <span className="font-mono text-slate-400">30%</span>
                </div>
                <div className="w-full bg-[#0b132b] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00d2ff] h-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Expired Tokens</span>
                  <span className="font-mono text-slate-400">15%</span>
                </div>
                <div className="w-full bg-[#0b132b] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onTabChange('campaigns')}
              className="mt-4 text-[10px] text-[#3a86ff] hover:text-[#2b6cb0] uppercase tracking-widest font-semibold flex items-center gap-1 transition-colors"
            >
              View Active Campaigns <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
