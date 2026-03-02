# Swagger / OpenAPI

1. Place your Swagger/OpenAPI spec here or reference its URL.
2. Suggested: generate a type-safe client, e.g.:
   - **openapi-typescript-codegen**: `npx openapi-typescript-codegen -i ./docs/api-spec.json -o ./src/api/generated`
   - **orval**: add orval config and run `npx orval` to generate client and React Query hooks from OpenAPI.
3. Replace the manual `src/api/client.ts` and `src/types/api.ts` with the generated code, and point your hooks in `src/hooks/useApi.ts` to the generated functions.

## Postman

- Import the provided Postman collection to verify endpoints (base URL, headers, body) before implementing.
- Use the same base URL in `.env` as in Postman (e.g. `VITE_API_BASE_URL`).
