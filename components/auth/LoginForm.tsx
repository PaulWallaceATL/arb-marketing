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
        // Update last login time
        await supabase
          .from('partner_users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('user_id', data.user.id);

        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
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
        setMessage(
          'Account created! Please check your email to verify your account.'
        );
        
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage('Password reset link sent! Check your email.');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h2 className="form-title">
          {isLogin ? 'Partner Login' : 'Create Partner Account'}
        </h2>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
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

        {isLogin && (
          <button
            type="button"
            onClick={handlePasswordReset}
            className="btn-link"
            disabled={isSubmitting}
          >
            Forgot Password?
          </button>
        )}

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
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 450px;
        }

        .form-title {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
          font-size: 1.75rem;
          font-weight: 600;
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
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn-submit {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
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
          margin-top: 2rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
        }

        .form-footer p {
          color: #666;
          font-size: 0.95rem;
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

