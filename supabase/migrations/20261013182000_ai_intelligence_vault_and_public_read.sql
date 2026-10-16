-- DealOS AI Intelligence Vault Schema & Public Read Security Policy Migration
-- Enables instant, sub-second query access to projects, units, precalculated investment metrics,
-- financial scenario matrices, developer ratings, district trends, amenity distances, and live market news.

-- 1. FIX CORE PERMISSIONS: Public read access on projects, units, payment plans & files
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT ON public.units TO anon, authenticated;
GRANT SELECT ON public.payment_plans TO anon, authenticated;
GRANT SELECT ON public.payment_plan_steps TO anon, authenticated;
GRANT SELECT ON public.parking TO anon, authenticated;
GRANT SELECT ON public.project_files TO anon, authenticated;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'projects_read_all') THEN
    CREATE POLICY "projects_read_all" ON public.projects FOR SELECT USING (true);
  END IF;
END $$;

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'units' AND policyname = 'units_read_all') THEN
    CREATE POLICY "units_read_all" ON public.units FOR SELECT USING (true);
  END IF;
END $$;

ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_plans' AND policyname = 'payment_plans_read_all') THEN
    CREATE POLICY "payment_plans_read_all" ON public.payment_plans FOR SELECT USING (true);
  END IF;
END $$;

ALTER TABLE public.payment_plan_steps ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_plan_steps' AND policyname = 'payment_plan_steps_read_all') THEN
    CREATE POLICY "payment_plan_steps_read_all" ON public.payment_plan_steps FOR SELECT USING (true);
  END IF;
END $$;

-- 2. SCHEMA ENHANCEMENT: View & Orientation attributes on units
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS view_type TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS orientation VARCHAR(4);
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS sun_exposure TEXT;

