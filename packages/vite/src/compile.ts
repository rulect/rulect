import path from "node:path";
import { builtinModules } from "node:module";
import { build as esbuild, type BuildOptions } from "esbuild";
import { useRulectStore } from "./state";

export async function bundleNative() {
  const store = useRulectStore();

  const isDev = store.get("isDev");
  const outDir = path.join(store.get("outDir"), "rulect");
  ///
  const external = ["electron", "sqlite3", "serialport", ...builtinModules];
  const commonOptions: BuildOptions = {
    bundle: true,
    platform: "node",
    target: "node20",
    external,
    sourcemap: isDev,
    minify: !isDev,
  };

  await Promise.all([
    esbuild({
      ...commonOptions,
      entryPoints: [store.get("entryFile")],
      format: "esm",
      outfile: path.join(outDir, "entry.js"),
    }),
    esbuild({
      ...commonOptions,
      entryPoints: [store.get("entryFile")],
      format: "cjs",
      outfile: path.join(outDir, "entry.cjs"),
    }),
    esbuild({
      ...commonOptions,
      entryPoints: [store.get("preloadFile")],
      format: "esm",
      outfile: path.join(outDir, "preload.js"),
    }),
    esbuild({
      ...commonOptions,
      entryPoints: [store.get("preloadFile")],
      format: "cjs",
      outfile: path.join(outDir, "preload.cjs"),
    }),
  ]);
}
