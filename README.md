# Technical Test – API Integration

This project completes **Task 1 (API Integration)** based on the provided starter.

---

## What I did

- Replaced the manual API client with an **OpenAPI-based solution using Orval**
- Added a minimal **Swagger / OpenAPI spec** (`docs/api-spec.json`)
- Generated **type-safe API client + React Query hooks**
- Updated frontend logic:
   - `hooks/useApi.ts`
   - `pages/ApiDemo.tsx`
- Implemented full CRUD flow:
   - list / create / update / delete items
- Added **local mock backend using json-server** for testing

---

## Run mock API (json-server)

From project root（larevelaTask/）:

```bash
npx json-server@0.17.3 --watch db.json --routes routes.json --port 3000