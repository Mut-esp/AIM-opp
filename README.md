# Pathway Explorer

Pathway Explorer is a Malaysia-focused discovery prototype for opportunities, community programmes, spiritual activities, scholarships, workshops and legitimate short-term work.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` runs the TypeScript build and production Vite build.

## Structure

- `src/types.ts` contains the domain models.
- `src/data/opportunities.ts` is the local sample repository. Replace this module with an API adapter when verified listings are available.
- `src/utils/filterOpportunities.ts` owns filtering and sorting so UI components do not encode business rules.
- `src/styles/tokens.css` is the central theme layer for colors, surfaces, spacing, radii, shadows and motion.
- `src/styles/global.css` contains the reset, spatial primitives and responsive composition.

The interface uses layered surfaces intentionally: atmospheric canvas, workspace, floating controls, and the detail drawer. Add new components by consuming the existing tokens and surface patterns instead of introducing hardcoded colors or shadows.

## Limitations and next steps

All records are clearly marked sample/demo data and use illustrative links. A production version should add a verified opportunity feed, moderation and expiry workflow, accurate geographic data, authentication, profile-based recommendations, and a database. Saved paths currently use browser `localStorage` and remain device-local.