-- 3. UNIT INVESTMENT SCORES (ROI, Yields, Liquidity, Appreciation)
CREATE TABLE IF NOT EXISTS public.unit_investment_scores (
  unit_id BIGINT PRIMARY KEY REFERENCES public.units(id) ON DELETE CASCADE,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  gross_yield_pct NUMERIC(5,2),
  net_yield_pct NUMERIC(5,2),
  appreciation_score SMALLINT DEFAULT 75,
  liquidity_score SMALLINT DEFAULT 80,
  composite_investment_score SMALLINT DEFAULT 78,
  dld_benchmark_rent_aed NUMERIC(10,2),
  annual_service_charge_aed NUMERIC(10,2),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_unit_inv_scores_composite ON public.unit_investment_scores(composite_investment_score DESC);
CREATE INDEX IF NOT EXISTS idx_unit_inv_scores_yield ON public.unit_investment_scores(net_yield_pct DESC);

-- 4. PRE-COMPUTED FINANCIAL SCENARIO MATRIX PER UNIT (Cash, Currencies, Mortgage, PHPP)
CREATE TABLE IF NOT EXISTS public.unit_financial_scenarios (
  unit_id BIGINT PRIMARY KEY REFERENCES public.units(id) ON DELETE CASCADE,
  price_aed NUMERIC(12,2) NOT NULL,
  scenarios JSONB NOT NULL,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DEVELOPER RELIABILITY RATINGS & AUDIT SCORES
CREATE TABLE IF NOT EXISTS public.developer_ratings (
  developer_name TEXT PRIMARY KEY,
  total_projects INT DEFAULT 0,
  on_time_handover_pct NUMERIC(5,2) DEFAULT 90.0,
  avg_delay_months NUMERIC(4,1) DEFAULT 0.0,
  escrow_compliance_score SMALLINT DEFAULT 100,
  reliability_tier TEXT DEFAULT 'A',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DISTRICT MARKET TRENDS (Recalculated from closed deals and Ejari)
CREATE TABLE IF NOT EXISTS public.district_market_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district TEXT NOT NULL,
  period_date DATE NOT NULL,
  avg_price_per_sqft NUMERIC(8,2),
  median_price_per_sqft NUMERIC(8,2),
  transaction_count_30d INT DEFAULT 0,
  mom_growth_pct NUMERIC(5,2) DEFAULT 0.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(district, period_date)
);
CREATE INDEX IF NOT EXISTS idx_district_trends_lookup ON public.district_market_trends(district, period_date DESC);

-- 7. PROJECT AMENITY DISTANCE MATRIX (Metro, Beach, Mall, International School)
CREATE TABLE IF NOT EXISTS public.project_amenity_distances (
  project_id BIGINT PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
  metro_station_name TEXT,
  metro_dist_km NUMERIC(4,2),
  metro_drive_min SMALLINT,
  beach_name TEXT,
  beach_dist_km NUMERIC(4,2),
  beach_drive_min SMALLINT,
  mall_name TEXT,
  mall_dist_km NUMERIC(4,2),
  mall_drive_min SMALLINT,
  intl_school_name TEXT,
  school_dist_km NUMERIC(4,2),
  school_drive_min SMALLINT,
  downtown_drive_min SMALLINT,
  dxb_airport_drive_min SMALLINT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DAILY MARKET NEWS & REGULATORY RADAR FEED
CREATE TABLE IF NOT EXISTS public.market_news_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  summary TEXT NOT NULL,
  impact_analysis TEXT,
  sentiment TEXT DEFAULT 'neutral',
  entities JSONB DEFAULT '{}'::jsonb,
  tags TEXT[],
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.market_news_feed(published_at DESC);

-- 9. UNIT ANOMALY & RISK FLAGS (Outliers, delay risk, escrow checks)
CREATE TABLE IF NOT EXISTS public.unit_anomalies (
  unit_id BIGINT PRIMARY KEY REFERENCES public.units(id) ON DELETE CASCADE,
  has_red_flags BOOLEAN DEFAULT FALSE,
  price_deviation_pct NUMERIC(5,2) DEFAULT 0.0,
  price_flag TEXT DEFAULT 'normal',
  delay_risk TEXT DEFAULT 'on_track',
  escrow_flag BOOLEAN DEFAULT FALSE,
  flags_detail JSONB DEFAULT '[]'::jsonb,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. GRANTS & SECURITY POLICIES FOR AI VAULT TABLES
GRANT SELECT ON public.unit_investment_scores, public.unit_financial_scenarios, public.developer_ratings, public.district_market_trends, public.project_amenity_distances, public.market_news_feed, public.unit_anomalies TO anon, authenticated;
GRANT ALL ON public.unit_investment_scores, public.unit_financial_scenarios, public.developer_ratings, public.district_market_trends, public.project_amenity_distances, public.market_news_feed, public.unit_anomalies TO service_role;

ALTER TABLE public.unit_investment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_financial_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_amenity_distances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_news_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_anomalies ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'unit_investment_scores' AND policyname = 'unit_inv_scores_read') THEN
    CREATE POLICY "unit_inv_scores_read" ON public.unit_investment_scores FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'unit_financial_scenarios' AND policyname = 'unit_scenarios_read') THEN
    CREATE POLICY "unit_scenarios_read" ON public.unit_financial_scenarios FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'developer_ratings' AND policyname = 'dev_ratings_read') THEN
    CREATE POLICY "dev_ratings_read" ON public.developer_ratings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'district_market_trends' AND policyname = 'district_trends_read') THEN
    CREATE POLICY "district_trends_read" ON public.district_market_trends FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_amenity_distances' AND policyname = 'amenity_dist_read') THEN
    CREATE POLICY "amenity_dist_read" ON public.project_amenity_distances FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'market_news_feed' AND policyname = 'market_news_read') THEN
    CREATE POLICY "market_news_read" ON public.market_news_feed FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'unit_anomalies' AND policyname = 'unit_anomalies_read') THEN
    CREATE POLICY "unit_anomalies_read" ON public.unit_anomalies FOR SELECT USING (true);
  END IF;
END $$;
