'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReferralForm from '@/components/referral/ReferralForm';
import { supabase } from '@/lib/supabase/client';

function PartnersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Get referral code from URL
    const code = searchParams.get('ref') || searchParams.get('referral_code');
    if (code) {
      setReferralCode(code);
      // Store in session storage for persistence
      sessionStorage.setItem('referral_code', code);
    } else {
      // Check if we have it in session storage
      const storedCode = sessionStorage.getItem('referral_code');
      if (storedCode) {
        setReferralCode(storedCode);
      }
    }

    // Check authentication status
    checkAuthStatus();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setShowLoginPrompt(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [searchParams]);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleFormSuccess = () => {
    // Show login prompt after successful submission
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/partners/login');
  };

  return (
    <div className="partners-page">
      <div className="partners-container">
        <header className="partners-header">
          <h1>Partner Referral Program</h1>
          <p className="subtitle">
            Submit a referral and help us grow our network
          </p>
          {referralCode && (
            <div className="referral-code-banner">
              <span className="icon">🎯</span>
              <span>
                You're using referral code: <strong>{referralCode}</strong>
              </span>
            </div>
          )}
        </header>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="login-prompt">
            <div className="login-prompt-content">
              <h3>✅ Submission Received!</h3>
              <p>
                Your referral has been submitted successfully. Would you like to create
                an account to track your referrals and access the partner dashboard?
              </p>
              <div className="login-prompt-actions">
                <button onClick={handleLoginRedirect} className="btn-primary">
                  Create Account / Login
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="btn-secondary"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Status */}
        {!isCheckingAuth && isAuthenticated && (
          <div className="auth-status">
            <span className="status-icon">✓</span>
            <span>You are logged in</span>
            <a href="/partners/dashboard" className="dashboard-link">
              Go to Dashboard →
            </a>
          </div>
        )}

        {/* Referral Form */}
        <div className="form-section">
          <ReferralForm
            referralCode={referralCode || undefined}
            onSuccess={handleFormSuccess}
          />
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h2>Why Partner With Us?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Earn Commission</h3>
              <p>
                Receive competitive commissions on every successful referral that
                converts to a paying customer.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Track Performance</h3>
              <p>
                Access your dashboard to monitor referrals, conversions, and earnings
                in real-time.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Dedicated Support</h3>
              <p>
                Get support from our partner success team to help you maximize your
                referral potential.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🚀</div>
              <h3>Easy Process</h3>
              <p>
                Simple referral process with no complicated requirements. Just share
                your unique link.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="cta-section">
            <h2>Ready to Become a Partner?</h2>
            <p>
              Already have an account? Login to access your partner dashboard and track
              your referrals.
            </p>
            <button onClick={handleLoginRedirect} className="btn-cta">
              Login / Sign Up
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .partners-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem 1rem;
        }

        .partners-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .partners-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .partners-header h1 {
          font-size: 3rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 2rem;
        }

        .referral-code-banner {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          font-size: 1.1rem;
        }

        .referral-code-banner .icon {
          font-size: 1.5rem;
        }

        .auth-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1rem;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          margin-bottom: 2rem;
          color: #155724;
        }

        .status-icon {
          font-size: 1.25rem;
        }

        .dashboard-link {
          margin-left: auto;
          color: #155724;
          font-weight: 600;
          text-decoration: none;
        }

        .dashboard-link:hover {
          text-decoration: underline;
        }

        .login-prompt {
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
          padding: 1rem;
        }

        .login-prompt-content {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .login-prompt-content h3 {
          margin-bottom: 1rem;
          color: #333;
          font-size: 1.75rem;
        }

        .login-prompt-content p {
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .login-prompt-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .form-section {
          margin-bottom: 4rem;
        }

        .benefits-section {
          margin-bottom: 4rem;
        }

        .benefits-section h2 {
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 3rem;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .benefit-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
        }

        .benefit-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .benefit-card h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .benefit-card p {
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .cta-section h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .cta-section p {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .btn-primary,
        .btn-cta {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-primary:hover,
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          padding: 1rem 2rem;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #667eea;
          color: white;
        }

        @media (max-width: 768px) {
          .partners-header h1 {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .login-prompt-actions {
            flex-direction: column;
          }

          .login-prompt-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default function PartnersPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PartnersContent />
    </Suspense>
  );
}

