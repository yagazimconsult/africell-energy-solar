-- public.rls_auto_enable() is Supabase's event-trigger helper that switches on RLS for new tables.
-- Event triggers run it automatically; API roles never need to call it via /rpc.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
