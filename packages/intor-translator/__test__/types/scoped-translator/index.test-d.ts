/* eslint-disable unused-imports/no-unused-vars */
import { expectType } from "tsd";
import { Translator as ScopeTranslator, type Replacement } from "../../../dist";

const messages = {
  "en-US": { greeting: "Hello, {name}", a: { b: { c: "d" } } },
  "zh-TW": { greeting: "哈囉, {name}", a: { b: { c: "d" } } },
};
const locale = "en-US";
const withoutMessages = { locale } as const;
const withMessages = { locale, messages } as const;

// No messages provided (fallback to string)
{
  const translator = new ScopeTranslator(withoutMessages);
  const scoped = translator.scoped();
  expectType<string | undefined>(
    null as unknown as Parameters<(typeof scoped)["t"]>[0],
  );
}

// Messages provided (inference mode)
{
  const translator = new ScopeTranslator(withMessages);
  const scoped = translator.scoped();
  expectType<"greeting" | "a.b.c" | undefined>(
    null as unknown as Parameters<(typeof scoped)["t"]>[0],
  );
}

// Explicitly opting out of inference
{
  const translator = new ScopeTranslator<unknown>(withMessages);
  const scoped = translator.scoped();
  expectType<string | undefined>(
    null as unknown as Parameters<(typeof scoped)["t"]>[0],
  );
}

//---------------------------------------------------------------
// With preKey
//---------------------------------------------------------------

// No messages provided
// {
//   const translator = new ScopeTranslator(withoutMessages);
//   const scoped = translator.scoped("a");
//   expectType<string | undefined>(
//     null as unknown as Parameters<(typeof scoped)["t"]>[0],
//   );
// }

// Messages provided (inference mode)
{
  const translator = new ScopeTranslator(withMessages);
  const scoped = translator.scoped("a");
  expectType<"b.c" | undefined>(
    null as unknown as Parameters<(typeof scoped)["t"]>[0],
  );
}

// Explicitly opting out of inference
{
  const translator = new ScopeTranslator<unknown>(withMessages);
  const scoped = translator.scoped("a");
  expectType<string | undefined>(
    null as unknown as Parameters<(typeof scoped)["t"]>[0],
  );
}

//---------------------------------------------------------------
// Replacements
//---------------------------------------------------------------

// No ReplacementShape provided (fallback to Replacement)
{
  const translator = new ScopeTranslator<typeof messages>(withMessages);
  expectType<Replacement | undefined>(
    null as unknown as Parameters<(typeof translator)["t"]>[1],
  );
}

// ReplacementShape provided (inference mode)
{
  type ReplacementShape = { "{locale}": { greeting: { name: string } } };
  const translator = new ScopeTranslator<typeof messages, ReplacementShape>(
    withMessages,
  );
  expectType<{ name: string } | undefined>(
    null as unknown as Parameters<(typeof translator)["t"]>[1],
  );
}
