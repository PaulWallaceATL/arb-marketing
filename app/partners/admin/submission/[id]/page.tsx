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
          <a href="/partners/dashboard" className="btn-secondary">← Back to dashboard</a>
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
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .page-shell {
          padding: 32px 16px 48px;
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
