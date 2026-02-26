import type {
  GenConfigKeys,
  GenMessages,
  GenReplacements,
  GenRich,
} from "../../../core";
import type { ReactTagRenderers } from "../render";
import type {
  LocalizedKey,
  LocalizedReplacement,
  LocalizedRich,
  Replacement,
} from "intor-translator";
import { useTranslator } from "./use-translator";

type TransProps<
  CK extends GenConfigKeys = "__default__",
  K extends string = LocalizedKey<GenMessages<CK>>,
  RI = LocalizedRich<GenRich<CK>, K>,
  RE extends Replacement = LocalizedReplacement<GenReplacements<CK>, K>,
> = {
  /** The message key to translate. */
  i18nKey: K | (string & {});

  /** Optional React renderers for semantic tags. */
  components?: ReactTagRenderers<RI> | ReactTagRenderers;

  /** Optional replacement values for interpolation. */
  values?: RE | Replacement;
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
  const { tRich } = useTranslator<CK>();
  return tRich(i18nKey, components, values);
}
