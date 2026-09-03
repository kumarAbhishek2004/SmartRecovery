import React, { useState } from 'react';

const API_BASE = 'https://smartrecovery-rd4l.onrender.com/api';

export default function UploadBatch({ onIngested }: { onIngested: (batchId: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const simulateExternalSync = async () => {
    setLoading(true);
    setError('');
    try {
      // Call the external sync endpoint
      const res = await fetch(`${API_BASE}/ingest/simulate-external`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to simulate external sync');
      const data = await res.json();
      
      // Run the recovery process on the newly generated batch
      const recRes = await fetch(`${API_BASE}/recovery/${data.batch_id}`, {
        method: 'POST'
      });
      if (!recRes.ok) throw new Error('Failed to run recovery engine');
      
      onIngested(data.batch_id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const text = await file.text();
      const events = text.trim().split('\n').map(line => JSON.parse(line));
      
      // Ingest the file data
      const res = await fetch(`${API_BASE}/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events)
      });
      
      if (!res.ok) throw new Error('Failed to ingest batch file');
      const data = await res.json();
      
      // Run the recovery process
      const recRes = await fetch(`${API_BASE}/recovery/${data.batch_id}`, {
        method: 'POST'
      });
      if (!recRes.ok) throw new Error('Failed to run recovery engine');
      
      onIngested(data.batch_id);
    } catch (err: any) {
      setError(err.message || 'Invalid JSONL format');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${API_BASE}/ingest/transform-csv`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Failed to run transformation pipeline on CSV');
      const data = await res.json();
      
      // Run the recovery process
      const recRes = await fetch(`${API_BASE}/recovery/${data.batch_id}`, {
        method: 'POST'
      });
      if (!recRes.ok) throw new Error('Failed to run recovery engine');
      
      onIngested(data.batch_id);
    } catch (err: any) {
      setError(err.message || 'Error processing CSV pipeline');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/ingest/load-sample`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to load sample data from backend');
      const data = await res.json();
      
      const recRes = await fetch(`${API_BASE}/recovery/${data.batch_id}`, {
        method: 'POST'
      });
      if (!recRes.ok) throw new Error('Failed to run recovery engine');
      
      onIngested(data.batch_id);
    } catch (err: any) {
      setError(err.message || 'Error loading sample');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Data Ingestion Options</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Select how you want to ingest the failed payments.
      </p>

      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', border: '1px solid var(--danger)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <button 
          className="btn" 
          onClick={simulateExternalSync} 
          disabled={loading}
          style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: 'var(--success)' }}
        >
          {loading ? 'Processing...' : 'Sync from Razorpay (Test Mode)'}
        </button>

        <div style={{ color: 'var(--text-muted)' }}>— OR —</div>
        
        <button 
          className="btn" 
          onClick={loadSampleData} 
          disabled={loading}
          style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: '#8b5cf6', color: '#fff' }}
        >
          {loading ? 'Processing...' : 'Load Pre-Generated Sample Data'}
        </button>

        <div style={{ color: 'var(--text-muted)' }}>— OR —</div>
        
        <label className="btn" style={{ padding: '1rem', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'block', backgroundColor: 'var(--warning)', color: '#000' }}>
          {loading ? 'Processing...' : 'Upload Raw CSV (Run Transformation Pipeline)'}
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            onChange={handleCsvUpload} 
            disabled={loading} 
          />
        </label>

        <div style={{ color: 'var(--text-muted)' }}>— OR —</div>

        <label className="btn" style={{ padding: '1rem', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'block' }}>
          {loading ? 'Processing...' : 'Upload Formatted JSONL File'}
          <input 
            type="file" 
            accept=".jsonl,.json" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
            disabled={loading} 
          />
        </label>
      </div>
    </div>
  );
}
