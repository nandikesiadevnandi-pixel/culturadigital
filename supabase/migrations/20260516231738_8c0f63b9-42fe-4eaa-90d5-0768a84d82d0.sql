
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _is_admin BOOLEAN;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, school, class_name, grade_year)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'school',
    NEW.raw_user_meta_data->>'class_name',
    NULLIF(NEW.raw_user_meta_data->>'grade_year', '')::INTEGER
  );

  _is_admin := NEW.email IN ('nandikesiadevnandi@gmail.com');

  IF _is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  END IF;

  RETURN NEW;
END;
$function$;

-- Promover conta existente, se já cadastrada
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email = 'nandikesiadevnandi@gmail.com'
ON CONFLICT DO NOTHING;
