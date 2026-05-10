import { SlidersHorizontal, X } from 'lucide-react';
import { EVENT_TYPES, DISTRICTS } from '../lib/mockData';

const selectStyle = {
  backgroundColor: '#1a1a2e',
  border: '1px solid #2a2a4a',
  borderRadius: '10px',
  color: '#e2e8f0',
  padding: '9px 14px',
  fontSize: '0.875rem',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '32px',
};

export default function FilterBar({ filters, setFilters }) {
  const hasActive = filters.type || filters.district || filters.date;

  function clearAll() {
    setFilters({ type: '', district: '', date: '' });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.875rem' }}>
        <SlidersHorizontal size={15} />
        <span>Filters:</span>
      </div>

      <select
        value={filters.type}
        onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
        style={selectStyle}
      >
        <option value="">All Types</option>
        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <select
        value={filters.district}
        onChange={e => setFilters(f => ({ ...f, district: e.target.value }))}
        style={selectStyle}
      >
        <option value="">All Districts</option>
        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <input
        type="date"
        value={filters.date}
        onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
        style={{ ...selectStyle, colorScheme: 'dark' }}
        title="Show events from this date onwards"
      />

      {hasActive && (
        <button
          onClick={clearAll}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', borderRadius: '10px', padding: '9px 12px',
            fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500,
          }}
        >
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}
