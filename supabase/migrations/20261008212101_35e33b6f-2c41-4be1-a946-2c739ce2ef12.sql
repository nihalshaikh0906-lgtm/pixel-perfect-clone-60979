create table public.org_listings (id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id) on delete cascade, agent_id uuid default auth.uid(), title text not null, type text default 'ready', community text, bedrooms text, size_sqft numeric, price numeric, status text not null default 'draft', permit_no text, description text, deleted_at timestamptz, created_at timestamptz not null default now());
grant select, insert, update, delete on public.org_listings to authenticated;
grant all on public.org_listings to service_role;
alter table public.org_listings enable row level security;
create policy listings_access on public.org_listings for all to authenticated
  using (org_id = public.my_org() and (public.is_org_admin() or agent_id = auth.uid()))
  with check (org_id = public.my_org() and (public.is_org_admin() or agent_id = auth.uid()));
create policy notif_delete on public.notifications for delete to authenticated using (org_id = public.my_org() and (user_id = auth.uid() or public.is_org_admin()));