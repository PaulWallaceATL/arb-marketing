'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [newReferral, setNewReferral] = useState({
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    lead_company: '',
    lead_message: '',
    status: 'new',
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
    status: 'new',
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const resetForms = () => {
    setNewReferral({
      lead_name: '',
      lead_email: '',
      lead_phone: '',
      lead_company: '',
      lead_message: '',
      status: 'new',
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
      status: 'new',
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

  const startEdit = (sub: any) => {
    setEditingId(sub.id);
    setEditValues({
      lead_name: sub.lead_name || '',
      lead_email: sub.lead_email || '',
      lead_phone: sub.lead_phone || '',
      lead_company: sub.lead_company || '',
      lead_message: sub.lead_message || '',
      status: sub.status || 'new',
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
          <>
            <div className="subs-section">
              <h3>Add Referral for this User</h3>
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
                  Message/notes
                  <textarea
                    value={newReferral.lead_message}
                    onChange={(e) => setNewReferral((p) => ({ ...p, lead_message: e.target.value }))}
                  />
                </label>
                <label>
                  Status
                  <select
                    value={newReferral.status}
                    onChange={(e) => setNewReferral((p) => ({ ...p, status: e.target.value }))}
                  >
                    {['new', 'contacted', 'qualified', 'converted', 'lost', 'spam'].map((s) => (
                      <option key={s} value={s}>{s}</option>
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
                <div className="actions full-row">
                  <button className="btn-primary" type="submit" disabled={creating}>
                    {creating ? 'Saving...' : 'Add referral'}
                  </button>
                </div>
              </form>
            </div>

            <div className="subs-section">
              <h3>Submissions</h3>
              {submissions.length === 0 ? (
                <p className="muted">No submissions for this user.</p>
              ) : (
                <div className="subs-list">
                  {submissions.map((s) => {
                    const isEditing = editingId === s.id;
                    return (
                      <div key={s.id} className="sub-row">
                        <div>
                          <div className="sub-lead">{s.lead_name}</div>
                          <div className="sub-email">{s.lead_email}</div>
                          <div className="sub-meta">
                            <span className="badge">{s.status}</span>
                            <span className="sub-date">{new Date(s.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="sub-actions">
                          <a href={`/partners/admin/submission/${s.id}`} className="btn-link small">View</a>
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
                                  onChange={(e) => setEditValues((p) => ({ ...p, status: e.target.value }))}
                                >
                                  {['new', 'contacted', 'qualified', 'converted', 'lost', 'spam'].map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <div className="actions">
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
            </div>
          </>
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
          gap: 12px;
        }
        .sub-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f8fafc;
          color: inherit;
        }
        .sub-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
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
        .form-grid, .edit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 14px;
          color: #0f172a;
        }
        input, textarea, select {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 8px;
          font-size: 14px;
          width: 100%;
        }
        textarea {
          min-height: 80px;
        }
        .full-row {
          grid-column: 1 / -1;
        }
        .actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .btn-primary {
          background: #4338ca;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-secondary {
          background: #eef2ff;
          color: #4338ca;
          border: 1px solid #c7d2fe;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-danger {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-link.small {
          font-size: 13px;
        }
        .edit-panel {
          padding: 10px;
          background: #fff;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
        }
        .actions .btn-secondary {
          background: #f3f4f6;
          border-color: #e5e7eb;
          color: #111827;
        }
      `}</style>
    </div>
  );
}

