import type { KeyUsage, TranslatorBindingMap } from "../types";
import type { SourceFile } from "ts-morph";
import { isStaticStringLiteral } from "./utils/is-static-string-literal";
import { walkTranslatorMethodCalls } from "./utils/walk-translator-method-calls";

/**
 * Collect static translation key usages from translator method calls
 * within a single source file.
 */
export function collectKeyUsages(
  sourceFile: SourceFile,
  translatorBindingMap: TranslatorBindingMap,
): KeyUsage[] {
  const keyUsages: KeyUsage[] = [];

  walkTranslatorMethodCalls(
    sourceFile,
    translatorBindingMap,
    ({ sourceFile, translatorUsage, call, localName }) => {
      const firstArg = call.getArguments()[0];
      if (!isStaticStringLiteral(firstArg)) return;

      // Resolve source location for diagnostics
      const pos = sourceFile.getLineAndColumnAtPos(firstArg.getStart());

      const configKey = translatorUsage.configKey;

      keyUsages.push({
        ...(configKey !== undefined ? { configKey } : {}),
        factory: translatorUsage.factory,
        method: translatorUsage.method,
        localName,
        key: firstArg.getLiteralText(),
        file: sourceFile.getFilePath(),
        line: pos.line,
        column: pos.column,
      });
    },
  );

  return keyUsages;
}
