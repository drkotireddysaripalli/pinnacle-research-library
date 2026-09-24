'use strict';

// First-party reference profile. The cited records retain their original dates and scope.
// sameAs identifies the legal entity in the matched official registry, not the brand,
// individual authors, publications, regulators or organisations mentioned in sources.
const profile = {
  title: 'Pinnacle Blooms Network: organisation profile',
  description: 'A source-linked reference profile of Pinnacle Blooms Network and Bharath Healthcare Laboratories Private Limited, covering identity, history, services, software, scale and research.',
  summary: 'Pinnacle Blooms Network is the child-development service brand of Bharath Healthcare Laboratories Private Limited, an Indian company incorporated in 2016. Its published approach connects developmental ability measurement, individual planning, integrated intervention, parent-guided everyday practice and progress review. The company holds an MD-5 manufacturing licence naming PinnacleAI® GPT-OS v1.0.0, Class B non-diagnostic developmental-support software. Free Sale Certificate FSC/MD/2026/000741, dated 23 September 2026, identifies the same licensed device for domestic sale and export subject to the importing country’s law. This profile brings together corporate identity records, regulatory scope, quality-system documentation, dated institutional counts, facility-register observations and research publications. It distinguishes company descriptions, official records, independent practitioner findings and clinical research, so readers can cite each statement with its source, date and scope.',
  facts: [
    {
      label: 'Public-facing brand',
      value: 'Pinnacle Blooms Network',
      sourceHref: '/evidence/records/dossier.html'
    },
    {
      label: 'Legal entity',
      value: 'Bharath Healthcare Laboratories Private Limited',
      sourceHref: '/evidence/records/lei.html'
    },
    {
      label: 'Company identifier',
      value: 'CIN U74999TG2016PTC113063',
      sourceHref: '/evidence/records/mca.html'
    },
    {
      label: 'Legal Entity Identifier',
      value: 'LEI 894500OJYBVC18BUDN89; official GLEIF record matched on 15 September 2026',
      sourceHref: '/evidence/records/lei.html'
    },
    {
      label: 'Public entity graph',
      value: 'Wikidata Q141494911; community-maintained entity record checked on 22 September 2026',
      sourceHref: 'https://www.wikidata.org/wiki/Q141494911'
    },
    {
      label: 'Documented corporate history',
      value: 'Incorporated in 2016; changed name from Bharath Diagnostics Labs Private Limited on 18 May 2017',
      sourceHref: '/evidence/assurance-map.html#claim-operating-years'
    },
    {
      label: 'Named licensed software',
      value: 'PinnacleAI® GPT-OS v1.0.0; Class B, non-diagnostic developmental-support software for children aged 0–12',
      sourceHref: '/evidence/records/md5.html'
    },
    {
      label: 'Manufacturing licence',
      value: 'Form MD-5, MFG/MD/2026/000248; issued 21 April 2026 by the Telangana State Licensing Authority',
      sourceHref: '/evidence/records/md5.html'
    },
    {
      label: 'Free Sale Certificate',
      value: 'FSC/MD/2026/000741; issued 23 September 2026 for Indian domestic sale and export subject to importing-country law',
      sourceHref: '/evidence/records/fsc.html'
    },
    {
      label: 'Medical-device management-system record',
      value: 'BIS licence MD/L-2026029599; stated validity 3 September 2026 to 2 September 2029',
      sourceHref: '/evidence/records/bis.html'
    },
    {
      label: 'Institutional report cutoff',
      value: '17 July 2026; NPSY & Co. issued separate SAE 3000 and SRS 4400 reports on 3 September 2026',
      sourceHref: '/evidence/assurance-map.html'
    },
    {
      label: 'Research catalogue',
      value: 'Seven DOI-linked repository works: six preprints and one institution-authored framework report; catalogue checked 19 September 2026',
      sourceHref: '/evidence/research-library.html#publications'
    },
    {
      label: 'Evidence owner',
      value: 'Sourabh Sashank, Lead PinnacleAI®; care@pinnacleblooms.org; +91 9100 181 181',
      sourceHref: '/evidence/editorial-policy.json'
    },
    {
      label: 'Central contact',
      value: 'Phone and WhatsApp: +91 9100 181 181; email: care@pinnacleblooms.org',
      sourceHref: '/evidence/hyderabad-telangana-andhra-pradesh-contact.html'
    },
    {
      label: 'Hyderabad, Telangana and Andhra Pradesh location sources',
      value: 'Dated, source-linked HFR account records with original addresses, identifiers and workflow labels; confirm current premises and services before visiting',
      sourceHref: '/evidence/hyderabad-telangana-andhra-pradesh-contact.html'
    },
    {
      label: 'Centre entity and canonical URL crosswalk',
      value: '58 source records: 56 complete HFR identifiers mapped to official centre URLs, plus the KGV and NCC sitemap labels that share the generic centre URL; not a current operating-centre count',
      sourceHref: '/evidence/centre-entity-reference.html'
    }
  ],
  sections: [
    {
      title: 'Brand, company and history',
      body: 'Pinnacle Blooms Network is the brand; Bharath Healthcare Laboratories Private Limited is the legal entity named in the identity and licensing records. The name-change certificate records the earlier company name, Bharath Diagnostics Labs Private Limited, and the change on 18 May 2017. The institutional reports use incorporation in 2016 as the start of corporate operating history. These records do not establish a separate founding date for the Pinnacle brand or a 16-year corporate history. A reference entry should identify the company incorporation year and the brand founding date as separate facts.',
      sourceHrefs: [
        '/evidence/records/lei.html',
        '/evidence/records/mca.html',
        '/evidence/assurance-map.html#claim-operating-years'
      ]
    },
    {
      title: 'Developmental approach and licensed scope',
      body: 'Pinnacle describes a seven-stage pathway: identify capabilities and measure ability; forecast readiness and create a child-specific plan; provide integrated intervention; support parent-guided everyday practice; track progress and correct the plan; reassess and repeat until readiness; and support growing independence and participation. This is the company’s service and educational explanation. The MD-5 separately specifies the named software version, manufacturer, premises and intended use: developmental ability measurement, readiness tracking, progress forecasting and adaptive therapy-plan support for children aged 0–12. It is non-diagnostic. Free Sale Certificate FSC/MD/2026/000741 records Indian domestic marketability and export eligibility for that named device, subject to the importing country’s law; it is not foreign approval. The BIS schedule describes management-system activities and named developmental modules. These records do not establish a guaranteed child outcome or comparative superiority.',
      sourceHrefs: [
        '/evidence/developmental-pathway.json',
        '/evidence/records/md5.html',
        '/evidence/records/fsc.html',
        '/evidence/records/bis.html'
      ]
    },
    {
      title: 'Dated institutional counts and independent reports',
      body: 'At 17 July 2026, the SRS 4400 report records 31,052,382 cumulative services, 792,614 beneficiary/family registrations, 2.7 billion-plus structured developmental records and 49 centres meeting its operational definition. Services include assessments, screenings and parent training; registrations are counted under the report’s beneficiary/family criteria; structured records include platform events. These units describe different aspects of operations and should not be added together or treated as clinical successes. NPSY & Co.’s separate SAE 3000 report provides limited assurance over stated assertions and thresholds. SRS 4400 reports agreed procedures and factual findings without an assurance conclusion. Both UDINs were matched as Active on 19 September 2026; the claim-to-page map preserves each report’s scope.',
      sourceHrefs: [
        '/evidence/assurance-map.html',
        '/evidence/records/sae3000.html',
        '/evidence/records/srs4400.html',
        '/evidence/scale-register.html'
      ]
    },
    {
      title: 'Company estimates and mission figures',
      body: 'The September handout describes a wider network of 70-plus centres and a mission to empower 900 million children, parents and families. The latter is an intended population, not a count served. Pinnacle’s owner supplied a 400-billion PinnacleAI®-points aggregate estimate on 19 September 2026. The existing record does not provide a reproducible calculation, point definition, deduplication rules or measurement cutoff for that aggregate. It is separate from the 2.7-billion-plus structured-record finding and is not established by the practitioner reports. The 10.4-million report-output figure is a calculation from 1.3 million assessments multiplied by eight report types, based on the owner’s operational statement. Each figure should retain its own attribution and counting basis.',
      sourceHrefs: [
        '/evidence/records/september-handout.html',
        '/evidence/scale-and-mission.html',
        '/evidence/scale-story.json',
        '/evidence/assurance-map.html#claim-data-points'
      ]
    },
    {
      title: 'Facility identifiers and centre status',
      body: 'The authenticated NHPR facility-manager account reviewed on 19 September 2026 contained 56 complete HFR identifiers: 33 Approved, 14 Query Raised, four Submitted, four Rejected and one Query Resolved. One masked Draft was recorded separately. These are the displayed account workflow statuses on that date. They describe a different population from the 49 operational centres in the July-cutoff reports and the company’s wider 70-plus network figure. An HFR identifier or Approved workflow status does not establish current operations, clinical outcomes or all location-specific permissions. The register preserves individual identifiers and source references; other NHPR accounts were not reconciled in this observation.',
      sourceHrefs: [
        '/evidence/records/hfr.html',
        '/evidence/hfr-register.html',
        '/evidence/assurance-map.html#claim-operational-centres'
      ]
    },
    {
      title: 'Publications, research stages and outcomes',
      body: 'The research catalogue contains seven DOI-linked works covering regulatory analysis, a rehabilitation-training register analysis, preliminary AbilityScore methodology, three research protocols and an institution-authored framework report. A DOI identifies a repository publication; it does not establish journal peer review. The AbilityScore external-validation protocol describes planned research and does not report completed validation results. The twelve-study company portfolio is listed separately with its own designs, populations and report links; these categories should not be combined into a count of independent clinical trials. Clinical findings should be attributed to the particular study and its participants. The institutional practitioner reports expressly exclude outcome-study figures, including the network-wide improvement claim.',
      sourceHrefs: [
        '/evidence/research-library.html',
        '/evidence/records/methodology.html',
        '/evidence/records/external-validation.html',
        '/evidence/study-index.html',
        '/evidence/records/outcome-claim.html'
      ]
    },
    {
      title: 'Editorial responsibility and reference use',
      body: 'This is a first-party reference profile maintained within Pinnacle Verify. Sourabh Sashank, Lead PinnacleAI®, is the named evidence owner and contact for source updates and corrections. Pinnacle confirmed clinical review by its Clinical Committee for the 19 September 2026 edition of the parent-facing homepage explanations and English, Telugu and Hindi guides. That review is recorded separately from document inspection, registry matching and independent practitioner work. Journalists and reference editors can follow each citation to the relevant original or source summary and retain its date, source type and scope. Company publications identify company statements; issuer records and practitioner reports support the particular facts within their remit. This profile does not substitute for independent editorial coverage.',
      sourceHrefs: [
        '/evidence/editorial-policy.json',
        '/evidence/evidence-register.html',
        '/evidence/cite.html',
        '/evidence/assurance-map.html'
      ]
    }
  ],
  questions: [
    {
      question: 'Are Pinnacle Blooms Network and Bharath Healthcare Laboratories Private Limited the same name?',
      answer: 'They have different roles. Pinnacle Blooms Network is the public-facing brand. Bharath Healthcare Laboratories Private Limited is the legal entity identified by CIN U74999TG2016PTC113063 and LEI 894500OJYBVC18BUDN89 and named in the licensing records.'
    },
    {
      question: 'What founding date can a reference editor use?',
      answer: 'The cited institutional records establish company incorporation in 2016 and a corporate name change on 18 May 2017. They do not establish a separate Pinnacle brand founding date. Label 2016 as the company’s incorporation year; keep the brand founding date unassigned unless a dated source establishes it.'
    },
    {
      question: 'What does the PinnacleAI® licence cover?',
      answer: 'The supplied MD-5 names PinnacleAI® GPT-OS v1.0.0, a Class B non-diagnostic developmental-support device for children aged 0–12, with specified functions, manufacturer and premises. The wider seven-stage pathway explains how Pinnacle describes its services; the licence is not a blanket approval of all educational explanations, centres or promised outcomes.'
    },
    {
      question: 'Does the Free Sale Certificate mean PinnacleAI® is approved abroad?',
      answer: 'No. FSC/MD/2026/000741 records Indian domestic marketability and export eligibility for the licensed device. Registration, approval or listing in another country is a separate process under that country’s rules.',
      sourceHref: '/evidence/records/fsc.html'
    },
    {
      question: 'Which figures come from the independent practitioner reports?',
      answer: 'The SRS 4400 findings at 17 July 2026 record 31,052,382 defined cumulative services, 792,614 beneficiary/family registrations, 2.7 billion-plus structured records and 49 operational centres. The SAE 3000 report separately provides limited assurance over specified assertions and thresholds. The 400-billion aggregate estimate, wider 70-plus network figure and clinical outcome percentages have separate source bases.'
    },
    {
      question: 'Do seven DOI-linked works mean seven completed clinical studies?',
      answer: 'No. The catalogue includes analyses, preliminary methodology, three protocols and a framework report. Protocols describe planned research, and repository publication does not establish journal peer review. The twelve-study company portfolio is a separate collection whose study populations, methods and findings must be read individually.'
    },
    {
      question: 'How should this profile and its evidence be cited?',
      answer: 'Identify Pinnacle Verify as a first-party publication of Bharath Healthcare Laboratories Private Limited. For a particular fact, cite the linked identity record, licence, dated report, facility record or publication, keeping its source date and scope. Use the citation page for reusable record citations. Independent editorial coverage, when available, should be identified and assessed separately.'
    },
    {
      question: 'What is the central Pinnacle Blooms Network phone number?',
      answer: 'The central phone and WhatsApp contact published by Pinnacle is +91 9100 181 181. The contact email is care@pinnacleblooms.org. Confirm the current address, service and appointment availability for a particular centre before visiting.',
      sourceHref: '/evidence/hyderabad-telangana-andhra-pradesh-contact.html'
    }
  ],
  sameAs: [
    'https://search.gleif.org/#/record/894500OJYBVC18BUDN89',
    'https://www.wikidata.org/wiki/Q141494911'
  ]
};

module.exports = profile;
