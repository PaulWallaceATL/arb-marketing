'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import EnhancedReferralForm from '@/components/referral/EnhancedReferralForm';
import { supabase } from '@/lib/supabase/client';

function SubmissionFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
    // After successful submission, redirect based on auth status
    if (isAuthenticated) {
      // User is logged in, redirect to their dashboard
      router.push('/partners/dashboard');
    } else {
      // User is not logged in, redirect to login/signup page
      router.push('/partners/login');
    }
  };

  return (
    <div className="submission-form-page">
      <div className="form-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <div className="header-badge">
              <span className="badge-text">REFERRAL COMPETITION</span>
            </div>
            <h1 className="header-title">
              Refer & Win<br />
              <span className="gradient-text">Amazing Prizes</span>
            </h1>
            <p className="header-description">
              Know someone who needs marketing help? Refer them to us and compete for cash prizes up to <strong>$5,000</strong>!
            </p>
            
            {referralCode && (
              <div className="referral-code-chip">
                <span className="chip-label">Tracking Code:</span>
                <strong className="chip-code">{referralCode}</strong>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="points-info">
                <div className="point-item">
                  <div className="point-details">
                    <strong>10 pts</strong>
                    <span>per referral</span>
                  </div>
                </div>
                <div className="point-divider">→</div>
                <div className="point-item">
                  <div className="point-details">
                    <strong>25 pts</strong>
                    <span>when qualified</span>
                  </div>
                </div>
                <div className="point-divider">→</div>
                <div className="point-item">
                  <div className="point-details">
                    <strong>100 pts</strong>
                    <span>when converted</span>
                  </div>
                </div>
              </div>
            )}

            {!isCheckingAuth && isAuthenticated && (
              <div className="auth-status">
                <span>✓ Logged In</span>
                <a href="/partners/dashboard" className="dashboard-link">
                  View Dashboard →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Referral Form */}
        <div className="form-section">
          <EnhancedReferralForm
            referralCode={referralCode || undefined}
            onSuccess={handleFormSuccess}
          />
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h2>How It Works</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-number">1</div>
              <h3>Submit Referral</h3>
              <p>
                Fill out the form with detailed information about someone who needs marketing services.
              </p>
            </div>
            <div className="info-card">
              <div className="info-number">2</div>
              <h3>We'll Review & Contact</h3>
              <p>
                Our team reviews the referral and reaches out to discuss their needs.
              </p>
            </div>
            <div className="info-card">
              <div className="info-number">3</div>
              <h3>Track Your Progress</h3>
              <p>
                {isAuthenticated 
                  ? "View your submissions and earnings in your dashboard!"
                  : "Login or create an account to track your referrals and compete for prizes!"}
              </p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="login-cta">
              <p>
                Want to track your referrals and compete for prizes?
              </p>
              <a href="/partners/login" className="btn-login">
                Login / Sign Up
              </a>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .submission-form-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
          padding-top: 0;
        }

        .form-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
        }

        /* Header Section */
        .header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 6rem 2rem 3rem;
          position: relative;
          overflow: hidden;
        }

        .header-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-bottom: 1.5rem;
          animation: fadeInDown 0.6s ease-out;
        }

        .badge-text {
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .header-title {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 1.5rem;
          font-weight: 800;
          line-height: 1.1;
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .gradient-text {
          color: white;
          font-weight: 800;
        }

        .header-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2rem;
          line-height: 1.6;
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .header-description strong {
          color: #ffd89b;
          font-weight: 700;
        }

        .referral-code-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .chip-label {
          color: #666;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .chip-code {
          color: #667eea;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .points-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        .point-item {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .point-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          text-align: center;
        }

        .point-details strong {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .point-details span {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .point-divider {
          color: white;
          font-size: 1.5rem;
          opacity: 0.5;
        }

        .auth-status {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.75rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50px;
          margin-top: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .auth-status span {
          color: #28a745;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .dashboard-link {
          color: #667eea;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .dashboard-link:hover {
          text-decoration: underline;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-section {
          padding: 4rem 2rem;
          background: white;
        }

        .info-section {
          padding: 4rem 2rem;
          background: #f8f9fa;
        }

        .info-section h2 {
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .info-section h2::after {
          content: '';
          display: block;
          width: 80px;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 1rem auto;
          border-radius: 2px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto 3rem;
        }

        .info-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .info-number {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .info-card h3 {
          font-size: 1.35rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .info-card p {
          color: #666;
          line-height: 1.6;
          font-size: 1rem;
        }

        .login-cta {
          text-align: center;
          padding: 2.5rem;
          background: white;
          border-radius: 16px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .login-cta p {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .btn-login {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 1024px) {
          .header-section {
            padding: 5rem 2rem 2.5rem;
          }

          .header-title {
            font-size: 3rem;
          }
        }

        @media (max-width: 768px) {
          .header-section {
            padding: 4rem 1.5rem 2rem;
          }

          .header-title {
            font-size: 2.25rem;
          }

          .header-description {
            font-size: 1.05rem;
          }

          .points-info {
            flex-direction: column;
            align-items: stretch;
          }

          .point-item {
            width: 100%;
          }

          .point-divider {
            transform: rotate(90deg);
            margin: 0.5rem 0;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .form-section {
            padding: 3rem 1rem;
          }

          .info-section {
            padding: 3rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .header-section {
            padding: 3.5rem 1rem 1.5rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .header-description {
            font-size: 1rem;
          }

          .info-section h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function SubmissionFormPage() {
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
      <SubmissionFormContent />
    </Suspense>
  );
}

