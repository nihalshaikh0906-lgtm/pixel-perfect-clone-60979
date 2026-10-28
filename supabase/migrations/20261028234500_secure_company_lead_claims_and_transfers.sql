-- ═══════════════════════════════════════════════════════════════════
-- SECURE SERVER-SIDE CLAIM & TRANSFER RPC FUNCTIONS FOR LEADS
-- Enforces cryptographic JWT verification (auth.uid()), strict multi-tenant
-- organization isolation, atomic row locks (FOR UPDATE), and database-level
-- role verification directly from public.org_members.
-- ═══════════════════════════════════════════════════════════════════

-- 1. Ensure agents can view unclaimed company floor leads within their organization
drop policy if exists leads_access on public.leads;
create policy leads_access on public.leads for all to authenticated
  using (
    org_id = public.my_org() and (
      public.is_org_admin()
      or assigned_to = auth.uid()
      or created_by = auth.uid()
      or (assigned_to is null and stage in ('new', 'unclaimed'))
    )
  )
  with check (
    org_id = public.my_org() and (
      public.is_org_admin()
      or assigned_to = auth.uid()
      or created_by = auth.uid()
    )
  );

-- 2. Server-side atomic claim function
create or replace function public.claim_company_lead(p_lead_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_org_id uuid;
  v_lead record;
  v_member record;
begin
  if v_uid is null then
    return jsonb_build_object('success', false, 'error', 'unauthenticated', 'message', 'Cryptographic session required to claim leads');
  end if;

  select org_id, full_name into v_member from org_members where user_id = v_uid;
  if v_member.org_id is null then
    return jsonb_build_object('success', false, 'error', 'no_organization', 'message', 'You do not belong to an active organization');
  end if;

  v_org_id := v_member.org_id;

  -- Lock row exclusively in Postgres to guarantee zero concurrency race
  select * into v_lead from leads where id = p_lead_id and org_id = v_org_id for update;
  if not found then
    return jsonb_build_object('success', false, 'error', 'not_found', 'message', 'Lead not found in your organization');
  end if;

  -- Atomic claim check
  if v_lead.assigned_to is not null and v_lead.assigned_to != v_uid then
    return jsonb_build_object(
      'success', false,
      'error', 'already_claimed',
      'message', 'This lead was already claimed by another broker in your company'
    );
  end if;

  if v_lead.assigned_to = v_uid then
    return jsonb_build_object(
      'success', true,
      'error', 'already_claimed_by_you',
      'message', 'You already hold this lead'
    );
  end if;

  update leads
  set assigned_to = v_uid, stage = 'claimed', updated_at = now()
  where id = p_lead_id;

  return jsonb_build_object(
    'success', true,
    'lead_id', p_lead_id,
    'claimed_by_id', v_uid,
    'claimed_by_name', coalesce(v_member.full_name, 'Agent'),
    'message', 'Lead claimed and locked successfully'
  );
end;
$$;

revoke execute on function public.claim_company_lead(uuid) from anon;
grant execute on function public.claim_company_lead(uuid) to authenticated;

-- 3. Server-side verified transfer function
create or replace function public.transfer_company_lead(
  p_lead_id uuid,
  p_target_user_id uuid,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_org_id uuid;
  v_role public.org_role;
  v_caller_name text;
  v_target_member record;
  v_lead record;
begin
  if v_uid is null then
    return jsonb_build_object('success', false, 'error', 'unauthenticated', 'message', 'Cryptographic session required');
  end if;

  select org_id, role, full_name into v_org_id, v_role, v_caller_name from org_members where user_id = v_uid;
  if v_org_id is null then
    return jsonb_build_object('success', false, 'error', 'no_organization', 'message', 'Caller has no registered organization');
  end if;

  -- Target broker must be an active member of the EXACT SAME organization
  select * into v_target_member from org_members where user_id = p_target_user_id and org_id = v_org_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'invalid_target', 'message', 'Target broker is not in your organization');
  end if;

  -- Lock lead row exclusively
  select * into v_lead from leads where id = p_lead_id and org_id = v_org_id for update;
  if not found then
    return jsonb_build_object('success', false, 'error', 'not_found', 'message', 'Lead not found in your organization');
  end if;

  -- SERVER-SIDE AUTHORIZATION:
  -- Only company_admin OR the broker currently holding assigned_to can execute transfer
  if v_role != 'company_admin' and (v_lead.assigned_to is null or v_lead.assigned_to != v_uid) then
    return jsonb_build_object(
      'success', false,
      'error', 'unauthorized',
      'message', 'Security violation: You do not own this lead and lack company admin privileges'
    );
  end if;

  -- Prevent transferring to same broker
  if v_lead.assigned_to = p_target_user_id then
    return jsonb_build_object('success', false, 'error', 'invalid_target', 'message', 'Lead is already assigned to this broker');
  end if;

  -- Execute server-side transfer
  update leads
  set assigned_to = p_target_user_id, stage = 'transferred', updated_at = now()
  where id = p_lead_id;

  -- Insert audit log message
  insert into lead_messages(lead_id, sender, channel, body)
  values (
    p_lead_id,
    coalesce(v_caller_name, 'System'),
    'transfer',
    coalesce(p_note, 'Transferred to ' || coalesce(v_target_member.full_name, 'Colleague'))
  );

  return jsonb_build_object(
    'success', true,
    'lead_id', p_lead_id,
    'transferred_to_id', p_target_user_id,
    'transferred_to_name', coalesce(v_target_member.full_name, 'Colleague'),
    'message', 'Lead successfully transferred'
  );
end;
$$;

revoke execute on function public.transfer_company_lead(uuid, uuid, text) from anon;
grant execute on function public.transfer_company_lead(uuid, uuid, text) to authenticated;
