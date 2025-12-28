/* eslint-disable react-hooks/rules-of-hooks */
import type { VueTagRenderers } from "@/client/vue/render";
import type { TranslatorInstanceVue } from "@/client/vue/translator/translator-instance";
import type { MessageKey } from "@/core";
import type { LocaleMessages, Replacement } from "intor-translator";
import { defineComponent, h } from "vue";
import { useTranslator } from "@/client/vue/translator/use-translator";

export const T = defineComponent({
  name: "T",

  props: {
    /** The message key to translate. */
    i18nKey: {
      type: String as () => MessageKey<LocaleMessages, undefined, "string">,
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
    const translator = useTranslator() as TranslatorInstanceVue<
      LocaleMessages,
      undefined,
      "string"
    >;
    return () => {
      const nodes = translator.tRich(
        props.i18nKey,
        props.components,
        props.values,
      );
      return h("span", null, nodes);
    };
  },
});
