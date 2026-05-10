import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, UserPlus, MailCheck, LogIn } from 'lucide-react';
import { DISTRICTS } from '../lib/mockData';
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

export default function SignupPage({ signup, signInWithGoogle, error, setError }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', college: '', district: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    setFieldErrors(e => ({ ...e, [k]: undefined }));
    setError('');
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.college.trim()) errs.college = 'College is required';
    if (!form.password) errs.password = 'Password is required';
    if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  }

  const [signedUp, setSignedUp] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    const ok = await signup(form.name, form.email, form.password, form.college, form.district);
    if (ok) setSignedUp(true);
  }

  if (signedUp) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, backgroundColor: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <MailCheck size={34} style={{ color: '#4f8ef7' }} />
          </div>
          <h2 style={{ color: '#e2e8f0', margin: '0 0 12px', fontSize: '1.6rem', fontWeight: 800 }}>Check your email</h2>
          <p style={{ color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.65, fontSize: '0.95rem' }}>
            We sent a verification link to
          </p>
          <p style={{ color: '#4f8ef7', fontWeight: 700, margin: '0 0 28px', fontSize: '1rem' }}>
            {form.email}
          </p>
          <p style={{ color: '#64748b', margin: '0 0 32px', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Click the link in the email to verify your account. Once verified, you can log in below.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#4f8ef7', color: '#fff', textDecoration: 'none',
              padding: '13px 28px', borderRadius: '10px', fontWeight: 700,
              fontSize: '0.95rem', transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6ba3ff'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f8ef7'}
          >
            <LogIn size={17} /> Go to Login
          </Link>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '20px' }}>
            Didn't receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSignedUp(false)}
              style={{ background: 'none', border: 'none', color: '#4f8ef7', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
            >
              try again
            </button>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ backgroundColor: '#4f8ef7', borderRadius: '10px', padding: '8px' }}>
              <Zap size={22} color="#fff" />
            </div>
            <span style={{ color: '#e2e8f0', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              Event<span style={{ color: '#4f8ef7' }}>Radar</span>
            </span>
          </div>
          <p style={{ margin: 0, color: '#94a3b8' }}>Join thousands of Maharashtra students.</p>
        </div>

        <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '20px', padding: '32px' }}>
          <h2 style={{ margin: '0 0 24px', color: '#e2e8f0', fontSize: '1.3rem', fontWeight: 700 }}>Create Account</h2>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#ef4444', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <GoogleSignInButton onClick={signInWithGoogle} label="Sign up with Google" />
          <AuthDivider />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, borderColor: fieldErrors.name ? '#ef4444' : '#2a2a4a' }} placeholder="Arjun Patil" value={form.name} onChange={e => set('name', e.target.value)} onFocus={e => e.target.style.borderColor = '#4f8ef7'} onBlur={e => e.target.style.borderColor = fieldErrors.name ? '#ef4444' : '#2a2a4a'} />
              {fieldErrors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{fieldErrors.name}</span>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>College Email <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="email" style={{ ...inputStyle, borderColor: fieldErrors.email ? '#ef4444' : '#2a2a4a' }} placeholder="you@college.edu.in" value={form.email} onChange={e => set('email', e.target.value)} onFocus={e => e.target.style.borderColor = '#4f8ef7'} onBlur={e => e.target.style.borderColor = fieldErrors.email ? '#ef4444' : '#2a2a4a'} />
              {fieldErrors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{fieldErrors.email}</span>}
            </div>

            {/* College + District */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>College <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={{ ...inputStyle, borderColor: fieldErrors.college ? '#ef4444' : '#2a2a4a' }} placeholder="MIT WPU" value={form.college} onChange={e => set('college', e.target.value)} onFocus={e => e.target.style.borderColor = '#4f8ef7'} onBlur={e => e.target.style.borderColor = fieldErrors.college ? '#ef4444' : '#2a2a4a'} />
                {fieldErrors.college && <span style={{ color: '#ef4444', fontSize: '0.78rem' }}>{fieldErrors.college}</span>}
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>District</label>
                <select style={{ ...inputStyle, appearance: 'none' }} value={form.district} onChange={e => set('district', e.target.value)} onFocus={e => e.target.style.borderColor = '#4f8ef7'} onBlur={e => e.target.style.borderColor = '#2a2a4a'}>
                  <option value="">Select</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Password <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: '44px', borderColor: fieldErrors.password ? '#ef4444' : '#2a2a4a' }} placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} onFocus={e => e.target.style.borderColor = '#4f8ef7'} onBlur={e => e.target.style.borderColor = fieldErrors.password ? '#ef4444' : '#2a2a4a'} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{fieldErrors.password}</span>}
            </div>

            {/* Confirm */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="password" style={{ ...inputStyle, borderColor: fieldErrors.confirm ? '#ef4444' : '#2a2a4a' }} placeholder="Re-enter password" value={form.confirm} onChange={e => set('confirm', e.target.value)} onFocus={e => e.target.style.borderColor = '#4f8ef7'} onBlur={e => e.target.style.borderColor = fieldErrors.confirm ? '#ef4444' : '#2a2a4a'} />
              {fieldErrors.confirm && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{fieldErrors.confirm}</span>}
            </div>

            <button
              type="submit"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', backgroundColor: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px', transition: 'background-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6ba3ff'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f8ef7'}
            >
              <UserPlus size={17} /> Create Account
            </button>
          </form>

          <div style={{ borderTop: '1px solid #2a2a4a', marginTop: '24px', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#4f8ef7', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
