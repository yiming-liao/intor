/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { expectType } from "tsd";
import { useTranslator } from "../../../../dist/export/react";

declare global {
  interface IntorGeneratedTypes {}
}

//-------------------------------------------------
// useTranslator / t()
//-------------------------------------------------
{
  const translator = useTranslator();
  type Translate = (typeof translator)["t"];
  expectType<string | undefined>(null as unknown as Parameters<Translate>[0]);
}

// With preKey
{
  const translator = useTranslator("preKey");
  type Translate = (typeof translator)["t"];
  expectType<string | undefined>(null as unknown as Parameters<Translate>[0]);
}

//-------------------------------------------------
// useTranslator / setLocale()
//-------------------------------------------------
{
  const translator = useTranslator();
  type SetLocale = (typeof translator)["setLocale"];
  expectType<string>(null as unknown as Parameters<SetLocale>[0]);
}
