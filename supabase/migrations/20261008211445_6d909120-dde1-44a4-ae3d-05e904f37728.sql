create type public.org_role as enum ('company_admin','agent');

create table public.organizations (id uuid primary key default gen_random_uuid(), name text not null, logo_url text, plan text default 'trial', created_at timestamptz not null default now());
create table public.org_members (id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role public.org_role not null default 'agent', full_name text, created_at timestamptz not null default now(), unique(user_id));
create table public.leads (id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id) on delete cascade, assigned_to uuid, created_by uuid default auth.uid(), name text not null, phone text, email text, source text, type text default 'off-plan', budget_min numeric, budget_max numeric, bedrooms text, preferred_areas text[], stage text not null default 'new', priority text not null default 'warm', score int default 50, ai_summary text, next_follow_up_at timestamptz, deleted_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.lead_messages (id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade, sender text not null default 'agent', channel text default 'whatsapp', body text not null, created_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id) on delete cascade, user_id uuid, type text default 'system', title text not null, body text, link text, is_read boolean not null default false, created_at timestamptz not null default now());

grant select, insert, update, delete on public.organizations, public.org_members, public.leads, public.lead_messages, public.notifications to authenticated;
grant all on public.organizations, public.org_members, public.leads, public.lead_messages, public.notifications to service_role;
alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.leads enable row level security;
alter table public.lead_messages enable row level security;
alter table public.notifications enable row level security;

create or replace function public.my_org() returns uuid language sql stable security definer set search_path=public as $$ select org_id from org_members where user_id = auth.uid() $$;
create or replace function public.is_org_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from org_members where user_id = auth.uid() and role='company_admin') $$;

create policy org_read on public.organizations for select to authenticated using (id = public.my_org());
create policy org_admin_update on public.organizations for update to authenticated using (id = public.my_org() and public.is_org_admin());
create policy members_read on public.org_members for select to authenticated using (org_id = public.my_org());
create policy members_admin_update on public.org_members for update to authenticated using (org_id = public.my_org() and public.is_org_admin()) with check (org_id = public.my_org());
create policy leads_access on public.leads for all to authenticated
  using (org_id = public.my_org() and (public.is_org_admin() or assigned_to = auth.uid() or created_by = auth.uid()))
  with check (org_id = public.my_org() and (public.is_org_admin() or assigned_to = auth.uid() or created_by = auth.uid()));
create policy msgs_access on public.lead_messages for all to authenticated
  using (exists(select 1 from leads l where l.id = lead_id)) with check (exists(select 1 from leads l where l.id = lead_id));
create policy notif_read on public.notifications for select to authenticated using (org_id = public.my_org() and (user_id is null or user_id = auth.uid()));
create policy notif_update on public.notifications for update to authenticated using (org_id = public.my_org() and (user_id is null or user_id = auth.uid()));
create policy notif_insert on public.notifications for insert to authenticated with check (org_id = public.my_org());

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at = now(); return new; end $$;
create trigger leads_touch before update on public.leads for each row execute function public.touch_updated_at();

create or replace function public.create_my_organization(p_name text, p_full_name text default null) returns uuid language plpgsql security definer set search_path=public as $$
declare o uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select org_id into o from org_members where user_id = auth.uid();
  if o is not null then return o; end if;
  insert into organizations(name) values (coalesce(nullif(trim(p_name),''),'My agency')) returning id into o;
  insert into org_members(org_id,user_id,role,full_name) values (o, auth.uid(), 'company_admin', p_full_name);
  return o;
end $$;
revoke execute on function public.create_my_organization(text,text) from anon;
grant execute on function public.create_my_organization(text,text) to authenticated;