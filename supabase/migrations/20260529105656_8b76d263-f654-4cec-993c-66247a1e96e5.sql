DROP POLICY IF EXISTS "trades_update_participant" ON public.album_trades;
DROP POLICY IF EXISTS "album_trades_update" ON public.album_trades;

CREATE POLICY "trades_update_participant" ON public.album_trades
  FOR UPDATE USING (
    auth.uid() = from_user_id OR
    auth.uid() = to_user_id OR
    status = 'open'
  );