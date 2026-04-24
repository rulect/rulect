type StoreUpdate<T extends object> = Partial<T> | ((state: T) => Partial<T>);

export interface Store<T extends object> {
  get: <K extends keyof T>(key: K) => T[K];
  set: (update: StoreUpdate<T>) => void;
  state: () => T;
  reset: () => void;
}

export default function defineStore<T extends object>(initialState: T) {
  let state = { ...initialState };

  return function useStore(): Store<T> {
    return {
      get(key) {
        return state[key];
      },

      set(update) {
        const next = typeof update === "function" ? update(state) : update;
        state = { ...state, ...next };
      },

      state() {
        return state;
      },

      reset() {
        state = { ...initialState };
      },
    };
  };
}
