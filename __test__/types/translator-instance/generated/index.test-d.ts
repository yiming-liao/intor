import type { Key, TranslatorInstance } from "../../../../dist/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {
    __intor_generated__: true;
  }
}

type Messages = GeneratedTypesFixture["config2"]["Messages"];

//-------------------------------------------------
// Key
//-------------------------------------------------
// Without preKey
expectType<"hello" | "nested.key" | "nested2.a.b.c.d">(
  null as unknown as Key<Messages, undefined>,
);

// With preKey
expectType<never>(null as unknown as Key<Messages, "hello">);
expectType<"key">(null as unknown as Key<Messages, "nested">);

//-------------------------------------------------
// TranslatorInstance / t()
//-------------------------------------------------
expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<Messages, undefined>["t"]
  >[0],
);

// With preKey
expectType<undefined>(
  null as unknown as Parameters<TranslatorInstance<Messages, "hello">["t"]>[0],
);
expectType<"key" | undefined>(
  null as unknown as Parameters<TranslatorInstance<Messages, "nested">["t"]>[0],
);
expectType<"a.b.c.d" | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<Messages, "nested2">["t"]
  >[0],
);
