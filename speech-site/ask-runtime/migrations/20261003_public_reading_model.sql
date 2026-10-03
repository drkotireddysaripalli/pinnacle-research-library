-- Public reading model. Source answers and private application tables are not changed.
CREATE OR REPLACE VIEW public.ask_portal_public WITH (security_invoker=true) AS
SELECT a.id,a.slug,a.lang,a.title,a.summary,a.answer_md,a.meta_robots,
 a.published_at,a.last_reviewed_at,
 (public.ask_indexing_enabled() AND coalesce(a.meta_robots,'') !~* 'noindex'
 AND EXISTS(SELECT 1 FROM public.pinnacle_question q WHERE q.answer_id=a.id AND q.access='public' AND q.gate_status IS NULL AND q.editorial_status='published')) AS indexable
FROM public.pinnacle_answer a WHERE a.status='published' AND a.access='public';
REVOKE ALL ON public.ask_portal_public FROM anon,authenticated;

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
 (p_kind='intent' AND q.intent=p_value) OR
 EXISTS(SELECT 1 FROM public.pinnacle_question_lens l WHERE l.question_id=q.id AND l.lens_kind=p_kind AND l.lens_key=p_value))
 ORDER BY a.id,(q.editorial_status='published') DESC NULLS LAST,coalesce(q.value_score,0) DESC,q.id;
$$;
REVOKE ALL ON FUNCTION public.ask_portal_members(text,text,text) FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.ask_portal_collection(p_kind text,p_value text,p_lang text DEFAULT 'en',p_page int DEFAULT 1)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='6000ms' AS $$
 WITH m AS MATERIALIZED(SELECT * FROM public.ask_portal_members(left(p_kind,80),left(p_value,240),p_lang)),
 page AS(SELECT * FROM m ORDER BY cluster_sort,slug LIMIT 24 OFFSET (least(greatest(p_page,1),2000)-1)*24)
 SELECT jsonb_build_object('total',count(*),'indexable',count(*) FILTER(WHERE indexable)>=8,
 'page',least(greatest(p_page,1),2000),'has_more',count(*)>least(greatest(p_page,1),2000)*24,
 'items',coalesce((SELECT jsonb_agg(to_jsonb(page)-'id' ORDER BY cluster_sort,slug) FROM page),'[]'::jsonb))
 FROM m;
$$;

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
 SELECT q.intent,initcap(replace(q.intent,'_',' ')),'intent',q.intent,NULL,a.id
 FROM public.pinnacle_question q JOIN public.ask_portal_public a ON a.id=q.answer_id
 WHERE p_kind='intent' AND a.lang=p_lang AND q.access='public' AND q.gate_status IS NULL AND q.intent IS NOT NULL
 ), grouped AS(SELECT key,max(label) label,kind,value,max(topic) topic,count(DISTINCT id) answer_count FROM rows GROUP BY key,kind,value),
 page AS(SELECT * FROM grouped ORDER BY lower(label),key LIMIT 48 OFFSET (least(greatest(p_page,1),2000)-1)*48)
 SELECT jsonb_build_object('total',count(*),'has_more',count(*)>least(greatest(p_page,1),2000)*48,
 'items',coalesce((SELECT jsonb_agg(to_jsonb(page) ORDER BY lower(label),key) FROM page),'[]'::jsonb)) FROM grouped;
$$;

CREATE OR REPLACE FUNCTION public.ask_portal_catalogue()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='6000ms' AS $$
 SELECT jsonb_build_object('languages',(SELECT jsonb_agg(x) FROM(SELECT lang,count(*) total FROM ask_portal_public GROUP BY lang ORDER BY lang)x),
 'lenses',(SELECT jsonb_agg(x) FROM(SELECT l.lens_kind kind,count(DISTINCT a.id) total FROM pinnacle_question_lens l JOIN pinnacle_question q ON q.id=l.question_id JOIN ask_portal_public a ON a.id=q.answer_id WHERE q.access='public' AND q.gate_status IS NULL GROUP BY l.lens_kind ORDER BY l.lens_kind)x),
 'indexing_enabled',public.ask_indexing_enabled());
$$;

