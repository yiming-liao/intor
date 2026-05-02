import type { BaseTranslator } from "../../../../dist/types/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import type { IntlFormatter } from "intor-translator";
import { expectError, expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes extends GeneratedTypesFixture {}
}

type M = GeneratedTypesFixture["config2"]["Messages"];
type RE = GeneratedTypesFixture["config2"]["Replacements"];
type RI = GeneratedTypesFixture["config2"]["Rich"];

//-------------------------------------------------
// BaseTranslator / state
//-------------------------------------------------

{
  const translator: BaseTranslator<M, RE, RI> = {} as any;

  expectType<M>(translator.messages);
  expectType<"{locale}">(translator.locale);
  expectType<IntlFormatter>(translator.format);
}

//-------------------------------------------------
// BaseTranslator / key input
//-------------------------------------------------

{
  // loose
  expectType<
    "hello" | "nested.key" | "nested2.a.b.c.d" | (string & {}) | undefined
  >(null as unknown as Parameters<BaseTranslator<M, RE, RI>["t"]>[0]);
  expectType<
    "hello" | "nested.key" | "nested2.a.b.c.d" | (string & {}) | undefined
  >(null as unknown as Parameters<BaseTranslator<M, RE, RI>["hasKey"]>[0]);
  expectType<
    "hello" | "nested.key" | "nested2.a.b.c.d" | (string & {}) | undefined
  >(null as unknown as Parameters<BaseTranslator<M, RE, RI>["tRich"]>[0]);

  // strict
  expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, undefined, "strict">["t"]
    >[0],
  );
  expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, undefined, "strict">["hasKey"]
    >[0],
  );
  expectType<"hello" | "nested.key" | "nested2.a.b.c.d" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, undefined, "strict">["tRich"]
    >[0],
  );
}

//-------------------------------------------------
// BaseTranslator / key input (with preKey)
//-------------------------------------------------

{
  // loose
  expectType<"key" | (string & {}) | undefined>(
    null as unknown as Parameters<BaseTranslator<M, RE, RI, "nested">["t"]>[0],
  );
  expectType<"key" | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, "nested">["hasKey"]
    >[0],
  );
  expectType<"key" | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, "nested">["tRich"]
    >[0],
  );

  expectType<"d" | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, "nested2.a.b.c">["t"]
    >[0],
  );

  // strict
  expectType<"key" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, "nested", "strict">["t"]
    >[0],
  );
  expectType<"key" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, "nested", "strict">["hasKey"]
    >[0],
  );
  expectType<"key" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, "nested", "strict">["tRich"]
    >[0],
  );

  expectType<"d" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, "nested2.a.b.c", "strict">["t"]
    >[0],
  );
}

//-------------------------------------------------
// BaseTranslator / args
//-------------------------------------------------

{
  expectType<"{locale}" | undefined>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, undefined, "strict">["hasKey"]
    >[1],
  );

  expectType<unknown>(
    null as unknown as Parameters<
      BaseTranslator<M, RE, RI, undefined, "strict">["tRich"]
    >[2],
  );

  const { t, hasKey, tRich }: BaseTranslator<M, RE, RI, undefined, "strict"> =
    {} as any;

  expectType<string>(t("hello", { name: "Ada" }));
  expectType<string>(t("nested.key", { anything: true }));
  expectError(t("hello", "Ada"));

  expectType<boolean>(hasKey("hello", "{locale}"));
  expectType<boolean>(hasKey("nested2.a.b.c.d", "{locale}"));
  expectError(hasKey("hello", "zh-TW"));

  expectType<string>(
    tRich("hello", { a: (children) => children.join("") }, { name: "Ada" }),
  );
  expectType<string>(tRich("nested.key", { b: "<b>" }, { anything: true }));
  expectError(tRich("hello", { a: 123 }));
  expectType<string>(
    tRich("hello", { a: (children) => children.join("") }, "Ada"),
  );
}

//-------------------------------------------------
// BaseTranslator / return type
//-------------------------------------------------

{
  const { t, hasKey, tRich }: BaseTranslator<M, RE, RI> = {} as any;

  expectType<string>(t("hello"));
  expectType<string>(t("this.key.does.not.exist"));
  expectType<boolean>(hasKey("hello"));
  expectType<boolean>(hasKey("this.key.does.not.exist"));
  expectType<string>(tRich("hello"));
  expectType<string>(tRich("this.key.does.not.exist"));
}

{
  const { t, hasKey, tRich }: BaseTranslator<M, RE, RI, undefined, "strict"> =
    {} as any;

  expectType<string>(t("hello"));
  expectType<string>(t("nested.key"));
  expectType<string>(t("nested2.a.b.c.d"));
  expectError(t("this.key.does.not.exist"));

  expectType<boolean>(hasKey("hello"));
  expectType<boolean>(hasKey("nested.key"));
  expectType<boolean>(hasKey("nested2.a.b.c.d"));
  expectError(hasKey("this.key.does.not.exist"));

  expectType<string>(tRich("hello"));
  expectType<string>(tRich("nested.key"));
  expectType<string>(tRich("nested2.a.b.c.d"));
  expectError(tRich("this.key.does.not.exist"));
}

{
  const { t, hasKey, tRich }: BaseTranslator<M, RE, RI, "nested", "strict"> =
    {} as any;

  expectType<string>(t("key"));
  expectError(t("nested.key"));
  expectError(t("hello"));

  expectType<boolean>(hasKey("key"));
  expectError(hasKey("nested.key"));
  expectError(hasKey("hello"));

  expectType<string>(tRich("key"));
  expectError(tRich("nested.key"));
  expectError(tRich("hello"));
}

{
  const {
    t,
    hasKey,
    tRich,
  }: BaseTranslator<M, RE, RI, "nested2.a.b.c", "strict"> = {} as any;

  expectType<string>(t("d"));
  expectError(t("nested2.a.b.c.d"));

  expectType<boolean>(hasKey("d"));
  expectError(hasKey("nested2.a.b.c.d"));

  expectType<string>(tRich("d"));
  expectError(tRich("nested2.a.b.c.d"));
}
