# RentNest Frontend

A Next.js (App Router) frontend for the RentNest rental marketplace — Tenant, Landlord, and Admin roles, Stripe payments, and full CRUD flows.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Shadcn-style components
- TanStack Query for server state
- Zustand for auth state
- React Hook Form + Zod for validation
- Stripe (`@stripe/react-stripe-js`) for payments
- Sonner for toast notifications

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the RentNest backend API, e.g. `http://localhost:5000/api` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test mode) |

## Project Structure

See `API_INTEGRATION.md` for the full endpoint-to-component mapping.