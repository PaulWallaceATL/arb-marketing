'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import EnhancedReferralForm from '@/components/referral/EnhancedReferralForm';
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
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">REFERRAL COMPETITION</span>
            </div>
            <h1 className="hero-title">
              Refer & Win<br />
              <span className="white-text">Amazing Prizes</span>
            </h1>
            <p className="hero-description">
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
          </div>
        </div>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="login-prompt">
            <div className="login-prompt-content">
              <h3>Submission Received!</h3>
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
            <span>Logged In</span>
            <a href="/partners/dashboard" className="dashboard-link">
              Go to Dashboard →
            </a>
          </div>
        )}

        {/* Referral Form */}
        <div className="form-section">
          <EnhancedReferralForm
            referralCode={referralCode || undefined}
            onSuccess={handleFormSuccess}
          />
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h2>How to Win</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-number">1</div>
              <h3>Submit Referrals</h3>
              <p>
                Fill out the form above with detailed information about someone who needs marketing services.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">2</div>
              <h3>Earn Points</h3>
              <p>
                Get 10 points per submission, 25 when qualified, and 100 points when they become a customer!
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">3</div>
              <h3>Climb the Leaderboard</h3>
              <p>
                Login to track your ranking. The more quality referrals you send, the higher you climb!
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">4</div>
              <h3>Win Prizes</h3>
              <p>
                Top referrers win cash prizes! 1st: $5,000, 2nd: $2,500, 3rd: $1,000 plus commissions!
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
          background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
          padding-top: 0;
        }

        .partners-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 8rem 2rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
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

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
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

        .hero-title {
          font-size: 4rem;
          color: white;
          margin-bottom: 1.5rem;
          font-weight: 800;
          line-height: 1.1;
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .white-text {
          color: white;
          font-weight: 800;
        }

        .hero-description {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2rem;
          line-height: 1.6;
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .hero-description strong {
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

        .auth-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border: 2px solid #28a745;
          border-radius: 12px;
          margin: 2rem auto;
          max-width: 600px;
          color: #155724;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
          font-weight: 600;
          font-size: 1rem;
        }

        .dashboard-link {
          color: #155724;
          font-weight: 700;
          text-decoration: none;
          padding: 0.5rem 1rem;
          background: white;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .dashboard-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .login-prompt {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .login-prompt-content {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          max-width: 550px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
          position: relative;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-prompt-content h3 {
          margin-bottom: 1rem;
          color: #333;
          font-size: 2rem;
          font-weight: 800;
        }

        .login-prompt-content p {
          color: #666;
          margin-bottom: 2.5rem;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .login-prompt-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .form-section {
          padding: 4rem 2rem;
          background: white;
        }

        .benefits-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .benefits-section h2 {
          text-align: center;
          font-size: 3rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .benefits-section h2::after {
          content: '';
          display: block;
          width: 100px;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 1.5rem auto;
          border-radius: 2px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .benefit-card {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .benefit-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
          border-color: #667eea;
        }

        .benefit-card:hover::before {
          transform: scaleX(1);
        }

        .benefit-number {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: transform 0.3s ease;
        }

        .benefit-card:hover .benefit-number {
          transform: scale(1.1) rotate(5deg);
        }

        .benefit-card h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .benefit-card p {
          color: #666;
          line-height: 1.7;
          font-size: 1rem;
        }

        .cta-section {
          text-align: center;
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .cta-section h2 {
          font-size: 3rem;
          color: white;
          margin-bottom: 1rem;
          font-weight: 800;
          position: relative;
          z-index: 1;
        }

        .cta-section p {
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2.5rem;
          font-size: 1.2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .btn-primary,
        .btn-cta {
          padding: 1.25rem 3rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-primary:hover,
        .btn-cta:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .btn-secondary {
          padding: 1rem 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid white;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: white;
          color: #667eea;
        }

        @media (max-width: 1024px) {
          .hero-section {
            padding: 7rem 2rem 3rem;
          }

          .hero-title {
            font-size: 3rem;
          }

          .points-info {
            flex-direction: column;
            align-items: stretch;
          }

          .point-divider {
            transform: rotate(90deg);
            margin: 0.5rem 0;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 6rem 1.5rem 2.5rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .referral-code-chip {
            padding: 1rem 1.5rem;
          }

          .points-info {
            gap: 0.75rem;
          }

          .point-item {
            padding: 0.875rem 1.25rem;
            width: 100%;
          }

          .benefits-section h2 {
            font-size: 2.25rem;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .benefit-card {
            padding: 2rem;
          }

          .cta-section h2 {
            font-size: 2rem;
          }

          .cta-section p {
            font-size: 1.05rem;
          }

          .login-prompt-actions {
            flex-direction: column;
          }

          .login-prompt-actions button {
            width: 100%;
          }

          .btn-primary,
          .btn-cta {
            padding: 1rem 2rem;
            font-size: 1rem;
          }

          .form-section {
            padding: 3rem 1rem;
          }

          .benefits-section {
            padding: 3rem 1rem;
          }

          .cta-section {
            padding: 3rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 5rem 1rem 2rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-badge {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }

          .referral-code-chip {
            padding: 0.875rem 1.25rem;
            font-size: 0.9rem;
          }

          .chip-code {
            font-size: 1rem;
          }

          .point-item {
            padding: 0.75rem 1rem;
          }

          .point-details strong {
            font-size: 1.1rem;
          }

          .benefit-card {
            padding: 1.5rem;
          }

          .benefit-number {
            width: 50px;
            height: 50px;
            font-size: 1.75rem;
          }

          .benefit-card h3 {
            font-size: 1.25rem;
          }

          .cta-section h2 {
            font-size: 1.75rem;
          }

          .login-prompt-content {
            padding: 2rem 1.5rem;
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

