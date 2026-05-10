import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Clock, Users, Calendar, ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';

const TYPE_COLORS = {
  Technical: '#4f8ef7', Cultural: '#a855f7', Sports: '#22c55e',
  Management: '#f59e0b', Medical: '#ef4444', Workshop: '#ec4899',
  Academic: '#14b8a6', Social: '#fb923c', Career: '#6366f1',
  Hackathon: '#4f8ef7', Fest: '#a855f7', Seminar: '#10b981',
  Contest: '#f59e0b', Webinar: '#14b8a6',
};

function StatCard({ icon, value, label, color }) {
  return (
    <div style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: 44, height: 44, backgroundColor: `${color}15`, border: `1px solid ${color}30`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ color: '#e2e8f0', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>{value}</div>
        <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    approved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'Approved' },
    pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'Pending' },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Rejected' },
  }[status] || { color: '#94a3b8', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', label: status };
  return (
    <span style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
      {cfg.label}
    </span>
  );
}

function ActionBtn({ children, onClick, variant = 'green' }) {
  const colors = {
    green: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981', hbg: 'rgba(16,185,129,0.2)' },
    red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', hbg: 'rgba(239,68,68,0.2)' },
  }[variant];
  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.hbg}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = colors.bg}
    >
      {children}
    </button>
  );
}

