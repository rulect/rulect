import path from "node:path";
import { spawn } from "node:child_process";
import { log } from "./logger";
import { useRulectStore } from "./state";

const store = useRulectStore();

export const stopRulect = () => {
  const rulectProcess = store.get("rulectProcess");

  if (rulectProcess && !rulectProcess.killed) {
    rulectProcess.kill("SIGTERM");

    setTimeout(() => {
      if (!rulectProcess.killed) {
        rulectProcess.kill("SIGKILL");
      }
    }, 350);
  }
};

export async function spawnRulect() {
  stopRulect();
  const devServer = store.get("devServer");

  const env = {
    ...process.env,
    DEV_SERVER: devServer?.resolvedUrls?.local?.[0],
    ///
    ELECTRON_DISABLE_SECURITY_WARNINGS: "true",
    ELECTRON_USER_DATA_DIR: path.join(store.get("outDir"), "rulect", "tmp"),
    ELECTRON_NO_ASAR: "1",
  };

  const entryPath = path.join(store.get("outDir"), "rulect/entry.js");
  const rulectProcess = spawn(store.get("startPath"), [entryPath], {
    env,
    stdio: ["inherit", "inherit", "inherit", "ipc"],
    shell: false,
    windowsHide: false,
    detached: false,
    cwd: store.get("rootDir"),
  });
  log.info(`New Rulect process started (PID: ${rulectProcess.pid})`);
  store.set({ rulectProcess });
  rulectProcess.send("TEST_MSG");

  return rulectProcess;
}
