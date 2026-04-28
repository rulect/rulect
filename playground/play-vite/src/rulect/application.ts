import { ipcMain } from "electron";
import Rulect from "@rulect/core";

const app = new Rulect({
  csp: "defaults",
  x: 5,
  y: 5,
});

const isDev = !app.isPackaged;

app.whenReady().then(() => {
  ipcMain.on("win:minimize", () => app.window?.minimize());
  ipcMain.on("win:maximize", () => {
    const win = app.window;
    if (!win) {
      return;
    }

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("win:close", () => app.window?.close());
  ipcMain.handle("ping", () => "pong");

  if (isDev) {
    app.openDevTools();
  }
});
