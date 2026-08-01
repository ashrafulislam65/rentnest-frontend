# API Integration Map

This document maps every frontend page/component to the backend endpoint(s) it consumes, as required by the assignment's mandatory API Integration & Documentation rule.

## Auth

| Frontend | Endpoint | Method |
|---|---|---|
| `app/(auth)/register/page.tsx` (`hooks/useAuth.ts` → `useRegister`) | `/auth/register` | POST |
| `app/(auth)/login/page.tsx` (`hooks/useAuth.ts` → `useLogin`) | `/auth/login` | POST |
| `hooks/useAuth.ts` → `useCurrentUser` (called in `RoleGuard`, hydrates Zustand store) | `/auth/me` | GET |

## Public Properties

| Frontend | Endpoint | Method |
|---|---|---|
| `app/page.tsx` (Home, featured properties) | `/properties` | GET |
| `app/properties/page.tsx` (browse + filters: location, minPrice, maxPrice, categoryId) | `/properties` | GET |
| `app/properties/[id]/page.tsx` | `/properties/:id` | GET |
| `app/properties/page.tsx`, `app/dashboard/landlord/properties/new/page.tsx` (category dropdown) | `/categories` | GET |

## Tenant / Rentals

| Frontend | Endpoint | Method |
|---|---|---|
| `app/properties/[id]/page.tsx` ("Request to Rent" CTA) → `hooks/useRentals.ts` → `useSubmitRentalRequest` | `/rentals` | POST |
| `app/dashboard/tenant/page.tsx` → `useTenantRentals` | `/rentals` | GET |
| `app/dashboard/tenant/requests/[id]/pay/page.tsx` → `useRental` (if needed) | `/rentals/:id` | GET |

## Payments (Stripe)

| Frontend | Endpoint | Method |
|---|---|---|
| `app/dashboard/tenant/requests/[id]/pay/page.tsx` → `useCreatePaymentIntent` | `/payments/create` | POST |
| `components/forms/StripeCheckoutForm.tsx` → `useConfirmPayment` (after `stripe.confirmCardPayment` succeeds) | `/payments/confirm` | POST |
| `app/dashboard/tenant/page.tsx` (payment history) → `useMyPayments` | `/payments` | GET |

## Reviews

| Frontend | Endpoint | Method |
|---|---|---|
| Tenant dashboard review form (post-`COMPLETED` rental) | `/reviews` | POST |
| Property details page (review list — to be added) | `/reviews/:propertyId` | GET |

## Landlord

| Frontend | Endpoint | Method |
|---|---|---|
| `app/dashboard/landlord/page.tsx` → `useLandlordProperties` | `/landlord/properties` | GET |
| `app/dashboard/landlord/properties/new/page.tsx` → `useCreateProperty` | `/landlord/properties` | POST |
| Property edit form (to be added) → `useUpdateProperty` | `/landlord/properties/:id` | PUT |
| Property delete action → `useDeleteProperty` | `/landlord/properties/:id` | DELETE |
| `app/dashboard/landlord/requests/page.tsx` → `useLandlordRequests` | `/landlord/requests` | GET |
| `app/dashboard/landlord/requests/page.tsx` (Approve/Reject buttons) → `useHandleRentalRequest` | `/landlord/requests/:id` | PATCH |

## Admin

| Frontend | Endpoint | Method |
|---|---|---|
| `app/dashboard/admin/users/page.tsx` → `useAdminUsers` | `/admin/users` | GET |
| `app/dashboard/admin/users/page.tsx` (Ban/Unban button) → `useToggleUserBan` | `/admin/users/:id/ban` | PATCH |
| `app/dashboard/admin/page.tsx` (moderation stat) → `useAdminProperties` | `/admin/properties` | GET |
| `app/dashboard/admin/page.tsx` (moderation stat) → `useAdminRentals` | `/admin/rentals` | GET |
| `app/dashboard/admin/categories/page.tsx` → `useCreateCategory` | `/admin/categories` | POST |
| `app/dashboard/admin/categories/page.tsx` (edit — to be added) | `/admin/categories/:id` | PUT |
| `app/dashboard/admin/categories/page.tsx` (Delete button) → `useDeleteCategory` | `/admin/categories/:id` | DELETE |

## Notes on gaps

- The backend has no dedicated "stats/overview" endpoint for landlord earnings or admin platform totals. `app/dashboard/landlord/page.tsx` and `app/dashboard/admin/page.tsx` derive these numbers client-side from the list endpoints above (`.length`, `.filter(...)`).
- `updateCategory` (`PUT /admin/categories/:id`) exists on the backend but isn't wired up in the current admin categories UI yet — only create/delete are implemented. Add an inline edit form if time permits.
- Property edit (`PUT /landlord/properties/:id`) and review listing (`GET /reviews/:propertyId`) hooks exist (`useUpdateProperty` in `hooks/useProperties.ts`) but aren't yet wired into a page — add an edit button/form on the landlord properties list.