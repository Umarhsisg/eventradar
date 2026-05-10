export default function GoogleSignInButton({ onClick, label = 'Continue with Google' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        width: '100%', padding: '12px',
        backgroundColor: '#fff', color: '#1f2937',
        border: '1px solid #2a2a4a', borderRadius: '10px',
        fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s, background-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#f8fafc';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(79,142,247,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#fff';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Official Google "G" logo */}
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      {label}
    </button>
  );
}

export function AuthDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#2a2a4a' }} />
      <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#2a2a4a' }} />
    </div>
  );
}
