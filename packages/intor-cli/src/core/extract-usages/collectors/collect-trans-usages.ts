import type { TransUsage } from "../types";
import type { SourceFile } from "ts-morph";
import { Node, SyntaxKind } from "ts-morph";
import { isStaticStringLiteral } from "./utils/is-static-string-literal";

const COMPONENT_NAME = "Trans";
const KEY_PROPERTY_NAME = "i18nKey";

/**
 * Collect static translation key usages from <Trans /> components
 * within a single source file.
 */
export function collectTransUsages(sourceFile: SourceFile): TransUsage[] {
  const usages: TransUsage[] = [];

  sourceFile.forEachDescendant((node) => {
    // ------------------------------------------------------------
    // Match <Trans ... /> or <Trans ...></Trans>
    // ------------------------------------------------------------
    if (
      !node.isKind(SyntaxKind.JsxSelfClosingElement) &&
      !node.isKind(SyntaxKind.JsxOpeningElement)
    ) {
      return;
    }

    const tagName = node.getTagNameNode()?.getText();
    if (tagName !== COMPONENT_NAME) return;

    // ------------------------------------------------------------
    // Resolve i18nKey attribute
    // ------------------------------------------------------------
    const i18nKeyAttr = node
      .getAttributes()
      .find(
        (attr) =>
          attr.isKind(SyntaxKind.JsxAttribute) &&
          attr.getNameNode().getText() === KEY_PROPERTY_NAME,
      );

    if (!i18nKeyAttr || !Node.isJsxAttribute(i18nKeyAttr)) return;

    const initializer = i18nKeyAttr.getInitializer();
    if (!initializer) return;

    // Support:
    //   <Trans i18nKey="home.title" />
    //   <Trans i18nKey={"home.title"} />
    const expr = initializer.isKind(SyntaxKind.JsxExpression)
      ? initializer.getExpression()
      : initializer;
    if (!isStaticStringLiteral(expr)) return;
    const literal = expr;

    // ------------------------------------------------------------
    // Source location
    // ------------------------------------------------------------
    const pos = sourceFile.getLineAndColumnAtPos(literal.getStart());

    usages.push({
      key: literal.getLiteralText(),
      file: sourceFile.getFilePath(),
      line: pos.line,
      column: pos.column,
    });
  });

  return usages;
}
