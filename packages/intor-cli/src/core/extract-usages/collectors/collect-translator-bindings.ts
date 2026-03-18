import type { TranslatorBinding, TranslatorBindingMap } from "../types";
import { SyntaxKind, type SourceFile } from "ts-morph";
import { getConfigKey } from "../../../core/extract-usages/collectors/utils/get-config-key";
import {
  TRANSLATOR_FACTORIES,
  TRANSLATOR_METHODS,
  type TranslatorFactory,
  type TranslatorMethod,
} from "../translator-registry";
import { walkTranslatorBindings } from "./utils/walk-translator-bindings";

export const TRANSLATOR_FACTORIES_SET = new Set<TranslatorFactory>(
  TRANSLATOR_FACTORIES,
);
export const TRANSLATOR_METHODS_SET = new Set<TranslatorMethod>(
  TRANSLATOR_METHODS,
);

/**
 * Collect static translator bindings from supported translator factories
 * within a single source file.
 */
export function collectTranslatorBindings(
  sourceFile: SourceFile,
): TranslatorBindingMap {
  const translatorBindingMap = new Map<string, TranslatorBinding>();

  walkTranslatorBindings(sourceFile, ({ call, binding }) => {
    // ----------------------------------------------------------------------
    // Resolve the translator factory name and ensure it is supported
    // ----------------------------------------------------------------------
    const expr = call.getExpression();
    if (!expr.isKind(SyntaxKind.Identifier)) return;
    const factoryName = expr.getText() as TranslatorFactory;
    if (!TRANSLATOR_FACTORIES_SET.has(factoryName)) return;

    // Iterate over destructured translator binding elements (e.g. { t, hasKey, ... })
    for (const el of binding.getElements()) {
      // ----------------------------------------------------------------------
      // Resolve the translator method name from the destructured binding
      // ----------------------------------------------------------------------
      const localName = el.getNameNode().getText(); // `t` from `const { t } = useTranslator`
      const aliasName = el.getPropertyNameNode()?.getText(); // `translate` from `const { t: translate } = useTranslator`
      const methodName = (aliasName ?? localName) as TranslatorMethod; // aliasName > originalName
      if (!TRANSLATOR_METHODS_SET.has(methodName)) continue;

      const configKey = getConfigKey(call);

      translatorBindingMap.set(localName, {
        factory: factoryName,
        method: methodName,
        ...(configKey !== undefined ? { configKey } : {}),
      });
    }
  });

  return translatorBindingMap;
}
