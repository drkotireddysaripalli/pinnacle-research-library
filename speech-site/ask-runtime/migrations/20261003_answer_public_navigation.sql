-- Add only existing public taxonomy relations to the current public answer RPC.
-- No source answers, private rows, grants or authentication settings are changed.
CREATE OR REPLACE FUNCTION public.ask_portal_answer(p_slug text, p_lang text DEFAULT 'en'::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout TO '6000ms'
AS $function$
 WITH a AS(SELECT x.*,p.indexable FROM pinnacle_answer x JOIN ask_portal_public p ON p.id=x.id WHERE x.slug=p_slug AND x.lang=p_lang),
 q AS(SELECT q.* FROM pinnacle_question q WHERE q.answer_id=(SELECT id FROM a) AND q.access='public' AND q.gate_status IS NULL ORDER BY(q.editorial_status='published') DESC NULLS LAST,coalesce(q.value_score,0) DESC,q.id LIMIT 1)
 SELECT jsonb_build_object('slug',a.slug,'lang',a.lang,'title',a.title,'h1',coalesce(a.h1,a.title),'summary',a.summary,'answer_md',a.answer_md,
 'meta_title',a.meta_title,'meta_description',a.meta_description,'canonical','https://pinnacleblooms.org/ask/'||a.slug,
 'meta_robots',CASE WHEN a.indexable THEN 'index, follow, max-image-preview:large' ELSE 'noindex, follow' END,
 'published_at',a.published_at,'last_reviewed_at',a.last_reviewed_at,'what_to_watch',a.what_to_watch,'everyday_tip',a.everyday_tip,
 'faq',coalesce(a.faq,'[]'::jsonb),'authority_links',coalesce(a.authority_links,'[]'::jsonb),
 'entity',jsonb_build_object('kind',q.entity_kind,'key',q.entity_key,'slug',q.entity_slug,'name',q.entity_name),
 'parent',(SELECT jsonb_build_object('label',d.label,'key',d.key) FROM ask_dimension d WHERE q.entity_kind=ANY(d.source_keys) AND d.is_active ORDER BY d.key LIMIT 1),

 'dimensions',coalesce((SELECT jsonb_agg(jsonb_build_object('key',d.key,'label',d.label) ORDER BY d.key) FROM ask_dimension d WHERE q.entity_kind=ANY(d.source_keys) AND d.is_active),'[]'::jsonb),
 'lenses',coalesce((SELECT jsonb_agg(jsonb_build_object('kind',f.kind,'value',f.value,'label',f.label) ORDER BY f.priority,f.kind,f.value) FROM (
  SELECT kind,value,max(label) label,min(priority) priority FROM (
   SELECT l.lens_kind kind,l.lens_key value,coalesce(l.lens_label,initcap(replace(l.lens_key,'_',' '))) label,20 priority FROM public.pinnacle_question_lens l WHERE l.question_id=q.id
   UNION ALL
   SELECT k.kind,public.ask_portal_primary_facet(q,k.kind),initcap(replace(public.ask_portal_primary_facet(q,k.kind),'_',' ')),k.priority
   FROM (VALUES ('stakeholder',1),('age',2),('dev_age',3),('domain',4),('readiness',5),('intent',6),('lifecycle',7),('route',8),('score_band',9),('component',10),('empowerment',11)) k(kind,priority)
  ) related WHERE value IS NOT NULL AND length(value)>0 GROUP BY kind,value ORDER BY min(priority),kind,value LIMIT 24
 ) f),'[]'::jsonb),
 'editorial',jsonb_build_object('developed_by',q.developed_by,'reviewed_at',q.reviewed_at,'reviewed_by',coalesce(q.reviewed_by_seat,q.reviewed_by_bench)),
 'related',coalesce((SELECT jsonb_agg(jsonb_build_object('slug',r.slug,'title',r.title,'lang',r.lang)) FROM ask_portal_public r WHERE r.lang=a.lang AND r.slug IN (SELECT v->>'slug' FROM jsonb_array_elements(coalesce(a.related,'[]'::jsonb)||coalesce(a.also_asked,'[]'::jsonb)) v)),'[]'::jsonb),
 'related_materials',coalesce(a.related_materials,'[]'::jsonb),'related_techniques',coalesce(a.related_techniques,'[]'::jsonb),
 'alternates',coalesce((SELECT jsonb_agg(jsonb_build_object('lang',r.lang,'href','https://pinnacleblooms.org/ask/'||r.slug,'indexable',r.indexable)) FROM ask_portal_public r WHERE r.slug IN(regexp_replace(a.slug,'-te$',''),regexp_replace(a.slug,'-te$','')||'-te')),'[]'::jsonb))
 FROM a LEFT JOIN q ON true;
$function$

