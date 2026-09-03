import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Zap,
  Tag,
  Check
} from 'lucide-react';

export default function CustomerPaymentPortal({ campaignId, campaigns = [], onPaymentSuccess, onBackToDashboard }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiProvider, setUpiProvider] = useState('gpay');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recoveredAmount, setRecoveredAmount] = useState(0);

  useEffect(() => {
    if (campaigns.length > 0) {
      const match = campaigns.find(c => c.id === campaignId || c.recoveryLinkId === campaignId) || campaigns[0];
      setSelectedCampaign(match);
      if (match) {
        setDiscountApplied(match.discountApplied && match.discountApplied.includes('REV5OFF'));
      }
    }
  }, [campaignId, campaigns]);

  if (!selectedCampaign) {
    return (
      <div className="bg-[#131A2F] border border-slate-800/80 rounded-sm shadow-sm p-12 text-center text-slate-400 space-y-4">
        <div>No active recovery campaign found.</div>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-sm bg-[#0B1021] text-white text-xs font-semibold hover:bg-slate-700"
        >
          Return to Merchant Dashboard
        </button>
      </div>
    );
  }

  const rawAmount = selectedCampaign.amount;
  const finalAmount = discountApplied ? Math.round(rawAmount * 0.95) : rawAmount;

  const handlePayNow = async () => {
    setProcessing(true);
    try {
      const res = await fetch('https://smartrecovery-rd4l.onrender.com/api/recover-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          paymentMethodUsed: paymentMethod === 'upi' ? `UPI (${upiProvider.toUpperCase()})` : paymentMethod === 'card' ? 'Credit Card (Updated Token)' : 'NetBanking HDFC Node 2'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setRecoveredAmount(finalAmount);
        if (onPaymentSuccess) onPaymentSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Top Back Navigation */}
      <button
        onClick={onBackToDashboard}
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Merchant Control Center
      </button>

      {/* Main Payment Card */}
      <div className="bg-[#131A2F] border border-slate-800/80 rounded-sm shadow-sm overflow-hidden border border-[#00d2ff]/40 shadow-lg bg-[#0d1630]">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-[#0b132b] via-[#1c2541] to-[#0b132b] p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#3a86ff] flex items-center justify-center font-black text-white text-sm">
              R
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                Razorpay Trusted Checkout
                <ShieldCheck className="w-3.5 h-3.5 text-[#3a86ff]" />
              </div>
              <div className="text-[11px] text-slate-400">AuraCloud SaaS & Digital Solutions</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              256-Bit SSL Encrypted
            </span>
          </div>
        </div>

        {/* Content Area */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Payment Recovered Successfully!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Transaction ID: <span className="font-mono text-[#3a86ff]">pay_rec_{Math.floor(100000 + Math.random() * 900000)}</span>
              </p>
            </div>

            <div className="p-4 rounded-sm bg-[#131A2F] border border-slate-800/80 text-xs space-y-1 text-slate-300">
              <div>Customer: <strong className="text-white">{selectedCampaign.customerName}</strong></div>
              <div>Subscription Plan: <strong className="text-white">{selectedCampaign.plan}</strong></div>
              <div>Amount Settled: <strong className="text-emerald-400 font-mono">₹{recoveredAmount.toLocaleString('en-IN')}</strong></div>
            </div>

            <button
              onClick={onBackToDashboard}
              className="w-full py-3 rounded-sm bg-[#3a86ff] text-slate-950 font-extrabold text-sm shadow-lg hover:brightness-110 cursor-pointer"
            >
              Back to Merchant Control Center
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Amount & Plan Card */}
            <div className="p-4 rounded-sm bg-[#131A2F]/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Subscription Renewal</div>
                <div className="text-sm font-bold text-white">{selectedCampaign.plan}</div>
                <div className="text-[11px] text-slate-400">Customer: {selectedCampaign.customerName}</div>
              </div>
              <div className="text-right">
                {discountApplied && (
                  <div className="text-[11px] text-slate-400 line-through">
                    ₹{rawAmount.toLocaleString('en-IN')}
                  </div>
                )}
                <div className="text-xl font-extrabold text-[#3a86ff] font-mono">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Smart Incentive Offer Banner if applicable */}
            {selectedCampaign.discountApplied && selectedCampaign.discountApplied.includes('REV5OFF') && (
              <div className="p-3 rounded-sm bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span>AI Dunning Special: <strong>5% Instant Waiver Applied (REV5OFF)</strong></span>
                </div>
                <span className="font-bold text-emerald-400">-₹{Math.round(rawAmount * 0.05)}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Recovery Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Method 1: Instant UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'bg-[#3a86ff]/15 border-[#00d2ff] text-white shadow-md'
                      : 'bg-[#131A2F]/60 border-slate-800/80 text-slate-400 hover:border-slate-800/80/80'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#3a86ff]" />
                  <span className="text-xs font-bold">UPI Intent</span>
                </button>

                {/* Method 2: Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'bg-[#3a86ff]/15 border-[#00d2ff] text-white shadow-md'
                      : 'bg-[#131A2F]/60 border-slate-800/80 text-slate-400 hover:border-slate-800/80/80'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-bold">Credit/Debit</span>
                </button>

                {/* Method 3: NetBanking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#3a86ff]/15 border-[#00d2ff] text-white shadow-md'
                      : 'bg-[#131A2F]/60 border-slate-800/80 text-slate-400 hover:border-slate-800/80/80'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">NetBanking</span>
                </button>
              </div>

              {/* UPI Provider options */}
              {paymentMethod === 'upi' && (
                <div className="p-3 bg-[#131A2F] rounded-sm border border-slate-800/80 space-y-2">
                  <div className="text-[11px] text-slate-400 font-semibold">Recommended UPI Apps:</div>
                  <div className="flex items-center gap-2">
                    {['gpay', 'phonepe', 'paytm'].map(app => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiProvider(app)}
                        className={`px-3 py-1.5 rounded-sm border text-xs font-bold uppercase tracking-wider cursor-pointer ${
                          upiProvider === app 
                            ? 'bg-[#3a86ff] border-[#3a86ff] text-white' 
                            : 'bg-slate-950 border-slate-800/80 text-slate-400'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full py-3.5 rounded-sm bg-gradient-to-r from-[#3a86ff] via-[#3a86ff] to-[#10b981] text-slate-950 font-extrabold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-slate-950" /> Authorizing via Razorpay API...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay ₹{finalAmount.toLocaleString('en-IN')} & Recover Access
                </>
              )}
            </button>

            <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3a86ff]" />
              Secured by Razorpay Magic Checkout Protocol
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
