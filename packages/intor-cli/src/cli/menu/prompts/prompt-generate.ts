import type { GenerateOptions } from "../../../features";
import { text, isCancel, confirm } from "@clack/prompts";
import { discoverConfigs } from "../../../core";
import { promptReaderOptions } from "./shared/prompt-reader-options";
import { promptMode, promptDebug, printOptionsSummary } from "./shared/shared";

export async function promptGenerate(): Promise<GenerateOptions | null> {
  // ------------------------------------------------------------------
  // Discover configs early (for prompt decisions)
  // ------------------------------------------------------------------
  const configs = await discoverConfigs();
  if (configs.length === 0) throw new Error("No Intor config found.");
  const isSingleConfig = configs.length === 1;

  // ------------------------------------------------------------------
  // Mode
  // ------------------------------------------------------------------
  const mode = await promptMode();
  if (!mode) return null;
  if (mode === "default") return {};

  const options: GenerateOptions = {};

  // ------------------------------------------------------------------
  // Message source
  // ------------------------------------------------------------------
  const useCustomMessages = await confirm({
    message:
      "Do you want to provide message files instead of using the loader?",
    initialValue: false,
  });
  if (isCancel(useCustomMessages)) return null;

  if (useCustomMessages) {
    const sourceMode = isSingleConfig ? "single" : "mapping";

    // single mode
    if (sourceMode === "single") {
      const file = await text({
        message: "Path to the message file (default locale)",
        placeholder: "messages/en/index.json",
      });
      if (isCancel(file)) return null;
      options.messageSource = { mode: "single", file };
    }

    // mapping mode
    if (sourceMode === "mapping") {
      const files: Record<string, string> = {};
      for (const { config } of configs) {
        const path = await text({
          message: `Message file for config "${config.id}" (default locale)`,
          placeholder: "messages/en/index.json",
        });
        if (isCancel(path)) return null;
        if (path) files[config.id] = path;
      }
      options.messageSource = { mode: "mapping", files };
    }
  }

  // ------------------------------------------------------------------
  // Reader options
  // ------------------------------------------------------------------
  const readerOptions = await promptReaderOptions();
  if (readerOptions === null) return null;
  if (readerOptions.exts?.length) {
    options.exts = readerOptions.exts;
  }
  if (readerOptions.customReaders) {
    options.customReaders = readerOptions.customReaders;
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
  printOptionsSummary("Generate options", [
    [
      "message files",
      options.messageSource?.mode === "single"
        ? options.messageSource.file
        : options.messageSource?.mode === "mapping"
          ? Object.entries(options.messageSource.files)
              .map(([id, path]) => `${id}: ${path}`)
              .join(", ")
          : "(loader)",
    ],
    ["exts", options.exts?.join(", ") ?? "(none)"],
    [
      "custom readers",
      options.customReaders
        ? Object.keys(options.customReaders).join(", ")
        : "(none)",
    ],
    ["debug", options.debug ? "on" : "off"],
  ]);

  return options;
}
