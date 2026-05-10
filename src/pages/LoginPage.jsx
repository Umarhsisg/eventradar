import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, LogIn } from 'lucide-react';
import GoogleSignInButton, { AuthDivider } from '../components/GoogleSignInButton';

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: '#0f0f14',
  border: '1px solid #2a2a4a',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export default function LoginPage({ login, signInWithGoogle, error, setError }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ backgroundColor: '#4f8ef7', borderRadius: '10px', padding: '8px' }}>
              <Zap size={22} color="#fff" />
            </div>
            <span style={{ color: '#e2e8f0', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              Event<span style={{ color: '#4f8ef7' }}>Radar</span>
            </span>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>Welcome back! Sign in to continue.</p>
        </div>

        <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '20px', padding: '32px' }}>
          <h2 style={{ margin: '0 0 24px', color: '#e2e8f0', fontSize: '1.3rem', fontWeight: 700 }}>Sign In</h2>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#ef4444', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <GoogleSignInButton onClick={signInWithGoogle} label="Sign in with Google" />
          <AuthDivider />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                style={inputStyle}
                placeholder="you@college.edu.in"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onFocus={e => e.target.style.borderColor = '#4f8ef7'}
                onBlur={e => e.target.style.borderColor = '#2a2a4a'}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  onFocus={e => e.target.style.borderColor = '#4f8ef7'}
                  onBlur={e => e.target.style.borderColor = '#2a2a4a'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', backgroundColor: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px', transition: 'background-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6ba3ff'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f8ef7'}
            >
              <LogIn size={17} /> Sign In
            </button>
          </form>

          <div style={{ borderTop: '1px solid #2a2a4a', marginTop: '24px', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#4f8ef7', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div style={{ marginTop: '20px', backgroundColor: 'rgba(79,142,247,0.05)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: '10px', padding: '12px 14px' }}>
            <p style={{ margin: '0 0 6px', color: '#4f8ef7', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Accounts</p>
            <p style={{ margin: '0 0 3px', color: '#64748b', fontSize: '0.8rem' }}>Admin: admin@eventradar.in / admin123</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Student: arjun@example.com / student123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
