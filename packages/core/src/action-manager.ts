/**
 *
 */
class ActionManager {
  private actions: Record<string, Function> = {};

  expose(name: string, callback: Function): void {
    if (this.actions[name]) {
      console.warn(`Rulect: Action "${name}" is being overwritten.`);
    }
    this.actions[name] = callback;
  }

  async handleInvoke(event: any, { actionName, args }: { actionName: string; args: any[] }) {
    const action = this.actions[actionName];

    if (!action) {
      throw new Error(`Rulect Action Error: "${actionName}" is not exposed.`);
    }

    try {
      return await action(...args);
    } catch (error) {
      console.error(`Error in action "${actionName}":`, error);
      throw error;
    }
  }

  getExposedNames(): string[] {
    return Object.keys(this.actions);
  }
}

export default ActionManager;
