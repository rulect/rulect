import type { RulectApi } from "./api";

export function getRulect(): RulectApi | undefined {
  return window.rulect;
}

export function assertRulect(): RulectApi {
  const rulect = getRulect();
  if (!rulect) {
    throw new Error("window.rulect is not available. Make sure the api script exposed it.");
  }
  return rulect;
}

export function useRulect(): RulectApi {
  return assertRulect();
}
