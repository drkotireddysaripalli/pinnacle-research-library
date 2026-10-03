# Shared Auth access separation

Applied to lyjwsaiqvgwyautowhlx on 3 October 2026 through the official Supabase migration tool. Server-assigned migration version: 20261003074425. The matching SQL is checked in beside this note. No CLI-generated version was fabricated.

## Reason and scope

The existing authenticated notifications SELECT policy used true. New Ask Google accounts would therefore inherit IRWFA notification access. Before enabling Ask registration, preserve the six existing accounts in an internal entitlement table and make the one notification SELECT policy require either that entitlement or the existing admin predicate. No member details, application text or notification content were inspected.

The migration locks auth.users during its short transaction, requires the exact reviewed count/policy, seeds the six IDs internally, and fails on unexpected pre-existing objects. It never prints or hardcodes real account IDs. The internal table has RLS enabled, no client policies and no client table privileges. Its no-argument helper uses only auth.uid(), fully qualified names and a fixed empty search_path. It is executable by authenticated users only and returns one boolean.

## Verified

- All six existing accounts return true through the access helper.
- An authenticated synthetic claim with no entitlement returns false and sees zero notifications.
- Authenticated callers cannot SELECT the entitlement table or INSERT their own grant.
- No new auth user or MFA factor was created for these tests.
- Existing owner/admin rules on other IRWFA resources were left unchanged.
- Supabase advisor INFO rls_enabled_no_policy for this new private table is intentional default denial. It does not require adding a client policy. [Advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

## Future IRWFA onboarding

Existing users and current admins continue to see notifications. New IRWFA users must receive an entitlement from the trusted IRWFA onboarding process; Ask signup must never grant it. Validate the person's actual IRWFA enrolment before granting. Do not use client-editable user_metadata or a self-service Ask field. This task does not modify that separate application's onboarding code.

## Recovery

Prefer a forward correction to an entitlement if a genuine IRWFA user is missing. Do not restore USING(true) while any Ask accounts exist: that would recreate the original exposure. If full rollback is necessary, first stop new Ask registration and establish that no Ask-only accounts retain notification access; then a reviewed migration may restore the recorded original notifications read policy and remove the now-unused helper/table/schema. Never delete auth.users as part of rollback.

## Remaining activation

WATI/Supabase secrets stay in ignored local preparation files and Cloudflare server-side bindings. The Send SMS signing-secret creation is an owner browser action. Adding the Ask callback and enabling the hook/phone provider are still pending coordinated configuration and an owner-controlled verification test. Public Ask reading, citations and calls remain live without sign-in.
