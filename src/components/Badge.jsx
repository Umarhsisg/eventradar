const VARIANTS = {
  blue: { bg: 'rgba(79,142,247,0.15)', text: '#4f8ef7', border: 'rgba(79,142,247,0.3)' },
  green: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  yellow: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  red: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  purple: { bg: 'rgba(168,85,247,0.15)', text: '#a855f7', border: 'rgba(168,85,247,0.3)' },
  gray: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
};

export default function Badge({ children, variant = 'blue', size = 'sm' }) {
  const c = VARIANTS[variant] || VARIANTS.blue;
  return (
    <span style={{
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      padding: size === 'sm' ? '3px 10px' : '5px 14px',
      borderRadius: '20px',
      fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
      fontWeight: 600,
      display: 'inline-block',
    }}>
      {children}
    </span>
  );
}
