/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  MessageKey,
  TranslatorInstance,
} from "../../../../dist/types/export/internal";
import type { LocaleMessages } from "intor-translator";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {}
}

//-------------------------------------------------
// Key
//-------------------------------------------------
// Without preKey
expectType<string>(null as unknown as MessageKey<LocaleMessages, undefined>);

// With preKey
expectType<string>(null as unknown as MessageKey<LocaleMessages, "preKey">);

//-------------------------------------------------
// TranslatorInstance / t()
//-------------------------------------------------
// Without preKey
expectType<string | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, undefined>["t"]
  >[0],
);

// With preKey
expectType<string | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, "preKey">["t"]
  >[0],
);
