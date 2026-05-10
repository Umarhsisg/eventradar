import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';

const TYPE_COLORS = {
  Technical:  { bg: 'rgba(79,142,247,0.15)',  text: '#4f8ef7',  border: 'rgba(79,142,247,0.3)' },
  Cultural:   { bg: 'rgba(168,85,247,0.15)',  text: '#a855f7',  border: 'rgba(168,85,247,0.3)' },
  Sports:     { bg: 'rgba(34,197,94,0.15)',   text: '#22c55e',  border: 'rgba(34,197,94,0.3)' },
  Management: { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b',  border: 'rgba(245,158,11,0.3)' },
  Medical:    { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444',  border: 'rgba(239,68,68,0.3)' },
  Workshop:   { bg: 'rgba(236,72,153,0.15)',  text: '#ec4899',  border: 'rgba(236,72,153,0.3)' },
  Academic:   { bg: 'rgba(20,184,166,0.15)',  text: '#14b8a6',  border: 'rgba(20,184,166,0.3)' },
  Social:     { bg: 'rgba(251,146,60,0.15)',  text: '#fb923c',  border: 'rgba(251,146,60,0.3)' },
  Career:     { bg: 'rgba(99,102,241,0.15)',  text: '#6366f1',  border: 'rgba(99,102,241,0.3)' },
  Hackathon:  { bg: 'rgba(79,142,247,0.15)',  text: '#4f8ef7',  border: 'rgba(79,142,247,0.3)' },
  Fest:       { bg: 'rgba(168,85,247,0.15)',  text: '#a855f7',  border: 'rgba(168,85,247,0.3)' },
  Seminar:    { bg: 'rgba(16,185,129,0.15)',  text: '#10b981',  border: 'rgba(16,185,129,0.3)' },
  Contest:    { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b',  border: 'rgba(245,158,11,0.3)' },
  Webinar:    { bg: 'rgba(20,184,166,0.15)',  text: '#14b8a6',  border: 'rgba(20,184,166,0.3)' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  // Parse YYYY-MM-DD without timezone shift
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export default function EventCard({ event }) {
  const typeColor = TYPE_COLORS[event.type] || TYPE_COLORS.Technical;

  return (
    <Link to={`/event/${event.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#1a1a2e',
          border: '1px solid #2a2a4a',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#4f8ef7';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,142,247,0.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#2a2a4a';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Event image */}
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* Top accent stripe */}
        {!event.imageUrl && (
          <div style={{ height: '6px', background: `linear-gradient(90deg, ${typeColor.text}, transparent)` }} />
        )}

        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Type badge + date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{
              backgroundColor: typeColor.bg, color: typeColor.text, border: `1px solid ${typeColor.border}`,
              padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
            }}>
              {event.type}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.8rem' }}>
              <Calendar size={13} />
              {formatDate(event.date)}
            </div>
          </div>

          {/* Title */}
          <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.35 }}>
            {event.title}
          </h3>

          {/* College */}
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>
            {event.college}
          </p>

          {/* Description */}
          <p style={{
            margin: 0, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {event.description}
          </p>

          <div style={{ flex: 1 }} />

          {/* Meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.82rem' }}>
              <MapPin size={13} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.district}</span>
            </div>
            {event.prize && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.82rem' }}>
                <Trophy size={13} style={{ flexShrink: 0 }} />
                <span>{event.prize}</span>
              </div>
            )}
            {event.teamSize && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.82rem' }}>
                <Users size={13} style={{ flexShrink: 0 }} />
                <span>Team: {event.teamSize}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {event.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{
                  backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a4a',
                  color: '#64748b', padding: '2px 9px', borderRadius: '6px', fontSize: '0.75rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
