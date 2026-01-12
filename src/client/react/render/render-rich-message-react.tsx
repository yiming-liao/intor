import type { ReactTagRenderers } from "./types";
import type { JSX } from "react/jsx-runtime";
import { renderRichMessage, type MessageValue } from "intor-translator";
import { Fragment } from "react/jsx-runtime";
import { createReactRenderer } from "./create-react-renderer";

/**
 * Render a rich-formatted message into React elements.
 *
 * This is a React-specific convenience wrapper that:
 * - Parses and renders a rich message using the core render pipeline
 * - Applies optional semantic tag handlers
 * - Ensures stable React keys at the top level
 *
 * This function is intended for React environments only.
 */
export function renderRichMessageReact(
  message: MessageValue,
  tagComponents?: ReactTagRenderers,
): JSX.Element[] {
  const reactRenderer = createReactRenderer(tagComponents);
  const nodes = renderRichMessage(message, reactRenderer);

  // Wrap each top-level node with a Fragment to provide a stable key
  return nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>);
}