export default function AdminPage({ user, events, updateEventStatus }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('events');
  const [eventFilter, setEventFilter] = useState('pending');
  const [userFilter, setUserFilter] = useState('pending');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const { users: managedUsers, loading: usersLoading, updateUserStatus, updateUserRole } = useUsers();

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '24px' }}>
        <Shield size={48} style={{ color: '#ef4444' }} />
        <h2 style={{ color: '#e2e8f0', margin: 0 }}>Access Denied</h2>
        <p style={{ color: '#94a3b8', margin: 0 }}>You need admin privileges to view this page.</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Go Home</button>
      </div>
    );
  }

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const pendingUsers = managedUsers.filter(u => u.status === 'pending');

  const displayedEvents = events.filter(e => !eventFilter || e.status === eventFilter);
  const displayedUsers = managedUsers.filter(u => !userFilter || u.status === userFilter);


  const tabStyle = (active) => ({
    padding: '9px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    backgroundColor: active ? '#4f8ef7' : 'transparent',
    color: active ? '#fff' : '#94a3b8',
    transition: 'all 0.15s',
  });

  const filterBtnStyle = (active) => ({
    padding: '6px 14px',
    borderRadius: '8px',
    border: `1px solid ${active ? '#4f8ef7' : '#2a2a4a'}`,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.82rem',
    backgroundColor: active ? 'rgba(79,142,247,0.1)' : 'transparent',
    color: active ? '#4f8ef7' : '#94a3b8',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ width: 42, height: 42, backgroundColor: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} style={{ color: '#4f8ef7' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.6rem', fontWeight: 800 }}>Admin Panel</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Manage events and user accounts</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard icon={<Clock size={20} />} value={pendingEvents.length} label="Pending Events" color="#f59e0b" />
          <StatCard icon={<CheckCircle size={20} />} value={approvedEvents.length} label="Approved Events" color="#10b981" />
          <StatCard icon={<Users size={20} />} value={managedUsers.length} label="Total Users" color="#4f8ef7" />
          <StatCard icon={<Calendar size={20} />} value={pendingUsers.length} label="Pending Users" color="#a855f7" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '14px', padding: '6px', marginBottom: '24px', width: 'fit-content' }}>
          <button style={tabStyle(tab === 'events')} onClick={() => setTab('events')}>
            Events {pendingEvents.length > 0 && <span style={{ backgroundColor: '#f59e0b', color: '#0f0f14', borderRadius: '10px', padding: '1px 7px', fontSize: '0.75rem', marginLeft: '6px', fontWeight: 700 }}>{pendingEvents.length}</span>}
          </button>
          <button style={tabStyle(tab === 'users')} onClick={() => setTab('users')}>
            Users {pendingUsers.length > 0 && <span style={{ backgroundColor: '#a855f7', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '0.75rem', marginLeft: '6px', fontWeight: 700 }}>{pendingUsers.length}</span>}
          </button>
        </div>

        {/* Events Tab */}
        {tab === 'events' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['pending', 'approved', 'rejected', ''].map((f, i) => (
                <button key={i} style={filterBtnStyle(eventFilter === f)} onClick={() => setEventFilter(f)}>
                  {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayedEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>No events in this category.</div>
              ) : displayedEvents.map(event => (
                <div key={event.id} style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: `${TYPE_COLORS[event.type] || '#4f8ef7'}20`, color: TYPE_COLORS[event.type] || '#4f8ef7', border: `1px solid ${TYPE_COLORS[event.type] || '#4f8ef7'}40`, padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {event.type}
                        </span>
                        <StatusBadge status={event.status} />
                      </div>
                      <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem' }}>{event.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '3px' }}>{event.college} · {event.district} · {event.date}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {event.status === 'pending' && (
                        <>
                          <ActionBtn onClick={() => updateEventStatus(event.id, 'approved')} variant="green">
                            <CheckCircle size={13} /> Approve
                          </ActionBtn>
                          <ActionBtn onClick={() => updateEventStatus(event.id, 'rejected')} variant="red">
                            <XCircle size={13} /> Reject
                          </ActionBtn>
                        </>
                      )}
                      {event.status === 'approved' && (
                        <ActionBtn onClick={() => updateEventStatus(event.id, 'rejected')} variant="red">
                          <XCircle size={13} /> Revoke
                        </ActionBtn>
                      )}
                      {event.status === 'rejected' && (
                        <ActionBtn onClick={() => updateEventStatus(event.id, 'approved')} variant="green">
                          <CheckCircle size={13} /> Re-approve
                        </ActionBtn>
                      )}
                      <a href={`/event/${event.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none' }}>
                        <ExternalLink size={15} />
                      </a>
                      <button
                        onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        {expandedEvent === event.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {expandedEvent === event.id && (
                    <div style={{ borderTop: '1px solid #2a2a4a', padding: '16px 20px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                      <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65 }}>{event.description}</p>
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ color: '#64748b', fontSize: '0.82rem' }}>🏆 {event.prize}</div>
                        <div style={{ color: '#64748b', fontSize: '0.82rem' }}>👥 Team: {event.teamSize}</div>
                        <div style={{ color: '#64748b', fontSize: '0.82rem' }}>📅 Deadline: {event.registrationDeadline}</div>
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4f8ef7', fontSize: '0.82rem' }}>🔗 Registration Link</a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['pending', 'approved', ''].map((f, i) => (
                <button key={i} style={filterBtnStyle(userFilter === f)} onClick={() => setUserFilter(f)}>
                  {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {usersLoading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading users...
                </div>
              ) : displayedUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>No users in this category.</div>
              ) : displayedUsers.map(user => (
                <div key={user.id} style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f8ef7', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                    {user.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{user.email}</div>
                    <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>{user.college} · {user.district}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <StatusBadge status={user.status} />
                    {user.status === 'pending' && (
                      <>
                        <ActionBtn onClick={() => updateUserStatus(user.id, 'approved')} variant="green">
                          <CheckCircle size={13} /> Approve
                        </ActionBtn>
                        <ActionBtn onClick={() => updateUserStatus(user.id, 'rejected')} variant="red">
                          <XCircle size={13} /> Reject
                        </ActionBtn>
                      </>
                    )}
                    {user.status === 'approved' && (
                      <ActionBtn onClick={() => updateUserStatus(user.id, 'rejected')} variant="red">
                        <XCircle size={13} /> Suspend
                      </ActionBtn>
                    )}
                    {user.status === 'rejected' && (
                      <ActionBtn onClick={() => updateUserStatus(user.id, 'approved')} variant="green">
                        <CheckCircle size={13} /> Restore
                      </ActionBtn>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
