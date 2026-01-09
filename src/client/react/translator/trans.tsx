import type { ReactTagRenderers } from "../render";
import type { GenConfigKeys, GenMessages, Key } from "@/core";
import type { Replacement } from "intor-translator";
import { useTranslator } from "./use-translator";

type TransProps<CK extends GenConfigKeys = "__default__"> = {
  /** The message key to translate. */
  i18nKey: Key<GenMessages<CK>>;

  /**
   * Optional React renderers for semantic tags in rich messages.
   *
   * Maps a tag name to either a React node or a render function,
   * allowing customization of rich tag rendering.
   */
  components?: ReactTagRenderers;

  /**
   * Optional replacement values for message interpolation.
   *
   * These values are passed to the underlying translator.
   */
  values?: Replacement;
};

/**
 * `<Trans />` is a lightweight React component for rendering rich translations.
 *
 * It is a thin adapter around `translator.tRich` and introduces no additional logic.
 */
export function Trans<CK extends GenConfigKeys = "__default__">(
  props: TransProps<CK>,
) {
  const { i18nKey, components, values } = props;
  const translator = useTranslator<CK>();
  return <>{translator.tRich(i18nKey, components, values)}</>;
}
