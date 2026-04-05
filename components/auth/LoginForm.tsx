'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

export default function LoginForm({ redirectTo = '/partners/dashboard', onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        setIsLoggedIn(true);
        // Immediate redirect to ensure navigation (with hard fallback)
          router.push(redirectTo);
        if (onSuccess) onSuccess();
        // Hard fallback after a short delay in case client-side routing stalls
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 300);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // With "Confirm email" disabled in Supabase, we often get a session and can redirect
        if (data.session) {
          setIsLoggedIn(true);
          router.push(redirectTo);
          if (onSuccess) onSuccess();
          setTimeout(() => { window.location.href = redirectTo; }, 300);
        } else {
          setMessage('Account created! You can log in with your email and password.');
          setFormData({ email: '', password: '', confirmPassword: '' });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h2 className="form-title">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        <p className="form-subtitle">
          {isLogin ? 'Sign in to access your partner dashboard.' : 'Join the referral program and start earning.'}
        </p>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {isLoggedIn && (
          <div className="alert alert-success" role="alert">
            Logged in. Redirecting to dashboard...
          </div>
        )}

        {message && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-submit"
          >
            {isSubmitting
              ? 'Please wait...'
              : isLogin
              ? 'Log In'
              : 'Sign Up'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setMessage('');
              }}
              className="btn-text"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-form-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-form-card {
          background: white;
          padding: 2.75rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 440px;
        }

        .form-title {
          text-align: center;
          margin-bottom: 0.5rem;
          color: #0f172a;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .form-subtitle {
          text-align: center;
          margin-bottom: 2rem;
          color: #64748b;
          font-size: 0.93rem;
          line-height: 1.5;
        }

        .alert {
          padding: 0.75rem;
          margin-bottom: 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 600;
          color: #1e293b;
          font-size: 0.88rem;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 0.95rem;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fafbfc;
        }

        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
          background: #fff;
        }

        .btn-submit {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-link {
          display: block;
          width: 100%;
          margin-top: 1rem;
          padding: 0.5rem;
          background: none;
          border: none;
          color: #667eea;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .btn-link:hover:not(:disabled) {
          color: #764ba2;
        }

        .form-footer {
          margin-top: 1.75rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .form-footer p {
          color: #64748b;
          font-size: 0.9rem;
        }

        .btn-text {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .btn-text:hover {
          color: #764ba2;
        }

        @media (max-width: 768px) {
          .login-form-container {
            padding: 1rem;
          }

          .login-form-card {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

