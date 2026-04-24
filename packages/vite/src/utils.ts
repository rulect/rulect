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
