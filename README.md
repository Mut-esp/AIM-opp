# AIM OPP

AIM OPP (AIM opportunities) is a local discovery prototype for Selangor opportunities, community programmes, spiritual activities, scholarships and legitimate short-term work, with a separate local shop directory. The home flow starts with a simple area form, then reveals matching opportunities; local businesses have their own sidebar section.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` runs the TypeScript build and production Vite build.

## Structure

- `src/types.ts` contains the domain models.
- `src/data/opportunities.ts` is the local sample repository, including job examples across all nine Selangor districts and shop examples with ratings, likes, prices and locations. Replace this module with an API adapter when verified listings are available.
- `src/utils/filterOpportunities.ts` owns filtering and sorting so UI components do not encode business rules.
- `src/styles/tokens.css` is the central theme layer for colors, surfaces, spacing, radii, shadows and motion.
- `src/styles/global.css` contains the reset, spatial primitives and responsive composition.

The interface uses layered surfaces intentionally: atmospheric canvas, workspace, floating controls, and the detail drawer. The presentation uses a 4:3 aspect ratio on desktop and becomes a readable stacked layout on mobile. Filters are intentionally hidden behind the Filters button and can be edited after discovery. Add new components by consuming the existing tokens and surface patterns instead of introducing hardcoded colors or shadows.

## Limitations and next steps

All records are clearly marked sample/demo data and use illustrative links. A production version should add a verified opportunity and business feed, moderation and expiry workflow, accurate geographic data, authentication, profile-based recommendations, recognition pathways for high-performing businesses, and a database. Saved paths currently use browser `localStorage` and remain device-local.
