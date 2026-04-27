import { app, BrowserWindow, ipcMain, screen, session } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let DEV_SERVER: string | null;
let isDev: boolean;
let win: BrowserWindow | null;

const createWindow = () => {
  isDev = !app.isPackaged;
  DEV_SERVER = process.env.DEV_SERVER || null;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  win = new BrowserWindow({
    width: Math.round(width * 0.75),
    minWidth: Math.round(width * 0.55),
    height: Math.round(height * 0.8),
    minHeight: Math.round(height * 0.6),
    x: 5,
    y: 5,
    show: false,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "api.cjs"),
    },
  });

  win.once("ready-to-show", () => win?.show());
  win.on("closed", () => (win = null));

  if (isDev) {
    win.loadURL(DEV_SERVER!);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../index.html"));
  }
};

app.whenReady().then(() => {
  createWindow();
  ///
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const csp = isDev
    ? `default-src * data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; connect-src *; img-src * data:;`
    : `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';`;

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({ responseHeaders: { ...details.responseHeaders, "Content-Security-Policy": [csp] } });
  });

  /// debug
  const _debug = () => {
    console.log("Rulect Process ID:", process.pid);
    console.log("IPC status:", typeof process.send);
    /// ipc
    if (process.send) {
      console.log("Rulect: IPC connected");

      process.on("message", (message: any) => {
        console.log("msg:", message);
        // if (message == "RELOAD_APP") {
        //   app.relaunch();
        //   app.exit(0);
        // }
      });
    } else {
      console.error("Rulect: IPC channel not found! check stdio: 'ipc'");
    }
  };
  _debug();

  const IPCInıt = () => {
    ipcMain.on("win:minimize", () => win?.minimize());
    ipcMain.on("win:maximize", () => (win?.isMaximized() ? win.unmaximize() : win?.maximize()));
    ipcMain.on("win:close", () => win?.close());

    /// invoke
    ipcMain.handle("ping", () => {
      console.log("pong");
      return "pong";
    });
  };

  IPCInıt();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
