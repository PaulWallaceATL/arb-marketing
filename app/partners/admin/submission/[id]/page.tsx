'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
      <div className="card">
        <div className="card-header">
          <div>
            <h1>Submission Detail</h1>
            <p className="muted">{submissionId}</p>
          </div>
          <a href="/partners/dashboard" className="btn-link">Back to admin</a>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && submission && (
          <div className="detail-grid">
            <div>
              <h3>Lead</h3>
              <p><strong>Name:</strong> {submission.lead_name}</p>
              <p><strong>Email:</strong> {submission.lead_email}</p>
              <p><strong>Phone:</strong> {submission.lead_phone || 'N/A'}</p>
              <p><strong>Message:</strong> {submission.lead_message || 'N/A'}</p>
            </div>
            <div>
              <h3>Status</h3>
              <p><strong>Status:</strong> {submission.status}</p>
              <p><strong>Created:</strong> {new Date(submission.created_at).toLocaleString()}</p>
              <p><strong>Partner:</strong> {submission.channel_partners?.company_name || 'Direct'}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .page-shell {
          padding: 24px;
        }
        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .muted {
          color: #64748b;
          margin: 0;
        }
        .btn-link {
          color: #4338ca;
          text-decoration: none;
          font-weight: 600;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
        .error {
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}

