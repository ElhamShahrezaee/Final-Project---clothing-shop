# Clothing Shop (React + TypeScript + Vite)

A luxury-style clothing e-commerce app (customer storefront + admin panel), built with React and TypeScript.

- **Default UI language**: Persian (FA), switchable to English (EN)
- **Goals**: Clear folder structure, clean code, incremental delivery (each feature as its own commit/push when applicable)

## Prerequisites

- Node.js (LTS recommended)
- [pnpm](https://pnpm.io/)

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm lint
pnpm build
pnpm preview
```

## Project layout

- `src/pages/`: route-level pages (Home, Products, Cart, Admin, …)
- `src/components/`: reusable UI (common, layouts, product, …)
- `src/routes/`: application routing
- `src/i18n/`: i18n configuration and translation resources

## Component structure map

The component architecture diagram lives in `docs/component-map.md` (when present).
