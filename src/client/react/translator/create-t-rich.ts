import type { ReactTagRenderers } from "../render";
import type { Replacement, Translator } from "intor-translator";
import { renderRichMessageReact } from "../render";

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
export const createTRich = (translator: Translator, preKey?: string) => {
  const t = preKey ? translator.scoped(preKey).t : translator.t;

  return (
    key: string,
    tagRenderers?: ReactTagRenderers,
    replacements?: Replacement,
  ) => {
    const message = t(key, replacements);
    return renderRichMessageReact(message, tagRenderers);
  };
};
