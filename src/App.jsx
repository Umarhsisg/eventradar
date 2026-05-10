import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import PostEventPage from './pages/PostEventPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import { useEvents } from './hooks/useEvents';
import { useAuth } from './hooks/useAuth';

function App() {
  const { events, filteredEvents, loading: eventsLoading, searchQuery, setSearchQuery, filters, setFilters, addEvent, updateEventStatus } = useEvents();
  const { user, loading: authLoading, error, setError, login, signup, logout } = useAuth();

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <Loader2 size={32} style={{ color: '#4f8ef7', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#94a3b8', margin: 0 }}>Loading EventRadar...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f14' }}>
        <Navbar user={user} onLogout={logout} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                filteredEvents={filteredEvents}
                allEvents={events}
                loading={eventsLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                setFilters={setFilters}
              />
            }
          />
          <Route
            path="/event/:id"
            element={<EventDetailPage events={events} />}
          />
          <Route
            path="/post-event"
            element={<PostEventPage user={user} addEvent={addEvent} />}
          />
          <Route
            path="/login"
            element={<LoginPage login={login} error={error} setError={setError} />}
          />
          <Route
            path="/signup"
            element={<SignupPage signup={signup} error={error} setError={setError} />}
          />
          <Route
            path="/admin"
            element={<AdminPage user={user} events={events} updateEventStatus={updateEventStatus} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
