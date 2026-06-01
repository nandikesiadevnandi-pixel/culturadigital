DROP POLICY IF EXISTS "trades_update_participant" ON public.album_trades;

CREATE POLICY "trades_update_participant" ON public.album_trades
  FOR UPDATE USING (
    auth.uid() = from_user_id
    OR auth.uid() = to_user_id
    OR (status = 'open' AND to_user_id IS NULL)
  );