import { SyntaxKind, type ObjectLiteralExpression } from "ts-morph";

/**
 * Extract static property keys from an object literal expression.
 */
export function extractStaticObjectKeys(
  obj: ObjectLiteralExpression,
): string[] {
  const keys: string[] = [];

  // Walk through object literal properties
  for (const prop of obj.getProperties()) {
    // Only support simple property assignments (skip spreads, methods, etc.)
    if (!prop.isKind(SyntaxKind.PropertyAssignment)) continue;

    const nameNode = prop.getNameNode();

    // { foo: ... }
    if (nameNode.isKind(SyntaxKind.Identifier)) {
      keys.push(nameNode.getText());
      continue;
    }

    // { "foo": ... }
    if (nameNode.isKind(SyntaxKind.StringLiteral)) {
      keys.push(nameNode.getLiteralText());
    }
  }

  return keys;
}
