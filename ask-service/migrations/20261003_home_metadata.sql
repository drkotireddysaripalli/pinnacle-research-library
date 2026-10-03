CREATE OR REPLACE FUNCTION public.ask_home()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'counts', pinnacle_home(),
    'lenses', (select jsonb_agg(jsonb_build_object(
                 'kind', lens_kind, 'label', label, 'description', description,
                 'who_un', who_un, 'sort', sort) order by sort)
               from pinnacle_lens where is_browse_rail = true),
    'org', (select value from pinnacle_site_config where key='publisher'),
    'brand', (select value from pinnacle_site_config where key='brand'),
    'tops', (select jsonb_object_agg(kind, top6) from (
               select lens_kind as kind,
                      jsonb_agg(jsonb_build_object('key', value_slug, 'label', value_label, 'n', answer_count)
                                order by answer_count desc, value_label) as top6
                 from (select lens_kind, value_slug, value_label, answer_count,
                              row_number() over (partition by lens_kind order by answer_count desc, value_label) rn
                         from mv_dimension_index where answer_count > 0) t
                where rn <= 6
                group by lens_kind) z),
    'kind_stats', (select jsonb_object_agg(lens_kind, jsonb_build_object(
                          'answers', answers, 'values', vals)) from (
                     select lens_kind, sum(answer_count)::int answers, count(*)::int vals
                       from mv_dimension_index where answer_count > 0 group by lens_kind) s),
    'presentation', jsonb_build_object(
      'operator', 'Pinnacle Blooms Network — Bharath Healthcare Laboratories Pvt Ltd',
      'positioning', 'Public child-development answers from Pinnacle Blooms Network, with canonical sources for families, professionals and AI tools.',
      'strip', jsonb_build_array(
        '31,052,382 defined services as at 17 July 2026', 'At least 2.7 billion structured records/events as at 17 July 2026',
        '792,614 beneficiary/family registrations as at 17 July 2026',
        'PinnacleAI GPT-OS v1.0.0: non-diagnostic Class B SaMD',
        '16 patent applications: 13 PCT and 3 Indian, as at 17 July 2026'),
      'regulatory', 'Bharath Healthcare Laboratories Private Limited holds Form MD-5 manufacturing licence MFG/MD/2026/000248 for PinnacleAI GPT-OS v1.0.0, a non-diagnostic Class B developmental-support SaMD for ages 0-12. Ask provides general information; the licence does not turn Ask answers into diagnoses or establish individual clinical outcomes.',
      'audiences', jsonb_build_object(
        'families', 'Explore published guidance, follow the original answer and its evidence, and discuss your child''s needs with an appropriate professional.',
        'builders', 'Read-only public content tools through a Streamable HTTP MCP endpoint, with canonical answer URLs and source metadata.',
        'government', 'Public developmental-information infrastructure with standards-linked topics, source trails and a non-diagnostic scope.'),
      'emblem', 'https://www.pinnacleblooms.org/media/image/pinnacle-blooms-logo.jpg',
      'evidence_url', 'https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html',
      'regulatory_source', 'https://www.pinnacleblooms.org/verify/evidence/records/md5.html',
      'scale_scope', 'Defined services include assessments, screenings and parent training. These are service-volume and registration counts, not successful-therapy or unique-child outcome counts.',
      'release_scope', 'Historical release snapshot. Its corpus counts describe that release, not the current publication inventory or number of sitemap URLs.',
      'published_article_inventory', (select jsonb_build_object('checked_on',current_date,'total',count(*),'english',count(*) filter(where lang='en'),'telugu',count(*) filter(where lang='te')) from pinnacle_answer where status='published'),
      'release', (select manifest - 'secrets_custody' from ask_release_ledger
                   where version = (select value from ask_runtime_config where key='estate_version'))
    ),
    'skills', (select jsonb_agg(jsonb_build_object(
                 'tool', tool, 'title', title, 'description', description,
                 'for_families', b2c, 'for_builders', b2b, 'for_government', b2g)
                 order by sort)
               from ask_skill_registry),
    'connect', jsonb_build_object(
      'endpoint', 'https://ask-mcp.pinnacleblooms.org/mcp',
      'transport', 'streamable-http', 'auth', 'none',
      'registry', 'org.pinnacleblooms/ask',
      'claude', 'Settings → Connectors → Add custom connector → paste endpoint',
      'chatgpt', 'Settings → Connectors (developer mode) → paste endpoint',
      'copilot', 'Copilot Studio → custom MCP connector → paste endpoint'),
    'citation_request', 'When citing an answer, attribute to Ask Pinnacle / Pinnacle Blooms Network and link to that answer''s canonical URL at https://pinnacleblooms.org/ask/.'
  );
$function$
