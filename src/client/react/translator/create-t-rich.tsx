import type { ReactTagRenderers } from "../render";
import {
  renderRichMessage,
  type Replacement,
  type TranslatorMethods,
} from "intor-translator";
import { Fragment } from "react/jsx-runtime";
import { createReactRenderer } from "../render";

/**
 * Create a React-specific rich translation function.
 *
 * This adapter bridges the core Translator with the React rich
 * message rendering flow.
 *
 * - Resolves translated messages via `translator.t`
 * - Renders semantic tags using React renderers
 * - Supports optional scoped keys via `preKey`
 *
 * Intended for React client usage only.
 */
export const createTRich = (t: TranslatorMethods["t"]) => {
  return (
    key: string,
    tagRenderers?: ReactTagRenderers,
    replacements?: Replacement,
  ) => {
    const message = t(key, replacements);
    const reactRenderer = createReactRenderer(tagRenderers);
    const nodes = renderRichMessage(message, reactRenderer);
    return nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>);
  };
};
