import type { ExtractedUsages } from "../../core";
import { dedupePreKeyUsages } from "./dedupe-pre-key-usages";

const DEFAULT_KEY = "__default__";

/**
 * Filter extracted usages down to the target config.
 *
 * Usages without a config key, or marked as "__default__", are treated as
 * belonging to the default config before filtering.
 */
export function filterUsagesByConfig({
  usages,
  defaultConfigKey,
  configKey,
}: {
  usages: ExtractedUsages;
  defaultConfigKey: string;
  configKey: string;
}): ExtractedUsages {
  // Treat missing / sentinel config keys as belonging to the default config.
  const matchesConfig = ({ configKey: ck }: { configKey?: string }) =>
    (ck == null || ck === DEFAULT_KEY ? defaultConfigKey : ck) === configKey;

  return {
    preKey: dedupePreKeyUsages(usages.preKey.filter(matchesConfig)),
    key: usages.key.filter(matchesConfig),
    replacement: usages.replacement.filter(matchesConfig),
    rich: usages.rich.filter(matchesConfig),
    trans: usages.trans.filter(matchesConfig),
  };
}
