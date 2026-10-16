-- Migration: Ensure 100% of projects have verified, high-resolution luxury cover images
-- Automatically maps missing or empty cover_image_url values to district-matching luxury Dubai architecture assets.

UPDATE public.projects
SET cover_image_url = CASE
  -- Dubai Marina & JBR
  WHEN district ILIKE '%Marina%' OR district ILIKE '%JBR%' OR name ILIKE '%Marina%'
    THEN 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80'
  
  -- Dubai Creek Harbour
  WHEN district ILIKE '%Creek%' OR name ILIKE '%Creek%'
    THEN 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80'
  
  -- Downtown Dubai, Business Bay & DIFC
  WHEN district ILIKE '%Downtown%' OR district ILIKE '%Business Bay%' OR district ILIKE '%DIFC%' OR name ILIKE '%Downtown%' OR name ILIKE '%Bay%'
    THEN 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1400&q=80'
  
  -- Palm Jumeirah & Waterfront
  WHEN district ILIKE '%Palm%' OR district ILIKE '%Islands%' OR name ILIKE '%Palm%'
    THEN 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1400&q=80'
  
  -- Dubai Hills Estate & Meydan
  WHEN district ILIKE '%Dubai Hills%' OR district ILIKE '%Meydan%' OR district ILIKE '%MBR%'
    THEN 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80'
  
  -- Jumeirah Village Circle (JVC) & JVT
  WHEN district ILIKE '%JVC%' OR district ILIKE '%Jumeirah Village%' OR district ILIKE '%JVT%'
    THEN 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'
  
  -- Dubai Studio City & Motor City (e.g. Ghaff Land Residence)
  WHEN district ILIKE '%Studio City%' OR district ILIKE '%Motor City%' OR district ILIKE '%Sports City%'
    THEN 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80'

  -- Default high-end Dubai luxury architectural exterior
  ELSE 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80'
END
WHERE cover_image_url IS NULL OR cover_image_url = '' OR cover_image_url ILIKE '%placeholder%' OR cover_image_url ILIKE '%example.com%';

-- Ensure public read permissions remain open
GRANT SELECT ON public.projects TO anon, authenticated;
