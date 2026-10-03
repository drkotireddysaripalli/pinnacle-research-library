SET LOCAL statement_timeout='120s';
INSERT INTO public.ask_copy_revision_20261003(answer_id,before_summary,before_answer_md)
SELECT id,summary,answer_md FROM public.pinnacle_answer WHERE status='published' AND access='public' AND answer_md LIKE '%a clinical AbilityScore® and any diagnosis are formed only at a Pinnacle Blooms Network centre under qualified clinician care.%' ON CONFLICT DO NOTHING;
UPDATE public.pinnacle_answer SET answer_md=replace(answer_md,'a clinical AbilityScore® and any diagnosis are formed only at a Pinnacle Blooms Network centre under qualified clinician care.','individual assessment and diagnosis require an appropriately qualified healthcare professional.')
WHERE status='published' AND access='public' AND answer_md LIKE '%a clinical AbilityScore® and any diagnosis are formed only at a Pinnacle Blooms Network centre under qualified clinician care.%';
