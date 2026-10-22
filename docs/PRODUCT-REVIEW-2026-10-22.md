# GuardCommerce — strict product review (22 October 2026)

Scope: source review of package.json, README.md, src/app/page.tsx, src/app/layout.tsx and src/app/style.css. No running production deployment or visual device test was verified. Scores below are preliminary, not comprehensive test results.

## Release verdict: NOT READY FOR CUSTOMERS OR PAYMENTS
- Critical: No server-authoritative cart, checkout, order lifecycle, verified Yoco payment webhooks or stock reservation. Do not accept live transactions.
- Critical: Supabase tenant isolation and RLS policies must be verified against the actual deployed database. Cross-merchant access must be tested.
- Critical: No demonstrated production deployment, monitoring, backups, disaster recovery, or successful end-to-end staging purchase.
- High: No Android/iOS projects, mobile builds, app-store privacy disclosures or account-deletion verification.
- High: No merchant billing, entitlements, refunds, customer support workflow or image uploads.
- Medium: Landing page promises orders/customer management before they exist; early-preview caveat appears only in small copy. Replace aspirational claims with clearly labeled roadmap.
- Medium: UI uses generic Arial, limited typography hierarchy, basic three-card layout, and minimal visual identity. Premium quality needs a cohesive design system, accessibility, and device testing.

## Design direction
Quiet luxury rather than visual excess: warm off-white canvas, near-black typography, restrained emerald accents, generous whitespace, precise spacing scale, accessible contrast, polished loading/empty/error states, consistent focus rings, refined product photography when genuine images exist. Do not fabricate customer testimonials, transactions, reviews or sales metrics.

## Ordered engineering acceptance gates
1. Inventory and product pricing owned by server; SQL constraints, atomic stock reservation, tenant-safe RLS.
2. Persistent cart, order state machine, authenticated checkout, verified and idempotent Yoco webhooks.
3. Refunds, reconciliation, audit trail, alerting, rate limits, backups and recovery drill.
4. Shared API contracts for web and Expo Android/iOS merchant and customer experiences; test both roles on physical devices.
5. Merchant billing and policy-compliant payment routing for physical versus digital purchases.
6. Accessibility and responsive design audit; keyboard, screen reader, touch target and performance checks.
7. Staging transactions, security regression tests, release builds, store metadata and review submissions.

Never change SmartBridge FET or the separate Tech & Guard corporate site. Preserve the EduConnect backup branch.
