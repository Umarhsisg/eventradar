import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Map snake_case DB columns → camelCase used throughout the UI
function mapEvent(e) {
  return {
    ...e,
    endDate: e.end_date,
    registrationLink: e.registration_link,
    registrationDeadline: e.registration_deadline,
    teamSize: e.team_size,
    postedBy: e.posted_by,
    createdAt: e.created_at,
    imageUrl: e.image_url,
    posterUrl: e.poster_url,
    locationAddress: e.location_address,
    maxSlots: e.max_slots,
  };
}

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: '', district: '', date: '' });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setEvents(data.map(mapEvent));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    return events
      .filter(e => e.status === 'approved')
      .filter(e => {
        const q = searchQuery.toLowerCase();
        return (
          !q ||
          e.title.toLowerCase().includes(q) ||
          e.college.toLowerCase().includes(q) ||
          (e.tags || []).some(t => t.toLowerCase().includes(q))
        );
      })
      .filter(e => !filters.type || e.type === filters.type)
      .filter(e => !filters.district || e.district === filters.district)
      .filter(e => !filters.date || e.date >= filters.date);
  }, [events, searchQuery, filters]);

  async function addEvent(eventData) {
    const { data: { user } } = await supabase.auth.getUser();

    // Upload images to Supabase Storage if provided
    let imageUrl = null;
    let posterUrl = null;

    if (eventData.imageFile) {
      const ext = eventData.imageFile.name.split('.').pop();
      const path = `event-images/${Date.now()}-image.${ext}`;
      const { data: imgData } = await supabase.storage
        .from('event-assets')
        .upload(path, eventData.imageFile, { upsert: true });
      if (imgData) {
        const { data: { publicUrl } } = supabase.storage.from('event-assets').getPublicUrl(path);
        imageUrl = publicUrl;
      }
    }

    if (eventData.posterFile) {
      const ext = eventData.posterFile.name.split('.').pop();
      const path = `event-posters/${Date.now()}-poster.${ext}`;
      const { data: posterData } = await supabase.storage
        .from('event-assets')
        .upload(path, eventData.posterFile, { upsert: true });
      if (posterData) {
        const { data: { publicUrl } } = supabase.storage.from('event-assets').getPublicUrl(path);
        posterUrl = publicUrl;
      }
    }

    const payload = {
      title: eventData.title,
      type: eventData.type,
      district: eventData.district,
      date: eventData.date,
      end_date: eventData.endDate || null,
      college: eventData.college,
      description: eventData.description,
      venue: eventData.venue,
      registration_link: eventData.registrationLink,
      registration_deadline: eventData.registrationDeadline,
      team_size: eventData.teamSize || null,
      prize: eventData.prize || null,
      organizer: eventData.organizer || null,
      tags: eventData.tags || [],
      status: 'pending',
      posted_by: user?.id ?? null,
      // Only include columns if they have a value — avoids schema error if migrations haven't run
      ...(imageUrl ? { image_url: imageUrl } : {}),
      ...(posterUrl ? { poster_url: posterUrl } : {}),
      ...(eventData.latitude != null ? { latitude: eventData.latitude } : {}),
      ...(eventData.longitude != null ? { longitude: eventData.longitude } : {}),
      ...(eventData.locationAddress ? { location_address: eventData.locationAddress } : {}),
      ...(eventData.maxSlots != null ? { max_slots: eventData.maxSlots } : {}),
    };

    const { data, error } = await supabase.from('events').insert(payload).select().single();
    if (error) throw error;
    return mapEvent(data);
  }

  async function updateEventStatus(id, status) {
    const { error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', id);
    if (!error) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    }
  }

  return {
    events,
    filteredEvents,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    addEvent,
    updateEventStatus,
    refetch: fetchEvents,
  };
}
