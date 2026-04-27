import { createRequire } from "module";
import path from "path";
import { type ChildProcess } from "node:child_process";
import type { PreviewServer, ViteDevServer } from "vite";
import defineStore from "./define-store";
import { getRulectDir, resolveRulectEntry } from "./utils";

export interface RulectState {
  rulectDir: string | null;
  rootDir: string;
  outDir: string;
  ///
  startPath: string;
  applicationFile: string;
  apiFile: string;
  env: Record<string, string>;
  devServer: ViteDevServer | PreviewServer | null;
  rulectProcess: ChildProcess | null;
  isBooting: boolean;
  isDev: boolean;
  test: () => void;
}
const rulectDir = getRulectDir();
if (!rulectDir) {
  throw new Error('Rulect could not find a "rulect" directory in the project root or "src/rulect".');
}
const require = createRequire(import.meta.url);
const startPath = require("electron") as unknown as string;
const rootDir = process.cwd();
const outDir = path.join(rootDir, "dist/rulect");
const applicationFile = resolveRulectEntry(rulectDir, "application");
const apiFile = resolveRulectEntry(rulectDir, "api");
const isDev = process.env.NODE_ENV === "development";

export const useRulectStore = defineStore<RulectState>({
  rulectDir,
  rootDir,
  outDir,
  ///
  startPath,
  applicationFile,
  apiFile,
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
