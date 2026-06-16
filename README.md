# PlantUML Live Editor

Browser-based PlantUML live editor with offline rendering, Monaco code intelligence, PNG export, and Firebase Hosting.

## Features

- Live PlantUML preview with debounced rendering (~400ms)
- Monaco editor with syntax highlighting and completions
- PNG export at custom dimensions (16–8192 px)
- Session-only state (no persistence)
- Firebase Analytics (production only)

## Development

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm test         # unit tests
pnpm test:coverage
pnpm build
pnpm exec playwright test
```

## Rendering

Diagram rendering uses [CheerpJ](https://leaningtech.com/cheerpj/) with [plantuml-core](https://github.com/plantuml/plantuml-core) (in-browser, no server). JAR assets are downloaded to `public/plantuml-core/` on `pnpm install` and `pnpm build`. The CheerpJ loader is fetched from Leaning Technologies CDN at runtime. First render may take several seconds while the engine initializes.

Live preview renders SVG on the main thread via `src/plantuml/engine.ts`. PNG export uses a Web Worker stub in `src/workers/plantuml.worker.ts`.

## Firebase

Set `VITE_FIREBASE_*` env vars for Analytics. Deploy with:

```bash
pnpm build && firebase deploy --only hosting
```
