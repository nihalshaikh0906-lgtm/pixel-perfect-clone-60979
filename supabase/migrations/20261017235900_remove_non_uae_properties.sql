-- DealOS UAE Sovereignty Enforcement: Remove all non-UAE properties
-- Ensures 100% pure UAE inventory across Dubai, Abu Dhabi, RAK, Sharjah, Ajman, UAQ, and Fujairah.

BEGIN;

-- 1. Delete investment scores for non-UAE projects
DELETE FROM public.unit_investment_scores
WHERE project_id IN (
  SELECT id FROM public.projects
  WHERE emirate_or_country NOT IN ('Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah')
     OR emirate_or_country IS NULL
);

-- 2. Delete units for non-UAE projects
DELETE FROM public.units
WHERE project_id IN (
  SELECT id FROM public.projects
  WHERE emirate_or_country NOT IN ('Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah')
     OR emirate_or_country IS NULL
);

-- 3. Delete the non-UAE projects
DELETE FROM public.projects
WHERE emirate_or_country NOT IN ('Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah')
   OR emirate_or_country IS NULL;

COMMIT;