CREATE OR REPLACE FUNCTION public.ask_portal_answer(p_slug text,p_lang text DEFAULT 'en')
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='6000ms' AS $$
 WITH a AS(SELECT x.*,p.indexable FROM pinnacle_answer x JOIN ask_portal_public p ON p.id=x.id WHERE x.slug=p_slug AND x.lang=p_lang),
 q AS(SELECT q.* FROM pinnacle_question q WHERE q.answer_id=(SELECT id FROM a) AND q.access='public' AND q.gate_status IS NULL ORDER BY(q.editorial_status='published') DESC NULLS LAST,coalesce(q.value_score,0) DESC,q.id LIMIT 1)
 SELECT jsonb_build_object('slug',a.slug,'lang',a.lang,'title',a.title,'h1',coalesce(a.h1,a.title),'summary',a.summary,'answer_md',a.answer_md,
 'meta_title',a.meta_title,'meta_description',a.meta_description,'canonical','https://pinnacleblooms.org/ask/'||a.slug,
 'meta_robots',CASE WHEN a.indexable THEN 'index, follow, max-image-preview:large' ELSE 'noindex, follow' END,
 'published_at',a.published_at,'last_reviewed_at',a.last_reviewed_at,'what_to_watch',a.what_to_watch,'everyday_tip',a.everyday_tip,
 'faq',coalesce(a.faq,'[]'::jsonb),'authority_links',coalesce(a.authority_links,'[]'::jsonb),
 'entity',jsonb_build_object('kind',q.entity_kind,'key',q.entity_key,'slug',q.entity_slug,'name',q.entity_name),
 'parent',(SELECT jsonb_build_object('label',d.label,'key',d.key) FROM ask_dimension d WHERE q.entity_kind=ANY(d.source_keys) AND d.is_active ORDER BY d.key LIMIT 1),
 'editorial',jsonb_build_object('developed_by',q.developed_by,'reviewed_at',q.reviewed_at,'reviewed_by',coalesce(q.reviewed_by_seat,q.reviewed_by_bench)),
 'related',coalesce((SELECT jsonb_agg(jsonb_build_object('slug',r.slug,'title',r.title,'lang',r.lang)) FROM ask_portal_public r WHERE r.lang=a.lang AND r.slug IN (SELECT v->>'slug' FROM jsonb_array_elements(coalesce(a.related,'[]'::jsonb)||coalesce(a.also_asked,'[]'::jsonb)) v)),'[]'::jsonb),
 'related_materials',coalesce(a.related_materials,'[]'::jsonb),'related_techniques',coalesce(a.related_techniques,'[]'::jsonb),
 'alternates',coalesce((SELECT jsonb_agg(jsonb_build_object('lang',r.lang,'href','https://pinnacleblooms.org/ask/'||r.slug,'indexable',r.indexable)) FROM ask_portal_public r WHERE r.slug IN(regexp_replace(a.slug,'-te$',''),regexp_replace(a.slug,'-te$','')||'-te')),'[]'::jsonb))
 FROM a LEFT JOIN q ON true;
$$;

CREATE OR REPLACE FUNCTION public.ask_portal_sitemap(p_page int DEFAULT 1)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public SET statement_timeout='6000ms' AS $$
 WITH x AS(SELECT slug,lang,coalesce(last_reviewed_at,published_at) modified FROM ask_portal_public WHERE indexable ORDER BY slug,lang LIMIT 10000 OFFSET (least(greatest(p_page,1),100)-1)*10000)
 SELECT jsonb_build_object('total',(SELECT count(*) FROM ask_portal_public WHERE indexable),'items',coalesce(jsonb_agg(x),'[]'::jsonb)) FROM x;
$$;
REVOKE ALL ON FUNCTION public.ask_portal_collection(text,text,text,int),public.ask_portal_directory(text,text,int),public.ask_portal_catalogue(),public.ask_portal_answer(text,text),public.ask_portal_sitemap(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ask_portal_collection(text,text,text,int),public.ask_portal_directory(text,text,int),public.ask_portal_catalogue(),public.ask_portal_answer(text,text),public.ask_portal_sitemap(int) TO anon,authenticated,service_role;
