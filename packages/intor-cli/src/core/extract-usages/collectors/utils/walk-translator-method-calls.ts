import type { TranslatorBinding, TranslatorBindingMap } from "../../types";
import type { SourceFile, CallExpression } from "ts-morph";
import { SyntaxKind } from "ts-morph";

interface TranslatorCallContext {
  sourceFile: SourceFile;
  translatorUsage: TranslatorBinding;
  call: CallExpression;
  localName: string;
}

/**
 * Walk through all static translator method calls within a source file.
 */
export function walkTranslatorMethodCalls(
  sourceFile: SourceFile,
  translatorBindingMap: TranslatorBindingMap,
  visitor: (ctx: TranslatorCallContext) => void,
): void {
  sourceFile.forEachDescendant((node) => {
    // Only care about call expressions (e.g. `t(...)`)
    if (!node.isKind(SyntaxKind.CallExpression)) return;

    // Only support direct identifier calls.
    // Supported: `t("key")`
    // Ignored: `translator.t("key")`, `getTranslator().t("key")`
    const expr = node.getExpression();
    if (!expr.isKind(SyntaxKind.Identifier)) return;

    // Match against known translator bindings
    const localName = expr.getText();
    const translatorUsage = translatorBindingMap.get(localName);
    if (!translatorUsage) return;

    visitor({
      sourceFile,
      translatorUsage,
      call: node,
      localName,
    });
  });
}
