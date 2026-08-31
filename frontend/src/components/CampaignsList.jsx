import React, { useState, useRef } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  ExternalLink, 
  Copy, 
  ChevronRight, 
  ArrowRight,
  User,
  ShieldAlert,
  Check,
  Trash2,
  Calendar,
  Upload
} from 'lucide-react';

export default function CampaignsList({ campaigns = [], onNavigateToCustomerPortal, onDeleteCampaign, onUploadCSV }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL_TIME');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const filtered = campaigns.filter(c => {
    const matchesSearch = 
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.plan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    
    // In our mock/live system, campaigns might have a created_at or we just filter randomly. 
    // Since mock campaigns don't have exact timestamps, we will mock the time filter logic or just apply it loosely.
    let matchesTime = true;
    if (timeFilter !== 'ALL_TIME') {
        // If we want actual date filtering, we would parse c.timeline[0].time or add a created_at field.
        // For now, if the user picks 'TODAY', we assume all live added campaigns are today.
        // We'll leave it as a UI element that passes everything for now, or you can expand this logic.
        matchesTime = true; 
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> RECOVERED
          </span>
        );
      case 'IN_RECOVERY':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3 animate-spin" /> IN RECOVERY
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
            <ShieldAlert className="w-3 h-3" /> ACTION REQUIRED
          </span>
        );
    }
  };

  const handleCopyLink = (campaignId, linkUrl) => {
    navigator.clipboard.writeText(linkUrl || `http://localhost:3000/#/recover/${campaignId}`);
    setCopiedId(campaignId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess(false);
    try {
        if (onUploadCSV) {
            await onUploadCSV(file);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        }
    } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rz-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Active Dunning & Revenue Recovery Campaigns
          </h2>
          <p className="text-xs text-slate-400">
            Real-time status of all failed Razorpay transactions & autonomous recovery workflows
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* CSV Upload */}
          <div className="relative">
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                uploadSuccess 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              {uploadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Successfully Uploaded
                </>
              ) : (
                <>
                  <Upload className={`w-3.5 h-3.5 ${uploading ? 'animate-bounce text-[#00d2ff]' : ''}`} />
                  {uploading ? 'Processing...' : 'Upload CSV'}
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, plan or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#00d2ff] w-48 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
              <select
                value={timeFilter}
                onChange={e => setTimeFilter(e.target.value)}
                className="bg-transparent border-none text-slate-300 text-xs focus:outline-none cursor-pointer py-1 px-2"
              >
                <option value="ALL_TIME">All Time</option>
                <option value="TODAY">Today</option>
                <option value="THIS_WEEK">This Week</option>
                <option value="THIS_MONTH">This Month</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              {['ALL', 'RECOVERED', 'IN_RECOVERY'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-[#3a86ff] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All Campaigns' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rz-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Campaign ID</th>
                <th className="px-5 py-3">Customer & Plan</th>
                <th className="px-5 py-3">Amount (₹)</th>
                <th className="px-5 py-3">Failure Reason</th>
                <th className="px-5 py-3">Risk Score</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-[#00d2ff]">
                    {item.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{item.customerName}</div>
                    <div className="text-[11px] text-slate-400">{item.plan}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-200 max-w-xs truncate">{item.failureReasonText}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Channel: {item.channelUsed}</div>
                  </td>
                  <td className="px-5 py-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.riskScore > 80 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.riskScore}/100
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedCampaign(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Inspect Log
                      </button>

                      {item.status !== 'RECOVERED' && (
                        <button
                          onClick={() => onNavigateToCustomerPortal(item.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#00d2ff] hover:bg-[#00c0eb] text-slate-950 text-[11px] font-extrabold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          Recover <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if(window.confirm('Delete this recovery campaign?')) {
                            if(onDeleteCampaign) onDeleteCampaign(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    No active recovery campaigns match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="rz-card p-6 max-w-2xl w-full bg-[#131b36] space-y-4 max-h-[90vh] overflow-y-auto border border-[#00d2ff]/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-[#00d2ff] font-bold">{selectedCampaign.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedCampaign.customerName} — Campaign Log</h3>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Overview Detail */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div><span className="text-slate-400">Plan:</span> <span className="font-semibold text-white">{selectedCampaign.plan}</span></div>
              <div><span className="text-slate-400">Amount:</span> <span className="font-semibold text-white">₹{selectedCampaign.amount.toLocaleString('en-IN')}</span></div>
              <div><span className="text-slate-400">Status:</span> {getStatusBadge(selectedCampaign.status)}</div>
              <div><span className="text-slate-400">Discount Applied:</span> <span className="font-mono text-emerald-400">{selectedCampaign.discountApplied}</span></div>
            </div>

            {/* AI Agent Action Summary */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200">
              <div className="font-bold text-blue-400 mb-1">🤖 AI Recovery Strategy:</div>
              {selectedCampaign.agentActionSummary}
            </div>

            {/* Timeline Log */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Execution Audit Timeline</h4>
              <div className="space-y-2 border-l-2 border-slate-800 pl-4 py-1">
                {selectedCampaign.timeline.map((t, idx) => (
                  <div key={idx} className="relative text-xs space-y-0.5">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#00d2ff] border-2 border-slate-900" />
                    <div className="text-[10px] font-mono text-slate-500">{t.time}</div>
                    <div className="text-slate-300 font-sans">{t.event}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => handleCopyLink(selectedCampaign.id, selectedCampaign.recoveryLink)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === selectedCampaign.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === selectedCampaign.id ? "Link Copied!" : "Copy Payment Link"}
              </button>

              {selectedCampaign.status !== 'RECOVERED' && (
                <button
                  onClick={() => {
                    const id = selectedCampaign.id;
                    setSelectedCampaign(null);
                    onNavigateToCustomerPortal(id);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00d2ff] hover:bg-[#00c0eb] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  Open Recovery Portal <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
