# GuardCommerce architecture (early implementation)
## Core approach
Modular monolith. Next.js frontend, Supabase PostgreSQL/Auth for initial merchant identity and tenant-scoped records. Commerce checkout and payments remain future work. A dedicated commerce engine will be evaluated before implementing orders and checkout.

## Trust boundaries
- Merchant-owned records include merchant_id and use PostgreSQL row-level security.
- Store creation is atomic via create_merchant RPC, preventing partial owner membership.
- No service-role credentials in browser bundles; no checkout success based solely on a browser redirect.
- Product prices are integer minor units (cents), never floating-point currency.
- Customer-facing product publication needs a restricted read-only API, not a public table policy.
- Payment providers require signed/verified webhooks, idempotency keys, and reconciliation.

## Required before production
1. Apply migrations to a dedicated Supabase project after review.
2. Validate RLS with at least two real test users and multiple merchants.
3. Add registration/session UI and server-side authorization.
4. Add product API and validation, then test merchant isolation.
5. Design orders, inventory reservations, refunds, shipping and billing.
6. Perform threat modelling, backup/restore testing and operational monitoring.

## Current state
Only SQL schema and UI scaffold committed. No connected database or production deployment. Do not onboard real merchants.
