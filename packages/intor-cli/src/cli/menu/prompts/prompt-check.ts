import type { CheckOptions } from "../../../features";
import { text, isCancel, confirm } from "@clack/prompts";
import {
  promptMode,
  promptDebug,
  printOptionsSummary,
  promptFormat,
  promptOutput,
} from "./shared/shared";

export async function promptCheck(): Promise<CheckOptions | null> {
  // ------------------------------------------------------------------
  // Mode
  // ------------------------------------------------------------------
  const mode = await promptMode();
  if (!mode) return null;
  if (mode === "default") return {};

  const options: CheckOptions = {};

  // ------------------------------------------------------------------
  // tsconfig path
  // ------------------------------------------------------------------
  const useCustomTsconfig = await confirm({
    message: "Do you want to use a custom tsconfig file?",
    initialValue: false,
  });
  if (isCancel(useCustomTsconfig)) return null;

  if (useCustomTsconfig) {
    const path = await text({
      message: "Path to tsconfig file",
      placeholder: "tsconfig.json",
      defaultValue: "tsconfig.json",
    });
    if (isCancel(path)) return null;
    if (path) options.tsconfigPath = path;
  }

  // ------------------------------------------------------------------
  // Output format
  // ------------------------------------------------------------------
  const format = await promptFormat();
  if (!format) return null;
  options.format = format;

  // ------------------------------------------------------------------
  // Output file (only for json)
  // ------------------------------------------------------------------
  if (format === "json") {
    const output = await promptOutput();
    if (output === null) return null;
    if (output) options.output = output;
  }

  // ------------------------------------------------------------------
  // Debug
  // ------------------------------------------------------------------
  const debug = await promptDebug();
  if (debug === null) return null;
  if (debug) options.debug = true;

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  printOptionsSummary("Check options", [
    ["tsconfig", options.tsconfigPath ?? "tsconfig.json"],
    ["format", options.format ?? "human"],
    ["output", options.output ?? "stdout"],
    ["debug", options.debug ? "on" : "off"],
  ]);

  return options;
}
