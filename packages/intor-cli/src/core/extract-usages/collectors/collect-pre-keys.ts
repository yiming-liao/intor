import type { PreKeyMap, PreKeyUsage, TranslatorBindingMap } from "../types";
import { SyntaxKind, type CallExpression, type SourceFile } from "ts-morph";
import { getObjectArg } from "./utils/get-object-arg";
import { isStaticStringLiteral } from "./utils/is-static-string-literal";
import { walkDestructuredCallBindings } from "./walkers/walk-destructured-call-bindings";

const PREKEY_PROPERTY_NAME = "preKey";

export interface CollectPreKeysResult {
  preKeyMap: PreKeyMap;
  usages: PreKeyUsage[];
}

/**
 * Resolve a static preKey from translator factory arguments.
 */
function getPreKey(call: CallExpression): string | undefined {
  // -----------------------------------------------------------------------
  // Resolve static preKey from translator factory arguments
  // -----------------------------------------------------------------------
  // 1. From the first positional string argument (e.g. `useTranslator("preKey")`)
  const firstArg = call.getArguments()[0];
  if (isStaticStringLiteral(firstArg)) {
    return firstArg.getLiteralText();
  }

  // 2. From the last options object (e.g. `getTranslator(_, { preKey })`)
  const lastArg = getObjectArg(call, "last");
  if (!lastArg) return undefined;

  // Extract the `preKey` property from the options object
  const prop = lastArg.getProperty(PREKEY_PROPERTY_NAME);
  if (!prop || !prop.isKind(SyntaxKind.PropertyAssignment)) return undefined;

  // Only accept static string initializers as preKey values
  const value = prop.getInitializer();
  if (!isStaticStringLiteral(value)) return undefined;

  return value.getLiteralText();
}

/**
 * Collect static preKey values associated with translator bindings
 * within a single source file.
 */
export function collectPreKeys(
  sourceFile: SourceFile,
  translatorBindingMap: TranslatorBindingMap,
): CollectPreKeysResult {
  const preKeyMap: PreKeyMap = new Map();
  const usages: PreKeyUsage[] = [];

  walkDestructuredCallBindings(sourceFile, ({ call, binding }) => {
    // Iterate over destructured translator binding elements (e.g. { t, hasKey, ... })
    for (const el of binding.getElements()) {
      const localName = el.getNameNode().getText(); // `t` from `const { t } = useTranslator`
      const translatorUsage = translatorBindingMap.get(localName);
      if (!translatorUsage) continue;

      const preKey = getPreKey(call);
      if (!preKey) continue;

      preKeyMap.set(localName, preKey);

      // Resolve source location for diagnostics
      const pos = sourceFile.getLineAndColumnAtPos(call.getStart());

      const { configKey, factory } = translatorUsage;

      usages.push({
        ...(configKey !== undefined ? { configKey } : {}),
        factory,
        localName,
        preKey,
        file: sourceFile.getFilePath(),
        line: pos.line,
        column: pos.column,
      });
    }
  });

  return { preKeyMap, usages };
}
