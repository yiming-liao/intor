import type { BaseTranslator } from "../../../../dist/types/export/internal";
import type { GeneratedTypesFixture } from "../../__fixtures__/generated-types";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {
    __intor_generated__: true;
  }
}

type M = GeneratedTypesFixture["config2"]["Messages"];
type RE = GeneratedTypesFixture["config2"]["Replacements"];
type RI = GeneratedTypesFixture["config2"]["Rich"];

// -------------------------------------------------
// BaseTranslator / t()
// -------------------------------------------------

{
  const t: BaseTranslator<M, RE, RI>["t"] = {} as any;

  expectType<string>(t("hello"));
  expectType<string>(t("this.key.does.not.exist")); // fallback to string
}

{
  const t: BaseTranslator<M, RE, RI, "nested">["t"] = {} as any;

  expectType<string>(t("key"));
  expectType<string>(t("this.key.does.not.exist")); // fallback to string
}
