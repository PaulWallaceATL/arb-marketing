'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError('No session found.');
        setLoading(false);
        return;
      }

      const resp = await fetch(`/api/admin/user/${userId}`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || 'Failed to load user');
        setLoading(false);
        return;
      }

      setUserEmail(json.user?.email || null);
      setSubmissions(json.submissions || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return <div className="page-shell"><p>Missing user id.</p></div>;
  }

  return (
    <div className="page-shell">
      <div className="card">
        <div className="card-header">
          <div>
            <h1>User Detail</h1>
            <p className="muted">{userId}</p>
            {userEmail && <p className="muted">{userEmail}</p>}
          </div>
          <a href="/partners/dashboard" className="btn-link">Back to admin</a>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="subs-section">
            <h3>Submissions</h3>
            {submissions.length === 0 ? (
              <p className="muted">No submissions for this user.</p>
            ) : (
              <div className="subs-list">
                {submissions.map((s) => (
                  <a key={s.id} href={`/partners/admin/submission/${s.id}`} className="sub-row">
                    <div>
                      <div className="sub-lead">{s.lead_name}</div>
                      <div className="sub-email">{s.lead_email}</div>
                    </div>
                    <div className="sub-meta">
                      <span className="badge">{s.status}</span>
                      <span className="sub-date">{new Date(s.created_at).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
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
        .subs-section {
          margin-top: 12px;
        }
        .subs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sub-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f8fafc;
          text-decoration: none;
          color: inherit;
        }
        .sub-lead {
          font-weight: 600;
          color: #0f172a;
        }
        .sub-email {
          font-size: 13px;
          color: #64748b;
        }
        .sub-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .badge {
          padding: 4px 8px;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 999px;
          font-weight: 600;
          font-size: 12px;
        }
        .sub-date {
          font-size: 12px;
          color: #94a3b8;
        }
        .error {
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}

