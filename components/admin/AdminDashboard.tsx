'use client';

import { useState, useEffect } from 'react';
import { supabase, ReferralSubmission } from '@/lib/supabase/client';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});
  const [recentSubmissions, setRecentSubmissions] = useState<ReferralSubmission[]>([]);
  const [partnerPerformance, setPartnerPerformance] = useState<PartnerPerformance[]>([]);
  const [usersWithSubs, setUsersWithSubs] = useState<UserWithSubs[]>([]);
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
      new: 'badge-new',
      contacted: 'badge-contacted',
      qualified: 'badge-qualified',
      converted: 'badge-converted',
      lost: 'badge-lost',
      spam: 'badge-spam',
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
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Control Center</h1>
          <p className="muted">Manage submissions, users, and performance at a glance.</p>
        </div>
        <button onClick={fetchDashboardData} className="btn-refresh">
          Refresh
        </button>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-circle">
            <span className="material-icon">assessment</span>
          </div>
          <div className="stat-content">
            <h3>Total Submissions</h3>
            <p className="stat-value">{stats?.totalSubmissions || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-circle">
            <span className="material-icon">fiber_new</span>
          </div>
          <div className="stat-content">
            <h3>New (7 days)</h3>
            <p className="stat-value">{stats?.newSubmissions || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-circle">
            <span className="material-icon">check_circle</span>
          </div>
          <div className="stat-content">
            <h3>Conversions</h3>
            <p className="stat-value">{stats?.convertedSubmissions || 0}</p>
            <p className="stat-subtitle">{stats?.conversionRate || 0}% rate</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-circle">
            <span className="material-icon">payments</span>
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats?.totalRevenue || '0.00'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-circle">
            <span className="material-icon">groups</span>
          </div>
          <div className="stat-content">
            <h3>Active Partners</h3>
            <p className="stat-value">{stats?.activePartners || 0}</p>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="section-card">
        <h2>Status Breakdown</h2>
        <div className="status-grid">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="status-item">
              <span className={`badge ${getStatusBadgeClass(status)}`}>
                {status}
              </span>
              <span className="status-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="section-card">
        <h2>Recent Submissions</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Lead Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Partner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission: any) => (
                <tr key={submission.id}>
                  <td>{formatDate(submission.created_at)}</td>
                  <td>{submission.lead_name}</td>
                  <td>{submission.lead_email}</td>
                  <td>{submission.lead_company || 'N/A'}</td>
                  <td>{submission.channel_partners?.company_name || 'Direct'}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="btn-action"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users and their submissions */}
      <div className="section-card">
        <h2>Users & Submissions</h2>
        <div className="table-container">
          {usersWithSubs.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No user submissions found.</p>
          ) : (
            <div className="user-list">
              {usersWithSubs.map((u) => (
                <a
                  href={`/partners/admin/users/${u.user_id}`}
                  className="user-block"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div className="user-block-header">
                    <div>
                      <div className="user-email">{u.email || 'No email'}</div>
                      <div className="user-id">{u.user_id}</div>
                    </div>
                    <span className="pill">{u.submissions.length} submissions</span>
                  </div>
                  <div className="user-submissions">
                    {u.submissions.length === 0 && <p className="muted">No submissions</p>}
                    {u.submissions.map((s) => (
                      <a
                        key={s.id}
                        href={`/partners/admin/submission/${s.id}`}
                        className="user-submission-row"
                        style={{ textDecoration: 'none', display: 'flex' }}
                      >
                        <div>
                          <div className="sub-lead">{s.lead_name}</div>
                          <div className="sub-email">{s.lead_email}</div>
                        </div>
                        <div className="sub-meta">
                          <span className={`badge ${getStatusBadgeClass(s.status)}`}>{s.status}</span>
                          <span className="sub-date">{new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
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
                  {['new', 'contacted', 'qualified', 'converted', 'lost', 'spam'].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateSubmissionStatus(selectedSubmission.id, status)
                        }
                        className={`btn-status ${getStatusBadgeClass(status)}`}
                        disabled={selectedSubmission.status === status}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          color: #333;
        }

        .btn-refresh {
          padding: 0.75rem 1.5rem;
          background-color: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-refresh:hover {
          background-color: #5568d3;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #ffffff;
          padding: 1.25rem;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
          display: flex;
          gap: 0.85rem;
          align-items: center;
        }

        .stat-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4338ca;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .material-icon {
          font-family: 'Material Icons';
          font-size: 20px;
          line-height: 1;
        }

        .stat-content h3 {
          font-size: 0.95rem;
          color: #111827;
          margin: 0 0 0.15rem;
        }

        .stat-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .stat-subtitle {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }

        .section-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .section-card h2 {
          margin-bottom: 1rem;
          color: #111827;
          font-size: 1.3rem;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .status-count {
          font-weight: 700;
          font-size: 1.25rem;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .badge-new {
          background-color: #cce5ff;
          color: #004085;
        }

        .badge-contacted {
          background-color: #fff3cd;
          color: #856404;
        }

        .badge-qualified {
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .badge-converted {
          background-color: #d4edda;
          color: #155724;
        }

        .badge-lost {
          background-color: #f8d7da;
          color: #721c24;
        }

        .badge-spam {
          background-color: #e2e3e5;
          color: #383d41;
        }

        .user-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-block {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px;
          background: #f8fafc;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }

        .user-block:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
        }

        .user-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .user-email {
          font-weight: 700;
          color: #0f172a;
        }

        .user-id {
          font-size: 12px;
          color: #94a3b8;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 999px;
          font-weight: 600;
          font-size: 12px;
        }

        .user-submissions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-submission-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fff;
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

        .sub-date {
          font-size: 12px;
          color: #94a3b8;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .data-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .data-table tr:hover {
          background-color: #f8f9fa;
        }

        .btn-action {
          padding: 0.5rem 1rem;
          background-color: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .btn-action:hover {
          background-color: #5568d3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h2 {
          margin: 0;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #999;
          line-height: 1;
        }

        .btn-close:hover {
          color: #333;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .detail-group {
          margin-bottom: 1.5rem;
        }

        .detail-group label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .detail-group p {
          margin: 0;
          color: #666;
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
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .btn-status:hover:not(:disabled) {
          opacity: 0.8;
        }

        .btn-status:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dashboard-loading,
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
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

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .data-table {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}

