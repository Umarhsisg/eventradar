-- Drop the old CHECK constraint that only allowed 4 event types
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_type_check;

-- Re-add it with the full expanded list of 14 types
ALTER TABLE public.events
  ADD CONSTRAINT events_type_check CHECK (type IN (
    'Technical', 'Cultural', 'Sports', 'Management', 'Medical',
    'Workshop', 'Academic', 'Social', 'Career',
    'Hackathon', 'Fest', 'Seminar', 'Contest', 'Webinar'
  ));
