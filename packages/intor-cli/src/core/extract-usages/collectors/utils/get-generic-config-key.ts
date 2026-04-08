import { SyntaxKind, type CallExpression } from "ts-morph";
import { isStaticStringLiteral } from "./is-static-string-literal";

/**
 * Get a static config key from the first type argument.
 */
export function getGenericConfigKey(call: CallExpression): string | undefined {
  const typeArgs = call.getTypeArguments();
  if (typeArgs.length === 0) return undefined;

  const firstArg = typeArgs[0];

  if (!firstArg?.isKind(SyntaxKind.LiteralType)) return undefined;

  const literal = firstArg.getLiteral();
  if (!isStaticStringLiteral(literal)) return undefined;

  return literal.getLiteralText();
}
