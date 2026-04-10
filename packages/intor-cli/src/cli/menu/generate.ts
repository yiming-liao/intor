import type { GenerateOptions } from "../../features";
import { note } from "@clack/prompts";
import { discoverConfigs } from "../../core";
import {
  debugOption,
  modeOption,
  readerOptionsOption,
  messageSourceOption,
} from "./options";
import { formatSummary } from "./utils/format-summary";

/**
 * Prompt generate options from the interactive menu.
 */
export async function generatePrompt(): Promise<GenerateOptions> {
  const options: GenerateOptions = {};

  // Discover configs first (for prompt decisions)
  const configEntries = await discoverConfigs();
  if (configEntries.length === 0) throw new Error("No Intor config found.");

  // ------------------------------------------------------------------
  // Option: mode
  // ------------------------------------------------------------------
  const mode = await modeOption.prompt();
  if (mode === "default") return {};

  // ------------------------------------------------------------------
  // Option: messageSource
  // ------------------------------------------------------------------
  const messageSource = await messageSourceOption.prompt(configEntries);
  options.messageSource = messageSource;

  // ------------------------------------------------------------------
  // Option: ReaderOptions
  // ------------------------------------------------------------------
  const { exts, customReaders } = await readerOptionsOption.prompt();
  if (exts?.length) options.exts = exts;
  if (customReaders) options.customReaders = customReaders;

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
      [...messageSourceOption.summary(options.messageSource)],
      [...readerOptionsOption.extsSummary(options.exts)],
      [...readerOptionsOption.customReadersSummary(options.customReaders)],
      [...debugOption.summary(options.debug)],
    ]),
    "Generate options",
  );

  return options;
}
