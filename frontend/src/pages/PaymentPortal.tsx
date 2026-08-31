import React from 'react';

export default function PaymentPortal() {
  const queryParams = new URLSearchParams(window.location.search);
  const paylink = queryParams.get('paylink') || 'unknown';
  
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', color: '#111827' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', maxWidth: '400px', width: '100%', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#02042b', padding: '1.5rem', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Razorpay Secure Checkout</h2>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.8, fontSize: '0.875rem' }}>Invoice Recovery Link</p>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Amount Due</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>₹499.00</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Link ID: {paylink}</div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', margin: '1.5rem 0' }}></div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Select Payment Method</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#374151' }}>UPI</div>
              <div>
                <div style={{ fontWeight: 600 }}>UPI Intent / Autopay</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>GPay, PhonePe, Paytm</div>
              </div>
            </button>

            <button style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#374151' }}>CC</div>
              <div>
                <div style={{ fontWeight: 600 }}>Credit/Debit Card</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Visa, Mastercard, RuPay</div>
              </div>
            </button>
            
            <button style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#374151' }}>NB</div>
              <div>
                <div style={{ fontWeight: 600 }}>NetBanking</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>All Indian Banks</div>
              </div>
            </button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={() => {
                alert("Simulated Payment Successful!");
                window.close();
              }}
              style={{ width: '100%', padding: '1rem', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
              Pay Now Securely
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '0.75rem', color: '#9ca3af' }}>
          🔒 Secured by Razorpay AI Checkouts
        </div>
      </div>
    </div>
  );
}
