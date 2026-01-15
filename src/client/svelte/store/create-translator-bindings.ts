import type { Translator } from "intor-translator";
import type { Replacement } from "intor-translator";
import { derived, type Readable } from "svelte/store";
import { renderRichMessageSvelte, type SvelteTagRenderers } from "../render";

export function createTranslatorBindings(translator: Readable<Translator>) {
  const scoped = (preKey: string) => {
    const scopedTranslator = derived(translator, ($t) => $t.scoped(preKey));
    return createTranslatorBindings(scopedTranslator as Readable<Translator>);
  };

  const t = derived(translator, ($t) => {
    return (key: string, replacements?: Replacement) =>
      $t.t(key, replacements) as string;
  });

  const tRich = derived(translator, ($t) => {
    return (
      key: string,
      tagRenderers?: SvelteTagRenderers,
      replacements?: Replacement,
    ) => {
      const message = $t.t(key, replacements);
      return renderRichMessageSvelte(message, tagRenderers);
    };
  });

  return {
    scoped,
    t,
    tRich,
  };
}
