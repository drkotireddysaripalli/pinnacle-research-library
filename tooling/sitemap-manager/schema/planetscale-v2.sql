-- Reviewed schema. No DROP/ALTER/care-table changes.

-- Existing PlanetScale foreign_keys_enabled=false: importer/readback enforce references; no setting change.

CREATE TABLE IF NOT EXISTS `website_sm2_url_registry` (
  `url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `url` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `normalized_url_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `scheme` VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `host` VARCHAR(253) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `address_kind` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `first_seen_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `last_seen_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `is_current` BIGINT,
  PRIMARY KEY (`url_id`),
  UNIQUE KEY `u0` (`normalized_url_sha256`),
  KEY `q0` (`host`,`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_pages` (
  `page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_system` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_record_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `primary_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `canonical_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `module_type` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `language` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `title` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `description` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `topic_keywords_json` JSON,
  `publication_status` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `content_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `published_date_or_datetime` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `significant_modified_date_or_datetime` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `modified_date_precision` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `modified_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `metadata_json` JSON,
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `u0` (`source_system`,`source_record_key`,`language`),
  UNIQUE KEY `u1` (`primary_url_id`),
  KEY `r0` (`primary_url_id`),
  KEY `r1` (`canonical_url_id`),
  KEY `r2` (`modified_evidence_id`),
  KEY `q0` (`module_type`,`publication_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_assets` (
  `asset_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_system` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_asset_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `asset_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `name` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `description` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `language` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `publication_status` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `publisher_modified_date_or_datetime` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `rights_status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `credit_text` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `copyright_notice` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `license_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `acquire_license_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `descriptive_metadata_json` JSON,
  `original_publication_value` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `upload_value` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `publication_date_precision` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `u0` (`source_system`,`source_asset_key`),
  KEY `r0` (`license_url_id`),
  KEY `r1` (`acquire_license_url_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_asset_renditions` (
  `rendition_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `asset_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `rendition_kind` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `representation_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `declared_content_type` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `detected_media_type` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `width_px` BIGINT,
  `height_px` BIGINT,
  `duration_ms` BIGINT,
  `byte_size` BIGINT,
  `byte_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `transform_metadata_json` JSON,
  `first_seen_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `last_seen_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `bitrate_kbps` DOUBLE,
  `frame_rate` DOUBLE,
  `sampling_rate_khz` DOUBLE,
  `audio_channels` BIGINT,
  PRIMARY KEY (`rendition_id`),
  UNIQUE KEY `u0` (`asset_id`,`url_id`,`representation_key`),
  KEY `r0` (`asset_id`),
  KEY `r1` (`url_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_media_uses` (
  `use_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `asset_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `rendered_rendition_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `slot_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `role` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `alt_text` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `caption` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `context_text` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `public_question_or_example_key` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `page_content_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `publication_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `placement_identity_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `placement_basis` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`use_id`),
  UNIQUE KEY `u0` (`page_id`,`slot_key`,`page_content_version_sha256`),
  UNIQUE KEY `u1` (`placement_identity_sha256`),
  KEY `r0` (`page_id`),
  KEY `r1` (`asset_id`),
  KEY `r2` (`rendered_rendition_id`),
  KEY `r3` (`evidence_id`),
  KEY `q0` (`asset_id`,`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_links` (
  `link_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `target_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `slot_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `raw_href` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `target_fragment` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `anchor_text` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `rel_tokens_json` JSON,
  `element_kind` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `relationship_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `hreflang` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `page_content_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `publication_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`link_id`),
  UNIQUE KEY `u0` (`source_page_id`,`slot_key`,`page_content_version_sha256`),
  KEY `r0` (`source_page_id`),
  KEY `r1` (`target_url_id`),
  KEY `r2` (`evidence_id`),
  KEY `q0` (`target_url_id`,`source_page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_asset_relations` (
  `relation_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_asset_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `target_asset_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `relationship_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `publication_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`relation_id`),
  KEY `r0` (`source_asset_id`),
  KEY `r1` (`target_asset_id`),
  KEY `r2` (`evidence_id`),
  KEY `q0` (`target_asset_id`,`source_asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_page_relations` (
  `relation_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `target_page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `relationship_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `language_code` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `publication_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`relation_id`),
  KEY `r0` (`source_page_id`),
  KEY `r1` (`target_page_id`),
  KEY `r2` (`evidence_id`),
  KEY `q0` (`target_page_id`,`source_page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_agents` (
  `agent_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `agent_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `name` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `public_profile_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_identity_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`agent_id`),
  UNIQUE KEY `u0` (`source_identity_key`),
  KEY `r0` (`public_profile_url_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_asset_contributors` (
  `contribution_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `asset_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `agent_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `role` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`contribution_id`),
  UNIQUE KEY `u0` (`asset_id`,`agent_id`,`role`),
  KEY `r0` (`asset_id`),
  KEY `r1` (`agent_id`),
  KEY `r2` (`evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_source_imports` (
  `import_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `source_type` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_scope` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `input_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_observed_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `imported_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `expected_rows` BIGINT,
  `received_rows` BIGINT,
  `completeness_state` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `raw_artifact_reference` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`import_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_observations` (
  `observation_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `import_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `subject_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `subject_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `attribute_name` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `observed_value_json` JSON,
  `observed_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `value_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`observation_id`),
  KEY `r0` (`import_id`),
  KEY `q0` (`subject_kind`,`subject_id`),
  KEY `q1` (`source_version_sha256`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_eligibility_decisions` (
  `decision_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `subject_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `subject_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `channel` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `decision` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `reason_code` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `policy_version` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `decided_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `expires_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`decision_id`),
  KEY `r0` (`evidence_id`),
  KEY `q0` (`channel`,`decision`),
  KEY `q1` (`subject_kind`,`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_text_representations` (
  `representation_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `public_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `language` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `format` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_content_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `text_artifact_reference` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `text_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `approval_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `approved_source_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`representation_id`),
  KEY `r0` (`page_id`),
  KEY `r1` (`public_url_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_publication_runs` (
  `publication_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `input_manifest_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `policy_version` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `release_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `state` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `generated_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `validated_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `published_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `previous_accepted_publication_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `coverage_receipt_reference` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`publication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_sitemap_files` (
  `file_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `publication_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `host` VARCHAR(253) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `public_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `file_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `family` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `shard_key` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `byte_size` BIGINT,
  `uncompressed_size` BIGINT,
  `entry_count` BIGINT,
  `content_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `actual_file_modified_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `submission_and_fetch_receipt_reference` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`file_id`),
  UNIQUE KEY `u0` (`publication_id`,`host`,`public_url_id`),
  KEY `r0` (`publication_id`),
  KEY `r1` (`public_url_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_sitemap_memberships` (
  `membership_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `file_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `media_use_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `eligibility_decision_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`membership_id`),
  KEY `r0` (`file_id`),
  KEY `r1` (`page_id`),
  KEY `r2` (`media_use_id`),
  KEY `r3` (`eligibility_decision_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_property_definitions` (
  `property_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `standard_key` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `standard_snapshot_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `property_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `domain_types_json` JSON,
  `range_types_json` JSON,
  `datatype` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `cardinality` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `nested_shape_json` JSON,
  `constraints_json` JSON,
  `lifecycle_status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `output_profile_rules_json` JSON,
  `source_url` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`property_id`),
  UNIQUE KEY `u0` (`standard_key`,`standard_snapshot_sha256`,`property_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_metadata_values` (
  `value_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `subject_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `subject_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `property_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `ordinal` BIGINT,
  `language` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `value_json` JSON,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `publication_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`value_id`),
  UNIQUE KEY `u0` (`subject_kind`,`subject_id`,`property_id`,`ordinal`,`source_version_sha256`),
  KEY `r0` (`property_id`),
  KEY `r1` (`source_evidence_id`),
  KEY `q0` (`subject_kind`,`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_page_sitemap_profiles` (
  `page_profile_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `priority` DOUBLE,
  `change_frequency` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`page_profile_id`),
  UNIQUE KEY `u0` (`page_id`),
  KEY `r0` (`page_id`),
  KEY `r1` (`source_evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_image_sitemap_profiles` (
  `image_profile_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `media_use_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `rendition_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`image_profile_id`),
  UNIQUE KEY `u0` (`media_use_id`,`rendition_id`),
  KEY `r0` (`media_use_id`),
  KEY `r1` (`rendition_id`),
  KEY `r2` (`source_evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_video_sitemap_profiles` (
  `video_profile_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `media_use_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `thumbnail_rendition_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `title` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `description` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `content_rendition_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `player_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `duration_seconds` BIGINT,
  `expiration_value` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `rating` DOUBLE,
  `view_count` BIGINT,
  `publication_value` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `family_friendly` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `restriction_relationship` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `restriction_country_codes_json` JSON,
  `platform_relationship` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `platform_codes_json` JSON,
  `requires_subscription` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `uploader_name` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `uploader_info_url_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `live` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `tags_json` JSON,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`video_profile_id`),
  UNIQUE KEY `u0` (`media_use_id`),
  KEY `r0` (`media_use_id`),
  KEY `r1` (`thumbnail_rendition_id`),
  KEY `r2` (`content_rendition_id`),
  KEY `r3` (`player_url_id`),
  KEY `r4` (`uploader_info_url_id`),
  KEY `r5` (`source_evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_news_publications` (
  `news_publication_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `name` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `language` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`news_publication_id`),
  KEY `r0` (`source_evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_news_sitemap_profiles` (
  `news_profile_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `news_publication_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `article_title` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `original_publication_value` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `qualifies_as_news` BIGINT,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`news_profile_id`),
  UNIQUE KEY `u0` (`page_id`),
  KEY `r0` (`page_id`),
  KEY `r1` (`news_publication_id`),
  KEY `r2` (`source_evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_translation_groups` (
  `translation_group_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `publisher_group_key` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `approval_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`translation_group_id`),
  UNIQUE KEY `u0` (`publisher_group_key`),
  KEY `r0` (`source_evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_translation_members` (
  `translation_member_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `translation_group_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `page_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `hreflang` VARCHAR(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`translation_member_id`),
  UNIQUE KEY `u0` (`translation_group_id`,`hreflang`),
  KEY `r0` (`translation_group_id`),
  KEY `r1` (`page_id`),
  KEY `r2` (`source_evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_output_profiles` (
  `output_profile_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `profile_key` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `profile_version` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `index_root` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `page_root` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `alternate_rel` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `namespaces_json` JSON,
  `allowed_fields_json` JSON,
  `allowed_attributes_json` JSON,
  `optional_field_policy_json` JSON,
  `file_limits_json` JSON,
  `schema_references_json` JSON,
  `source_snapshot_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`output_profile_id`),
  UNIQUE KEY `u0` (`profile_key`,`profile_version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_claims` (
  `claim_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `subject_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `subject_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `claim_text` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `claim_type` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `scope_json` JSON,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `approval_state` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `public_disclosure_state` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`claim_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_claim_evidence` (
  `claim_evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `claim_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `observation_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `relationship_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_locator` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `review_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`claim_evidence_id`),
  UNIQUE KEY `u0` (`claim_id`,`observation_id`,`relationship_kind`),
  KEY `r0` (`claim_id`),
  KEY `r1` (`observation_id`),
  KEY `r2` (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_content_reviews` (
  `review_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `subject_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `subject_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `agent_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `review_kind` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `reviewed_source_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `decision` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `reviewed_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `next_review_at` VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`review_id`),
  KEY `r0` (`agent_id`),
  KEY `r1` (`evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS `website_sm2_subject_contributors` (
  `contributor_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `subject_kind` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `subject_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `agent_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `role` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `source_version_sha256` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  `evidence_id` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin,
  PRIMARY KEY (`contributor_id`),
  UNIQUE KEY `u0` (`subject_kind`,`subject_id`,`agent_id`,`role`,`source_version_sha256`),
  KEY `r0` (`agent_id`),
  KEY `r1` (`evidence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
