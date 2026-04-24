import chalk from "chalk";

const getTimestamp = () => chalk.dim(new Date().toLocaleTimeString());
const label = chalk.cyan("[rulect]");

export const log = {
  info: (message: string, context = "native") => {
    console.log(`${getTimestamp()} ${label} ${chalk.dim(`(${context})`)} ${message}`);
  },

  success: (message: string, context = "native") => {
    console.log(`${getTimestamp()} ${label} ${chalk.dim(`(${context})`)} ${chalk.green(message)}`);
  },

  warn: (message: string, context = "native") => {
    console.log(`${getTimestamp()} ${label} ${chalk.dim(`(${context})`)} ${chalk.yellow(message)}`);
  },

  error: (message: string, error?: unknown, context = "native") => {
    console.log(`${getTimestamp()} ${label} ${chalk.dim(`(${context})`)} ${chalk.red(message)}`);
    if (error) {
      console.error(chalk.red(error instanceof Error ? error.stack : String(error)));
    }
  },

  divider: () => {
    console.log(chalk.dim("--------------------------------------------------"));
  },
};
