from pathlib import Path
import shutil


root = Path(__file__).resolve().parents[1]
target = root.parent / "public-github-pinnacle-research-library-20260922" / "speech-site"
assert (target.parent / ".git").exists()

# This script publishes source and selected, non-sensitive release evidence only.
# Generated builds/release unions, Worker upload directories, raw upstream API test
# captures, credentials, secrets and caches must never enter the public source sync.
blocked_parts = {
    ".cache",
    ".git",
    ".wrangler",
    "__pycache__",
    "dist",
    "node_modules",
    "live-enrolment-upload-20260929",
    "visual-upload-worker-20260929",
}
blocked_file_prefixes = (
    ".env",
    "enrolment-api-test-",
)
blocked_directory_prefixes = (
    ".worker-upload-",
    "dryrun-worker-",
    "dryrun-production-config-",
    "dryrun-enrolment",
    "live-enrolment-upload-",
    "release-enrolment-live-",
    "release-enrolment-refine-",
    "visual-upload-worker-",
)
blocked_suffixes = {".key", ".p12", ".pem", ".pfx", ".secret"}
copied: list[str] = []


def assert_public_source(source: Path) -> None:
    relative = source.relative_to(root)
    assert not any(part in blocked_parts for part in relative.parts), relative
    assert not source.name.startswith(blocked_file_prefixes), relative
    assert not any(
        part.startswith(blocked_directory_prefixes) for part in relative.parts[:-1]
    ), relative
    assert source.suffix.lower() not in blocked_suffixes, relative


def copy_relative(relative: str) -> None:
    source = root / relative
    assert source.is_file(), f"Missing required public source artifact: {relative}"
    assert_public_source(source)
    destination = target / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    copied.append(relative)


# Keep the public repository directly buildable from a clean checkout.
for relative in (
    ".gitattributes",
    ".gitignore",
    "AGENTS.md",
    "astro.config.mjs",
    "package.json",
    "package-lock.json",
):
    copy_relative(relative)

# Dated Wrangler files pointed at generated directories that are intentionally not
# published. Keep only the reusable source-based production configuration.
for obsolete in (target / "deployment").glob("wrangler-enrolment-live-*.jsonc"):
    obsolete.unlink()

# An earlier release copied a root config whose entrypoint lived beside audit
# artefacts. The isolated upload builder below supersedes it and prevents Wrangler
# from discovering unrelated files as Worker modules.
obsolete_production_config = target / "deployment/wrangler.production.jsonc"
if obsolete_production_config.exists():
    obsolete_production_config.unlink()


allowed_photos = {
    "suchitra/interior-3.jpg",
    "gurunanak-road/interior-3.jpg",
    "jayanagar/exterior.jpg",
}

# Application source includes the live enrolment route, components, styles, public
# form client and narrative assets. The centre-photo limit prevents bulk media copies.
for folder in ("src", "public"):
    for path in (root / folder).rglob("*"):
        if not path.is_file():
            continue
        if path.name in {"hero-family.jpg", "hero-practice.jpg"}:
            continue
        if (
            "centres" in path.parts
            and path.relative_to(root / "src/assets/centres").as_posix()
            not in allowed_photos
        ):
            continue
        copy_relative(path.relative_to(root).as_posix())

# Generated endpoint replaces the previous manual duplicate; remove only those exact
# obsolete public-repository files.
for name in ("speech-service-information.json", "speech-service-information.txt"):
    obsolete = target / "public/pinnacle-pages-data" / name
    if obsolete.exists():
        obsolete.unlink()

