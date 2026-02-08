import type { ReactTagRenderers } from "../render";
import type { TranslatorInstance } from "@/core";
import type { JSX } from "react/jsx-runtime";
import {
  type Locale,
  type LocaleMessages,
  type LocalizedKey,
  type LocalizedReplacement,
  type LocalizedRich,
  type Replacement,
  type Rich,
  type ScopedKey,
} from "intor-translator";

export type TranslatorInstanceReact<
  M extends LocaleMessages,
  ReplacementSchema = Replacement,
  RichSchema = Rich,
  PK extends string | undefined = undefined,
> = Omit<TranslatorInstance<M, ReplacementSchema, RichSchema, PK>, "tRich"> & {
  /** Indicates whether translations are currently loading. */
  isLoading: boolean;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Translate a key into React nodes using semantic tags */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = LocalizedRich<RichSchema, K>,
    RE = LocalizedReplacement<ReplacementSchema, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: ReactTagRenderers<RI> | ReactTagRenderers,
    replacements?: RE | Replacement,
  ) => JSX.Element[];
};
