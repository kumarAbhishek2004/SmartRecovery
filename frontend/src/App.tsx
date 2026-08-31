import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import UploadBatch from './pages/UploadBatch';
import PaymentPortal from './pages/PaymentPortal';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const isPaylink = queryParams.has('paylink');

  if (isPaylink) {
    return <PaymentPortal />;
  }

  const [currentView, setCurrentView] = useState<'upload' | 'dashboard'>('dashboard');
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    const initApp = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/ingest/load-sample`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          await fetch(`${API_BASE}/recovery/${data.batch_id}`, { method: 'POST' });
          setActiveBatchId(data.batch_id);
        }
      } catch (e) {
        console.error("Initial load failed", e);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };
    initApp();
  }, [initialized]);

  const handleIngested = (batchId: string) => {
    setActiveBatchId(batchId);
    setCurrentView('dashboard');
  };

  const fetchDashboardData = async () => {
    if (!activeBatchId) return;
    
    setLoading(true);
    setError('');
    try {
      const metricsRes = await fetch(`${API_BASE}/metrics/${activeBatchId}`);
      if (!metricsRes.ok) throw new Error("Metrics not found.");
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);

      const auditRes = await fetch(`${API_BASE}/audit/${activeBatchId}`);
      const auditData = await auditRes.json();
      setAuditLogs(auditData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard' && activeBatchId) {
      fetchDashboardData();
    }
  }, [currentView, activeBatchId]);

  const chartData = metrics ? Object.entries(metrics.failure_reason_breakdown).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  })) : [];

  const successLog = auditLogs.find(log => log.action_taken === 'retry' || log.action_taken === 'remind');
  const blockedLog = auditLogs.find(log => log.action_taken === 'no_op' || log.action_taken === 'escalate');

  return (
    <div className="dashboard-container">
      <div className="header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1>AI Revenue Recovery Agent</h1>
        <div>
          {currentView === 'dashboard' && (
            <button className="btn" onClick={() => setCurrentView('upload')} style={{ marginRight: '1rem', backgroundColor: 'var(--panel-bg)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              + New Batch
            </button>
          )}
          {currentView === 'dashboard' && (
            <button className="btn" onClick={fetchDashboardData} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          )}
          {currentView === 'upload' && activeBatchId && (
            <button className="btn" onClick={() => setCurrentView('dashboard')} style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              ← Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {currentView === 'upload' && <UploadBatch onIngested={handleIngested} />}

      {currentView === 'dashboard' && error && (
        <div className="panel" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {currentView === 'dashboard' && metrics && (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-title">Total Failed Amount</div>
              <div className="metric-value" style={{ color: 'var(--danger)' }}>
                ₹{metrics.total_failed_amount.toFixed(2)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-title">Recovered Amount (Retries)</div>
              <div className="metric-value" style={{ color: 'var(--success)' }}>
                ₹{metrics.recovered_amount.toFixed(2)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-title">Recovery Rate</div>
              <div className="metric-value">{metrics.recovery_rate}%</div>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid var(--warning)' }}>
              <div className="metric-title">Guardrails Triggered</div>
              <div className="metric-value">{metrics.guardrails_triggered}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Blocks & Escalations</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="panel" style={{ margin: 0 }}>
              <h2>Failure Reason Breakdown</h2>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: 'var(--text-muted)' }} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border)' }} />
                    <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel" style={{ margin: 0 }}>
              <h2>Highlighted Decisions</h2>
              
              {successLog && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.25rem' }}>✓ Automated Recovery Action</div>
                  <div style={{ fontSize: '0.875rem' }}><strong>Reason:</strong> {successLog.input_event.failure_code.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: '0.875rem' }}><strong>AI Rationale:</strong> {successLog.decision.rationale}</div>
                </div>
              )}
              
              {blockedLog && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--warning)', marginBottom: '0.25rem' }}>⚠ Guardrail Block / Escalation</div>
                  <div style={{ fontSize: '0.875rem' }}><strong>Reason:</strong> {blockedLog.input_event.failure_code.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: '0.875rem' }}><strong>AI Rationale:</strong> {blockedLog.decision.rationale}</div>
                </div>
              )}
            </div>
          </div>

          {auditLogs.length > 0 && (
            <div className="panel">
              <h2>Complete Audit Trail</h2>
              <table>
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Failure Reason</th>
                    <th>AI Decision</th>
                    <th>Generated Message (Preview)</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.input_event.customer_id}</td>
                      <td>{log.input_event.failure_code.replace(/_/g, ' ')}</td>
                      <td>
                        <span className={`badge ${log.action_taken}`}>
                          {log.action_taken.replace(/_/g, ' ')}
                        </span>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                          {log.decision.rationale}
                        </div>
                      </td>
                      <td>
                        {log.outreach_content && (
                          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '4px', fontSize: '0.875rem' }}>
                            <div style={{ color: '#25D366', fontWeight: 'bold', marginBottom: '0.25rem' }}>WhatsApp Preview</div>
                            <div style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>"{log.outreach_content.whatsapp_text}"</div>
                            <a href={log.outreach_content.recovery_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                              View Mock Payment Portal ↗
                            </a>
                            {log.outreach_content.incentive_code && (
                              <div style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.1rem 0.4rem', backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px dashed var(--warning)', color: 'var(--warning)', borderRadius: '4px' }}>
                                Coupon: {log.outreach_content.incentive_code}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
