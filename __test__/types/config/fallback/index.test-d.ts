/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  GenConfigKeys,
  GenConfig,
} from "../../../../dist/export/internal";
import type { LocaleMessages } from "intor-translator";
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
