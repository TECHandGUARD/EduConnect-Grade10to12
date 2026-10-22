# GuardCommerce beta release gates

**Current state: NOT READY.** These are hard requirements, not completed features.

## Identity and tenancy
- [ ] Sign up, sign in, reset password, sign out
- [ ] Merchant creation and owner membership transaction tested
- [ ] Two-merchant cross-access tests pass on deployed database
- [ ] Server routes validate session and tenant membership
- [ ] Audit log for privileged changes

## Commerce
- [ ] Create, update, archive products and upload product images
- [ ] Published storefront per merchant
- [ ] Cart, server-side pricing, order placement and stock reservation
- [ ] Yoco sandbox checkout and verified webhook processing
- [ ] Duplicate webhook and failed payment tests
- [ ] Refund and cancellation process documented

## SaaS
- [ ] Merchant onboarding and subscription lifecycle
- [ ] Platform admin authorization
- [ ] Basic theme customization and merchant storefront settings
- [ ] Merchant domain/subdomain routing tested

## Reliability
- [ ] CI green, lint, build, unit tests and end-to-end smoke tests
- [ ] Backup and restore drill
- [ ] Monitoring and incident response
- [ ] Privacy and terms review
- [ ] Free-tier usage limits and upgrade plan
- [ ] Mobile/browser accessibility checks

Do not accept live payments or merchant data before the relevant gates pass.
