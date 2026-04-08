import type {
  ExtractedUsages,
  KeyUsage,
  PreKeyMap,
  PreKeyUsage,
  ReplacementUsage,
  RichUsage,
} from "./types";
import type { SourceFile } from "ts-morph";
import {
  collectTranslatorBindings,
  collectKeyUsages,
  collectReplacementUsages,
  collectRichUsages,
  collectPreKeys,
  collectTransUsages,
} from "./collectors";

/**
 * Attach resolved preKey values to extracted usages by local name.
 */
function attachPreKey<T extends { localName: string; preKey?: string }>(
  usages: T[],
  preKeyMap: PreKeyMap,
) {
  for (const usage of usages) {
    const preKey = preKeyMap.get(usage.localName);
    if (preKey !== undefined) usage.preKey = preKey;
  }
}

/**
 * Extract all static translator usages from a single source file.
 *
 * This is a pure, file-level extractor suitable for editor extensions
 * and incremental analysis.
 */
export function extractUsagesFromSourceFile(
  sourceFile: SourceFile,
): ExtractedUsages {
  // -----------------------------------------------------------------------
  // Trans component usages (independent of translator bindings)
  // -----------------------------------------------------------------------
  const transUsages = collectTransUsages(sourceFile);

  // -----------------------------------------------------------------------
  // Translator binding (function-based APIs)
  // -----------------------------------------------------------------------
  const translatorBindingMap = collectTranslatorBindings(sourceFile);

  // Prepare defaults
  let keyUsages: KeyUsage[] = [];
  let replacementUsages: ReplacementUsage[] = [];
  let richUsages: RichUsage[] = [];
  let preKeyUsages: PreKeyUsage[] = [];

  if (translatorBindingMap.size > 0) {
    // ---------------------------------------------------------------------
    // Key usages
    // ---------------------------------------------------------------------
    keyUsages = collectKeyUsages(sourceFile, translatorBindingMap);

    // ---------------------------------------------------------------------
    // Replacement usages
    // ---------------------------------------------------------------------
    replacementUsages = collectReplacementUsages(
      sourceFile,
      translatorBindingMap,
    );

    // ---------------------------------------------------------------------
    // Rich usages
    // ---------------------------------------------------------------------
    richUsages = collectRichUsages(sourceFile, translatorBindingMap);

    // ---------------------------------------------------------------------
    // PreKey values
    // ---------------------------------------------------------------------
    const { preKeyMap, usages } = collectPreKeys(
      sourceFile,
      translatorBindingMap,
    );

    attachPreKey(keyUsages, preKeyMap);
    attachPreKey(replacementUsages, preKeyMap);
    attachPreKey(richUsages, preKeyMap);

    preKeyUsages = usages;
  }

  return {
    preKey: preKeyUsages,
    key: keyUsages,
    replacement: replacementUsages,
    rich: richUsages,
    trans: transUsages,
  };
}
