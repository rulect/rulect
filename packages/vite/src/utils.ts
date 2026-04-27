import { existsSync } from "node:fs";
import { join } from "node:path";

export const getRulectDir = () => {
  const root = process.cwd();
  const candidates = [root, join(root, "src")];

  for (const candidate of candidates) {
    const rulectPath = join(candidate, "rulect");
    if (existsSync(rulectPath)) {
      return rulectPath;
    }
  }

  return null;
};

export const resolveRulectEntry = (rulectDir: string, name: string) => {
  const candidates = [join(rulectDir, `${name}.ts`), join(rulectDir, `${name}.js`)];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Rulect could not find "${name}.ts" or "${name}.js" in ${rulectDir}.`);
};
