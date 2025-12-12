'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminDashboard from '@/components/admin/AdminDashboard';

interface Submission {
  id: string;
  lead_name: string;
  lead_email: string;
  lead_phone?: string;
  lead_message?: string;
  referral_code?: string;
  status: string;
  quality_score?: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAdminRole = async (token: string | null) => {
    if (!token) return false;
    try {
      const resp = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setUserRole('admin');
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/partners/login');
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(session.user.email ?? null);
      
      // Quick admin check (if admin, force admin view)
      const token = session.access_token;
      const isAdmin = await checkAdminRole(token);

      // Fetch user submissions (service role via API)
      setSubsLoading(true);
      setSubsError(null);
      setSubmissions([]);
      try {
        const resp = await fetch('/api/referral/my-submissions', {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (resp.ok) {
          const json = await resp.json();
          setSubmissions(json.submissions || []);
          if (isAdmin) {
            setUserRole('admin');
          } else {
            setUserRole(json.role || 'User');
          }
          if (typeof json.points === 'number') {
            setUserPoints(json.points);
          }
          if (json.warning) {
            setSubsError(json.warning);
          }
        } else {
          const json = await resp.json().catch(() => ({}));
          setSubsError(json.error || 'Failed to load your referrals');
          setSubmissions([]);
        }
      } catch (err: any) {
        setSubsError(err?.message || 'Failed to load your referrals');
        setSubmissions([]);
      } finally {
        setSubsLoading(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/partners/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/submission-form');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
          }

          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  console.log('Dashboard rendering with userRole:', userRole);

  return (
    <div className="dashboard-page">
      <div className="gradient-bg" />
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="nav-logo">Partner Portal</h1>
          <div className="nav-actions">
            <span className="pill role">{userRole || 'User'}</span>
            {typeof userPoints === 'number' && (
              <span className="pill points">Points: {userPoints}</span>
            )}
            <a href="/submission-form" className="nav-link">
              Referral Form
            </a>
            <button onClick={handleLogout} className="btn-ghost">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        {userRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <div className="partner-view">
            <div className="page-heading card">
              <div>
                <p className="eyebrow">Welcome back</p>
                <h2 className="page-title">Partner Dashboard</h2>
                <p className="muted">Track the referrals you’ve shared with us.</p>
              </div>
              <div className="heading-actions">
                <a className="btn-primary" href="/submission-form">Submit a referral</a>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card card">
                <div className="info-label">Your Email</div>
                <div className="info-value">{userEmail || '—'}</div>
              </div>
              <div className="info-card card">
                <div className="info-label">Role</div>
                <div className="info-value">{userRole || 'User'}</div>
              </div>
              <div className="info-card card">
                <div className="info-label">Points</div>
                <div className="info-value accent">{typeof userPoints === 'number' ? userPoints : '—'}</div>
                <p className="micro-text">Earn 1 point per referral, +2 when approved.</p>
              </div>
            </div>

            <div className="submissions-card card">
              <div className="submissions-header">
                <div>
                  <p className="eyebrow">Recent activity</p>
                  <h3 className="card-title">Your Referrals</h3>
                </div>
                <span className="chip">
                  {subsLoading ? 'Loading...' : `${submissions.length} total`}
                </span>
              </div>

              {submissions.length === 0 && !subsLoading ? (
                <div className="empty-state">
                  <p>No referrals yet.</p>
                  {subsError && (
                    <p style={{ color: '#6b7280', marginTop: '0.35rem' }}>
                      (We couldn’t load your referrals just now.)
                    </p>
                  )}
                  <a href="/submission-form" className="btn-link">
                    Go to submission form
                  </a>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="submissions-table">
                    <thead>
                      <tr>
                        <th>Submitted</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((s) => (
                        <tr key={s.id}>
                          <td>{new Date(s.created_at).toLocaleDateString()}</td>
                          <td>{s.lead_name}</td>
                          <td>{s.lead_email}</td>
                          <td>{s.lead_phone || '—'}</td>
                          <td>
                            <span className={`status-chip ${s.status}`}>{s.status}</span>
                          </td>
                          <td className="details">
                            {s.lead_message || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: radial-gradient(circle at 10% 20%, rgba(102,126,234,0.10), transparent 25%), #f8fafc;
          position: relative;
        }
        .gradient-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(900px 900px at 80% 0%, rgba(76,29,149,0.06), transparent), radial-gradient(700px 700px at 10% 30%, rgba(99,102,241,0.08), transparent);
          z-index: 0;
        }

        .dashboard-nav {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(15,23,42,0.06);
          position: sticky;
          top: 0;
          z-index: 120;
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-content {
          max-width: 1360px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .nav-logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .pill.role {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }
        .pill.points {
          background: #eef2ff;
          color: #312e81;
          border: 1px solid #c7d2fe;
        }

        .nav-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 700;
          padding: 0.45rem 0.6rem;
          border-radius: 10px;
        }
        .nav-link:hover {
          background: #eef2ff;
        }

        .btn-ghost {
          padding: 0.55rem 1.1rem;
          background: #f8fafc;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-ghost:hover {
          background: #e5e7eb;
        }

        .dashboard-main {
          padding: 2.5rem 0 3rem;
          margin-top: 76px;
        }

        .partner-view {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem 2rem;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06);
        }

        .page-heading {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .page-title {
          margin: 0.25rem 0 0;
          font-size: 2rem;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .heading-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.8rem 1.35rem;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          border: none;
          box-shadow: 0 12px 30px rgba(99,102,241,0.28);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 36px rgba(99,102,241,0.32);
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
          color: #6b7280;
          margin: 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }
        .info-card {
          padding: 1.1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .info-label {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }
        .info-value {
          font-weight: 800;
          color: #0f172a;
          font-size: 1.05rem;
        }
        .info-value.accent {
          color: #4f46e5;
        }
        .micro-text {
          margin: 0;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .submissions-card {
          padding: 1.35rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .submissions-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .card-title {
          margin: 0;
          font-size: 1.25rem;
          color: #0f172a;
        }
        .chip {
          padding: 0.4rem 0.85rem;
          background: #f3f4f6;
          border-radius: 999px;
          font-size: 0.88rem;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .table-wrapper {
          overflow-x: auto;
        }
        .submissions-table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          text-align: left;
          padding: 0.75rem 0.5rem;
          font-size: 0.95rem;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6b7280;
        }
        .status-chip {
          padding: 0.35rem 0.6rem;
          border-radius: 999px;
          font-weight: 700;
          text-transform: capitalize;
          display: inline-block;
        }
        .status-chip.pending { background: #fef3c7; color: #d97706; }
        .status-chip.approved { background: #d1fae5; color: #059669; }
        .status-chip.denied { background: #fee2e2; color: #dc2626; }

        .details {
          max-width: 360px;
          color: #4b5563;
        }
        .empty-state {
          text-align: center;
          color: #6b7280;
          padding: 1rem 0;
        }
        .btn-link {
          color: #6366f1;
          text-decoration: none;
          font-weight: 700;
        }
        .btn-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .nav-content {
            padding: 0.85rem 1.25rem;
          }
          .page-heading {
            flex-direction: column;
            align-items: flex-start;
          }
          .heading-actions {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .nav-actions {
            gap: 0.5rem;
          }
          .pill.points {
            width: 100%;
            justify-content: center;
          }
          .dashboard-main {
            margin-top: 70px;
            padding: 1.5rem 0 2rem;
          }
          .partner-view {
            padding: 0 1rem 1.5rem;
          }
          th, td {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}

