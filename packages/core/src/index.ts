///
///
export { default, default as Rulect } from "./application";
export type { RulectContentSecurityPolicy, RulectLoadOptions, RulectOptions } from "./application";

export function useActions<T extends Record<string, (...args: any[]) => Promise<any>>>(): T {
  if (typeof window === "undefined" || !("__rulect_bridge" in window)) {
    return {} as T;
  }

  const bridge = (window as any).__rulect_bridge;

  return new Proxy({} as T, {
    get(_, actionName: string) {
      return (...args: any[]) => bridge.invoke(actionName, ...args);
    },
  });
}

