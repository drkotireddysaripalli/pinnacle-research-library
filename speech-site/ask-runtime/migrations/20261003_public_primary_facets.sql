CREATE OR REPLACE FUNCTION public.ask_portal_primary_facet(q public.pinnacle_question,p_kind text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path=public AS $$
 SELECT CASE p_kind WHEN 'age' THEN q.age_band_key WHEN 'dev_age' THEN q.dev_age_band_key
 WHEN 'domain' THEN q.primary_domain WHEN 'readiness' THEN q.primary_readiness
 WHEN 'stakeholder' THEN q.primary_audience WHEN 'intent' THEN q.intent
 WHEN 'lifecycle' THEN q.lifecycle_step WHEN 'route' THEN q.route
 WHEN 'score_band' THEN q.score_band WHEN 'component' THEN q.pinnacle_component
 WHEN 'empowerment' THEN q.empowerment_facet WHEN 'gender' THEN q.gender
 WHEN 'rag_status' THEN q.rag_status WHEN 'body_system' THEN q.body_system
 WHEN 'phenomenon' THEN q.phenomenon_key WHEN 'ichi' THEN q.ichi_code
 WHEN 'snomed' THEN q.snomed_code END
$$;
REVOKE ALL ON FUNCTION public.ask_portal_primary_facet(public.pinnacle_question,text) FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.ask_portal_members(p_kind text,p_value text,p_lang text DEFAULT 'en')
RETURNS TABLE(id uuid,slug text,lang text,title text,summary text,intent text,cluster_key text,cluster_label text,cluster_sort int,indexable boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='6000ms' AS $$
 SELECT DISTINCT ON(a.id) a.id,a.slug,a.lang,a.title,a.summary,q.intent,
 coalesce(c.cluster_key,'more'),coalesce(c.cluster_label,'More questions'),coalesce(c.cluster_sort,99),a.indexable
 FROM public.ask_portal_public a
 JOIN public.pinnacle_question q ON q.answer_id=a.id AND q.access='public' AND q.gate_status IS NULL
 LEFT JOIN public.ask_intent_cluster c ON c.intent=q.intent
 WHERE a.lang=p_lang AND (
 (p_kind='topic' AND q.entity_slug=p_value) OR
 (p_kind LIKE 'entity:%' AND q.entity_kind=substring(p_kind from 8) AND (q.entity_key=p_value OR q.entity_slug=p_value)) OR
 (public.ask_portal_primary_facet(q,p_kind)=p_value) OR
 (p_kind='language' AND a.lang=p_value) OR
 EXISTS(SELECT 1 FROM public.pinnacle_question_lens l WHERE l.question_id=q.id AND l.lens_kind=p_kind AND l.lens_key=p_value))
 ORDER BY a.id,(q.editorial_status='published') DESC NULLS LAST,coalesce(q.value_score,0) DESC,q.id;
$$;
REVOKE ALL ON FUNCTION public.ask_portal_members(text,text,text) FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.ask_portal_directory(p_kind text,p_lang text DEFAULT 'en',p_page int DEFAULT 1)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='6000ms' AS $$
 WITH rows AS(
 SELECT q.entity_kind||':'||q.entity_key AS key,coalesce(q.entity_name,q.entity_key) AS label,
 'entity:'||q.entity_kind AS kind,q.entity_key AS value,q.entity_slug AS topic,a.id
 FROM public.ask_portal_public a JOIN public.pinnacle_question q ON q.answer_id=a.id
 JOIN public.ask_dimension d ON q.entity_kind=ANY(d.source_keys) AND d.is_active
 WHERE p_kind LIKE 'dimension:%' AND d.key=substring(p_kind from 11)
 AND a.lang=p_lang AND q.access='public' AND q.gate_status IS NULL AND q.entity_key IS NOT NULL
 UNION ALL
 SELECT l.lens_key,coalesce(l.lens_label,l.lens_key),l.lens_kind,l.lens_key,NULL,a.id
 FROM public.pinnacle_question_lens l JOIN public.pinnacle_question q ON q.id=l.question_id
 JOIN public.ask_portal_public a ON a.id=q.answer_id
 WHERE l.lens_kind=p_kind AND a.lang=p_lang AND q.access='public' AND q.gate_status IS NULL
 UNION ALL
 SELECT public.ask_portal_primary_facet(q,p_kind),initcap(replace(public.ask_portal_primary_facet(q,p_kind),'_',' ')),p_kind,public.ask_portal_primary_facet(q,p_kind),NULL,a.id
 FROM public.pinnacle_question q JOIN public.ask_portal_public a ON a.id=q.answer_id
 WHERE a.lang=p_lang AND q.access='public' AND q.gate_status IS NULL AND public.ask_portal_primary_facet(q,p_kind) IS NOT NULL
 UNION ALL SELECT a.lang,CASE a.lang WHEN 'te' THEN 'తెలుగు' ELSE 'English' END,'language',a.lang,NULL,a.id FROM ask_portal_public a WHERE p_kind='language'
 ), grouped AS(SELECT key,max(label) label,kind,value,max(topic) topic,count(DISTINCT id) answer_count FROM rows GROUP BY key,kind,value),
 page AS(SELECT * FROM grouped ORDER BY lower(label),key LIMIT 48 OFFSET (least(greatest(p_page,1),2000)-1)*48)
 SELECT jsonb_build_object('total',count(*),'has_more',count(*)>least(greatest(p_page,1),2000)*48,
 'items',coalesce((SELECT jsonb_agg(to_jsonb(page) ORDER BY lower(label),key) FROM page),'[]'::jsonb)) FROM grouped;
$$;


CREATE OR REPLACE FUNCTION public.ask_portal_references(p_slugs text[],p_lang text DEFAULT 'en')
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='4000ms' AS $$
 SELECT coalesce(jsonb_agg(x),'[]'::jsonb) FROM(SELECT slug,title,lang FROM ask_portal_public WHERE lang=p_lang AND slug=ANY(p_slugs[1:48]) ORDER BY slug LIMIT 24)x
$$;
REVOKE ALL ON FUNCTION public.ask_portal_references(text[],text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ask_portal_references(text[],text) TO anon,authenticated,service_role;
