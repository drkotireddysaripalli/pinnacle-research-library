-- Add only a fingerprint of existing public, indexable answer content to the existing RPC.
-- Preserve signature, limits, publication filter, security mode, owner and grants.
CREATE OR REPLACE FUNCTION public.ask_portal_sitemap(p_page integer DEFAULT 1)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout TO '6000ms'
AS $function$
 WITH x AS(SELECT slug,lang,coalesce(last_reviewed_at,published_at) modified FROM ask_portal_public WHERE indexable ORDER BY slug,lang LIMIT 10000 OFFSET (least(greatest(p_page,1),100)-1)*10000), p AS MATERIALIZED(SELECT id,slug,lang,indexable FROM public.ask_portal_public WHERE indexable ORDER BY slug,lang LIMIT 500 OFFSET (least(greatest(p_page,1),100)-1)*500), metadata AS(SELECT p.slug,p.lang,pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(pg_catalog.jsonb_build_object('title',a.title,'h1',a.h1,'summary',a.summary,'answer_md',a.answer_md,'meta_title',a.meta_title,'meta_description',a.meta_description,'faq',a.faq,'authority_links',a.authority_links,'what_to_watch',a.what_to_watch,'everyday_tip',a.everyday_tip,'related',a.related,'also_asked',a.also_asked,'related_materials',a.related_materials,'related_techniques',a.related_techniques,'meta_robots',a.meta_robots,'indexable',p.indexable)::text,'UTF8')),'hex') publisher_source_fingerprint FROM p JOIN public.pinnacle_answer a ON a.id=p.id ORDER BY p.slug,p.lang)
 SELECT jsonb_build_object('total',(SELECT count(*) FROM ask_portal_public WHERE indexable),'items',coalesce((SELECT jsonb_agg(x) FROM x),'[]'::jsonb),'source_page_size',500,'source_items',coalesce((SELECT jsonb_agg(metadata) FROM metadata),'[]'::jsonb));
$function$