script_files = (
    "test-enrolment.mjs",
    "prepare-release.mjs",
    "validate-production.mjs",
    "validate-sales.mjs",
    "validate-portal.mjs",
    "validate-evidence.mjs",
    "test-measurement.mjs",
    "test-speech-route.mjs",
    "test-discovery-handler.mjs",
    "test-release-20260928.mjs",
    "test-centre-release.mjs",
    "validate-machine-delivery.mjs",
    "validate-enrolment-story-20260929.mjs",
    "verify-enrolment-story-release-20260929.mjs",
    "validate-enrolment-live-20260929.mjs",
    "audit-enrolment-metadata.mjs",
    "clean-generated.mjs",
    "prepare-worker-upload.mjs",
    "verify-shared-release.mjs",
    "validate-shared-shell-live-20260929.mjs",
    "validate-navigation-release.mjs",
    "capture-header-menu-baseline.mjs",
    "validate-header-menu-release.mjs",
    "submit-indexnow.mjs",
    "validate-occupational-live.mjs",
    "validate-aba-live.mjs",
    "validate-special-education-build.mjs",
    "validate-special-education-live.mjs",
    "validate-special-education-responsive.cjs",
    "build-special-education-social-card.py",
    "validate-autism-build.mjs",
    "validate-autism-live.mjs",
    "validate-autism-w3c.mjs",
    "validate-autism-responsive.cjs",
    "build-autism-therapy-social-card.py",
    "sync-public-source-20260928.py",
)
for name in script_files:
    copy_relative(f"scripts/{name}")
shutil.copytree(
    root / "scripts/fixtures",
    target / "scripts/fixtures",
    dirs_exist_ok=True,
)

deployment_files = (
    "release-enrolment-20260928.json",
    "release-enrolment-story-20260929.json",
    "release-enrolment-visual-story-20260929.json",
    "postdeploy-enrolment-visual-20260929.json",
    "deployed-enrolment-visual-20260929.json",
    "enrolment-story-production-20260929.json",
    "enrolment-live-production-20260929.json",
    "release-enrolment-live-20260929.json",
    "release-enrolment-repair-20260929.json",
    "release-enrolment-preview-retirement-20260929.json",
    "release-enrolment-final-20260929.json",
    "indexnow-enrolment-20260929.json",
    "indexnow-enrolment-repair-20260929.json",
    "indexnow-header-clarity-20260929.json",
    "pinnacle-route-v12.mjs",
    "speech-handler.mjs",
    "speech-enquiry-handler.mjs",
    "centre-facilities.mjs",
    "enrolment-handler.mjs",
    "speech-inventory.json",
    "release.json",
    "release-measurement-20260928.json",
    "release-directory-20260928.json",
    "release-final-20260928.json",
    "release-visual-20260928.json",
    "enquiry-bundle-source.json",
    "production-before-20260928.json",
    "shared-shell-production-20260929.json",
    "release-shared-header-footer-20260929.json",
    "production-before-shared-footer-v101-20260929.json",
    "production-before-header-clarity-v102-20260929.json",
    "production-header-clarity-v102-20260929.json",
    "release-header-clarity-20260929.json",
    "production-before-navigation-v103-20260929.json",
    "production-navigation-v103-20260929.json",
    "release-navigation-system-20260929.json",
    "indexnow-navigation-v103-20260929.json",
    "production-before-header-menu-v104-20260929.json",
    "production-header-menu-v104-20260929.json",
    "release-header-menu-v104-20260929.json",
    "indexnow-header-menu-v104-20260929.json",
    "production-before-authority-copy-v105-20260929.json",
    "production-authority-copy-v105-20260929.json",
    "shared-shell-production-v105-20260929.json",
    "release-authority-copy-v105-20260929.json",
    "indexnow-authority-copy-v105-20260929.json",
    "production-before-exact-authority-copy-v106-20260929.json",
    "production-exact-authority-copy-v106-20260929.json",
    "shared-shell-production-v106-20260929.json",
    "release-exact-authority-copy-v106-20260929.json",
    "indexnow-exact-authority-copy-v106-20260929.json",
    "production-before-navigation-completion-v107-20260929.json",
    "production-navigation-completion-v107-20260929.json",
    "shared-shell-production-v107-20260929.json",
    "release-navigation-completion-v107-20260929.json",
    "indexnow-navigation-completion-v107-20260929.json",
    "production-before-payment-canonical-v108-20260929.json",
    "production-payment-canonical-v108-20260929.json",
    "shared-shell-production-v108-20260929.json",
    "release-payment-canonical-v108-20260929.json",
    "indexnow-payment-canonical-v108-20260929.json",
    "discovery-handler.mjs",
    "occupational-live-20260929.json",
    "indexnow-occupational-v112-20260929.json",
    "release-occupational-v112-20260929.json",
    "aba-live-20260929.json",
    "indexnow-aba-v113-20260929.json",
    "aba-routes-v113-20260929.json",
    "release-aba-v113-20260929.json",
    "special-education-build-20260929.json",
    "special-education-live-20260929.json",
    "special-education-responsive-v116-20260929.json",
    "special-education-routes-v114-20260929.json",
    "indexnow-special-education-v116-20260929.json",
    "shared-release-special-education-v116-20260929.json",
    "release-special-education-v116-20260929.json",
    "autism-therapy-build-20260929.json",
    "autism-therapy-live-20260929.json",
    "autism-therapy-routes-v117-20260929.json",
    "autism-therapy-responsive-live-20260929.json",
    "autism-therapy-w3c-20260929.json",
    "indexnow-autism-therapy-v117-20260929.json",
    "release-autism-therapy-v117-20260929.json",
)
for name in deployment_files:
    copy_relative(f"deployment/{name}")

