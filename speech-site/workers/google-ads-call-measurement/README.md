# Google Ads website-call measurement

The existing wrapper owns five selected Speech/Verify routes and one bootstrap path. Public Ask pages load the same source through AskLayout. Private Ask account, auth, search and API routes stay excluded.

The v3 implementation restores website-call measurement only after a separate advertising choice in the common footer. Global Privacy Control, refusal, expired consent and unavailable storage keep the helper off. Analytics permission is independent. Withdrawal restores the original display/dial targets, clears owned call-measurement cookies, and reloads to unload the helper; same-origin tabs receive withdrawal too. Ordinary calls work without permission.

Shared source: `src/lib/google-ads-call-consent.mjs`. `scripts/build-ad-call-bootstrap.mjs` generates the served bootstrap before bundling. The wrapper also serves the corrected Verify reader script on its three existing Verify routes; immutable historical asset URLs are retained. Both analytics implementations preserve independent choices and share one Google loader.

Build and tests: production Astro build, Ask build, `npm run test:unit`, `scripts/validate-ad-call-opt-in.mjs`, `scripts/validate-verify-call-consent.mjs`. See `RELEASE-WEBSITE-CALL-MEASUREMENT-20261006.md` for the actual release state and coverage.

Use current Cloudflare Worker version/binding/route read-back and a current rollback, then inactive version upload and explicit deployment. Do not use a historical wrapper or a narrowed route flag. The existing conversion action is AW-10810823199/VNUcCMSy3YobEJ-kgKMo, with visible source number9100 181181. A callback fixture is not proof of a real Google forwarding number or qualified call.

Google documents Phone Call Conversions as not yet supporting Consent Mode. The helper must remain gated, rather than relying on denied consent flags alone: https://developers.google.com/tag-platform/security/concepts/consent-mode
