# lease-up-noles

This application will be a central hub to shop for off campus apartments for FSU/FAMU students in Tallahassee, FL! It will include key factors like price, availability, location, amenities, and more!

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS
- ESLint + Prettier

## Getting Started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server             |
| `npm run build`        | Production build                 |
| `npm run start`        | Serve the production build       |
| `npm run lint`         | Run ESLint                       |
| `npm run lint:fix`     | Run ESLint and auto-fix          |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |

## Folder Structure

```
src/
├── app/          # Routes, layouts, and pages (Next.js App Router)
├── components/   # Reusable UI components
├── lib/          # Utilities, data access, and helpers (e.g. Supabase client, distance calc)
└── types/        # Shared TypeScript types
public/           # Static assets served from the site root
```
