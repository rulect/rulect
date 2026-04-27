import type { RulectApi } from "./api";

declare global {
  interface Window {
    rulect: RulectApi;
  }
}

export {};
