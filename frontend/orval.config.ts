import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: '../docs/api-spec.json',
        output: {
            target: './src/api/generated/endpoints.ts',
            schemas: './src/api/generated/model',
            client: 'react-query',
            httpClient: 'axios',
            mode: 'split',
            override: {
                mutator: {
                    path: './src/api/mutator/custom-instance.ts',
                    name: 'customInstance',
                },
            },
        },
    },
});