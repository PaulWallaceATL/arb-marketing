'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

export default function AdminSubmissionDetailPage() {
  const params = useParams();
  const submissionId = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any | null>(null);
  const [statusSaving, setStatusSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError('No session found.');
        setLoading(false);
        return;
      }

      const resp = await fetch(`/api/admin/submission/${submissionId}`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || 'Failed to load submission');
        setLoading(false);
        return;
      }

      setSubmission(json.data || json);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load submission');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: 'pending' | 'approved' | 'denied') => {
    if (!submissionId) return;
    setStatusSaving(status);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError('No session found.');
        setStatusSaving(null);
        return;
      }

      const resp = await fetch(`/api/admin/submission/${submissionId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || 'Failed to update status');
      } else {
        setError(null);
        await fetchSubmission();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update status');
    } finally {
      setStatusSaving(null);
    }
  };

  const deleteSubmission = async () => {
    if (!submissionId) return;
    if (!confirm('Delete this submission?')) return;
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError('No session found.');
        setDeleting(false);
        return;
      }
      const resp = await fetch(`/api/admin/submission/${submissionId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(json.error || 'Failed to delete submission');
      } else {
        setError(null);
        window.location.href = '/partners/dashboard';
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete submission');
    } finally {
      setDeleting(false);
    }
  };

  if (!submissionId) {
    return <div className="page-shell"><p>Missing submission id.</p></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <p className="eyebrow">Submission Detail</p>
            <h1 className="page-title">Lead Overview</h1>
            <p className="muted">Full context and current status for this referral.</p>
          </div>
          <div className="hero-actions">
            <a href="/partners/dashboard" className="btn-secondary">← Back to dashboard</a>
            <button className="btn-danger" onClick={deleteSubmission} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete submission'}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          {loading && <p>Loading...</p>}
          {error && !loading && <p className="error-text">{error}</p>}

          {!loading && !error && submission && (
            <div className="detail-grid">
              <div className="detail-card">
                <p className="eyebrow">Lead</p>
                <h3 className="detail-title">{submission.lead_name}</h3>
                <p className="muted">{submission.lead_email}</p>
                <div className="detail-list">
                  <div className="detail-row">
                    <span>Phone</span>
                    <strong>{submission.lead_phone || 'N/A'}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Company</span>
                    <strong>{submission.lead_company || 'N/A'}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Message</span>
                    <strong>{submission.lead_message || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <p className="eyebrow">Status</p>
                <h3 className="detail-title">{submission.status}</h3>
                <div className="detail-list">
                  <div className="detail-row">
                    <span>Created</span>
                    <strong>{new Date(submission.created_at).toLocaleString()}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Partner</span>
                    <strong>{submission.channel_partners?.company_name || 'Direct'}</strong>
                  </div>
                </div>
                <div className="status-actions">
                  {(['pending', 'approved', 'denied'] as const).map((s) => (
                    <button
                      key={s}
                      className={`status-btn ${submission.status === s ? 'active' : ''}`}
                      onClick={() => updateStatus(s)}
                      disabled={submission.status === s || statusSaving === s || loading}
                    >
                      {statusSaving === s ? 'Updating...' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .page-shell {
          padding: 96px 16px 64px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .page-container {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .page-hero {
          background: white;
          padding: 20px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .page-title {
          margin: 4px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          font-size: 12px;
          color: #6366f1;
          margin: 0;
        }

        .muted {
          color: #64748b;
          margin: 0;
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #d8dee9;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-danger {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .detail-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }

        .status-actions {
          display: flex;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .status-btn {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          font-weight: 600;
          text-transform: capitalize;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-btn:hover:not(:disabled) {
          border-color: #6366f1;
          color: #6366f1;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.16);
        }

        .status-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
        }

        .detail-title {
          margin: 4px 0;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .detail-list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          color: #475569;
          font-size: 0.95rem;
        }

        .detail-row strong {
          color: #0f172a;
        }

        .error-text {
          color: #b91c1c;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page-shell {
            padding: 20px 12px 32px;
          }

          .page-hero {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
