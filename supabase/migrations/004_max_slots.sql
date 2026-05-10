ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS max_slots integer;
