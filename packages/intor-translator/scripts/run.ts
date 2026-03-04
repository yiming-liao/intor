import { execSync } from "node:child_process";

const gray = (text: string) => `\u001B[90m${text}\u001B[0m`;

const divider = (char = "─") => {
  const width = process.stdout.columns ?? 80;
  console.log("\n" + gray(char.repeat(width)));
};

export const run = (cmd: string) => {
  console.log("\n" + gray("› ") + `${cmd}`);
  execSync(cmd, { stdio: "inherit" });
  divider();
};
