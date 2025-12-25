import type { ReactTagRenderers } from "@/client/react/render";
import type { GenConfigKeys, GenMessages, MessageKey } from "@/shared/types";
import type { Replacement } from "intor-translator";
import { useTranslator } from "@/client/react/translator/use-translator";

type TProps<CK extends GenConfigKeys = "__default__"> = {
  /** The message key to translate. */
  i18nKey: MessageKey<GenMessages<CK>>;

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
 * `<T />` is a lightweight React component for rendering translated messages.
 *
 * It is a thin wrapper around `translator.tRich`, designed for use in JSX.
 */
export function T<CK extends GenConfigKeys = "__default__">(props: TProps<CK>) {
  const { i18nKey, components, values } = props;
  const translator = useTranslator<CK>();
  return <>{translator.tRich(i18nKey, components, values)}</>;
}
