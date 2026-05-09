import { invokeRulectAction } from "./client";

export interface RulectApi {
  invoke: typeof invokeRulectAction;
}

export function useRulectApi(): RulectApi {
  return {
    invoke: invokeRulectAction,
  };
}
