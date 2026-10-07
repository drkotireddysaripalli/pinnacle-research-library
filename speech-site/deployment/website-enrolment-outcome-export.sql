-- Protected, read-only receiver export contract. Not an Analytics payload.
-- This query intentionally contains no customer/contact/child fields.
-- Run only through existing authorised operational data access.
-- No qualification/appointment/admission tables are guessed or joined here.
SELECT receipt_id,
       lead_reference,
       state,
       created_at_ms,
       updated_at_ms
FROM website_enrolment_receipts
WHERE state = 'accepted'
  AND lead_reference IS NOT NULL
  AND updated_at_ms >= ?
ORDER BY updated_at_ms, receipt_id;
-- The receiving-system reference is versioned: lead_v1:<Id> or
-- peoplenote_v1:<Id>. Operations must confirm the corresponding authoritative
-- entity and explicit relationship IDs before joins to qualification, booked
-- assessment, attendance, admission or MyOperator call records are activated.
-- Unknown/missing relationship IDs remain unmatched. Neither time proximity
-- nor phone equality establishes an acquired family or conversion.
