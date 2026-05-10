import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search events, colleges, tags...' }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Search
        size={18}
        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 40px 12px 44px',
          backgroundColor: '#1a1a2e',
          border: '1px solid #2a2a4a',
          borderRadius: '12px',
          color: '#e2e8f0',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = '#4f8ef7'}
        onBlur={e => e.target.style.borderColor = '#2a2a4a'}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
