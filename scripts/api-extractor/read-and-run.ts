import fs from "node:fs";
import path from "node:path";
import { run } from "../run";

interface Options {
  local: boolean;
}

export function readAndRun({ local }: Options) {
  const configsDir = path.resolve("api-extractor/configs");

  const entries = fs
    .readdirSync(configsDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  if (entries.length === 0) {
    console.warn("No api-extractor configs found.");
    return;
  }

  for (const file of entries) {
    const configPath = path.resolve(configsDir, file);
    run(`api-extractor run -c "${configPath}"${local ? " --local" : ""}`);
  }
}
