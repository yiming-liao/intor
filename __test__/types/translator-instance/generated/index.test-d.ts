import type {
  Key,
  TranslatorInstance,
  Value,
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
// Key
// -------------------------------------------------

// auto (default) — no preKey
expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | (string & {})>(
  null as unknown as Key<Messages>,
);

// auto — with preKey
expectType<"key" | (string & {})>(null as unknown as Key<Messages, "nested">);

// strict — no preKey
expectType<"hello" | "nested.key" | "nested2.a.b.c.d">(
  null as unknown as Key<Messages, undefined, "strict">,
);

// strict — with preKey
expectType<"key">(null as unknown as Key<Messages, "nested", "strict">);

// string
expectType<string>(null as unknown as Key<Messages, undefined, "string">);

//-------------------------------------------------
// Value
//-------------------------------------------------
type M = {
  "{locale}": {
    string: string;
    number: number;
    boolean: boolean;
    null: null;
    array: string[];
    nested: { key: string };
  };
};

// no preKey
expectType<string>(null as unknown as Value<M, undefined, "string">);
expectType<number>(null as unknown as Value<M, undefined, "number">);
expectType<boolean>(null as unknown as Value<M, undefined, "boolean">);
expectType<null>(null as unknown as Value<M, undefined, "null">);
expectType<string[]>(null as unknown as Value<M, undefined, "array">);
expectType<{ key: string }>(null as unknown as Value<M, undefined, "nested">);

// with preKey
expectType<string>(null as unknown as Value<M, "nested", "key">);

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
