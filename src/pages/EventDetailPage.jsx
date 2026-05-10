import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Clock, ExternalLink, Building2, Tag, Share2, FileImage } from 'lucide-react';
import MapPicker from '../components/MapPicker';

const TYPE_COLORS = {
  Technical: '#4f8ef7', Cultural: '#a855f7', Sports: '#22c55e',
  Management: '#f59e0b', Medical: '#ef4444', Workshop: '#ec4899',
  Academic: '#14b8a6', Social: '#fb923c', Career: '#6366f1',
  Hackathon: '#4f8ef7', Fest: '#a855f7', Seminar: '#10b981',
  Contest: '#f59e0b', Webinar: '#14b8a6',
};

function formatDate(dateStr) {
  if (!dateStr) return 'TBD';
  // Parse YYYY-MM-DD without timezone shift
  const [y, m, d] = String(dateStr).split('-');
  if (!d) return dateStr;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d} ${months[parseInt(m,10)-1]} ${y}`;
}

function InfoRow({ icon, label, value, accent }) {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <div style={{ color: '#4f8ef7', marginTop: '2px', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{label}</div>
        <div style={{ color: accent || '#e2e8f0', fontWeight: 500, fontSize: '0.95rem' }}>{value || '—'}</div>
      </div>
    </div>
  );
}

export default function EventDetailPage({ events }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '3rem' }}>😕</div>
        <h2 style={{ color: '#e2e8f0', margin: 0 }}>Event not found</h2>
        <Link to="/" style={{ color: '#4f8ef7' }}>Back to Events</Link>
      </div>
    );
  }

  const color = TYPE_COLORS[event.type] || '#4f8ef7';
  const deadline = event.registrationDeadline;
  const daysLeft = deadline
    ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const regLink = event.registrationLink;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14' }}>
      {/* Hero image */}
      {event.imageUrl && (
        <div style={{ width: '100%', maxHeight: '320px', overflow: 'hidden' }}>
          <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Top bar */}
      <div style={{ background: 'linear-gradient(135deg, #0f0f14, #16213e)', borderBottom: '1px solid #2a2a4a', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '6px 0', marginBottom: '24px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={16} /> Back to Events
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}50`, padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              {event.type}
            </span>
            {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
              <span style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
                ⚡ {daysLeft}d left to register
              </span>
            )}
          </div>
          <h1 style={{ margin: '0 0 12px', color: '#e2e8f0', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, lineHeight: 1.25 }}>
            {event.title}
          </h1>
          <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{event.college}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '28px', alignItems: 'start' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ margin: '0 0 16px', color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 700 }}>About This Event</h2>
              <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.75, fontSize: '0.95rem' }}>{event.description}</p>
            </div>

            {/* Invitation Poster */}
            {event.posterUrl && (
              <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <FileImage size={16} style={{ color: '#4f8ef7' }} />
                  <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem', fontWeight: 700 }}>Invitation Poster</h2>
                </div>
                {event.posterUrl.endsWith('.pdf') ? (
                  <a href={event.posterUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4f8ef7', fontWeight: 600, fontSize: '0.9rem' }}>
                    <ExternalLink size={15} /> View Poster PDF
                  </a>
                ) : (
                  <img src={event.posterUrl} alt="Event poster" style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
                )}
              </div>
            )}

            {event.tags?.length > 0 && (
              <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Tag size={16} style={{ color: '#4f8ef7' }} />
                  <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem', fontWeight: 700 }}>Tags</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {event.tags.map(tag => (
                    <span key={tag} style={{ backgroundColor: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', color: '#4f8ef7', padding: '5px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.organizer && (
              <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Building2 size={16} style={{ color: '#4f8ef7' }} />
                  <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem', fontWeight: 700 }}>Organized By</h2>
                </div>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{event.organizer}</p>
              </div>
            )}

            {event.latitude && event.longitude && (
              <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <MapPin size={16} style={{ color: '#4f8ef7' }} />
                  <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem', fontWeight: 700 }}>Event Location</h2>
                </div>
                <MapPicker
                  value={{ lat: event.latitude, lng: event.longitude, address: event.locationAddress }}
                  readOnly
                />
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '84px' }}>
            {/* Register CTA */}
            <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px', background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
              {event.prize && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '10px 14px' }}>
                  <Trophy size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem' }}>{event.prize}</span>
                </div>
              )}
              {regLink ? (
                <a
                  href={regLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', backgroundColor: '#4f8ef7', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'background-color 0.15s', marginBottom: '12px' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6ba3ff'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f8ef7'}
                >
                  Register Now <ExternalLink size={16} />
                </a>
              ) : (
                <div style={{ textAlign: 'center', padding: '14px', backgroundColor: 'rgba(100,116,139,0.1)', border: '1px solid #2a2a4a', borderRadius: '12px', color: '#64748b', marginBottom: '12px', fontSize: '0.9rem' }}>
                  Registration link not available
                </div>
              )}
              {deadline && (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                  Deadline: {formatDate(deadline)}
                </div>
              )}
            </div>

            {/* Event Details */}
            <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <InfoRow
                icon={<Calendar size={17} />}
                label="Date"
                value={`${formatDate(event.date)}${event.endDate && event.endDate !== event.date ? ` → ${formatDate(event.endDate)}` : ''}`}
              />
              <div style={{ height: '1px', backgroundColor: '#2a2a4a' }} />
              <InfoRow icon={<MapPin size={17} />} label="Venue" value={event.venue} />
              <div style={{ height: '1px', backgroundColor: '#2a2a4a' }} />
              <InfoRow icon={<Users size={17} />} label="Team Size" value={event.teamSize} />
              {event.maxSlots && (
                <>
                  <div style={{ height: '1px', backgroundColor: '#2a2a4a' }} />
                  <InfoRow icon={<Users size={17} />} label="Max Participants" value={`${event.maxSlots} slots`} />
                </>
              )}
              <div style={{ height: '1px', backgroundColor: '#2a2a4a' }} />
              <InfoRow
                icon={<Clock size={17} />}
                label="Registration Closes"
                value={formatDate(deadline)}
                accent={daysLeft !== null && daysLeft <= 3 ? '#ef4444' : daysLeft !== null && daysLeft <= 7 ? '#f59e0b' : '#e2e8f0'}
              />
            </div>

            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid #2a2a4a', borderRadius: '12px', color: '#94a3b8', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f8ef7'; e.currentTarget.style.color = '#4f8ef7'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a4a'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <Share2 size={15} /> Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
