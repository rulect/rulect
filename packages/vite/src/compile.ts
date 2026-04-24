import path from "node:path";
import { builtinModules } from "node:module";
import { build, type InlineConfig } from "vite";
import { useRulectStore } from "./state";

export async function bundleNative() {
  const store = useRulectStore();

  const nativeConfig: InlineConfig = {
    configFile: false,
    publicDir: false,
    logLevel: "error",
    build: {
      ssr: true,
      outDir: path.join(store.get("outDir"), "rulect"),
      target: "node20",
      minify: !store.get("isDev"),
      sourcemap: store.get("isDev"),
      emptyOutDir: true,
      lib: {
        entry: {
          entry: store.get("entryFile"),
          preload: store.get("preloadFile"),
        },
        formats: ["cjs", "es"],
      },
      rollupOptions: {
        platform: "node",
        external: ["electron", "sqlite3", "serialport", ...builtinModules],
        /* output: [
          {
            format: "cjs",
            entryFileNames: "[name].cjs",
            chunkFileNames: "chunks/[name]-[hash].cjs",
            assetFileNames: "assets/[name]-[hash][extname]",
          },
          {
            format: "es",
            entryFileNames: "[name].mjs",
            chunkFileNames: "chunks/[name]-[hash].mjs",
            assetFileNames: "assets/[name]-[hash][extname]",
          },
        ], */
      },
    },
    resolve: {
      conditions: ["node"],
    },
  };
  return await build(nativeConfig);
}
