-- Revoga execução pública das funções definer (são usadas só por triggers/RLS internamente)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_user_xp() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- has_role precisa ser chamável pelas policies RLS (que rodam como definer da tabela),
-- mas não queremos exposição direta pela API. Mantém para authenticated apenas.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;