review_files = (
    "ENROLMENT-VALIDATION-20260928.json",
    "ENROLMENT-W3C-20260928.json",
    "MEDIA-RELEASE-20260928.md",
    "IMAGE-PROMPTS-20260928.md",
    "W3C-RELEASE-20260928.json",
    "CENTRE-MEDIA-RELEASE-20260928.json",
    "LIGHTHOUSE-DIRECTORY-SUMMARY-20260928.json",
    "CLOUDFLARE-MACHINE-FINAL-20260928.json",
    "NAVIGATION-RESPONSIVE-20260929.json",
    "NAVIGATION-PRODUCTION-20260929.json",
    "HEADER-MENU-RESPONSIVE-20260929.json",
    "CENTRE-RELEASE-VALIDATION-20260928.json",
)
for name in review_files:
    copy_relative(f"reviews/{name}")

root_documents = (
    "PORTAL-CONTEXT-AND-BUILD-MODALITY.md",
    "PORTAL-PAGE-INVENTORY-20260929.md",
    "ACTIVE-PAGE-WORK-ORDER.md",
    "ASSET-SOURCES.md",
    "ENROLMENT-API-CONTRACT.md",
    "RELEASE-ENROLMENT-20260928.md",
    "RELEASE-ENROLMENT-STORY-20260929.md",
    "RELEASE-ENROLMENT-LIVE-20260929.md",
    "RELEASE-ENROLMENT-REPAIR-20260929.md",
    "RELEASE-ENROLMENT-PREVIEW-RETIREMENT-20260929.md",
    "RELEASE-ENROLMENT-FINAL-20260929.md",
    "README.md",
    "RELEASE-DIRECTORY-20260928.md",
    "RELEASE-MEASUREMENT-20260928.md",
    "RELEASE-SHARED-HEADER-FOOTER-20260929.md",
    "RELEASE-HEADER-CLARITY-20260929.md",
    "RELEASE-NAVIGATION-SYSTEM-20260929.md",
    "RELEASE-HEADER-MENU-V104-20260929.md",
    "RELEASE-AUTHORITY-COPY-V105-20260929.md",
    "RELEASE-EXACT-AUTHORITY-COPY-V106-20260929.md",
    "RELEASE-NAVIGATION-COMPLETION-V107-20260929.md",
    "RELEASE-PAYMENT-CANONICAL-V108-20260929.md",
    "RELEASE-OCCUPATIONAL-THERAPY-V112-20260929.md",
    "RELEASE-ABA-THERAPY-V113-20260929.md",
    "RELEASE-SPECIAL-EDUCATION-V116-20260929.md",
    "RELEASE-AUTISM-THERAPY-V117-20260929.md",
    "PORTAL-VALIDATION-20260927.json",
)
for name in root_documents:
    copy_relative(name)

# Defence in depth: this records what the script copied and refuses to finish if a
# future allowlist edit accidentally admits a raw response, secret, cache or build.
for relative in copied:
    assert_public_source(root / relative)

print(
    f"Copied {len(copied)} public source files, selected media and non-sensitive "
    "release receipts only"
)
