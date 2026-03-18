import { SyntaxKind, type CallExpression } from "ts-morph";

export function getConfigKey(call: CallExpression): string | undefined {
  const typeArgs = call.getTypeArguments();
  if (typeArgs.length === 0) return undefined;

  const firstArg = typeArgs[0];

  if (!firstArg?.isKind(SyntaxKind.LiteralType)) return undefined;

  const literal = firstArg.getLiteral();
  if (!literal || !literal.isKind(SyntaxKind.StringLiteral)) return undefined;

  return literal.getLiteralText();
}
