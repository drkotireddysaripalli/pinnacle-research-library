CREATE OR REPLACE FUNCTION public.ask_portal_topic_sitemap()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 WITH a AS MATERIALIZED(SELECT id FROM ask_portal_public WHERE lang='en' AND indexable),
 topics AS(SELECT q.entity_slug slug,count(DISTINCT a.id) total FROM a JOIN pinnacle_question q ON q.answer_id=a.id WHERE q.access='public' AND q.gate_status IS NULL AND q.entity_slug IS NOT NULL GROUP BY q.entity_slug HAVING count(DISTINCT a.id)>=8)
 SELECT coalesce(jsonb_agg(jsonb_build_object('slug',slug)),'[]'::jsonb) FROM topics;
$$;
REVOKE ALL ON FUNCTION public.ask_portal_topic_sitemap() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ask_portal_topic_sitemap() TO anon,authenticated,service_role;
