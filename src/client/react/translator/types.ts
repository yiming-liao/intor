import type { BaseTranslator } from "../../../core";
import type { ReactTagRenderers } from "../render";
import type * as React from "react";
import {
  type Locale,
  type LocaleMessages,
  type LocalizedKey,
  type LocalizedReplacement,
  type LocalizedRich,
  type Replacement,
  type Rich,
  type ScopedKey,
  type ScopedReplacement,
  type ScopedRich,
} from "intor-translator";

export type ReactTranslator<
  M extends LocaleMessages,
  ReplacementShape = Replacement,
  RichShape = Rich,
  PK extends string | undefined = undefined,
> = Omit<BaseTranslator<M, ReplacementShape, RichShape, PK>, "tRich"> & {
  /** Whether translations are loading. */
  isLoading: boolean;

  /** Update the active locale. */
  setLocale: (locale: Locale<M>) => void;

  /** Resolve a localized value and render it as React nodes. */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = PK extends string
      ? ScopedRich<RichShape, PK, K>
      : LocalizedRich<RichShape, K>,
    RE = PK extends string
      ? ScopedReplacement<ReplacementShape, PK, K>
      : LocalizedReplacement<ReplacementShape, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: ReactTagRenderers<RI> | ReactTagRenderers,
    replacements?: RE | Replacement,
  ) => React.ReactNode[];
};
