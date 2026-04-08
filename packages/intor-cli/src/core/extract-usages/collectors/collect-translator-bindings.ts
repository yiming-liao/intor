import type { TranslatorBinding, TranslatorBindingMap } from "../types";
import { SyntaxKind, type SourceFile } from "ts-morph";
import {
  TRANSLATOR_FACTORIES,
  TRANSLATOR_METHODS,
  type TranslatorFactory,
  type TranslatorMethod,
} from "../translator-registry";
import { getGenericConfigKey } from "./utils/get-generic-config-key";
import { getIntorImportLocalNames } from "./utils/get-intor-import-local-names";
import { walkDestructuredCallBindings } from "./walkers/walk-destructured-call-bindings";

export const FACTORY_SET = new Set<TranslatorFactory>(TRANSLATOR_FACTORIES);
export const METHOD_SET = new Set<TranslatorMethod>(TRANSLATOR_METHODS);

/**
 * Map local factory names to supported Intor translator factories.
 * - Supports aliased imports like `useTranslator as useT`.
 */
function createTranslatorFactoryMap(
  sourceFile: SourceFile,
): Map<string, TranslatorFactory> {
  const map = new Map<string, TranslatorFactory>();
  for (const factory of TRANSLATOR_FACTORIES) {
    const localNames = getIntorImportLocalNames(sourceFile, factory); // e.g. Set { "useTranslator" }
    for (const localName of localNames) map.set(localName, factory);
  }
  return map;
}

/**
 * Collect static translator bindings from supported translator factories
 * within a single source file.
 */
export function collectTranslatorBindings(
  sourceFile: SourceFile,
): TranslatorBindingMap {
  const translatorBindingMap = new Map<string, TranslatorBinding>();
  const translatorFactoryMap = createTranslatorFactoryMap(sourceFile);
  if (translatorFactoryMap.size === 0) return translatorBindingMap;

  walkDestructuredCallBindings(sourceFile, ({ call, binding }) => {
    // ----------------------------------------------------------------------
    // Resolve the translator factory name and ensure it is supported
    // ----------------------------------------------------------------------
    const expr = call.getExpression();
    if (!expr.isKind(SyntaxKind.Identifier)) return;
    const factoryName = translatorFactoryMap.get(expr.getText());
    if (!factoryName || !FACTORY_SET.has(factoryName)) return;

    // Iterate over destructured translator binding elements (e.g. { t, hasKey, ... })
    for (const el of binding.getElements()) {
      // ----------------------------------------------------------------------
      // Resolve the translator method name from the destructured binding
      // ----------------------------------------------------------------------
      const localName = el.getNameNode().getText(); // e.g. `t` from `const { t } = useTranslator`
      const aliasName = el.getPropertyNameNode()?.getText(); // e.g. `translate` from `const { t: translate } = useTranslator`
      const methodName = (aliasName ?? localName) as TranslatorMethod; // aliasName > originalName
      if (!METHOD_SET.has(methodName)) continue;

      const configKey = getGenericConfigKey(call);

      translatorBindingMap.set(localName, {
        factory: factoryName,
        method: methodName,
        ...(configKey !== undefined ? { configKey } : {}),
      });
    }
  });

  return translatorBindingMap;
}
