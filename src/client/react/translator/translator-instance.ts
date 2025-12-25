import type { ReactTagRenderers } from "@/client/react/render";
import type { TranslatorInstanceClient } from "@/client/shared/types";
import type { KeyMode, MessageKey } from "@/shared/types";
import type { JSX } from "react/jsx-runtime";
import { type LocaleMessages, type Replacement } from "intor-translator";

/**
 * React-specific translator instance.
 */
export type TranslatorInstanceReact<
  M extends LocaleMessages,
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> = TranslatorInstanceClient<M, PK, Mode> & {
  /** Translate a key into React nodes using semantic tags */
  tRich: (
    key?: MessageKey<M, PK, Mode>,
    tagRenderers?: ReactTagRenderers,
    replacements?: Replacement,
  ) => JSX.Element[];
};
