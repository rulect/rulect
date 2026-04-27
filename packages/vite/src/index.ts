import path from "node:path";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";
import { bundleNative } from "./compile";
import { spawnRulect, stopRulect } from "./runtime";
import { log } from "./logger";
import { useRulectStore } from "./state";

export default function rulectPlugin(): Plugin {
  const store = useRulectStore();

  const stopRunningRulect = () => {
    if (store.get("rulectProcess")) {
      stopRulect();
      store.set({ rulectProcess: null });
    }
  };

  const bootRulect = async () => {
    try {
      await bundleNative();
      await spawnRulect();
      log.success("Native process synchronized and restarted");
    } catch (error) {
      log.error("Failed to boot Rulect process", error);
    }
  };

  const attachServerLifecycle = (server: ViteDevServer | PreviewServer, mode: "dev" | "preview") => {
    server.httpServer?.once("listening", () => {
      store.set({ devServer: server });

      const localUrl = server.resolvedUrls?.local?.[0];
      const address = server.httpServer?.address();
      const port = typeof address === "string" ? address : address?.port;

      log.divider();
      log.info(
        mode === "preview"
          ? `Vite preview active at ${localUrl ?? `http://localhost:${port}`}`
          : `Vite server active at ${localUrl ?? `http://localhost:${port}`}`,
      );
      log.info("Launching Electron application...");
      log.divider();
      void bootRulect();
    });

    server.httpServer?.on("close", () => {
      stopRunningRulect();
    });
  };

  return {
    name: "vite-plugin-rulect",
    configureServer(server) {
      attachServerLifecycle(server, "dev");
    },

    configurePreviewServer(server) {
      attachServerLifecycle(server, "preview");
    },

    /**
     * @see https://vite.dev/guide/api-plugin#handlehotupdate
     */
    async handleHotUpdate({ file, server }) {
      const rootDir = server.config.root;
      const relativePath = path.relative(rootDir, file);
      const isNativeChange = relativePath.startsWith(`rulect${path.sep}`) || relativePath.startsWith(`src${path.sep}rulect${path.sep}`);
      /// debug
      /// console.log({ file, rootDir, relativePath, isNativeChange });

      if (isNativeChange) {
        log.info(`Re-bundling ${path.basename(file)}`);
        await bootRulect();
        return [];
      }
      return;
    },

    configResolved(config) {
      store.set({
        rootDir: config.root,
        outDir: config.build.outDir,
      });
    },

    config(config, { command }) {
      config.base = config.base || "./";
      if (command === "build") {
        /// ..
      }
    },

    async writeBundle(server) {
      log.info("Bundling native process...");
      try {
        await bundleNative();
        log.success(`Native process bundled to ${store.get("outDir")}/rulect`);
      } catch (e) {
        log.error("Native bundle failed!");
      }
    },

    async closeBundle() {
      stopRunningRulect();
    },
  };
}
