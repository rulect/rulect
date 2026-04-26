import type { RulectApi } from "./preload";

declare global {
  interface Window {
    rulect: RulectApi;
  }
}

export {};
