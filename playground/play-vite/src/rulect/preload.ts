import { contextBridge, ipcRenderer } from "electron";

/**
 * Invokes a Rulect action in the main process.
 * @param actionName The name of the action to invoke.
 * @param args The arguments to pass to the action.
 * @returns A promise that resolves with the result of the action.
 */
const invokeRulectAction = (actionName: string, ...args: any[]): Promise<any> => {
  return ipcRenderer.invoke("rulect-action-invoke", { actionName, args });
};

/**
 * Exposes a global API to the renderer process for invoking Rulect actions.
 * The `invoke` function can be accessed via `window.rulect.invoke`.
 */
contextBridge.exposeInMainWorld("rulect", {
  invoke: invokeRulectAction,
});
