import type { PreKeyUsage } from "../../core/extract-usages";

/**
 * Deduplicate preKey usages from the same translator factory call.
 *
 * A single factory call (e.g. `useTranslator("home")`) may expose
 * multiple methods (`t`, `tRich`, ...).
 *
 * PreKey validation should happen once per factory call,
 * not once per method, otherwise diagnostics would be duplicated.
 */
export function dedupePreKeyUsages(usages: PreKeyUsage[]): PreKeyUsage[] {
  const seen = new Set<string>();

  return usages.filter((u) => {
    const sig = [u.factory, u.configKey, u.preKey, u.file, u.line].join("|");

    if (seen.has(sig)) {
      return false;
    } else {
      seen.add(sig);
      return true;
    }
  });
}
