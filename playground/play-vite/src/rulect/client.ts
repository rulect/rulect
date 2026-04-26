import type { RulectApi } from "./preload";

export function getRulect(): RulectApi | undefined {
  return window.rulect;
}

export function assertRulect(): RulectApi {
  const rulect = getRulect();
  if (!rulect) {
    throw new Error("window.rulect is not available. Make sure the preload script exposed it.");
  }
  return rulect;
}

export function useRulect(): RulectApi {
  return assertRulect();
}
