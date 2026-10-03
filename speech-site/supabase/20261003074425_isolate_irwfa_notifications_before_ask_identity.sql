-- Preserve existing IRWFA notification access before Ask signups use the shared Auth project.
-- Future IRWFA onboarding must grant this entitlement through a trusted server workflow.
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '20s';
LOCK TABLE auth.users IN SHARE MODE;
DO $guard$
BEGIN
  IF (SELECT count(*) FROM auth.users) <> 6 THEN
    RAISE EXCEPTION 'Auth population changed; inspect access scope before migration';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='notifications'
      AND policyname='notifications read' AND cmd='SELECT'
      AND roles=ARRAY['authenticated']::name[] AND qual='true'
  ) THEN
    RAISE EXCEPTION 'Notification policy changed; inspect before migration';
  END IF;
END
$guard$;

CREATE SCHEMA ask_identity_private AUTHORIZATION postgres;
REVOKE ALL ON SCHEMA ask_identity_private FROM PUBLIC, anon, authenticated;

CREATE TABLE ask_identity_private.legacy_irwfa_access (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ask_identity_private.legacy_irwfa_access OWNER TO postgres;
ALTER TABLE ask_identity_private.legacy_irwfa_access ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE ask_identity_private.legacy_irwfa_access FROM PUBLIC, anon, authenticated;
INSERT INTO ask_identity_private.legacy_irwfa_access(user_id) SELECT id FROM auth.users;
DO $seed$
BEGIN
  IF (SELECT count(*) FROM ask_identity_private.legacy_irwfa_access) <> 6 THEN
    RAISE EXCEPTION 'Existing access preservation failed';
  END IF;
END
$seed$;

CREATE FUNCTION ask_identity_private.has_irwfa_access()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM ask_identity_private.legacy_irwfa_access AS access
    WHERE access.user_id = (SELECT auth.uid())
  );
$function$;
ALTER FUNCTION ask_identity_private.has_irwfa_access() OWNER TO postgres;
REVOKE ALL ON FUNCTION ask_identity_private.has_irwfa_access() FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA ask_identity_private TO authenticated;
GRANT EXECUTE ON FUNCTION ask_identity_private.has_irwfa_access() TO authenticated;

ALTER POLICY "notifications read" ON public.notifications
USING (public.is_admin() OR (SELECT ask_identity_private.has_irwfa_access()));
COMMENT ON TABLE ask_identity_private.legacy_irwfa_access IS
'Existing IRWFA notification readers at Ask identity rollout. No client writes; future IRWFA grants require trusted onboarding.';
