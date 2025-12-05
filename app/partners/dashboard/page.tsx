'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getUserRole } from '@/lib/supabase/client';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

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
      
      // Get user role
      const role = await getUserRole(session.user.id);
      setUserRole(role);

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
            <div className="coming-soon">
              <span className="icon">🚧</span>
              <p>
                Partner-specific features coming soon. For now, please contact your
                administrator for access to submission data.
              </p>
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

