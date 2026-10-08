revoke execute on function public.my_org() from public, anon;
revoke execute on function public.is_org_admin() from public, anon;
revoke execute on function public.create_my_organization(text,text) from public, anon;
grant execute on function public.my_org() to authenticated;
grant execute on function public.is_org_admin() to authenticated;