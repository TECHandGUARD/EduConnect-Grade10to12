# Tenant isolation test plan
Run on a disposable Supabase environment with two authenticated users A and B.

1. User A creates merchant A using create_merchant; user B creates merchant B.
2. Confirm each merchant has exactly one owner membership.
3. A inserts product with merchant A ID; B inserts product with merchant B ID.
4. A cannot SELECT, UPDATE or DELETE B's product.
5. B cannot SELECT, UPDATE or DELETE A's product.
6. A cannot add itself as a member of merchant B.
7. Unauthenticated users cannot list merchants, memberships or products.
8. Staff can only modify products in their own merchant; only owner/admin may delete.
9. Invalid slug and unauthenticated create_merchant calls are rejected.
10. Verify a merchant cannot update owner_id to transfer ownership.
11. Verify unauthorized user cannot call privileged helper functions to leak records.

No tests have been executed yet; this is a manual acceptance checklist.
