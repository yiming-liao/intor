import type { TranslatorInstance } from "../../../../dist/types/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {
    __intor_generated__: true;
  }
}

type Messages = GeneratedTypesFixture["config2"]["Messages"];

// -------------------------------------------------
// TranslatorInstance / t()
// -------------------------------------------------

declare const t: TranslatorInstance<Messages>["t"];

expectType<string>(t("hello"));
expectType<string>(t("nested.key"));
expectType<string>(t("nested2.a.b.c.d"));
expectType<string>(t("this.key.does.not.exist"));
