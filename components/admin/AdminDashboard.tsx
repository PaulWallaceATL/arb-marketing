'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, ReferralSubmission } from '@/lib/supabase/client';

// Icons for status badges
const StatusIcon = ({ status }: { status: string }) => {
  const icons = {
    pending: '⏳',
    approved: '✅',
    denied: '🚫'
  };
  return <span>{icons[status as keyof typeof icons] || '❓'}</span>;
};

interface DashboardStats {
  totalSubmissions: number;
  newSubmissions: number;
  convertedSubmissions: number;
  activePartners: number;
  totalRevenue: string;
  conversionRate: string;
}

interface StatusCounts {
  [key: string]: number;
}

interface PartnerPerformance {
  company_name: string;
  total_referrals: number;
  total_conversions: number;
  conversion_rate: number;
  total_revenue: number;
}

interface UserWithSubs {
  user_id: string;
  email: string | null;
  submissions: ReferralSubmission[];
}

interface Raffle {
  id: string;
  name: string;
  description: string | null;
  entry_cost_points: number;
  max_entries: number;
  status: string;
  entry_count?: number;
  created_at?: string;
  image_url?: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});
  const [recentSubmissions, setRecentSubmissions] = useState<ReferralSubmission[]>([]);
  const [partnerPerformance, setPartnerPerformance] = useState<PartnerPerformance[]>([]);
  const [usersWithSubs, setUsersWithSubs] = useState<UserWithSubs[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [raffleForm, setRaffleForm] = useState({
    name: '',
    description: '',
    entry_cost_points: 1,
    max_entries: 10,
    image_url: '',
  });
  const [raffleLoading, setRaffleLoading] = useState(false);
  const [showRaffleForm, setShowRaffleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ReferralSubmission | null>(null);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError('No session found. Please log in again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setStats(data.summary);
        setStatusCounts(data.statusCounts || {});
        setRecentSubmissions(data.recentSubmissions || []);
        setPartnerPerformance(data.partnerPerformance || []);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }

      // Fetch users and their submissions
      const usersResp = await fetch('/api/admin/users-with-submissions', {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersJson = await usersResp.json();
      if (usersResp.ok) {
        setUsersWithSubs(usersJson.users || []);
      } else {
        setError((prev) => prev || usersJson.error || 'Failed to fetch users/submissions');
      }

      // Fetch raffles
      const rafflesResp = await fetch('/api/admin/raffles', {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      const rafflesJson = await rafflesResp.json();
      if (rafflesResp.ok) {
        setRaffles(rafflesJson.raffles || []);
      } else {
        setError((prev) => prev || rafflesJson.error || 'Failed to fetch raffles');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        alert('No session found. Please log in again.');
        return;
      }

      const response = await fetch(`/api/admin/submission/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
        setSelectedSubmission(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update submission');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const createRaffle = async (e: React.FormEvent) => {
    e.preventDefault();
    setRaffleLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        alert('No session found. Please log in again.');
        setRaffleLoading(false);
        return;
      }

      const resp = await fetch('/api/admin/raffles', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(raffleForm),
      });
      const json = await resp.json();
      if (!resp.ok) {
        alert(json.error || 'Failed to create raffle');
      } else {
        // refresh raffles
        setRaffles((prev) => [json.raffle, ...prev]);
        setRaffleForm({ name: '', description: '', entry_cost_points: 1, max_entries: 10, image_url: '' });
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to create raffle');
    } finally {
      setRaffleLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const classes: { [key: string]: string } = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      denied: 'badge-denied',
    };
    return classes[status] || 'badge-default';
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-text">
            <div className="header-badge">Admin Panel</div>
            <h1 className="header-title">Referral Management</h1>
            <p className="header-subtitle">Monitor and manage your referral pipeline</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchDashboardData} className="btn-secondary">
              <span>🔄</span> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Raffles */}
      <div className="raffles-section card">
        <div className="section-header">
          <h2 className="section-title">Raffles</h2>
          <div className="raffle-actions">
            <span className="raffle-count">{raffles.length} active</span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowRaffleForm((prev) => !prev)}
            >
              {showRaffleForm ? 'Close' : 'New raffle'}
            </button>
          </div>
        </div>

        <div className="raffle-layout">
          {showRaffleForm && (
            <div className="raffle-form">
              <div className="raffle-form-header">
                <div>
                  <p className="eyebrow">Admin Panel</p>
                  <h3>Create Raffle</h3>
                  <p className="muted">Set entry cost, limit, and optional cover image.</p>
                </div>
              </div>
              <form className="form-grid" onSubmit={createRaffle}>
                <label>
                  Name
                  <input
                    required
                    value={raffleForm.name}
                    onChange={(e) => setRaffleForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </label>
                <label>
                  Entry cost (points)
                  <input
                    type="number"
                    min={1}
                    required
                    value={raffleForm.entry_cost_points}
                    onChange={(e) => setRaffleForm((p) => ({ ...p, entry_cost_points: Number(e.target.value) || 1 }))}
                  />
                </label>
                <label>
                  Max entries
                  <input
                    type="number"
                    min={1}
                    required
                    value={raffleForm.max_entries}
                    onChange={(e) => setRaffleForm((p) => ({ ...p, max_entries: Number(e.target.value) || 1 }))}
                  />
                </label>
                <label>
                  Image URL (optional)
                  <input
                    placeholder="https://..."
                    value={raffleForm.image_url}
                    onChange={(e) => setRaffleForm((p) => ({ ...p, image_url: e.target.value }))}
                  />
                </label>
                <label className="full-row">
                  Description
                  <textarea
                    value={raffleForm.description}
                    onChange={(e) => setRaffleForm((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                  />
                </label>
                <div className="form-actions full-row">
                  <button className="btn-primary" type="submit" disabled={raffleLoading}>
                    {raffleLoading ? 'Creating...' : 'Create raffle'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="raffle-list">
            {raffles.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎟️</div>
                <h4>No raffles yet</h4>
                <p>Create a raffle to start accepting entries.</p>
              </div>
            )}
            {raffles.map((r) => (
              <div key={r.id} className="raffle-card">
                <div className="raffle-card-header">
                  <div className="raffle-card-title">
                    <h4>{r.name}</h4>
                    {r.description && <p className="muted">{r.description}</p>}
                  </div>
                  <span className={`status-badge ${r.status === 'active' ? 'badge-approved' : 'badge-pending'}`}>
                    {r.status}
                  </span>
                </div>
                {r.image_url && (
                  <div className="raffle-image">
                    <img src={r.image_url} alt={r.name} />
                  </div>
                )}
                <div className="raffle-meta">
                  <div>
                    <strong>{r.entry_cost_points}</strong>
                    <span>Points per entry</span>
                  </div>
                  <div>
                    <strong>{r.max_entries}</strong>
                    <span>Max entries</span>
                  </div>
                  <div>
                    <strong>{r.entry_count ?? 0}</strong>
                    <span>Entries used</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <h2 className="section-title">Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <span>📊</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{stats?.totalSubmissions || 0}</div>
              <div className="metric-label">Total Submissions</div>
              <div className="metric-trend">All time</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <span>🆕</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{stats?.newSubmissions || 0}</div>
              <div className="metric-label">New This Week</div>
              <div className="metric-trend">Last 7 days</div>
            </div>
          </div>

          <div className="metric-card highlight">
            <div className="metric-icon">
              <span>💰</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{stats?.convertedSubmissions || 0}</div>
              <div className="metric-label">Conversions</div>
              <div className="metric-trend">{stats?.conversionRate || 0}% success rate</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <span>💵</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">${stats?.totalRevenue || '0.00'}</div>
              <div className="metric-label">Revenue</div>
              <div className="metric-trend">Total generated</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <span>👥</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{stats?.activePartners || 0}</div>
              <div className="metric-label">Active Partners</div>
              <div className="metric-trend">Currently active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="status-section">
        <h2 className="section-title">Pipeline Status</h2>
        <div className="status-overview">
          <div className="status-chart">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = stats?.totalSubmissions ?
                Math.round((count / stats.totalSubmissions) * 100) : 0;
              return (
                <div key={status} className="status-bar">
                  <div className="status-info">
                    <div className="status-header">
                      <StatusIcon status={status} />
                      <span className="status-name">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </div>
                    <span className="status-count">{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${getStatusBadgeClass(status)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="status-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h2 className="section-title">Recent Submissions</h2>
          <button className="btn-link">View All</button>
        </div>
          <div className="activity-list">
          {recentSubmissions.slice(0, 5).map((submission: any) => (
            <div
              key={submission.id}
              className="activity-item clickable"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/partners/admin/submission/${submission.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(`/partners/admin/submission/${submission.id}`);
                }
              }}
            >
              <div className="activity-avatar">
                <span>{submission.lead_name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="activity-content">
                <div className="activity-primary">
                  <span className="activity-name">{submission.lead_name}</span>
                  <span className="activity-company">
                    {submission.lead_company || 'No company'}
                  </span>
                </div>
                <div className="activity-meta">
                  <span className="activity-date">{formatDate(submission.created_at)}</span>
                  <span className="activity-source">
                    {submission.channel_partners?.company_name || 'Direct'}
                  </span>
                </div>
              </div>
              <div className="activity-status">
                <span className={`status-badge ${getStatusBadgeClass(submission.status)}`}>
                  <StatusIcon status={submission.status} />
                  {submission.status}
                </span>
              </div>
              <div className="activity-actions">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/partners/admin/submission/${submission.id}`);
                  }}
                  className="btn-icon"
                  title="View Details"
                >
                  👁️
                </button>
              </div>
            </div>
          ))}
          {recentSubmissions.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No recent submissions</h3>
              <p>Submissions will appear here as they come in.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Management */}
      <div className="users-section">
        <div className="section-header">
          <h2 className="section-title">Partner Management</h2>
          <button className="btn-primary">Add Partner</button>
        </div>

        {usersWithSubs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No partners yet</h3>
            <p>Partners will appear here as they sign up and submit referrals.</p>
          </div>
        ) : (
          <div className="users-grid">
            {usersWithSubs.map((u) => (
              <div
                key={u.user_id}
                className="user-card"
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/partners/admin/users/${u.user_id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/partners/admin/users/${u.user_id}`);
                  }
                }}
              >
                <div className="user-card-header">
                  <div className="user-avatar">
                    <span>{(u.email || u.user_id).charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{u.email || 'No email'}</h3>
                    <p className="user-id">{u.user_id.slice(0, 8)}...</p>
                  </div>
                  <div className="user-stats">
                    <div className="stat">
                      <span className="stat-number">{u.submissions.length}</span>
                      <span className="stat-label">Referrals</span>
                    </div>
                  </div>
                </div>

                <div className="user-card-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/partners/admin/users/${u.user_id}`);
                    }}
                  >
                    Manage
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    title="View Profile"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/partners/admin/users/${u.user_id}`);
                    }}
                  >
                    👁️
                  </button>
                </div>

                {u.submissions.length > 0 && (
                  <div className="user-recent-submissions">
                    <h4>Recent Referrals</h4>
                    <div className="submission-previews">
                      {u.submissions.slice(0, 3).map((s) => (
                        <div
                          key={s.id}
                          className="submission-preview"
                          onClick={() => router.push(`/partners/admin/submission/${s.id}`)}
                        >
                          <div className="preview-info">
                            <span className="preview-name">{s.lead_name}</span>
                            <span className={`preview-status ${getStatusBadgeClass(s.status)}`}>
                              {s.status}
                            </span>
                          </div>
                          <span className="preview-date">
                            {new Date(s.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="btn-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Lead Name:</label>
                <p>{selectedSubmission.lead_name}</p>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <p>{selectedSubmission.lead_email}</p>
              </div>
              <div className="detail-group">
                <label>Phone:</label>
                <p>{selectedSubmission.lead_phone || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Company:</label>
                <p>{selectedSubmission.lead_company || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Message:</label>
                <p>{selectedSubmission.lead_message || 'N/A'}</p>
              </div>
              <div className="detail-group">
                <label>Current Status:</label>
                <span className={`badge ${getStatusBadgeClass(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
              </div>
              <div className="detail-group">
                <label>Change Status:</label>
                <div className="status-buttons">
                  {['pending', 'approved', 'denied'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateSubmissionStatus(selectedSubmission.id, status)}
                      className={`btn-status ${getStatusBadgeClass(status)}`}
                      disabled={selectedSubmission.status === status}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .admin-header {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .header-text {
          flex: 1;
        }

        .header-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .header-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        /* Section Styles */
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1.5rem 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header .section-title {
          margin: 0;
        }

        .btn-link {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-size: 0.875rem;
        }

        /* Metrics Section */
        .metrics-section {
          margin-bottom: 2rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .metric-card.highlight {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }

        .metric-card.highlight .metric-label,
        .metric-card.highlight .metric-trend {
          color: rgba(255, 255, 255, 0.9);
        }

        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .metric-card.highlight .metric-icon {
          background: rgba(255, 255, 255, 0.2);
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .metric-card.highlight .metric-value {
          color: white;
        }

        .metric-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 0.25rem 0;
        }

        .metric-trend {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Status Section */
        .status-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .status-overview {
          margin-top: 1rem;
        }

        .status-chart {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .status-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .status-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          margin-right: 1rem;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-name {
          font-weight: 600;
          color: #1e293b;
        }

        .status-count {
          font-weight: 700;
          font-size: 1.125rem;
          color: #1e293b;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-fill.badge-pending { background: #f59e0b; }
        .progress-fill.badge-approved { background: #16a34a; }
        .progress-fill.badge-denied { background: #ef4444; }

        .status-percentage {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          min-width: 3rem;
          text-align: right;
        }

        /* Activity Section */
        .activity-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .activity-item:hover {
          background: #f1f5f9;
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1rem;
        }

        .activity-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .activity-primary {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .activity-name {
          font-weight: 600;
          color: #1e293b;
        }

        .activity-company {
          font-size: 0.875rem;
          color: #64748b;
        }

        .activity-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .activity-date {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .activity-source {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .activity-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.badge-pending {
          background: #fef3c7;
          color: #d97706;
        }

        .status-badge.badge-approved {
          background: #d1fae5;
          color: #059669;
        }

        .status-badge.badge-denied {
          background: #fee2e2;
          color: #dc2626;
        }

        .activity-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }

        .btn-icon:hover {
          background: #e2e8f0;
        }

        /* Users Section */
        .users-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .user-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          pointer-events: auto;
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .user-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .user-id {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        .user-stats {
          text-align: center;
        }

        .stat .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          display: block;
        }

        .stat .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .user-card-actions {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          pointer-events: auto;
        }

        .user-recent-submissions h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.75rem 0;
        }

        .submission-previews {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .submission-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .submission-preview:hover {
          background: #f8fafc;
        }

        .preview-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .preview-name {
          font-weight: 500;
          color: #1e293b;
        }

        .preview-status {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .preview-date {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Raffles */
        .raffles-section {
          margin-top: 1rem;
        }

        .raffle-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .raffle-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .raffle-form {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
        }

        .raffle-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .raffle-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          background: white;
        }

        .raffle-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 10px;
        }

        .raffle-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .raffle-meta div {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px;
        }

        .raffle-meta strong {
          display: block;
          font-size: 1.1rem;
          color: #0f172a;
        }

        .raffle-meta span {
          font-size: 0.85rem;
          color: #64748b;
        }

        .raffle-image {
          margin: 0.5rem 0 0.75rem 0;
          overflow: hidden;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .raffle-image img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Empty States */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          margin: 0;
        }

        /* Buttons */
        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #94a3b8;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .btn-close:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .modal-body {
          padding: 2rem;
        }

        .detail-group {
          margin-bottom: 1.5rem;
        }

        .detail-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .detail-group p {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }

        .status-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-status {
          padding: 0.5rem 1rem;
          border: 2px solid currentColor;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
          transition: all 0.2s ease;
        }

        .btn-status:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-status:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }

          .admin-header {
            padding: 1.5rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .activity-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .activity-content {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .user-card-header {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .user-card-actions {
            justify-content: center;
          }
        }

        /* Loading States */
        .dashboard-loading,
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1.5rem;
        }

        .spinner {
          border: 4px solid #f1f5f9;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-error h2 {
          color: #ef4444;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

