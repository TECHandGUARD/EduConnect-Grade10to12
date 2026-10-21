# Commerce implementation status
- Public store route /store/[slug] implemented; reads only active products through storefront_catalogue RPC.
- Merchant dashboard can publish and unpublish draft products.
- Orders and order_items tables are private, read-only for merchant members, and have no browser write permissions.
- Cart, checkout, stock reservation, payment verification, shipping, subscriptions and refunds are **not implemented**.
- SQL migration 0003 must be applied on a separate GuardCommerce database before routes function.
- Security, builds and multi-user acceptance tests remain pending.
