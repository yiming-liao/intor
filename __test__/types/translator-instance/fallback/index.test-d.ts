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

// auto (default) — no preKey
expectType<string & {}>(
  null as unknown as MessageKey<LocaleMessages, undefined>,
);

// auto — with preKey
expectType<string & {}>(
  null as unknown as MessageKey<LocaleMessages, "preKey">,
);

// strict
expectType<never>(
  null as unknown as MessageKey<LocaleMessages, undefined, "strict">,
);

// string
expectType<string>(
  null as unknown as MessageKey<LocaleMessages, undefined, "string">,
);

//-------------------------------------------------
// TranslatorInstance / t()
//-------------------------------------------------

// auto — no preKey
expectType<(string & {}) | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, undefined>["t"]
  >[0],
);

// auto — with preKey
expectType<(string & {}) | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, "preKey">["t"]
  >[0],
);

// strict
expectType<undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, undefined, "strict">["t"]
  >[0],
);

// string
expectType<string | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<LocaleMessages, undefined, "string">["t"]
  >[0],
);
