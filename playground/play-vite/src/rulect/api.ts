import { contextBridge, ipcRenderer } from "electron";

const rulectApi = {
  minimize: () => ipcRenderer.send("win:minimize"),
  maximize: () => ipcRenderer.send("win:maximize"),
  close: () => ipcRenderer.send("win:close"),
  ping: () => ipcRenderer.invoke("ping"),
} as const;

export type RulectApi = typeof rulectApi;

contextBridge.exposeInMainWorld("rulect", rulectApi);
