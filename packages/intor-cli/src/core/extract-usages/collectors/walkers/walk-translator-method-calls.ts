import type { TranslatorBinding, TranslatorBindingMap } from "../../types";
import type { SourceFile, CallExpression, Identifier } from "ts-morph";
import { SyntaxKind } from "ts-morph";

export interface TranslatorMethodCallContext {
  sourceFile: SourceFile;
  /** Resolved translator binding metadata. */
  translatorUsage: TranslatorBinding;
  /** Matched call expression, e.g. t("key") */
  call: CallExpression;
  /** Matched local binding name. */
  localName: string;
}

function resolveTranslatorUsage(
  expr: Identifier,
  translatorBindingMap: TranslatorBindingMap,
): { localName: string; translatorUsage: TranslatorBinding } | null {
  const localName = expr.getText();
  const translatorUsage = translatorBindingMap.get(localName);
  if (!translatorUsage) return null;

  // ----------------------------------------------------------------------
  // Ensure the identifier resolves back to a destructured binding
  // rather than a shadowed local variable or parameter.
  // ----------------------------------------------------------------------
  const declarationName = expr.getDefinitions()[0]?.getNode();
  if (!declarationName?.isKind(SyntaxKind.Identifier)) return null;

  const binding = declarationName.getParentIfKind(SyntaxKind.BindingElement);
  if (!binding) return null;

  const pattern = binding.getParentIfKind(SyntaxKind.ObjectBindingPattern);
  if (!pattern) return null;

  return {
    localName,
    translatorUsage,
  };
}

/**
 * Walk through all static translator method calls within a source file.
 */
export function walkTranslatorMethodCalls(
  sourceFile: SourceFile,
  translatorBindingMap: TranslatorBindingMap,
  visitor: (ctx: TranslatorMethodCallContext) => void,
): void {
  sourceFile.forEachDescendant((node) => {
    // ----------------------------------------------------------------------
    // Only care about call expressions (e.g. `t(...)`)
    // ----------------------------------------------------------------------
    if (!node.isKind(SyntaxKind.CallExpression)) return;

    // ----------------------------------------------------------------------
    // Only support direct identifier calls.
    // Supported: `t("key")`
    // Ignored: `translator.t("key")`, `getTranslator().t("key")`
    // ----------------------------------------------------------------------
    const expr = node.getExpression();
    if (!expr.isKind(SyntaxKind.Identifier)) return;

    // ----------------------------------------------------------------------
    // Match against known translator bindings and ignore shadowed names
    // ----------------------------------------------------------------------
    const resolved = resolveTranslatorUsage(expr, translatorBindingMap);
    if (!resolved) return;

    visitor({
      sourceFile,
      translatorUsage: resolved.translatorUsage,
      call: node,
      localName: resolved.localName,
    });
  });
}
