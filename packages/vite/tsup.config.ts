import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const isDev = !!options.watch;
  return {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm", "cjs"],
    outDir: "dist",
    platform: "node",
    target: "node20",
    external: ["vite"],
    ///
    dts: {
      compilerOptions: {
        ignoreDeprecations: "6.0",
      },
    },
    splitting: false,
    shims: true,
    clean: true,
    //skipNodeModulesBundle: true,
    minify: !isDev,
    sourcemap: isDev,
    treeshake: true,
  };
});
