-- Reviewed schema. No DROP/ALTER/care-table changes.

CREATE TABLE IF NOT EXISTS `url_registry` (
  `url_id` TEXT NOT NULL,
  `url` TEXT,
  `normalized_url_sha256` TEXT,
  `scheme` TEXT,
  `host` TEXT,
  `address_kind` TEXT,
  `first_seen_at` TEXT,
  `last_seen_at` TEXT,
  `is_current` INTEGER,
  PRIMARY KEY (`url_id`),
  UNIQUE (`normalized_url_sha256`)
);

CREATE TABLE IF NOT EXISTS `pages` (
  `page_id` TEXT NOT NULL,
  `source_system` TEXT,
  `source_record_key` TEXT,
  `primary_url_id` TEXT,
  `canonical_url_id` TEXT,
  `module_type` TEXT,
  `language` TEXT,
  `title` TEXT,
  `description` TEXT,
  `topic_keywords_json` TEXT,
  `publication_status` TEXT,
  `content_version_sha256` TEXT,
  `published_date_or_datetime` TEXT,
  `significant_modified_date_or_datetime` TEXT,
  `modified_date_precision` TEXT,
  `modified_evidence_id` TEXT,
  `metadata_json` TEXT,
  PRIMARY KEY (`page_id`),
  UNIQUE (`source_system`,`source_record_key`,`language`),
  UNIQUE (`primary_url_id`),
  FOREIGN KEY (`primary_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`canonical_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`modified_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (`topic_keywords_json` IS NULL OR json_valid(`topic_keywords_json`)),
  CHECK (`metadata_json` IS NULL OR json_valid(`metadata_json`))
);

CREATE TABLE IF NOT EXISTS `assets` (
  `asset_id` TEXT NOT NULL,
  `source_system` TEXT,
  `source_asset_key` TEXT,
  `asset_kind` TEXT,
  `name` TEXT,
  `description` TEXT,
  `language` TEXT,
  `publication_status` TEXT,
  `publisher_modified_date_or_datetime` TEXT,
  `rights_status` TEXT,
  `credit_text` TEXT,
  `copyright_notice` TEXT,
  `license_url_id` TEXT,
  `acquire_license_url_id` TEXT,
  `descriptive_metadata_json` TEXT,
  `original_publication_value` TEXT,
  `upload_value` TEXT,
  `publication_date_precision` TEXT,
  PRIMARY KEY (`asset_id`),
  UNIQUE (`source_system`,`source_asset_key`),
  FOREIGN KEY (`license_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`acquire_license_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (`descriptive_metadata_json` IS NULL OR json_valid(`descriptive_metadata_json`))
);

CREATE TABLE IF NOT EXISTS `asset_renditions` (
  `rendition_id` TEXT NOT NULL,
  `asset_id` TEXT,
  `url_id` TEXT,
  `rendition_kind` TEXT,
  `representation_key` TEXT,
  `declared_content_type` TEXT,
  `detected_media_type` TEXT,
  `width_px` INTEGER,
  `height_px` INTEGER,
  `duration_ms` INTEGER,
  `byte_size` INTEGER,
  `byte_sha256` TEXT,
  `transform_metadata_json` TEXT,
  `first_seen_at` TEXT,
  `last_seen_at` TEXT,
  `bitrate_kbps` REAL,
  `frame_rate` REAL,
  `sampling_rate_khz` REAL,
  `audio_channels` INTEGER,
  PRIMARY KEY (`rendition_id`),
  UNIQUE (`asset_id`,`url_id`,`representation_key`),
  UNIQUE (`rendition_id`,`asset_id`),
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (`transform_metadata_json` IS NULL OR json_valid(`transform_metadata_json`))
);

CREATE TABLE IF NOT EXISTS `media_uses` (
  `use_id` TEXT NOT NULL,
  `page_id` TEXT,
  `asset_id` TEXT,
  `rendered_rendition_id` TEXT,
  `slot_key` TEXT,
  `role` TEXT,
  `alt_text` TEXT,
  `caption` TEXT,
  `context_text` TEXT,
  `public_question_or_example_key` TEXT,
  `page_content_version_sha256` TEXT,
  `evidence_id` TEXT,
  `publication_state` TEXT,
  `placement_identity_sha256` TEXT,
  `placement_basis` TEXT,
  PRIMARY KEY (`use_id`),
  UNIQUE (`page_id`,`slot_key`,`page_content_version_sha256`),
  UNIQUE (`placement_identity_sha256`),
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`rendered_rendition_id`) REFERENCES `asset_renditions` (`rendition_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`rendered_rendition_id`,`asset_id`) REFERENCES asset_renditions(rendition_id,asset_id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `links` (
  `link_id` TEXT NOT NULL,
  `source_page_id` TEXT,
  `target_url_id` TEXT,
  `slot_key` TEXT,
  `raw_href` TEXT,
  `target_fragment` TEXT,
  `anchor_text` TEXT,
  `rel_tokens_json` TEXT,
  `element_kind` TEXT,
  `relationship_kind` TEXT,
  `hreflang` TEXT,
  `page_content_version_sha256` TEXT,
  `evidence_id` TEXT,
  `publication_state` TEXT,
  PRIMARY KEY (`link_id`),
  UNIQUE (`source_page_id`,`slot_key`,`page_content_version_sha256`),
  FOREIGN KEY (`source_page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`target_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (`rel_tokens_json` IS NULL OR json_valid(`rel_tokens_json`))
);

CREATE TABLE IF NOT EXISTS `asset_relations` (
  `relation_id` TEXT NOT NULL,
  `source_asset_id` TEXT,
  `target_asset_id` TEXT,
  `relationship_kind` TEXT,
  `evidence_id` TEXT,
  `publication_state` TEXT,
  PRIMARY KEY (`relation_id`),
  FOREIGN KEY (`source_asset_id`) REFERENCES `assets` (`asset_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`target_asset_id`) REFERENCES `assets` (`asset_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `page_relations` (
  `relation_id` TEXT NOT NULL,
  `source_page_id` TEXT,
  `target_page_id` TEXT,
  `relationship_kind` TEXT,
  `language_code` TEXT,
  `evidence_id` TEXT,
  `publication_state` TEXT,
  PRIMARY KEY (`relation_id`),
  FOREIGN KEY (`source_page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`target_page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `agents` (
  `agent_id` TEXT NOT NULL,
  `agent_kind` TEXT,
  `name` TEXT,
  `public_profile_url_id` TEXT,
  `source_identity_key` TEXT,
  PRIMARY KEY (`agent_id`),
  UNIQUE (`source_identity_key`),
  FOREIGN KEY (`public_profile_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `asset_contributors` (
  `contribution_id` TEXT NOT NULL,
  `asset_id` TEXT,
  `agent_id` TEXT,
  `role` TEXT,
  `evidence_id` TEXT,
  PRIMARY KEY (`contribution_id`),
  UNIQUE (`asset_id`,`agent_id`,`role`),
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `source_imports` (
  `import_id` TEXT NOT NULL,
  `source_type` TEXT,
  `source_scope` TEXT,
  `input_sha256` TEXT,
  `source_observed_at` TEXT,
  `imported_at` TEXT,
  `expected_rows` INTEGER,
  `received_rows` INTEGER,
  `completeness_state` TEXT,
  `raw_artifact_reference` TEXT,
  PRIMARY KEY (`import_id`)
);

CREATE TABLE IF NOT EXISTS `observations` (
  `observation_id` TEXT NOT NULL,
  `import_id` TEXT,
  `subject_kind` TEXT,
  `subject_id` TEXT,
  `attribute_name` TEXT,
  `observed_value_json` TEXT,
  `observed_at` TEXT,
  `source_version_sha256` TEXT,
  `value_sha256` TEXT,
  PRIMARY KEY (`observation_id`),
  FOREIGN KEY (`import_id`) REFERENCES `source_imports` (`import_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (`observed_value_json` IS NULL OR json_valid(`observed_value_json`))
);

CREATE TABLE IF NOT EXISTS `eligibility_decisions` (
  `decision_id` TEXT NOT NULL,
  `subject_kind` TEXT,
  `subject_id` TEXT,
  `channel` TEXT,
  `decision` TEXT,
  `reason_code` TEXT,
  `policy_version` TEXT,
  `source_version_sha256` TEXT,
  `evidence_id` TEXT,
  `decided_at` TEXT,
  `expires_at` TEXT,
  PRIMARY KEY (`decision_id`),
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `text_representations` (
  `representation_id` TEXT NOT NULL,
  `page_id` TEXT,
  `public_url_id` TEXT,
  `language` TEXT,
  `format` TEXT,
  `source_content_sha256` TEXT,
  `text_artifact_reference` TEXT,
  `text_sha256` TEXT,
  `approval_state` TEXT,
  `approved_source_sha256` TEXT,
  PRIMARY KEY (`representation_id`),
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`public_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `publication_runs` (
  `publication_id` TEXT NOT NULL,
  `input_manifest_sha256` TEXT,
  `policy_version` TEXT,
  `release_sha256` TEXT,
  `state` TEXT,
  `generated_at` TEXT,
  `validated_at` TEXT,
  `published_at` TEXT,
  `previous_accepted_publication_id` TEXT,
  `coverage_receipt_reference` TEXT,
  PRIMARY KEY (`publication_id`)
);

CREATE TABLE IF NOT EXISTS `sitemap_files` (
  `file_id` TEXT NOT NULL,
  `publication_id` TEXT,
  `host` TEXT,
  `public_url_id` TEXT,
  `file_kind` TEXT,
  `family` TEXT,
  `shard_key` TEXT,
  `byte_size` INTEGER,
  `uncompressed_size` INTEGER,
  `entry_count` INTEGER,
  `content_sha256` TEXT,
  `actual_file_modified_at` TEXT,
  `submission_and_fetch_receipt_reference` TEXT,
  PRIMARY KEY (`file_id`),
  UNIQUE (`publication_id`,`host`,`public_url_id`),
  FOREIGN KEY (`publication_id`) REFERENCES `publication_runs` (`publication_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`public_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `sitemap_memberships` (
  `membership_id` TEXT NOT NULL,
  `file_id` TEXT,
  `page_id` TEXT,
  `media_use_id` TEXT,
  `eligibility_decision_id` TEXT,
  `source_version_sha256` TEXT,
  PRIMARY KEY (`membership_id`),
  FOREIGN KEY (`file_id`) REFERENCES `sitemap_files` (`file_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`media_use_id`) REFERENCES `media_uses` (`use_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`eligibility_decision_id`) REFERENCES `eligibility_decisions` (`decision_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `property_definitions` (
  `property_id` TEXT NOT NULL,
  `standard_key` TEXT,
  `standard_snapshot_sha256` TEXT,
  `property_key` TEXT,
  `domain_types_json` TEXT,
  `range_types_json` TEXT,
  `datatype` TEXT,
  `cardinality` TEXT,
  `nested_shape_json` TEXT,
  `constraints_json` TEXT,
  `lifecycle_status` TEXT,
  `output_profile_rules_json` TEXT,
  `source_url` TEXT,
  PRIMARY KEY (`property_id`),
  UNIQUE (`standard_key`,`standard_snapshot_sha256`,`property_key`),
  CHECK (`domain_types_json` IS NULL OR json_valid(`domain_types_json`)),
  CHECK (`range_types_json` IS NULL OR json_valid(`range_types_json`)),
  CHECK (`nested_shape_json` IS NULL OR json_valid(`nested_shape_json`)),
  CHECK (`constraints_json` IS NULL OR json_valid(`constraints_json`)),
  CHECK (`output_profile_rules_json` IS NULL OR json_valid(`output_profile_rules_json`))
);

CREATE TABLE IF NOT EXISTS `metadata_values` (
  `value_id` TEXT NOT NULL,
  `subject_kind` TEXT,
  `subject_id` TEXT,
  `property_id` TEXT,
  `ordinal` INTEGER,
  `language` TEXT,
  `value_json` TEXT,
  `source_evidence_id` TEXT,
  `source_version_sha256` TEXT,
  `publication_state` TEXT,
  PRIMARY KEY (`value_id`),
  UNIQUE (`subject_kind`,`subject_id`,`property_id`,`ordinal`,`source_version_sha256`),
  FOREIGN KEY (`property_id`) REFERENCES `property_definitions` (`property_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (`value_json` IS NULL OR json_valid(`value_json`)),
  CHECK (ordinal IS NULL OR ordinal>=0)
);

CREATE TABLE IF NOT EXISTS `page_sitemap_profiles` (
  `page_profile_id` TEXT NOT NULL,
  `page_id` TEXT,
  `priority` REAL,
  `change_frequency` TEXT,
  `source_evidence_id` TEXT,
  `source_version_sha256` TEXT,
  PRIMARY KEY (`page_profile_id`),
  UNIQUE (`page_id`),
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (priority IS NULL OR (priority>=0 AND priority<=1))
);

CREATE TABLE IF NOT EXISTS `image_sitemap_profiles` (
  `image_profile_id` TEXT NOT NULL,
  `media_use_id` TEXT,
  `rendition_id` TEXT,
  `source_evidence_id` TEXT,
  `source_version_sha256` TEXT,
  PRIMARY KEY (`image_profile_id`),
  UNIQUE (`media_use_id`,`rendition_id`),
  FOREIGN KEY (`media_use_id`) REFERENCES `media_uses` (`use_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`rendition_id`) REFERENCES `asset_renditions` (`rendition_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `video_sitemap_profiles` (
  `video_profile_id` TEXT NOT NULL,
  `media_use_id` TEXT,
  `thumbnail_rendition_id` TEXT,
  `title` TEXT,
  `description` TEXT,
  `content_rendition_id` TEXT,
  `player_url_id` TEXT,
  `duration_seconds` INTEGER,
  `expiration_value` TEXT,
  `rating` REAL,
  `view_count` INTEGER,
  `publication_value` TEXT,
  `family_friendly` TEXT,
  `restriction_relationship` TEXT,
  `restriction_country_codes_json` TEXT,
  `platform_relationship` TEXT,
  `platform_codes_json` TEXT,
  `requires_subscription` TEXT,
  `uploader_name` TEXT,
  `uploader_info_url_id` TEXT,
  `live` TEXT,
  `tags_json` TEXT,
  `source_evidence_id` TEXT,
  `source_version_sha256` TEXT,
  PRIMARY KEY (`video_profile_id`),
  UNIQUE (`media_use_id`),
  FOREIGN KEY (`media_use_id`) REFERENCES `media_uses` (`use_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`thumbnail_rendition_id`) REFERENCES `asset_renditions` (`rendition_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`content_rendition_id`) REFERENCES `asset_renditions` (`rendition_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`player_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`uploader_info_url_id`) REFERENCES `url_registry` (`url_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED,
  CHECK (`restriction_country_codes_json` IS NULL OR json_valid(`restriction_country_codes_json`)),
  CHECK (`platform_codes_json` IS NULL OR json_valid(`platform_codes_json`)),
  CHECK (`tags_json` IS NULL OR json_valid(`tags_json`)),
  CHECK (duration_seconds IS NULL OR (duration_seconds>=1 AND duration_seconds<=28800))
);

CREATE TABLE IF NOT EXISTS `news_publications` (
  `news_publication_id` TEXT NOT NULL,
  `name` TEXT,
  `language` TEXT,
  `source_evidence_id` TEXT,
  PRIMARY KEY (`news_publication_id`),
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `news_sitemap_profiles` (
  `news_profile_id` TEXT NOT NULL,
  `page_id` TEXT,
  `news_publication_id` TEXT,
  `article_title` TEXT,
  `original_publication_value` TEXT,
  `qualifies_as_news` INTEGER,
  `source_evidence_id` TEXT,
  `source_version_sha256` TEXT,
  PRIMARY KEY (`news_profile_id`),
  UNIQUE (`page_id`),
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`news_publication_id`) REFERENCES `news_publications` (`news_publication_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `translation_groups` (
  `translation_group_id` TEXT NOT NULL,
  `publisher_group_key` TEXT,
  `source_evidence_id` TEXT,
  `approval_state` TEXT,
  PRIMARY KEY (`translation_group_id`),
  UNIQUE (`publisher_group_key`),
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `translation_members` (
  `translation_member_id` TEXT NOT NULL,
  `translation_group_id` TEXT,
  `page_id` TEXT,
  `hreflang` TEXT,
  `source_evidence_id` TEXT,
  PRIMARY KEY (`translation_member_id`),
  UNIQUE (`translation_group_id`,`hreflang`),
  FOREIGN KEY (`translation_group_id`) REFERENCES `translation_groups` (`translation_group_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`page_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`source_evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `output_profiles` (
  `output_profile_id` TEXT NOT NULL,
  `profile_key` TEXT,
  `profile_version` TEXT,
  `index_root` TEXT,
  `page_root` TEXT,
  `alternate_rel` TEXT,
  `namespaces_json` TEXT,
  `allowed_fields_json` TEXT,
  `allowed_attributes_json` TEXT,
  `optional_field_policy_json` TEXT,
  `file_limits_json` TEXT,
  `schema_references_json` TEXT,
  `source_snapshot_sha256` TEXT,
  PRIMARY KEY (`output_profile_id`),
  UNIQUE (`profile_key`,`profile_version`),
  CHECK (`namespaces_json` IS NULL OR json_valid(`namespaces_json`)),
  CHECK (`allowed_fields_json` IS NULL OR json_valid(`allowed_fields_json`)),
  CHECK (`allowed_attributes_json` IS NULL OR json_valid(`allowed_attributes_json`)),
  CHECK (`optional_field_policy_json` IS NULL OR json_valid(`optional_field_policy_json`)),
  CHECK (`file_limits_json` IS NULL OR json_valid(`file_limits_json`)),
  CHECK (`schema_references_json` IS NULL OR json_valid(`schema_references_json`))
);

CREATE TABLE IF NOT EXISTS `claims` (
  `claim_id` TEXT NOT NULL,
  `subject_kind` TEXT,
  `subject_id` TEXT,
  `claim_text` TEXT,
  `claim_type` TEXT,
  `scope_json` TEXT,
  `source_version_sha256` TEXT,
  `approval_state` TEXT,
  `public_disclosure_state` TEXT,
  PRIMARY KEY (`claim_id`),
  CHECK (`scope_json` IS NULL OR json_valid(`scope_json`))
);

CREATE TABLE IF NOT EXISTS `claim_evidence` (
  `claim_evidence_id` TEXT NOT NULL,
  `claim_id` TEXT,
  `observation_id` TEXT,
  `relationship_kind` TEXT,
  `source_locator` TEXT,
  `review_id` TEXT,
  PRIMARY KEY (`claim_evidence_id`),
  UNIQUE (`claim_id`,`observation_id`,`relationship_kind`),
  FOREIGN KEY (`claim_id`) REFERENCES `claims` (`claim_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`observation_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`review_id`) REFERENCES `content_reviews` (`review_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `content_reviews` (
  `review_id` TEXT NOT NULL,
  `subject_kind` TEXT,
  `subject_id` TEXT,
  `agent_id` TEXT,
  `review_kind` TEXT,
  `reviewed_source_sha256` TEXT,
  `decision` TEXT,
  `reviewed_at` TEXT,
  `next_review_at` TEXT,
  `evidence_id` TEXT,
  PRIMARY KEY (`review_id`),
  FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS `subject_contributors` (
  `contributor_id` TEXT NOT NULL,
  `subject_kind` TEXT,
  `subject_id` TEXT,
  `agent_id` TEXT,
  `role` TEXT,
  `source_version_sha256` TEXT,
  `evidence_id` TEXT,
  PRIMARY KEY (`contributor_id`),
  UNIQUE (`subject_kind`,`subject_id`,`agent_id`,`role`,`source_version_sha256`),
  FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (`evidence_id`) REFERENCES `observations` (`observation_id`) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS `url_registry_q0` ON `url_registry` (host,is_current);

CREATE INDEX IF NOT EXISTS `pages_q0` ON `pages` (module_type,publication_status);

CREATE INDEX IF NOT EXISTS `eligibility_decisions_q0` ON `eligibility_decisions` (channel,decision);

CREATE INDEX IF NOT EXISTS `eligibility_decisions_q1` ON `eligibility_decisions` (subject_kind,subject_id);

CREATE INDEX IF NOT EXISTS `observations_q0` ON `observations` (subject_kind,subject_id);

CREATE INDEX IF NOT EXISTS `observations_q1` ON `observations` (source_version_sha256);

CREATE INDEX IF NOT EXISTS `metadata_values_q0` ON `metadata_values` (subject_kind,subject_id);

CREATE INDEX IF NOT EXISTS `media_uses_q0` ON `media_uses` (asset_id,page_id);

CREATE INDEX IF NOT EXISTS `links_q0` ON `links` (target_url_id,source_page_id);

CREATE INDEX IF NOT EXISTS `page_relations_q0` ON `page_relations` (target_page_id,source_page_id);

CREATE INDEX IF NOT EXISTS `asset_relations_q0` ON `asset_relations` (target_asset_id,source_asset_id);
