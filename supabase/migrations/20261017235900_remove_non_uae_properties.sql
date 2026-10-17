-- DealOS UAE Sovereignty Enforcement: Remove all non-UAE properties
-- Ensures 100% pure UAE inventory across Dubai, Abu Dhabi, RAK, Sharjah, Ajman, UAQ, and Fujairah.

BEGIN;

-- 1. Delete unit investment scores for non-UAE projects
DELETE FROM public.unit_investment_scores
WHERE project_id IN (
  SELECT id FROM public.projects
  WHERE emirate_or_country NOT IN (
    'Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah'
  ) OR emirate_or_country IS NULL
);

-- 2. Delete payment plan steps for non-UAE projects
DELETE FROM public.payment_plan_steps
WHERE payment_plan_id IN (
  SELECT id FROM public.payment_plans
  WHERE project_id IN (
    SELECT id FROM public.projects
    WHERE emirate_or_country NOT IN (
      'Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah'
    ) OR emirate_or_country IS NULL
  )
);

-- 3. Delete payment plans for non-UAE projects
DELETE FROM public.payment_plans
WHERE project_id IN (
  SELECT id FROM public.projects
  WHERE emirate_or_country NOT IN (
    'Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah'
  ) OR emirate_or_country IS NULL
);

-- 4. Delete parking records for non-UAE projects
DELETE FROM public.parking
WHERE project_id IN (
  SELECT id FROM public.projects
  WHERE emirate_or_country NOT IN (
    'Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah'
  ) OR emirate_or_country IS NULL
);

-- 5. Delete units for non-UAE projects
DELETE FROM public.units
WHERE project_id IN (
  SELECT id FROM public.projects
  WHERE emirate_or_country NOT IN (
    'Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah'
  ) OR emirate_or_country IS NULL
);

-- 6. Delete project files for non-UAE projects
DELETE FROM public.project_files
WHERE project_id IN (
  SELECT id FROM public.projects
  WHERE emirate_or_country NOT IN (
    'Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah'
  ) OR emirate_or_country IS NULL
);

-- 7. Delete non-UAE projects
DELETE FROM public.projects
WHERE emirate_or_country NOT IN (
  'Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Fujairah'
) OR emirate_or_country IS NULL;

COMMIT;
