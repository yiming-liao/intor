import type { ReplacementUsage, TranslatorBindingMap } from "../types";
import type { ObjectLiteralExpression, SourceFile } from "ts-morph";
import { TRANSLATOR_METHOD } from "../translator-registry";
import { extractStaticObjectKeys } from "./utils/extract-static-object-keys";
import { getObjectArg } from "./utils/get-object-arg";
import { isStaticStringLiteral } from "./utils/is-static-string-literal";
import { walkTranslatorMethodCalls } from "./walkers/walk-translator-method-calls";

/**
 * Collect static replacement usages from translator method calls
 * within a single source file.
 */
export function collectReplacementUsages(
  sourceFile: SourceFile,
  translatorBindingMap: TranslatorBindingMap,
): ReplacementUsage[] {
  const replacementUsages: ReplacementUsage[] = [];

  walkTranslatorMethodCalls(
    sourceFile,
    translatorBindingMap,
    ({ sourceFile, translatorUsage, call, localName }) => {
      const { configKey, factory, method } = translatorUsage;

      // Only collect replacement-aware translator methods
      if (method !== "t" && method !== "tRich") return;

      const firstArg = call.getArguments()[0];
      if (!isStaticStringLiteral(firstArg)) return;

      // ----------------------------------------------------------------------
      // Resolve replacements based on method semantics
      // ----------------------------------------------------------------------
      let replacementArg: ObjectLiteralExpression | null = null;

      // `t(key, replacements)`
      if (method === TRANSLATOR_METHOD.t) {
        replacementArg = getObjectArg(call, 2);
      }

      // `tRich(key, rich, replacements)`
      if (method === TRANSLATOR_METHOD.tRich) {
        replacementArg = getObjectArg(call, 3);
      }

      if (!replacementArg) return;

      // ----------------------------------------------------------------------
      // Extract static replacement keys from the replacements object
      // ----------------------------------------------------------------------
      const keys: string[] = extractStaticObjectKeys(replacementArg);
      if (keys.length === 0) return;

      // Resolve source location for diagnostics
      const pos = sourceFile.getLineAndColumnAtPos(replacementArg.getStart());

      replacementUsages.push({
        ...(configKey !== undefined ? { configKey } : {}),
        factory,
        method,
        localName,
        key: firstArg.getLiteralText(),
        replacements: keys,
        file: sourceFile.getFilePath(),
        line: pos.line,
        column: pos.column,
      });
    },
  );

  return replacementUsages;
}
