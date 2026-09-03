import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import RecoverySimulator from './components/RecoverySimulator';
import CampaignsList from './components/CampaignsList';
import CustomerPaymentPortal from './components/CustomerPaymentPortal';
import ArchitectureDoc from './components/ArchitectureDoc';
import { 
  LayoutDashboard, 
  Zap, 
  ListOrdered, 
  CreditCard, 
  FileCode, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Server,
  RotateCcw
} from 'lucide-react';

const API_BASE = 'https://smartrecovery-rd4l.onrender.com/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | simulator | campaigns | portal | doc
  const [overviewData, setOverviewData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [targetPortalCampaignId, setTargetPortalCampaignId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);

  // Fetch overview & campaigns telemetry
  const fetchData = async () => {
    try {
      const [ovRes, cmpRes] = await Promise.all([
        fetch(`${API_BASE}/overview`),
        fetch(`${API_BASE}/campaigns`)
      ]);

      if (ovRes.ok && cmpRes.ok) {
        const ov = await ovRes.json();
        const cmp = await cmpRes.json();
        setOverviewData(ov);
        setCampaigns(cmp);
        setServerOnline(true);
      }
    } catch (err) {
      console.error("API error:", err);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // Live poll every 4s
    return () => clearInterval(interval);
  }, []);

  const handleResetSession = async () => {
    try {
      await fetch(`${API_BASE}/reset`, { method: 'POST' });
      fetchData();
      setActiveTab('dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await fetch(`${API_BASE}/campaigns/${campaignId}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/upload-csv`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchData();
      } else {
        console.error("CSV Upload failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToPortal = (campaignId) => {
    setTargetPortalCampaignId(campaignId);
    setActiveTab('portal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100 selection:bg-[#00d2ff]/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0b132b]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & System Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2b6cb0] via-[#3a86ff] to-[#00d2ff] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">SmartRecovery</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                  Razorpay Track 3
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Autonomous Revenue Recovery Engine
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#3a86ff] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#3a86ff] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#00d2ff]" /> AI Simulator
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'campaigns'
                  ? 'bg-[#3a86ff] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" /> Campaigns ({campaigns.length})
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'portal'
                  ? 'bg-[#3a86ff] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Checkout Portal
            </button>

            <button
              onClick={() => setActiveTab('doc')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'doc'
                  ? 'bg-[#3a86ff] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Pitch & Architecture
            </button>
          </nav>

          {/* Right Action: Status & Reset */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              {serverOnline ? 'Backend Online' : 'Connecting...'}
            </div>

            <button
              onClick={handleResetSession}
              title="Reset Demo Data"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-[#0b132b] py-2 text-[11px]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'dashboard' ? 'text-[#00d2ff] font-bold' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'simulator' ? 'text-[#00d2ff] font-bold' : 'text-slate-400'}`}
          >
            <Zap className="w-4 h-4" /> Simulator
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'campaigns' ? 'text-[#00d2ff] font-bold' : 'text-slate-400'}`}
          >
            <ListOrdered className="w-4 h-4" /> Campaigns
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'portal' ? 'text-[#00d2ff] font-bold' : 'text-slate-400'}`}
          >
            <CreditCard className="w-4 h-4" /> Checkout
          </button>
          <button
            onClick={() => setActiveTab('doc')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'doc' ? 'text-[#00d2ff] font-bold' : 'text-slate-400'}`}
          >
            <FileCode className="w-4 h-4" /> Architecture
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#00d2ff]" />
            <div className="text-sm font-semibold">Initializing SmartRecovery Telemetry Engine...</div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                data={overviewData}
                onTabChange={setActiveTab}
                onTriggerSimulator={() => setActiveTab('simulator')}
              />
            )}

            {activeTab === 'simulator' && (
              <RecoverySimulator
                onSimulate={fetchData}
                onNavigateToCustomerPortal={navigateToPortal}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignsList
                campaigns={campaigns}
                onNavigateToCustomerPortal={navigateToPortal}
                onDeleteCampaign={handleDeleteCampaign}
                onUploadCSV={handleUploadCSV}
              />
            )}

            {activeTab === 'portal' && (
              <CustomerPaymentPortal
                campaignId={targetPortalCampaignId || (campaigns[0] && campaigns[0].id)}
                campaigns={campaigns}
                onPaymentSuccess={fetchData}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'doc' && (
              <ArchitectureDoc />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500 bg-[#080d1e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Built for <strong className="text-slate-300">Razorpay AI Builder Internship 2026</strong> — Track 3 (AI Revenue Recovery)
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            SmartRecovery Engine v2.4.0 • Autonomous Dunning Protocol
          </div>
        </div>
      </footer>
    </div>
  );
}
