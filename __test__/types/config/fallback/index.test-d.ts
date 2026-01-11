/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  GenConfigKeys,
  GenConfig,
} from "../../../../dist/types/export/internal";
import type { LocaleMessages, Replacement, Rich } from "intor-translator";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {}
}

//-------------------------------------------------
// GenConfigKeys
//-------------------------------------------------
expectType<string>(null as unknown as GenConfigKeys);

//-------------------------------------------------
// GenConfig
//-------------------------------------------------
expectType<string>(null as unknown as GenConfig<"__default__">["Locales"]);
expectType<LocaleMessages>(
  null as unknown as GenConfig<"__default__">["Messages"],
);
expectType<Replacement>(
  null as unknown as GenConfig<"__default__">["Replacements"],
);
expectType<Rich>(null as unknown as GenConfig<"__default__">["Rich"]);
