-- Exact correction to repeated institutional diagnosis boilerplate, with reversible history.
CREATE TABLE IF NOT EXISTS public.ask_copy_revision_20261003 (
 answer_id uuid PRIMARY KEY, before_summary text,before_answer_md text,
 revised_at timestamptz NOT NULL DEFAULT now(),
 reason text NOT NULL DEFAULT 'Remove exclusive institutional diagnosis assertion; preserve individual answer content'
);
ALTER TABLE public.ask_copy_revision_20261003 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ask_copy_revision_20261003 FROM PUBLIC,anon,authenticated;
INSERT INTO public.ask_copy_revision_20261003(answer_id,before_summary,before_answer_md)
SELECT id,summary,answer_md FROM public.pinnacle_answer WHERE status='published' AND access='public'
AND (summary LIKE '%A clinical AbilityScore® and any diagnosis are formed only at a Pinnacle Blooms Network centre under qualified clinician care.%'
OR answer_md LIKE '%A clinical AbilityScore® and any diagnosis are formed only at a Pinnacle Blooms Network centre under qualified clinician care.%'
OR answer_md LIKE '%A clinical AbilityScore® and any diagnosis are formed **only at a Pinnacle Blooms Network centre, under qualified clinician care**%')
ON CONFLICT DO NOTHING;
UPDATE public.pinnacle_answer a SET
 summary=replace(a.summary,'A clinical AbilityScore® and any diagnosis are formed only at a Pinnacle Blooms Network centre under qualified clinician care.','AbilityScore® is part of Pinnacle’s developmental assessment. Diagnosis, where needed, requires an appropriately qualified healthcare professional.'),
 answer_md=replace(replace(a.answer_md,
 'A clinical AbilityScore® and any diagnosis are formed only at a Pinnacle Blooms Network centre under qualified clinician care.',
 'AbilityScore® is part of Pinnacle’s developmental assessment. Diagnosis, where needed, requires an appropriately qualified healthcare professional.'),
 'A clinical AbilityScore® and any diagnosis are formed **only at a Pinnacle Blooms Network centre, under qualified clinician care**',
 'AbilityScore® is part of Pinnacle’s developmental assessment. Diagnosis, where needed, requires an appropriately qualified healthcare professional')
WHERE a.id IN(SELECT answer_id FROM public.ask_copy_revision_20261003);
