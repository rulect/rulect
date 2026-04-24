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

    async handleHotUpdate({ file }) {
      const isNativeChange = file.includes("src/rulect") || file.includes("src/platform");

      if (isNativeChange) {
        log.info(`Native change detected: ${path.basename(file)}`);
        log.info("Re-bundling native source...");
        await bootRulect();
        return [];
      }
      return;
    },

    configResolved(config) {
      store.set({
        rootDir: config.root,
        outDir: path.resolve(config.root, config.build.outDir),
      });
    },

    config(_, { command }) {
      // if (command === "serve") {
      //   return {
      //     optimizeDeps: {
      //       exclude: ["electron"],
      //     },
      //     build: {
      //       sourcemap: true,
      //       outDir: ".rulect",
      //       emptyOutDir: true,
      //     },
      //   };
      // }
    },

    async closeBundle() {
      stopRunningRulect();
      await bundleNative();
    },
  };
}
