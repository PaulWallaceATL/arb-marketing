'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getUserRole } from '@/lib/supabase/client';
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/partners/login');
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(session.user.email ?? null);
      
      // Get user role
      const role = await getUserRole(session.user.id);
      setUserRole(role);

      // Fetch user submissions (service role via API)
      setSubsLoading(true);
      setSubsError(null);
      try {
        const resp = await fetch('/api/referral/my-submissions');
        if (resp.ok) {
          const json = await resp.json();
          setSubmissions(json.submissions || []);
        } else {
          const json = await resp.json().catch(() => ({}));
          setSubsError(json.error || 'Failed to load your referrals');
        }
      } catch (err: any) {
        setSubsError(err?.message || 'Failed to load your referrals');
      } finally {
        setSubsLoading(false);
      }

      if (!role) {
        // User doesn't have a role assigned yet
        console.error('User role not found');
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

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="nav-logo">Partner Portal</h1>
          <div className="nav-actions">
            <span className="user-role">{userRole || 'User'}</span>
            <a href="/submission-form" className="nav-link">
              Referral Form
            </a>
            <button onClick={handleLogout} className="btn-logout">
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
            <h2>Partner Dashboard</h2>
            <p>Welcome to your partner dashboard!</p>

            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Your Email</div>
                <div className="info-value">{userEmail || '—'}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Role</div>
                <div className="info-value">{userRole || 'User'}</div>
              </div>
            </div>

            <div className="submissions-card">
              <div className="submissions-header">
                <h3>Your Referrals</h3>
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
                            <span className="status-chip">{s.status}</span>
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
          background: #f5f7fa;
        }

        .dashboard-nav {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-role {
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .nav-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .nav-link:hover {
          text-decoration: underline;
        }

        .btn-logout {
          padding: 0.5rem 1.5rem;
          background: #f8f9fa;
          color: #333;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-logout:hover {
          background: #e9ecef;
        }

        .dashboard-main {
          padding: 0;
        }

        .partner-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .partner-view h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0 2rem;
        }

        .info-card {
          background: white;
          padding: 1.25rem;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .info-label {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.35rem;
        }

        .info-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .submissions-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .submissions-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .submissions-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #1f2937;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.6rem;
          border-radius: 999px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .submissions-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }

        .submissions-table th,
        .submissions-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          text-align: left;
        }

        .submissions-table th {
          color: #6b7280;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .submissions-table td {
          color: #111827;
        }

        .status-chip {
          display: inline-flex;
          padding: 0.25rem 0.55rem;
          border-radius: 999px;
          background: #e0f2fe;
          color: #0369a1;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .details {
          max-width: 320px;
          white-space: pre-wrap;
        }

        .empty-state {
          padding: 1rem 0.5rem;
          color: #475569;
        }

        .btn-link {
          display: inline-block;
          margin-top: 0.35rem;
          color: #4f46e5;
          text-decoration: underline;
          font-weight: 600;
        }

        .coming-soon {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          text-align: center;
          margin-top: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .coming-soon .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }

        .coming-soon p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .nav-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .nav-actions {
            width: 100%;
            justify-content: space-between;
          }

          .partner-view {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}

