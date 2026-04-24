import { createRequire } from "module";
import path from "path";
import { type ChildProcess } from "node:child_process";
import type { PreviewServer, ViteDevServer } from "vite";
import defineStore from "./define-store";
import { getRulectDir } from "./utils";

export interface RulectState {
  rulectDir: string | null;
  rootDir: string;
  outDir: string;
  ///
  startPath: string;
  entryFile: string;
  preloadFile: string;
  env: Record<string, string>;
  devServer: ViteDevServer | PreviewServer | null;
  rulectProcess: ChildProcess | null;
  isBooting: boolean;
  isDev: boolean;
  test: () => void;
}
const rulectDir = getRulectDir();
const require = createRequire(import.meta.url);
const startPath = require("electron") as unknown as string;
const rootDir = process.cwd();
const outDir = path.join(rootDir, "dist/rulect");
const entryFile = path.join(rulectDir!, "entry.ts");
const preloadFile = path.join(rulectDir!, "preload.ts");
const isDev = process.env.NODE_ENV === "development";

export const useRulectStore = defineStore<RulectState>({
  rulectDir,
  rootDir,
  outDir,
  ///
  startPath,
  entryFile,
  preloadFile,
  env: {},
  devServer: null,
  rulectProcess: null,
  isBooting: false,
  isDev,
  test() {
    console.log("ok");
  },
});

const rulectStore = useRulectStore();
