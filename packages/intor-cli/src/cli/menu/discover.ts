import type { DiscoverOptions } from "../../features";
import { note } from "@clack/prompts";
import { debugOption } from "./options";
import { formatSummary } from "./utils/format-summary";

/**
 * Prompt discover options from the interactive menu.
 */
export async function discoverPrompt(): Promise<DiscoverOptions> {
  const options: DiscoverOptions = {};

  // ------------------------------------------------------------------
  // Option: debug
  // ------------------------------------------------------------------
  const debug = await debugOption.prompt();
  options.debug = debug;

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  note(
    formatSummary([[...debugOption.summary(options.debug)]]),
    "Discover options",
  );

  return options;
}
