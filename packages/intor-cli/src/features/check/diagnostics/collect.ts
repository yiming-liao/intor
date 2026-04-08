import type { KeyUsageLike } from "./rules/key";
import type { Diagnostic } from "./types";
import type { ExtractedUsages, InferredShapes } from "../../../core";
import { enforceMissingReplacements } from "./rules/enforce-missing-replacements";
import { enforceMissingRich } from "./rules/enforce-missing-rich";
import { keyEmpty, keyNotExist } from "./rules/key";
import { preKeyNotExist } from "./rules/pre-key";
import {
  replacementsNotAllowed,
  replacementMissing,
  replacementUnexpected,
} from "./rules/replacement";
import { richMissing, richNotAllowed, richUnexpected } from "./rules/rich";
import { indexUsagesByKey } from "./utils/index-usages-by-key";

export function collectDiagnostics(
  shapes: InferredShapes,
  usages: ExtractedUsages,
) {
  const diagnostics: Diagnostic[] = [];

  // ----------------------------------------------------------------------
  // Key
  // ----------------------------------------------------------------------
  const allKeyUsages: KeyUsageLike[] = [
    ...usages.key.map((u) => ({ ...u, method: u.method })),
    ...usages.trans.map((u) => ({ ...u, method: "Trans" })),
  ];

  for (const usage of allKeyUsages) {
    diagnostics.push(
      ...keyNotExist(usage, shapes.messages),
      ...keyEmpty(usage),
    );
  }

  // ----------------------------------------------------------------------
  // PreKey
  // ----------------------------------------------------------------------
  for (const usage of usages.preKey) {
    diagnostics.push(...preKeyNotExist(usage, shapes.messages));
  }

  // ----------------------------------------------------------------------
  // Replacement
  // ----------------------------------------------------------------------
  for (const usage of usages.replacement) {
    diagnostics.push(
      ...replacementsNotAllowed(usage, shapes.replacements),
      ...replacementMissing(usage, shapes.replacements),
      ...replacementUnexpected(usage, shapes.replacements),
    );
  }

  // ----------------------------------------------------------------------
  // Rich
  // ----------------------------------------------------------------------
  for (const usage of usages.rich) {
    diagnostics.push(
      ...richNotAllowed(usage, shapes.rich),
      ...richMissing(usage, shapes.rich),
      ...richUnexpected(usage, shapes.rich),
    );
  }

  // ----------------------------------------------------------------------
  // Ensure required replacements / rich tags are detected even when no usage provides them
  // ----------------------------------------------------------------------
  const replacementIndex = indexUsagesByKey(usages.replacement);
  const richIndex = indexUsagesByKey(usages.rich);
  for (const usage of usages.key) {
    diagnostics.push(
      ...enforceMissingReplacements(
        usage,
        replacementIndex,
        shapes.replacements,
      ),
      ...enforceMissingRich(usage, richIndex, shapes.rich),
    );
  }

  return diagnostics;
}
