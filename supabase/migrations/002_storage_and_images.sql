-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/zyeqabocultzyakjjsvd/sql

-- Add image columns to events table
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS image_url  text,
  ADD COLUMN IF NOT EXISTS poster_url text;

-- Create storage bucket for event assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-assets', 'event-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can view, authenticated users can upload
CREATE POLICY "Public can view event assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-assets');

CREATE POLICY "Authenticated users can upload event assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-assets');

CREATE POLICY "Users can update own event assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-assets');
