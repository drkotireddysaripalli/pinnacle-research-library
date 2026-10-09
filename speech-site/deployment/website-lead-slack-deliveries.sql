-- Candidate metadata journal in the receiver's EXISTING private MySQL database.
-- Not applied. No family payload, lead URL, credentials or clinical data.
CREATE TABLE IF NOT EXISTS website_lead_slack_deliveries (
 delivery_key VARCHAR(240) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 payload_digest CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 state ENUM('pending','in_flight','delivered','uncertain') NOT NULL,
 claim_token CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 slack_ts VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin NULL,
 created_at_ms BIGINT UNSIGNED NOT NULL,
 updated_at_ms BIGINT UNSIGNED NOT NULL
);
