-- Candidate only: owner must review/apply in the receiver's existing database.
-- This creates no additional database, service, vendor or customer record.
CREATE TABLE IF NOT EXISTS website_enrolment_receipts (
  request_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  payload_digest CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  state VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  receipt_id VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  claim_token VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  source_json TEXT NOT NULL,
  lead_reference VARCHAR(100) NULL,
  created_at_ms BIGINT UNSIGNED NOT NULL,
  updated_at_ms BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (request_key),
  UNIQUE KEY website_enrolment_receipt_id (receipt_id),
  KEY website_enrolment_state_updated (state,updated_at_ms)
);
-- No automatic deletion: uncertain rows require reconciliation. Retention of
-- source and lead references requires the owner's policy; request-key/digest
-- tombstones must survive any approved purge so an old request cannot repost.
