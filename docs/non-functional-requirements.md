# Requirements Document v1: Non-Functional Requirements

**Project:** Lease Up Noles
**Increment:** 1

Non-functional requirements describe *how well* the app must work (speed, security, cost, reliability, usability), as opposed to *what* it does.

## 1. Usability / Mobile Responsiveness

| ID | Requirement | Verification |
|---|---|---|
| NFR-1 | The browse and listing detail pages shall be fully usable at a 375px screen width (iPhone SE) with no horizontal scrolling. | Tested in Safari Responsive Design Mode (#11). |
| NFR-2 | Layouts shall adapt to screen size: 1 listing column on phones, 2 on tablets, 3 on desktop. | Resize browser and confirm the column count changes. |
| NFR-3 | Interactive elements shall be sized for touch: each listing card is fully tappable and filter buttons are full-width on mobile. | Manual test at 375px. |

## 2. Security

| ID | Requirement | Verification |
|---|---|---|
| NFR-4 | Row-Level Security (RLS) shall be enabled on every table (`listings`, `profiles`, `reviews`). | Migration files / Supabase dashboard. |
| NFR-5 | Listings shall be publicly readable; only the server-side seed script (using the secret key) may create or modify them. | Read-only RLS policy on `listings`. |
| NFR-6 | User accounts shall be managed by Supabase Auth; the app shall never store passwords itself. | Sign up / log in flow (#7). |
| NFR-7 | Users may read only their own profile and shall not be able to change their own role (e.g., promote themselves to admin). | Profile RLS policy; no update policy exists. |
| NFR-8 | Secret keys shall never be committed to the repository; they are stored in `.env.local`, which is gitignored. | `.gitignore` check. |

## 3. Cost & Performance

| ID | Requirement | Verification |
|---|---|---|
| NFR-9 | The MVP shall run at $0/month: Supabase Free plan, Vercel free tier (deployment planned in #12), and no paid APIs (no Google Maps or paid geocoding). | Review plan/billing settings. |
| NFR-10 | Distance to campus shall be precomputed and stored per listing (Haversine formula) rather than looked up live, so distance filtering is instant and free. | `distance_miles` column; `distance.test.ts`. |
| NFR-11 | Filtering by price, bedrooms, and distance shall run in the database query, not in the browser. | Code review of `src/lib/listings.ts`. |

## 4. Reliability & Data Integrity

| ID | Requirement | Verification |
|---|---|---|
| NFR-12 | The app shall include ~20 realistic seed listings so it never demos empty (cold-start problem). | Run seed script; browse page shows 20 listings. |
| NFR-13 | The seed script shall be safe to re-run without creating duplicate listings. | Run twice; listing count stays the same. |
| NFR-14 | The database shall reject invalid data: no negative prices or bedroom counts, no blank names/addresses, ratings only 1–5. | `CHECK` constraints in schema. |

## 5. Code Quality

| ID | Requirement | Verification |
|---|---|---|
| NFR-15 | Code shall pass ESLint and Prettier checks, and core logic (distance calculation) shall have automated tests. | `npm run lint`, `npm run format:check`, `npm test`. |
