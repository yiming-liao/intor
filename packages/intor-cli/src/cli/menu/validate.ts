import type { ValidateOptions } from "../../features";
import { note } from "@clack/prompts";
import {
  modeOption,
  debugOption,
  readerOptionsOption,
  formatOption,
  outputOption,
} from "./options";
import { formatSummary } from "./utils/format-summary";

/**
 * Prompt validate options from the interactive menu.
 */
export async function validatePrompt(): Promise<ValidateOptions> {
  const options: ValidateOptions = {};

  // ------------------------------------------------------------------
  // Option: mode
  // ------------------------------------------------------------------
  const mode = await modeOption.prompt();
  if (mode === "default") return {};

  // ------------------------------------------------------------------
  // Option: ReaderOptions
  // ------------------------------------------------------------------
  const { exts, customReaders } = await readerOptionsOption.prompt();
  if (exts?.length) options.exts = exts;
  if (customReaders) options.customReaders = customReaders;

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
      [...readerOptionsOption.extsSummary(options.exts)],
      [...readerOptionsOption.customReadersSummary(options.customReaders)],
      [...formatOption.summary(options.format)],
      [...outputOption.summary(options.output)],
      [...debugOption.summary(options.debug)],
    ]),
    "Validate options",
  );

  return options;
}
