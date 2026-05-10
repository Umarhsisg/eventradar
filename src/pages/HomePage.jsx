import { Link } from 'react-router-dom';
import { Zap, TrendingUp, MapPin, CalendarDays, Loader2, Search, Plus, ArrowRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MaharashtraOutline from '../components/MaharashtraOutline';
import { EVENT_TYPES } from '../lib/mockData';

// Decorative background photos representing different event types
const PHOTO = (id) => `https://images.unsplash.com/${id}?w=560&q=80&auto=format&fit=crop`;
const EVENT_PHOTOS = [
  // LEFT — outer column (close to edge, partially clipped)
  { url: PHOTO('photo-1517694712202-14dd9538aa97'), position: { left: '0%',   top: '3%' },    size: 280, rotate: -4 }, // hackathon
  { url: PHOTO('photo-1461896836934-ffe607ba8211'), position: { left: '-2%',  top: '32%' },   size: 290, rotate: 3 },  // sports
  { url: PHOTO('photo-1540575467063-178a50c2df87'), position: { left: '1%',   bottom: '4%' }, size: 280, rotate: -3 }, // seminar
  // LEFT — inner column
  { url: PHOTO('photo-1556761175-5973dc0f32e7'),    position: { left: '14%',  top: '16%' },   size: 260, rotate: 4 },  // career / networking
  { url: PHOTO('photo-1429962714451-bb934ecdc4ec'), position: { left: '17%',  top: '46%' },   size: 270, rotate: -3 }, // concert crowd
  { url: PHOTO('photo-1505373877841-8d25f7d46678'), position: { left: '12%',  bottom: '8%' }, size: 260, rotate: 3 },  // graduation / academic

  // RIGHT — outer column (close to edge, partially clipped)
  { url: PHOTO('photo-1493225457124-a3eb161ffa5f'), position: { right: '0%',   top: '3%' },    size: 280, rotate: 4 },  // fest / concert
  { url: PHOTO('photo-1492684223066-81342ee5ff30'), position: { right: '-2%',  top: '32%' },   size: 290, rotate: -3 }, // party
  { url: PHOTO('photo-1504384308090-c894fdcc538d'), position: { right: '1%',   bottom: '4%' }, size: 280, rotate: 3 },  // technical / coding
  // RIGHT — inner column
  { url: PHOTO('photo-1551038247-3d9af20df552'),    position: { right: '14%',  top: '16%' },   size: 260, rotate: -4 }, // architecture / conference
  { url: PHOTO('photo-1574629810360-7efbbe195018'), position: { right: '17%',  top: '46%' },   size: 270, rotate: 3 },  // sports stadium
  { url: PHOTO('photo-1558008258-3256797b43f3'),    position: { right: '12%',  bottom: '8%' }, size: 260, rotate: -3 }, // workshop
];

export default function HomePage({ filteredEvents, allEvents, loading, searchQuery, setSearchQuery, filters, setFilters }) {
  const approvedCount = allEvents?.filter(e => e.status === 'approved').length ?? filteredEvents.length;

  const stats = [
    { icon: <Zap size={18} />, value: loading ? '—' : approvedCount, label: 'Active Events' },
    { icon: <MapPin size={18} />, value: '35', label: 'Districts' },
    { icon: <TrendingUp size={18} />, value: '500+', label: 'Students' },
    { icon: <CalendarDays size={18} />, value: EVENT_TYPES.length, label: 'Event Types' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0f14 0%, #16213e 50%, #0f0f14 100%)',
        padding: '64px 24px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(79,142,247,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Maharashtra outline — decorative background, centred */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '520px', pointerEvents: 'none', userSelect: 'none',
        }}>
          <MaharashtraOutline style={{ width: '100%', height: 'auto' }} />
        </div>

        {/* Floating event photos around the map */}
        {EVENT_PHOTOS.map((p, i) => (
          <div
            key={i}
            className="event-photo-bg"
            style={{
              position: 'absolute',
              ...p.position,
              width: p.size,
              height: Math.round(p.size * 0.7),
              borderRadius: '12px',
              overflow: 'hidden',
              opacity: 0.75,
              border: '1px solid rgba(79,142,247,0.25)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
              pointerEvents: 'none',
              userSelect: 'none',
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <img
              src={p.url}
              alt=""
              loading="lazy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: 'saturate(0.65) brightness(0.8) contrast(1.05)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(15,15,20,0.35) 0%, rgba(79,142,247,0.18) 100%)',
              mixBlendMode: 'overlay',
            }} />
          </div>
        ))}
        <style>{`
          @media (max-width: 1280px) { .event-photo-bg { display: none; } }
        `}</style>

        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '24px',
            color: '#4f8ef7', fontSize: '0.85rem', fontWeight: 600,
          }}>
            <Zap size={14} /> Maharashtra's Student Event Hub
          </div>
          <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#e2e8f0', lineHeight: 1.2, letterSpacing: '-1px' }}>
            Discover Events That
            <span style={{ color: '#4f8ef7' }}> Level Up</span> Your Skills
          </h1>
          <p style={{ margin: '0 0 32px', color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Hackathons, fests, seminars, and contests across Maharashtra — all in one place.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '44px' }}>
            <a
              href="#events"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 26px', backgroundColor: '#4f8ef7', color: '#fff',
                borderRadius: '12px', fontWeight: 700, fontSize: '0.98rem', textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(79,142,247,0.35)',
                transition: 'transform 0.15s, background-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#6ba3ff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(79,142,247,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4f8ef7'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,142,247,0.35)'; }}
            >
              <Search size={18} /> Explore Events <ArrowRight size={16} />
            </a>
            <Link
              to="/post-event"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 26px', backgroundColor: 'transparent', color: '#e2e8f0',
                border: '1px solid rgba(79,142,247,0.45)', borderRadius: '12px',
                fontWeight: 700, fontSize: '0.98rem', textDecoration: 'none',
                transition: 'transform 0.15s, background-color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(79,142,247,0.12)'; e.currentTarget.style.borderColor = '#4f8ef7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(79,142,247,0.45)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Plus size={18} /> List Your Event
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#4f8ef7', marginBottom: '4px' }}>
                  {s.icon}
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0' }}>{s.value}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div id="events" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 32px', scrollMarginTop: '24px' }}>
        <div style={{
          backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a',
          borderRadius: '16px', padding: '20px', marginBottom: '28px',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1rem' }}>{filteredEvents.length}</span> events found
          </div>
          {(searchQuery || filters.type || filters.district || filters.date) && (
            <div style={{ color: '#4f8ef7', fontSize: '0.85rem' }}>Filtered results</div>
          )}
        </div>

        {/* Events grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Loader2 size={32} style={{ color: '#4f8ef7', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#94a3b8', margin: 0 }}>Loading events...</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: '#e2e8f0', margin: '0 0 10px' }}>No events found</h3>
            <p style={{ color: '#94a3b8', margin: 0 }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
