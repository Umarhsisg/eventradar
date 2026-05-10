import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Events' },
    { to: '/post-event', label: 'Post Event' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
  ];

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav style={{ backgroundColor: '#1a1a2e', borderBottom: '1px solid #2a2a4a' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div style={{ backgroundColor: '#4f8ef7', borderRadius: '8px' }} className="p-1.5">
              <Zap size={20} color="#fff" />
            </div>
            <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
              Event<span style={{ color: '#4f8ef7' }}>Radar</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: isActive(link.to) ? '#4f8ef7' : '#94a3b8',
                  backgroundColor: isActive(link.to) ? 'rgba(79,142,247,0.1)' : 'transparent',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '0.925rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive(link.to)) { e.target.style.color = '#e2e8f0'; e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; } }}
                onMouseLeave={e => { if (!isActive(link.to)) { e.target.style.color = '#94a3b8'; e.target.style.backgroundColor = 'transparent'; } }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{ backgroundColor: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '10px', padding: '7px 14px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#4f8ef7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {user.name.charAt(0)}
                  </div>
                  {user.name.split(' ')[0]}
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '12px', padding: '8px', minWidth: '180px', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', zIndex: 100 }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a4a', marginBottom: '6px' }}>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{user.email}</div>
                    </div>
                    <button
                      onClick={() => { onLogout(); setProfileOpen(false); }}
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', padding: '7px 14px', borderRadius: '8px', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#e2e8f0'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  style={{ backgroundColor: '#4f8ef7', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', padding: '7px 16px', borderRadius: '8px', transition: 'background-color 0.15s' }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#6ba3ff'}
                  onMouseLeave={e => e.target.style.backgroundColor = '#4f8ef7'}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid #2a2a4a', padding: '12px 16px 16px' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: isActive(link.to) ? '#4f8ef7' : '#94a3b8', padding: '10px 12px', borderRadius: '8px', fontWeight: 500, textDecoration: 'none', backgroundColor: isActive(link.to) ? 'rgba(79,142,247,0.1)' : 'transparent', marginBottom: '4px' }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #2a2a4a', marginTop: '12px', paddingTop: '12px' }}>
            {user ? (
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px', fontSize: '0.95rem', fontWeight: 500 }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1px solid #2a2a4a', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Log in</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#4f8ef7', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
