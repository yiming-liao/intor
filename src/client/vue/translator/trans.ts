/* eslint-disable react-hooks/rules-of-hooks */
import type { VueTagRenderers } from "../render";
import type { Replacement } from "intor-translator";
import { defineComponent, h, Fragment } from "vue";
import { useTranslator } from "../translator/use-translator";

/**
 * `<Trans />` is a lightweight Vue component for rendering rich translations.
 *
 * It is a thin adapter around `translator.tRich` and introduces no additional logic.
 */
export const Trans = defineComponent({
  name: "Trans",

  props: {
    /** The message key to translate. */
    i18nKey: {
      type: String,
      required: true,
    },

    /** Optional Vue renderers for semantic tags. */
    components: {
      type: Object as () => VueTagRenderers | undefined,
      required: false,
    },

    /** Optional replacement values for interpolation. */
    values: {
      type: Object as () => Replacement | undefined,
      required: false,
    },
  },

  setup(props) {
    const { tRich } = useTranslator();
    return () => {
      const { i18nKey, components, values } = props;
      const nodes = tRich(i18nKey, components, values);
      return h(Fragment, null, nodes);
    };
  },
});
