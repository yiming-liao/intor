import type { ValidateOptions } from "../../../features";
import { promptReaderOptions } from "./shared/prompt-reader-options";
import { promptMode, promptDebug, printOptionsSummary } from "./shared/shared";

export async function promptValidate(): Promise<ValidateOptions | null> {
  // ------------------------------------------------------------------
  // Mode
  // ------------------------------------------------------------------
  const mode = await promptMode();
  if (!mode) return null;
  if (mode === "default") return {};

  const options: ValidateOptions = {};

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
  printOptionsSummary("Validate options", [
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
