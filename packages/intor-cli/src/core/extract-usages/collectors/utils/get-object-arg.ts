import type {
  CallExpression,
  Node,
  ObjectLiteralExpression,
  ts,
} from "ts-morph";
import { SyntaxKind } from "ts-morph";

/**
 * position:
 * - "first" | "last"
 * - number: 1-based argument position (2 = second argument)
 */
type ObjectArgPosition = "first" | "last" | number;

export function getObjectArg(
  node: CallExpression,
  position: ObjectArgPosition,
): ObjectLiteralExpression | null {
  const args = node.getArguments();

  let target: Node<ts.Node> | undefined | null = null;

  switch (position) {
    case "first": {
      target = args[0];
      break;
    }

    case "last": {
      target = args.at(-1);
      break;
    }

    default: {
      target = args[position - 1];
    }
  }

  if (!target?.isKind(SyntaxKind.ObjectLiteralExpression)) return null;
  return target;
}
