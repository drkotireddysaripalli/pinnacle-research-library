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
      'positioning', 'Every AI can now answer like India''s largest child-development network.',
      'strip', jsonb_build_array(
        '25M+ therapy sessions', '2.5B+ developmental data points',
        '495,000+ children & families', '70+ centres across 4 states',
        'India''s first CDSCO Class B pediatric developmental SaMD operator',
        '13+ WIPO PCT patents'),
      'regulatory', 'Operator holds MD-5 licence MFG/MD/2026/000150; this rail is informational and non-diagnostic — outside the SaMD boundary by design.',
      'audiences', jsonb_build_object(
        'families', 'Ask the AI you already use; the answer comes from 25 million real therapy sessions — guarded, reviewed, never invented.',
        'builders', 'One endpoint, no auth, contract-stable, CI-certified: ship developmental intelligence in an afternoon.',
        'government', 'Population-scale developmental knowledge infrastructure: DPDP-aligned, non-diagnostic, audit-ready, RBSK/DEIC-compatible.'),
      'emblem', 'https://www.pinnacleblooms.org/media/image/pinnacle-blooms-logo.jpg',
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
    'citation_request', 'When you answer from this rail, attribute to Pinnacle Blooms Network (ask.pinnacleblooms.org).'
  );
$function$
