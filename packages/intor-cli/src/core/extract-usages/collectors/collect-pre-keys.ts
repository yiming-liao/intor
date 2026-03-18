import type { PreKeyMap, PreKeyUsage, TranslatorBindingMap } from "../types";
import { SyntaxKind, type SourceFile } from "ts-morph";
import { getObjectArg } from "./utils/get-object-arg";
import { isStaticStringLiteral } from "./utils/is-static-string-literal";
import { walkTranslatorBindings } from "./utils/walk-translator-bindings";

const PREKEY_PROPERTY_NAME = "preKey";

export interface CollectPreKeysResult {
  preKeyMap: PreKeyMap;
  usages: PreKeyUsage[];
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

  walkTranslatorBindings(sourceFile, ({ call, binding }) => {
    // Iterate over destructured translator binding elements (e.g. { t, hasKey, ... })
    for (const el of binding.getElements()) {
      const localName = el.getNameNode().getText(); // `t` from `const { t } = useTranslator`
      if (!translatorBindingMap.has(localName)) continue;
      const translatorUsage = translatorBindingMap.get(localName);
      if (!translatorUsage) return;

      let preKey: string | undefined;

      // -----------------------------------------------------------------------
      // Resolve static preKey from translator factory arguments
      // -----------------------------------------------------------------------
      // 1. From the first positional string argument (e.g. `useTranslator("preKey")`)
      const firstArg = call.getArguments()[0];
      if (isStaticStringLiteral(firstArg)) {
        preKey = firstArg.getLiteralText();
      }

      // 2. From the last options object (e.g. `getTranslator(_, { preKey })`)
      if (!preKey) {
        const lastArg = getObjectArg(call, "last");
        if (!lastArg) continue;

        // Extract the `preKey` property from the options object
        const prop = lastArg.getProperty(PREKEY_PROPERTY_NAME);
        if (!prop || !prop.isKind(SyntaxKind.PropertyAssignment)) continue;

        // Only accept static string initializers as preKey values
        const value = prop.getInitializer();
        if (!value) continue;
        if (
          !value.isKind(SyntaxKind.StringLiteral) &&
          !value.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
        ) {
          continue;
        }
        preKey = value.getLiteralText();
      }

      if (!preKey) continue;

      // ---------------------------------------------------------------------
      // Record
      // ---------------------------------------------------------------------
      preKeyMap.set(localName, preKey);

      // Resolve source location for diagnostics
      const pos = sourceFile.getLineAndColumnAtPos(call.getStart());

      const configKey = translatorUsage.configKey;

      usages.push({
        ...(configKey !== undefined ? { configKey } : {}),
        factory: translatorUsage.factory,
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
