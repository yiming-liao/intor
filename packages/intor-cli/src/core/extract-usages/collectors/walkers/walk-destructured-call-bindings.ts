import type {
  CallExpression,
  ObjectBindingPattern,
  SourceFile,
} from "ts-morph";
import { SyntaxKind } from "ts-morph";

export interface DestructuredCallBindingContext {
  sourceFile: SourceFile;
  /** Matched call expression, e.g. useTranslator() */
  call: CallExpression;
  /** Matched object binding pattern, e.g. { t, tRich } */
  binding: ObjectBindingPattern;
}

/**
 * Walk through destructured variable declarations initialized by a call.
 */
export function walkDestructuredCallBindings(
  sourceFile: SourceFile,
  visitor: (ctx: DestructuredCallBindingContext) => void,
): void {
  sourceFile.forEachDescendant((node) => {
    // ----------------------------------------------------------------------
    // Only handle variable declarations (e.g. `const x = ...`)
    // ----------------------------------------------------------------------
    if (!node.isKind(SyntaxKind.VariableDeclaration)) return;

    // ----------------------------------------------------------------------
    // Ensure the declaration has an initializer (skip `let x;`)
    // ----------------------------------------------------------------------
    const initializer = node.getInitializer();
    if (!initializer) return;

    // ----------------------------------------------------------------------
    // Unwrap awaited initializers (e.g. `await foo()` -> `foo()`)
    // ----------------------------------------------------------------------
    const call = initializer.isKind(SyntaxKind.AwaitExpression)
      ? initializer.getExpression()
      : initializer;
    if (!call.isKind(SyntaxKind.CallExpression)) return;

    // ----------------------------------------------------------------------
    // Only support object destructuring bindings
    // Supported: `const { t } = useTranslator()`
    // Ignored: `const translator = useTranslator()` (no destructuring)
    // ----------------------------------------------------------------------
    const binding = node.getNameNode();
    if (!binding.isKind(SyntaxKind.ObjectBindingPattern)) return;

    visitor({
      sourceFile,
      call,
      binding,
    });
  });
}
