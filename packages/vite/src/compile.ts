import path from "node:path";
import { builtinModules } from "node:module";
import { build as viteBuild, type InlineConfig } from "vite";
import { useRulectStore } from "./state";

export async function bundleNative() {
  const store = useRulectStore();

  const isDev = store.get("isDev");
  const outDir = path.join(store.get("outDir"), "rulect");
  const external = ["electron", "sqlite3", "serialport", ...builtinModules];

  const buildConfig = (entry: string, format: "es" | "cjs", outFile: string): InlineConfig => ({
    root: store.get("rootDir"),
    configFile: false,
    logLevel: "error",
    publicDir: false,

    build: {
      ssr: entry,
      target: "node20",
      outDir,
      emptyOutDir: false,
      sourcemap: isDev,
      minify: !isDev,
      rollupOptions: {
        input: entry,
        external,
        output: {
          format,
          entryFileNames: outFile,
          exports: "auto",
        },
      },
    },
  });

  await Promise.all([
    viteBuild(buildConfig(store.get("applicationFile"), "es", "application.js")),
    viteBuild(buildConfig(store.get("applicationFile"), "cjs", "application.cjs")),
    viteBuild(buildConfig(store.get("apiFile"), "es", "api.js")),
    viteBuild(buildConfig(store.get("apiFile"), "cjs", "api.cjs")),
  ]);
}
