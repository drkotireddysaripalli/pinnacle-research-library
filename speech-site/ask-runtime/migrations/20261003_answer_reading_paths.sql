-- Public, topic-specific reading paths. Reuses existing entity and answer indexes.
-- No embeddings, private profiles or source-answer changes are needed to follow
-- recorded relationships. Template overrides describe navigation, not care advice.
CREATE OR REPLACE FUNCTION public.ask_portal_reading_paths(p_slug text,p_lang text DEFAULT 'en')
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='6000ms' AS $$
WITH a AS MATERIALIZED (
 SELECT x.id,x.slug,x.lang,x.related,x.also_asked FROM pinnacle_answer x
 JOIN ask_portal_public p ON p.id=x.id WHERE x.slug=p_slug AND x.lang=p_lang
), q AS MATERIALIZED (
 SELECT x.* FROM pinnacle_question x JOIN a ON a.id=x.answer_id
 WHERE x.access='public' AND x.gate_status IS NULL
 ORDER BY (x.editorial_status='published') DESC NULLS LAST,coalesce(x.value_score,0) DESC,x.id LIMIT 1
), edges AS (
 SELECT v->>'slug' slug,min(ord)::int position FROM a,
 jsonb_array_elements(coalesce(a.related,'[]'::jsonb)||coalesce(a.also_asked,'[]'::jsonb)) WITH ORDINALITY e(v,ord)
 WHERE v->>'slug' IS NOT NULL GROUP BY v->>'slug'
), candidates AS (
 SELECT p.id,p.slug,p.lang,p.title,p.summary,n.id question_id,n.intent,n.template_key,n.primary_audience,n.primary_domain,n.age_band_key,
 CASE WHEN e.slug IS NOT NULL THEN 100 ELSE 60 END
 + CASE WHEN n.primary_audience=q.primary_audience THEN 8 ELSE 0 END
 + CASE WHEN n.primary_domain=q.primary_domain THEN 4 ELSE 0 END
 + CASE WHEN n.age_band_key=q.age_band_key THEN 6 ELSE 0 END
 - CASE WHEN n.template_key LIKE 'mc_%' AND q.template_key NOT LIKE 'mc_%' THEN 40 ELSE 0 END relevance,
 e.position,CASE WHEN e.slug IS NOT NULL THEN 'Linked from this answer' ELSE 'Same topic' END reason
 FROM q JOIN pinnacle_question n ON n.entity_kind=q.entity_kind AND n.entity_key=q.entity_key
 JOIN ask_portal_public p ON p.id=n.answer_id CROSS JOIN a LEFT JOIN edges e ON e.slug=p.slug
 WHERE n.access='public' AND n.gate_status IS NULL AND n.editorial_status='published'
 AND p.lang=p_lang AND p.id<>a.id
 UNION ALL
 SELECT p.id,p.slug,p.lang,p.title,p.summary,n.id,n.intent,n.template_key,n.primary_audience,n.primary_domain,n.age_band_key,
 120,e.position,'Linked from this answer'
 FROM edges e JOIN ask_portal_public p ON p.slug=e.slug AND p.lang=p_lang
 JOIN pinnacle_question n ON n.answer_id=p.id CROSS JOIN a
 WHERE n.access='public' AND n.gate_status IS NULL AND n.editorial_status='published' AND p.id<>a.id
), unique_answers AS (
 SELECT DISTINCT ON(id) * FROM candidates ORDER BY id,relevance DESC,position NULLS LAST,question_id
), grouped AS (
 SELECT u.*,CASE
 WHEN template_key='tm_home' THEN 'home'
 WHEN template_key IN('tm2_progress','tm_expect','tm2_duration','mc_progress') THEN 'progress'
 WHEN template_key IN('tm2_cost','tm2_find','tm2_qualifications') THEN 'care'
 ELSE coalesce(c.cluster_key,'more') END reading_group
 FROM unique_answers u LEFT JOIN ask_intent_cluster c ON c.intent=u.intent
), ranked AS (
 SELECT *,row_number() OVER(PARTITION BY reading_group ORDER BY relevance DESC,position NULLS LAST,slug) rn,
 count(*) OVER(PARTITION BY reading_group) total FROM grouped
), groups AS (
 SELECT reading_group,max(total) total,
 jsonb_agg(jsonb_build_object('slug',slug,'title',title,'lang',lang,'reason',reason)
 ORDER BY rn) FILTER(WHERE rn<=12) items FROM ranked GROUP BY reading_group
)
SELECT coalesce(jsonb_agg(jsonb_build_object('key',g.reading_group,'label',coalesce(l.label,'More connected questions'),
 'total',g.total,'items',g.items) ORDER BY coalesce(l.sort,99),g.reading_group),'[]'::jsonb)
FROM groups g LEFT JOIN (VALUES
 ('understand','Understand the subject',1),('signs','Recognise signs & concerns',2),('causes','Explore causes & influences',3),
 ('assess','Understand assessment',4),('therapy','Explore therapy & support',5),('home','At home & in everyday life',6),
 ('progress','Follow progress',7),('care','Choose and access care',8),('next','Outcomes, rights & access',9)
) l(key,label,sort) ON l.key=g.reading_group;
$$;
REVOKE ALL ON FUNCTION public.ask_portal_reading_paths(text,text) FROM PUBLIC,anon,authenticated;

-- Extend the existing, explicit public answer allowlist in one database request.
DO $migration$
DECLARE definition text;
BEGIN
 SELECT pg_get_functiondef('public.ask_portal_answer(text,text)'::regprocedure) INTO definition;
 IF position('''reading_paths''' in definition)=0 THEN
  definition:=replace(definition,'''related_materials'',','''reading_paths'',public.ask_portal_reading_paths(a.slug,a.lang),''related_materials'',');
  IF position('''reading_paths''' in definition)=0 THEN RAISE EXCEPTION 'Expected public answer insertion point missing'; END IF;
  EXECUTE definition;
 END IF;
END
$migration$;
