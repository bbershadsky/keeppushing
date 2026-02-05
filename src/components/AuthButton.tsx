import { useState, useEffect } from 'react';

interface User {
  id: string;
  displayName?: string;
  primaryEmail?: string;
}

interface AuthButtonProps {
  initialUser: User | null;
  onUserChange?: (user: User | null) => void;
}

export default function AuthButton({ initialUser, onUserChange }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (onUserChange) {
      onUserChange(user);
    }
  }, [user, onUserChange]);

  const handleSignIn = () => {
    window.location.href = '/api/auth/signin';
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setUser(null);
      if (onUserChange) {
        onUserChange(null);
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <button className="auth-btn" disabled>
        <span className="auth-spinner"></span>
        <style>{`
          .auth-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-top-color: #71717a;
            border-radius: 50%;
            animation: auth-spin 0.6s linear infinite;
          }
          @keyframes auth-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </button>
    );
  }

  if (user) {
    return (
      <div className="auth-container">
        <span className="user-name">{user.displayName || user.primaryEmail?.split('@')[0] || 'User'}</span>
        <button className="auth-btn sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button className="auth-btn sign-in" onClick={handleSignIn}>
        <span className="google-icon-wrap">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </span>
        Sign in
      </button>
      <style>{`
        .auth-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-name {
          color: #fafafa;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .auth-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          border: none;
          font-family: inherit;
        }
        .auth-btn.sign-in {
          background: rgba(255, 255, 255, 0.06);
          color: #d4d4d8;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.35rem 0.875rem 0.35rem 0.35rem;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .auth-btn.sign-in:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fafafa;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        .auth-btn.sign-in:active {
          transform: translateY(0);
          box-shadow: none;
        }
        .google-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: white;
          border-radius: 6px;
          flex-shrink: 0;
        }
        .auth-btn.sign-out {
          background: #27272a;
          color: #a1a1aa;
          border: 1px solid #3f3f46;
        }
        .auth-btn.sign-out:hover {
          background: #3f3f46;
          color: #fafafa;
        }
      `}</style>
    </>
  );
}
