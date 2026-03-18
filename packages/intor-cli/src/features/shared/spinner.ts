import ora from "ora";

export const spinner = ora({ isEnabled: process.stdout.isTTY });
