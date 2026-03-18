import type { RichUsage, TranslatorBindingMap } from "../types";
import type { SourceFile } from "ts-morph";
import { extractStaticObjectKeys } from "./utils/extract-static-object-keys";
import { getObjectArg } from "./utils/get-object-arg";
import { isStaticStringLiteral } from "./utils/is-static-string-literal";
import { walkTranslatorMethodCalls } from "./utils/walk-translator-method-calls";

/**
 * Collect static rich tag usages from translator method calls
 * within a single source file.
 */
export function collectRichUsages(
  sourceFile: SourceFile,
  translatorBindingMap: TranslatorBindingMap,
): RichUsage[] {
  const richUsages: RichUsage[] = [];

  walkTranslatorMethodCalls(
    sourceFile,
    translatorBindingMap,
    ({ sourceFile, translatorUsage, call, localName }) => {
      if (translatorUsage.method !== "tRich") return;

      const firstArg = call.getArguments()[0];
      if (!isStaticStringLiteral(firstArg)) return;

      // ----------------------------------------------------------------------
      // Resolve rich tags from the first object-literal argument after the key
      // ----------------------------------------------------------------------
      const richArg = getObjectArg(call, 2);
      if (!richArg) return;

      // ----------------------------------------------------------------------
      // Extract static rich tag definitions from the rich object argument
      // ----------------------------------------------------------------------
      const keys: string[] = extractStaticObjectKeys(richArg);
      if (keys.length === 0) return;

      // Resolve source location for diagnostics
      const pos = sourceFile.getLineAndColumnAtPos(richArg.getStart());

      const configKey = translatorUsage.configKey;

      richUsages.push({
        ...(configKey !== undefined ? { configKey } : {}),
        factory: translatorUsage.factory,
        method: translatorUsage.method,
        localName,
        key: firstArg.getLiteralText(),
        rich: keys,
        file: sourceFile.getFilePath(),
        line: pos.line,
        column: pos.column,
      });
    },
  );

  return richUsages;
}
