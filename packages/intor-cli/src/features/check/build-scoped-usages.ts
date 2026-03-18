import type { ExtractedUsages } from "../../core";
import { dedupePreKeyUsages } from "./dedupe-pre-key-usages";

function resolveConfigKey(
  usageConfigKey: string | undefined,
  defaultConfigKey: string,
) {
  if (usageConfigKey === "__default__") return defaultConfigKey;
  if (usageConfigKey == null) return defaultConfigKey;
  return usageConfigKey;
}

/**
 * Build per-config scoped usages from extracted usages
 */
export const buildScopeUsages = ({
  usages,
  defaultConfigKey,
  configKey,
}: {
  usages: ExtractedUsages;
  defaultConfigKey: string;
  configKey: string;
}): ExtractedUsages => {
  const match = (u: { configKey?: string }) =>
    resolveConfigKey(u.configKey, defaultConfigKey) === configKey;

  return {
    preKey: dedupePreKeyUsages(usages.preKey.filter((el) => match(el))),
    key: usages.key.filter((el) => match(el)),
    replacement: usages.replacement.filter((el) => match(el)),
    rich: usages.rich.filter((el) => match(el)),
    trans: usages.trans.filter((el) => match(el)),
  };
};
