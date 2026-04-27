# @rulect/vite

Vite integration for Rulect.

This plugin bootstraps an Electron process when the Vite dev server or preview server is ready, bundles native Rulect sources, and restarts the Electron process when native source files change.

## Install

```bash
# npm
npm install --save-dev @rulect/vite electron

# pnpm
pnpm add -D @rulect/vite electron

# yarn
yarn add -D @rulect/vite electron
```

## Usage

```ts
import { defineConfig } from "vite";
import rulect from "@rulect/vite";

export default defineConfig({
  plugins: [rulect()],
});
```

## What it does

- Bundles your Electron main and preload scripts from `rulect/application.ts` or `rulect/application.js` and `rulect/api.ts` or `rulect/api.js`.
- Produces both ESM and CJS outputs for the native bundle targets.
- Starts Electron after Vite is ready.
- Restarts Electron automatically when native sources change.
- Detects the `rulect` directory at project root or under `src/rulect`.

  ```
  <project>
  ├── src
  │   ├── rulect
  │   │   ├── api.ts
  │   │   ├── application.ts
  │   │   ├── client.ts
  │   │   └── rulect.d.ts
  │   └── ...
  ├── .gitignore
  └── package.json
  ```


## Notes

- Requires `vite >= 7` and `electron >= 40`.
- Expects a `rulect` directory with `application` and `api` source files.
- Uses `esbuild` for native bundling and excludes Electron and built-in Node modules.
- Watches changes in native Rulect source files and reloads the Electron process accordingly.
