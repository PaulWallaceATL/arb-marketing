'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

type Submission = {
  id: string;
  lead_name: string;
  lead_email: string;
  lead_phone?: string;
  lead_company?: string;
  lead_message?: string;
  status: string;
  created_at: string;
};

type StatusOption = 'pending' | 'approved' | 'denied';

const STATUS_OPTIONS: StatusOption[] = ['pending', 'approved', 'denied'];
const statusColors: Record<StatusOption, string> = {
  pending: '#f59e0b',
  approved: '#16a34a',
  denied: '#ef4444',
};

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [newReferral, setNewReferral] = useState({
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    lead_company: '',
    lead_message: '',
    status: 'pending' as StatusOption,
    referral_code: '',
    partner_id: '',
  });
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    lead_company: '',
    lead_message: '',
    status: 'pending' as StatusOption,
  });

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

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const resetForms = () => {
    setNewReferral({
      lead_name: '',
      lead_email: '',
      lead_phone: '',
      lead_company: '',
      lead_message: '',
      status: 'pending',
      referral_code: '',
      partner_id: '',
    });
    setEditingId(null);
    setEditValues({
      lead_name: '',
      lead_email: '',
      lead_phone: '',
      lead_company: '',
      lead_message: '',
      status: 'pending',
    });
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setCreating(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError('No session found.');
        setCreating(false);
        return;
      }

      const resp = await fetch('/api/admin/submissions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          ...newReferral,
        }),
      });

      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || 'Failed to create referral');
        return;
      }

      resetForms();
      await fetchUser();
    } catch (err: any) {
      setError(err?.message || 'Failed to create referral');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (sub: Submission) => {
    setEditingId(sub.id);
    setEditValues({
      lead_name: sub.lead_name || '',
      lead_email: sub.lead_email || '',
      lead_phone: sub.lead_phone || '',
      lead_company: sub.lead_company || '',
      lead_message: sub.lead_message || '',
      status: (sub.status as StatusOption) || 'pending',
    });
  };

  const handleUpdate = async (id: string) => {
    setSavingId(id);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError('No session found.');
        setSavingId(null);
        return;
      }

      const resp = await fetch(`/api/admin/submission/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editValues),
      });

      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || 'Failed to update referral');
        setSavingId(null);
        return;
      }

      resetForms();
      await fetchUser();
    } catch (err: any) {
      setError(err?.message || 'Failed to update referral');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this referral?')) return;

    setSavingId(id);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError('No session found.');
        setSavingId(null);
        return;
      }

      const resp = await fetch(`/api/admin/submission/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(json.error || 'Failed to delete referral');
        setSavingId(null);
        return;
      }

      resetForms();
      await fetchUser();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete referral');
    } finally {
      setSavingId(null);
    }
  };

  const summary = useMemo(() => {
    const total = submissions.length;
    const converted = submissions.filter((s) => s.status === 'converted').length;
    const contacted = submissions.filter((s) => s.status === 'contacted').length;
    const qualified = submissions.filter((s) => s.status === 'qualified').length;
    return { total, converted, contacted, qualified };
  }, [submissions]);

  if (!userId) {
    return <div className="page-shell"><p>Missing user id.</p></div>;
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
            <p className="eyebrow">User Detail</p>
            <h1 className="page-title">Partner Profile</h1>
            <p className="muted">Manage referrals and submissions for this partner.</p>
          </div>
          <a href="/partners/dashboard" className="btn-secondary">← Back to dashboard</a>
        </motion.div>

        <div className="grid two-col">
          <motion.div
            className="card overview-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <div className="overview-header">
              <div className="avatar">{(userEmail || userId).charAt(0).toUpperCase()}</div>
              <div>
                <h3 className="overview-title">{userEmail || 'Unknown email'}</h3>
                <p className="overview-subtitle">ID: {userId}</p>
              </div>
            </div>
            <div className="overview-stats">
              <div className="stat-chip">
                <span className="stat-value">{summary.total}</span>
                <span className="stat-label">Total referrals</span>
              </div>
              <div className="stat-chip">
                <span className="stat-value">{summary.converted}</span>
                <span className="stat-label">Converted</span>
              </div>
              <div className="stat-chip">
                <span className="stat-value">{summary.qualified}</span>
                <span className="stat-label">Qualified</span>
              </div>
              <div className="stat-chip">
                <span className="stat-value">{summary.contacted}</span>
                <span className="stat-label">Contacted</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card form-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="card-header">
              <div>
                <p className="eyebrow">Add referral</p>
                <h3 className="card-title">Create a new referral</h3>
              </div>
            </div>
            <form className="form-grid" onSubmit={handleCreateReferral}>
              <label>
                Lead name
                <input
                  required
                  value={newReferral.lead_name}
                  onChange={(e) => setNewReferral((p) => ({ ...p, lead_name: e.target.value }))}
                />
              </label>
              <label>
                Lead email
                <input
                  required
                  type="email"
                  value={newReferral.lead_email}
                  onChange={(e) => setNewReferral((p) => ({ ...p, lead_email: e.target.value }))}
                />
              </label>
              <label>
                Lead phone
                <input
                  value={newReferral.lead_phone}
                  onChange={(e) => setNewReferral((p) => ({ ...p, lead_phone: e.target.value }))}
                />
              </label>
              <label>
                Company
                <input
                  value={newReferral.lead_company}
                  onChange={(e) => setNewReferral((p) => ({ ...p, lead_company: e.target.value }))}
                />
              </label>
              <label className="full-row">
                Message / notes
                <textarea
                  value={newReferral.lead_message}
                  onChange={(e) => setNewReferral((p) => ({ ...p, lead_message: e.target.value }))}
                  rows={3}
                />
              </label>
              <label>
                Status
                <select
                  value={newReferral.status}
                  onChange={(e) => setNewReferral((p) => ({ ...p, status: e.target.value as StatusOption }))}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </label>
              <label>
                Referral code
                <input
                  value={newReferral.referral_code}
                  onChange={(e) => setNewReferral((p) => ({ ...p, referral_code: e.target.value }))}
                />
              </label>
              <label>
                Partner ID
                <input
                  value={newReferral.partner_id}
                  onChange={(e) => setNewReferral((p) => ({ ...p, partner_id: e.target.value }))}
                />
              </label>
              <div className="form-actions full-row">
                <button className="btn-primary" type="submit" disabled={creating}>
                  {creating ? 'Saving...' : 'Add referral'}
                </button>
                {error && <span className="error-text">{error}</span>}
              </div>
            </form>
          </motion.div>
        </div>

        <motion.div
          className="card submissions-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <div className="card-header">
            <div>
              <p className="eyebrow">Submissions</p>
              <h3 className="card-title">Referral history</h3>
              <p className="muted">Recent activity and status updates for this partner.</p>
            </div>
          </div>

          {loading && <p>Loading...</p>}
          {error && !loading && <p className="error-text">{error}</p>}

          {!loading && !error && submissions.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>No submissions yet</h4>
              <p>Create a referral above to get started.</p>
            </div>
          )}

          {!loading && !error && submissions.length > 0 && (
            <div className="submission-list">
              {submissions.map((s) => {
                const isEditing = editingId === s.id;
                return (
                  <div key={s.id} className="submission-item">
                    <div className="submission-meta">
                      <div>
                        <p className="submission-name">{s.lead_name}</p>
                        <p className="submission-email">{s.lead_email}</p>
                        <p className="submission-date">{new Date(s.created_at).toLocaleDateString()}</p>
                      </div>
                      <span
                        className="status-chip"
                        style={{ backgroundColor: `${statusColors[s.status as StatusOption] || '#e2e8f0'}1A`, color: statusColors[s.status as StatusOption] || '#1f2937' }}
                      >
                        {statusLabel(s.status)}
                      </span>
                    </div>

                    <div className="submission-actions">
                      <a href={`/partners/admin/submission/${s.id}`} className="btn-secondary">View</a>
                      <button type="button" className="btn-secondary" onClick={() => startEdit(s)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        disabled={savingId === s.id}
                        onClick={() => handleDelete(s.id)}
                      >
                        {savingId === s.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>

                    {isEditing && (
                      <div className="edit-panel">
                        <div className="edit-grid">
                          <label>
                            Lead name
                            <input
                              value={editValues.lead_name}
                              onChange={(e) => setEditValues((p) => ({ ...p, lead_name: e.target.value }))}
                            />
                          </label>
                          <label>
                            Lead email
                            <input
                              type="email"
                              value={editValues.lead_email}
                              onChange={(e) => setEditValues((p) => ({ ...p, lead_email: e.target.value }))}
                            />
                          </label>
                          <label>
                            Lead phone
                            <input
                              value={editValues.lead_phone}
                              onChange={(e) => setEditValues((p) => ({ ...p, lead_phone: e.target.value }))}
                            />
                          </label>
                          <label>
                            Company
                            <input
                              value={editValues.lead_company}
                              onChange={(e) => setEditValues((p) => ({ ...p, lead_company: e.target.value }))}
                            />
                          </label>
                          <label className="full-row">
                            Message/notes
                            <textarea
                              value={editValues.lead_message}
                              onChange={(e) => setEditValues((p) => ({ ...p, lead_message: e.target.value }))}
                            />
                          </label>
                          <label>
                            Status
                            <select
                              value={editValues.status}
                              onChange={(e) => setEditValues((p) => ({ ...p, status: e.target.value as StatusOption }))}
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>{statusLabel(status)}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="form-actions">
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={savingId === s.id}
                            onClick={() => handleUpdate(s.id)}
                          >
                            {savingId === s.id ? 'Saving...' : 'Save changes'}
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
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

        .grid.two-col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 16px;
        }

        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }

        .overview-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .overview-header {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 20px;
        }

        .overview-title {
          margin: 0;
          font-size: 1.2rem;
          color: #0f172a;
        }

        .overview-subtitle {
          margin: 2px 0 0 0;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
        }

        .stat-chip {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px;
        }

        .stat-value {
          font-weight: 700;
          font-size: 1.2rem;
          color: #0f172a;
          display: block;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.85rem;
        }

        .form-card .card-title,
        .submissions-card .card-title {
          margin: 4px 0 0 0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-weight: 600;
          color: #0f172a;
        }

        input, textarea, select {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px;
          font-size: 14px;
          background: #f8fafc;
        }

        textarea {
          resize: vertical;
          min-height: 90px;
        }

        .full-row {
          grid-column: 1 / -1;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
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

        .error-text {
          color: #b91c1c;
          font-weight: 600;
        }

        .submissions-card {
          margin-top: 8px;
        }

        .submission-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .submission-item {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px;
          background: #fdfefe;
        }

        .submission-meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .submission-name {
          margin: 0;
          font-weight: 700;
          color: #0f172a;
        }

        .submission-email {
          margin: 2px 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .submission-date {
          margin: 0;
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .status-chip {
          padding: 6px 10px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .submission-actions {
          display: flex;
          gap: 10px;
          margin: 12px 0;
          flex-wrap: wrap;
        }

        .edit-panel {
          border: 1px dashed #e2e8f0;
          padding: 12px;
          border-radius: 10px;
          background: #fff;
        }

        .edit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
        }

        .empty-state {
          text-align: center;
          padding: 24px;
          color: #64748b;
        }

        .empty-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .page-shell {
            padding: 20px 12px 32px;
          }

          .page-hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .submission-meta {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
