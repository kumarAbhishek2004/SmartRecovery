import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Loader2, X } from 'lucide-react';

export default function MockCheckoutModal({ campaign, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      await fetch(`https://smartrecovery-rd4l.onrender.com/api/checkout/${campaign.id}/success`, { method: 'POST' });
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto close after showing success for 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050b14]/90 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#131A2F] rounded-sm shadow-lg overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#0B1021] p-6 text-center relative">
          {!isProcessing && !isSuccess && (
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-sm flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Razorpay Secure Checkout</h2>
          <p className="text-blue-200/60 text-sm mt-1">{campaign.customerName}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-2">Payment Successful!</h3>
              <p className="text-slate-400">Redirecting you back...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Amount Box */}
              <div className="bg-[#0B1021] p-4 rounded-sm border border-slate-800/50 text-center">
                <div className="text-sm text-slate-400 font-medium mb-1">Total Amount</div>
                <div className="text-4xl font-extrabold text-slate-200">
                  ₹{campaign.amount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Fake Credit Card Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Card Number</label>
                  <div className="relative">
                    <input type="text" value="4111 1111 1111 1111" readOnly className="w-full bg-[#0B1021] border border-slate-800/80 rounded-sm py-3 px-4 pl-10 text-slate-300 font-mono outline-none" />
                    <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Expiry</label>
                    <input type="text" value="12/28" readOnly className="w-full bg-[#0B1021] border border-slate-800/80 rounded-sm py-3 px-4 text-slate-300 font-mono outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">CVV</label>
                    <input type="password" value="123" readOnly className="w-full bg-[#0B1021] border border-slate-800/80 rounded-sm py-3 px-4 text-slate-300 font-mono outline-none" />
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button 
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-sm shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2 mt-4"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  `Pay ₹${campaign.amount.toLocaleString('en-IN')} Securely`
                )}
              </button>
              
              <div className="text-center flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Secured by Razorpay
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
