import type { CheckOptions } from "../../features";
import { note } from "@clack/prompts";
import {
  debugOption,
  modeOption,
  formatOption,
  outputOption,
  tsconfigPathOption,
} from "./options";
import { formatSummary } from "./utils/format-summary";

/**
 * Prompt check options from the interactive menu.
 */
export async function checkPrompt(): Promise<CheckOptions> {
  const options: CheckOptions = {};

  // ------------------------------------------------------------------
  // Option: mode
  // ------------------------------------------------------------------
  const mode = await modeOption.prompt();
  if (mode === "default") return {};

  // ------------------------------------------------------------------
  // Option: tsconfigPath
  // ------------------------------------------------------------------
  const tsconfigPath = await tsconfigPathOption.prompt();
  if (tsconfigPath.trim()) options.tsconfigPath = tsconfigPath;

  // ------------------------------------------------------------------
  // Option: format
  // ------------------------------------------------------------------
  const format = await formatOption.prompt();
  options.format = format;

  // ------------------------------------------------------------------
  // Option: output (only when format is `json`)
  // ------------------------------------------------------------------
  if (format === "json") {
    const output = await outputOption.prompt();
    if (output.trim()) options.output = output;
  }

  // ------------------------------------------------------------------
  // Option: debug
  // ------------------------------------------------------------------
  const debug = await debugOption.prompt();
  options.debug = debug;

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  note(
    formatSummary([
      [...tsconfigPathOption.summary(options.tsconfigPath)],
      [...formatOption.summary(options.format)],
      [...outputOption.summary(options.output)],
      [...debugOption.summary(options.debug)],
    ]),
    "Check options",
  );

  return options;
}
