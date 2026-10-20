-- DealOS Inbound Demo & Enterprise Access Requests
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  agency TEXT,
  role TEXT DEFAULT 'broker',
  team_size TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors and authenticated users to submit demo requests
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'demo_requests' AND policyname = 'demo_requests_anon_insert') THEN
    CREATE POLICY "demo_requests_anon_insert" ON public.demo_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;

-- Allow authenticated admins to view demo requests
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'demo_requests' AND policyname = 'demo_requests_admin_select') THEN
    CREATE POLICY "demo_requests_admin_select" ON public.demo_requests FOR SELECT TO authenticated USING (true);
  END IF;
END $$;
