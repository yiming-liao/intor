import type { TranslatorMethod } from "../../../../core";
import { resolveKeyPath } from "./resolve-key-path";

/**
 * Index extracted usages by their resolved message key.
 */
export function indexUsagesByKey<
  T extends { key: string; preKey?: string; method: TranslatorMethod },
>(usages: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();

  for (const usage of usages) {
    const keyPath = resolveKeyPath(usage.key, usage.preKey);
    const indexKey = `${usage.method}::${keyPath}`;

    // Append this usage to the existing group for the same key
    const list = map.get(indexKey);

    if (list) {
      list.push(usage);
    } else {
      // First usage encountered for this message key
      map.set(indexKey, [usage]);
    }
  }

  return map;
}
