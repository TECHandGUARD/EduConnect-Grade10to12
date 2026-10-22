# GuardCommerce auth and data setup

1. Create a separate Supabase project for GuardCommerce. Do not reuse SmartBridge FET.
2. Apply migrations 0001_core.sql and 0002_security_hardening.sql in order.
3. Configure email confirmation and allowed redirect URLs in Supabase Auth.
4. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment.
5. Run npm install, npm run lint and npm run build.
6. Test two unrelated users in separate browser sessions, each with a different merchant.
7. Confirm tenant isolation before real users or products are stored.

This early-alpha interface only supports account sign-up/sign-in, merchant creation and draft product entry. It does not implement orders, storefronts, payments, customer management, production-grade authorization tests or beta release readiness.
