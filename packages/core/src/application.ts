import path from "node:path";
import { fileURLToPath } from "node:url";
import type { App, BrowserWindowConstructorOptions, OnHeadersReceivedListenerDetails, OpenDevToolsOptions, WebPreferences } from "electron";
import { app, BrowserWindow, screen, session } from "electron";
import { log } from "./logger";
import { isUrl } from "./utils";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultContentSecurityPolicy = {
  dev: `default-src * data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; connect-src *; img-src * data:;`,
  prod: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';`,
} as const;

export interface RulectContentSecurityPolicy {
  dev?: string;
  prod?: string;
}

export interface RulectLoadOptions {
  dev?: string;
  prod?: string;
}

export interface RulectOptions extends BrowserWindowConstructorOptions {
  load?: string | RulectLoadOptions;
  csp?: "defaults" | string | RulectContentSecurityPolicy;
}

export interface Rulect extends App {}

export class Rulect {
  public window: BrowserWindow | null = null;
  private readonly electronApp: App = app;
  private readonly defaultOptions: BrowserWindowConstructorOptions;
  private readonly userOptions: RulectOptions;

  constructor(options: RulectOptions = {}) {
    this.defaultOptions = {
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "api.cjs"),
        sandbox: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
    };
    this.userOptions = options;
    this.initLifecycle();

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        const value = Reflect.get(target.electronApp as object, prop, target.electronApp);
        return typeof value === "function" ? value.bind(target.electronApp) : value;
      },
    });
  }

  private initLifecycle() {
    this.electronApp.whenReady().then(() => {
      this.applyContentSecurityPolicy();

      if (!this.window) {
        void this.createWindow();
      }
    });

    this.electronApp.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        void this.createWindow();
      }
    });

    this.electronApp.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        this.electronApp.quit();
      }
    });
  }

  private applyContentSecurityPolicy() {
    const csp = this.resolveContentSecurityPolicy();
    if (!csp) {
      return;
    }

    session.defaultSession.webRequest.onHeadersReceived((details: OnHeadersReceivedListenerDetails, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [csp],
        },
      });
    });
  }

  public async createWindow(options: BrowserWindowConstructorOptions = {}) {
    await this.electronApp.whenReady();
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    this.window = new BrowserWindow({
      width: Math.round(width * 0.75),
      height: Math.round(height * 0.8),
      ...this.defaultOptions,
      ...this.userOptions,
      ...options,
    });
    this.window.once("closed", () => {
      this.window = null;
    });
    this.window.once("ready-to-show", () => {
      this.window?.show();
    });
    await this.loadWindow();
    return this.window;
  }

  public async loadURL(url: string) {
    if (!this.window) {
      await this.createWindow();
    }

    await this.window!.loadURL(url);
    return this.window!;
  }

  public async loadFile(filePath: string) {
    if (!this.window) {
      await this.createWindow();
    }

    await this.window!.loadFile(filePath);
    return this.window!;
  }

  public openDevTools(options?: OpenDevToolsOptions) {
    if (this.window) {
      this.window.webContents.openDevTools(options);
      return;
    }

    this.electronApp.whenReady().then(() => {
      this.window?.webContents.openDevTools(options);
    });
  }

  private async loadWindow() {
    if (!this.window) {
      return;
    }

    const load = this.resolveLoadTarget();

    try {
      if (load) {
        if (isUrl(load)) {
          await this.window.loadURL(load);
        } else {
          await this.window.loadFile(load);
        }
        return;
      }
    } catch (error) {
      log.error("Window load failed", error, "application");
      this.window.show();
    }
  }

  private resolveContentSecurityPolicy() {
    const { csp } = this.userOptions;
    if (!csp) {
      return null;
    }

    if (csp === "defaults") {
      return this.electronApp.isPackaged
        ? defaultContentSecurityPolicy.prod
        : defaultContentSecurityPolicy.dev;
    }

    if (typeof csp === "string") {
      return csp;
    }

    return this.electronApp.isPackaged ? csp.prod ?? null : csp.dev ?? csp.prod ?? null;
  }

  private resolveLoadTarget() {
    const { load } = this.userOptions;
    const devServer = process.env.DEV_SERVER ?? process.env.VITE_DEV_SERVER_URL;
    const prodFile = path.join(__dirname, "../index.html");

    if (!load) {
      return !this.electronApp.isPackaged && devServer ? devServer : prodFile;
    }

    if (typeof load === "string") {
      return load;
    }

    return this.electronApp.isPackaged
      ? load.prod ?? prodFile
      : load.dev ?? devServer ?? load.prod ?? prodFile;
  }
}

export default Rulect;
