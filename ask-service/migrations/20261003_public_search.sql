-- Public published-article retrieval only. No query logging, embeddings or generation.
-- Use the existing GIN index rather than rebuilding each article's search vector.
CREATE OR REPLACE FUNCTION public.ask_public_search(p_q text, p_k integer DEFAULT 10)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO public, pg_temp
SET statement_timeout TO '4s'
AS $function$
  WITH input AS (
    SELECT left(trim(coalesce(p_q, '')), 200) AS q,
           least(greatest(coalesce(p_k, 10), 1), 12) AS k
  ), matches AS (
    SELECT a.slug, a.title, a.summary, a.lang,
           ts_rank(a.search_tsv, websearch_to_tsquery('english', input.q)) AS rank
    FROM public.pinnacle_answer a CROSS JOIN input
    WHERE a.status = 'published' AND length(input.q) >= 2
      AND a.search_tsv @@ websearch_to_tsquery('english', input.q)
    ORDER BY rank DESC, a.slug
    LIMIT (SELECT k FROM input)
  )
  SELECT jsonb_build_object('results', coalesce(jsonb_agg(
    jsonb_build_object('slug', slug, 'title', title, 'summary', summary,
      'lang', lang, 'url', 'https://pinnacleblooms.org/ask/' || slug)
    ORDER BY rank DESC, slug), '[]'::jsonb)) FROM matches;
$function$;
REVOKE ALL ON FUNCTION public.ask_public_search(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ask_public_search(text, integer) TO anon, authenticated, service_role;
