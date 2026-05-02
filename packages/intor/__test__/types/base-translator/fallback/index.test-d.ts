import type { BaseTranslator } from "../../../../dist/types/export/internal";
import type { HtmlTagRenderers } from "../../../../dist/types/export/shared-types";
import type {
  IntlFormatter,
  LocaleMessages,
  Replacement,
} from "intor-translator";
import { expectType } from "tsd";

declare global {
  interface IntorGeneratedTypes {}
}

//-------------------------------------------------
// BaseTranslator / state
//-------------------------------------------------

{
  const translator: BaseTranslator<LocaleMessages> = {} as any;

  expectType<LocaleMessages>(translator.messages);
  expectType<string>(translator.locale);
  expectType<IntlFormatter>(translator.format);
}

//-------------------------------------------------
// BaseTranslator / key input
//-------------------------------------------------

{
  // loose
  expectType<string | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<LocaleMessages, unknown, unknown, undefined, "loose">["t"]
    >[0],
  );
  expectType<string | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        undefined,
        "loose"
      >["hasKey"]
    >[0],
  );
  expectType<string | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        undefined,
        "loose"
      >["tRich"]
    >[0],
  );

  // strict
  expectType<string | undefined>(
    null as unknown as Parameters<
      BaseTranslator<LocaleMessages, unknown, unknown, undefined, "strict">["t"]
    >[0],
  );
  expectType<string | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        undefined,
        "strict"
      >["hasKey"]
    >[0],
  );
  expectType<string | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        undefined,
        "strict"
      >["tRich"]
    >[0],
  );
}

//-------------------------------------------------
// BaseTranslator / key input (with preKey)
//-------------------------------------------------

{
  // loose
  expectType<string | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<LocaleMessages, unknown, unknown, "preKey", "loose">["t"]
    >[0],
  );
  expectType<string | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        "preKey",
        "loose"
      >["hasKey"]
    >[0],
  );
  expectType<string | (string & {}) | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        "preKey",
        "loose"
      >["tRich"]
    >[0],
  );

  // strict
  expectType<string | undefined>(
    null as unknown as Parameters<
      BaseTranslator<LocaleMessages, unknown, unknown, "preKey", "strict">["t"]
    >[0],
  );
  expectType<string | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        "preKey",
        "strict"
      >["hasKey"]
    >[0],
  );
  expectType<string | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        "preKey",
        "strict"
      >["tRich"]
    >[0],
  );
}

//-------------------------------------------------
// BaseTranslator / args
//-------------------------------------------------

{
  expectType<Replacement | undefined>(
    null as unknown as Parameters<
      BaseTranslator<LocaleMessages, unknown, unknown, "preKey", "strict">["t"]
    >[1],
  );

  expectType<string | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        "preKey",
        "strict"
      >["hasKey"]
    >[1],
  );

  expectType<HtmlTagRenderers | HtmlTagRenderers<unknown> | undefined>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        "preKey",
        "strict"
      >["tRich"]
    >[1],
  );

  expectType<unknown>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        unknown,
        unknown,
        "preKey",
        "strict"
      >["tRich"]
    >[2],
  );

  expectType<unknown>(
    null as unknown as Parameters<
      BaseTranslator<
        LocaleMessages,
        Replacement,
        unknown,
        "preKey",
        "strict"
      >["tRich"]
    >[2],
  );
}

//-------------------------------------------------
// BaseTranslator / return type
//-------------------------------------------------

{
  const {
    t,
    hasKey,
    tRich,
  }: BaseTranslator<LocaleMessages, unknown, unknown, "preKey", "strict"> =
    {} as any;

  expectType<string>(t("any.key"));
  expectType<boolean>(hasKey("any.key"));
  expectType<string>(tRich("any.key"));
}
