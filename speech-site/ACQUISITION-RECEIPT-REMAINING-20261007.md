# Remaining accepted-enquiry contract — 7 October 2026

## Status: not complete

Website implementation owner: this website thread. Existing admissions/telephony outcome access remains with the established operations coordination; a named receiving-system person and a verified protected outcome export have not been established here. MyOperator case 685868 is recorded in the existing closeout; a booked meeting is not evidence of its outcome.

## Fresh receiver evidence

The live `pbn-planetscale` Worker routes `/api/gl/swfs` to `HandleStaticWebForms`. For Enroll it awaits `HandleLead`, obtains the resulting lead's `Id`, and returns only `true`. The website adapter waits for that value and returns accepted. It drops the client's request key and fixed source object before this handoff. Current receiving source access is available. The private source bundle and its hash are retained outside the public repository; no lead/customer records were queried or exported.

## Implementation that remains

1. Define and implement one private durable request ledger with an atomic request-key claim, payload consistency, state transitions and retention. Store permitted source evidence against that same key. Keep contact/child information out of analytics and unapproved vendor payloads.
2. Extend only the versioned website Enroll contract to preserve the key and return a receiver receipt/lead reference after the actual write. Preserve older clients' response format and existing intake/notification behaviour.
3. Return acceptance only after durable receipt and confirmed handoff. Hold uncertain handoffs for reconciliation; do not automatically repost them. A later attempt with the same key and same request must reuse the receipt; conflicting reuse must be rejected.
4. Emit the consent-safe event once from the verified receipt boundary, without private IDs or health/contact fields in GA4. Maintain browser request persistence and suppress refresh/double-tap duplication. Consent or absent attribution must not prevent an enquiry.
5. Establish the existing protected receipt-to-call/CRM export contract and join keys with actual qualification, appointments, attendance and admissions. Unknown links remain unknown; timestamp proximity or a shared phone alone cannot establish attribution.
6. Run labelled QA/staging success, retry, conflicting payload, failed/uncertain handoff and reload cases using an isolated receiving fixture. Prove durable persistence across process restart and absence from real sales/Ads counters. Production family leads/calls and paid self-clicks are not QA.

## Completion boundary and next trigger

The source review and call-coverage release do not close this requirement. Next action is the receiver/ledger implementation contract and isolated QA path above, with actual admissions/telephony access identified before an outcome join is claimed. Keep the existing GA4 event outside any claim of deduplicated qualified leads or completed admission attribution. No standing scheduler or additional vendor is created for this follow-up.
