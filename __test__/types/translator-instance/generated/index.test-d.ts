import type {
  MessageKey,
  TranslatorInstance,
} from "../../../../dist/types/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {
    __intor_generated__: true;
  }
}

type Messages = GeneratedTypesFixture["config2"]["Messages"];

// -------------------------------------------------
// MessageKey
// -------------------------------------------------

// auto (default) — no preKey
expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | (string & {})>(
  null as unknown as MessageKey<Messages>,
);

// auto — with preKey
expectType<"key" | (string & {})>(
  null as unknown as MessageKey<Messages, "nested">,
);

// strict — no preKey
expectType<"hello" | "nested.key" | "nested2.a.b.c.d">(
  null as unknown as MessageKey<Messages, undefined, "strict">,
);

// strict — with preKey
expectType<"key">(null as unknown as MessageKey<Messages, "nested", "strict">);

// string
expectType<string>(
  null as unknown as MessageKey<Messages, undefined, "string">,
);

// -------------------------------------------------
// TranslatorInstance / t()
// -------------------------------------------------

// auto — no preKey
expectType<
  "hello" | "nested.key" | "nested2.a.b.c.d" | undefined | (string & {})
>(null as unknown as Parameters<TranslatorInstance<Messages>["t"]>[0]);

// auto — with preKey
expectType<"key" | undefined | (string & {})>(
  null as unknown as Parameters<TranslatorInstance<Messages, "nested">["t"]>[0],
);

// strict — no preKey
expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<Messages, undefined, "strict">["t"]
  >[0],
);

// strict — with preKey
expectType<"key" | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<Messages, "nested", "strict">["t"]
  >[0],
);

// string
expectType<string | undefined>(
  null as unknown as Parameters<
    TranslatorInstance<Messages, undefined, "string">["t"]
  >[0],
);
