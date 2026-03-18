import { promptDebug, printOptionsSummary } from "./shared/shared";

export interface DiscoverOptions {
  debug?: boolean;
}

export async function promptDiscover(): Promise<DiscoverOptions | null> {
  const options: DiscoverOptions = {};

  // ------------------------------------------------------------------
  // Debug
  // ------------------------------------------------------------------
  const debug = await promptDebug();
  if (debug === null) return null;
  if (debug) options.debug = true;

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  printOptionsSummary("Discover options", [
    ["debug", options.debug ? "on" : "off"],
  ]);

  return options;
}
