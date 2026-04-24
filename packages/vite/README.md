# @rulect/vite

Vite integration for Rulect.

It starts the Electron process when the Vite dev server or preview server is ready, bundles native files, and restarts Rulect when native sources change.

## Install

```bash
pnpm add -D electron @rulect/vite
```

## Usage

```ts
import { defineConfig } from "vite";
import rulect from "@rulect/vite";

export default defineConfig({
  plugins: [rulect()],
});
```

## Notes

- Requires `vite >= 7` and `electron >= 40`.
- Expects a `rulect` directory in your project root.
- Inside `rulect`, you should have `entry.js` or `entry.ts` for the main process.
- Inside `rulect`, you should have `preload.js` or `preload.ts` for the preload script.
- Watches native changes under `src/rulect` and `src/platform`.
