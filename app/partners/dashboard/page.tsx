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
                <p className="eyebrow">Partner Portal</p>
                <h2 className="page-title">Your Referral Hub</h2>
                <p className="muted">Monitor your referrals and track your earnings in one place.</p>
              </div>
              <div className="heading-actions">
                <a className="btn-primary" href="/submission-form">+ New Referral</a>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card card">
                <div className="info-icon" style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="info-text">
                  <div className="info-label">Account</div>
                  <div className="info-value">{userEmail || '—'}</div>
                </div>
              </div>
              <div className="info-card card">
                <div className="info-icon" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="info-text">
                  <div className="info-label">Total Referrals</div>
                  <div className="info-value">{submissions.length}</div>
                </div>
              </div>
              <div className="info-card card">
                <div className="info-icon" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div className="info-text">
                  <div className="info-label">Points Earned</div>
                  <div className="info-value accent">{typeof userPoints === 'number' ? userPoints : '0'}</div>
                </div>
              </div>
            </div>

            <div className="submissions-card card">
              <div className="submissions-header">
                <div>
                  <p className="eyebrow">Activity</p>
                  <h3 className="card-title">Submitted Referrals</h3>
                </div>
                <span className="chip">
                  {subsLoading ? 'Loading...' : `${submissions.length} total`}
                </span>
              </div>

              {submissions.length === 0 && !subsLoading ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <h4>No referrals yet</h4>
                  <p>Submit your first referral to start earning points and rewards.</p>
                  {subsError && (
                    <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '0.85rem' }}>
                      Unable to load referrals right now. Please try again later.
                    </p>
                  )}
                  <a href="/submission-form" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.9rem', padding: '0.7rem 1.4rem' }}>
                    Submit Your First Referral
                  </a>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="submissions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Lead Name</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((s) => (
                        <tr key={s.id}>
                          <td className="date-cell">{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td className="name-cell"><strong>{s.lead_name}</strong></td>
                          <td className="contact-cell">
                            <span>{s.lead_email}</span>
                            {s.lead_phone && <span className="phone-sub">{s.lead_phone}</span>}
                          </td>
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
          padding: 1.25rem 1.35rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .info-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .info-label {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .info-value {
          font-weight: 800;
          color: #0f172a;
          font-size: 1.1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .info-value.accent {
          color: #059669;
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
          padding: 0.85rem 0.75rem;
          font-size: 0.93rem;
          color: #374151;
          border-bottom: 1px solid #f1f5f9;
        }
        th {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.65rem;
        }
        tbody tr {
          transition: background-color 0.15s ease;
        }
        tbody tr:hover {
          background: #f8fafc;
        }
        .status-chip {
          padding: 0.35rem 0.6rem;
          border-radius: 999px;
          font-weight: 700;
          text-transform: capitalize;
          display: inline-block;
        }
        .status-chip.new { background: #e0e7ff; color: #4338ca; }
        .status-chip.pending { background: #fef3c7; color: #92400e; }
        .status-chip.approved { background: #d1fae5; color: #065f46; }
        .status-chip.denied { background: #fee2e2; color: #991b1b; }

        .date-cell {
          white-space: nowrap;
          color: #64748b;
          font-size: 0.88rem;
        }
        .name-cell strong {
          color: #0f172a;
          font-weight: 600;
        }
        .contact-cell {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .contact-cell .phone-sub {
          font-size: 0.82rem;
          color: #94a3b8;
        }
        .details {
          max-width: 280px;
          color: #64748b;
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .empty-state {
          text-align: center;
          color: #64748b;
          padding: 3rem 1.5rem;
        }
        .empty-state .empty-icon {
          margin-bottom: 1rem;
        }
        .empty-state h4 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.35rem;
        }
        .empty-state p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
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

