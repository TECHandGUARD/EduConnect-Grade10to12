# GuardCommerce — Tech & Guard

Multi-merchant ecommerce SaaS, built separately from SmartBridge FET and the Tech & Guard corporate website.

## Current development status (alpha)
The `feature/guardcommerce-foundation` branch contains a Next.js 15/React 19 frontend, Supabase email/password authentication, merchant creation and store selection, draft product creation, publishing/unpublishing, inventory counts and public read-only storefronts. The intended tenant protection is Supabase row-level security; **verify the actual migrations and policies in the target Supabase project before inviting merchants**.

**Not a commercial beta yet.** There is no shopping cart, server-validated checkout, order lifecycle, Yoco webhook verification, merchant subscription billing, product image upload, custom domains, or proven production deployment. Do not accept real orders or money through this alpha.

## Local development
Requires Node.js 20+.

```bash
npm install
npm run dev
npm run lint
npm run build
```

Create `.env.local` with public browser-safe credentials from a **dedicated GuardCommerce Supabase project**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Never expose Supabase service-role keys, Yoco secret keys or webhook secrets in `NEXT_PUBLIC_*` variables, client components, Git history or screenshots.

## Beta release gates
1. Apply and audit migrations and RLS: users can only edit stores/products they own; anonymous users can only read published storefront catalogue data.
2. Add server-authoritative cart/checkout, transactional stock reservation and order records; reject tampered prices and quantities.
3. Implement Yoco checkout server-side, verify signed webhooks, make webhook processing idempotent, and only mark paid orders after trusted verification.
4. Add refunds/cancellations, payment failure handling, audit logs and operational monitoring.
5. Implement merchant billing and entitlement enforcement; add store images and mobile purchase flows.
6. Test authentication, cross-tenant isolation, checkout edge cases, mobile UX, and production build; configure deployment secrets and perform a staging end-to-end purchase before production release.

## Repository safety
Work only in this GuardCommerce repository and its feature branch. Preserve `backup/educonnect-before-guardcommerce`. Do not modify SmartBridge FET or the separate Tech & Guard website.
