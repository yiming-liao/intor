/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { expectType } from "tsd";
import { useTranslator } from "../../../../../../dist/export/react";

declare global {
  interface IntorGeneratedTypes {}
}

const translator = useTranslator();
type Translator = typeof translator;
type T = Translator["t"];

//-------------------------------------------------
// GenConfigKeys
//-------------------------------------------------
expectType<string | undefined>(null as unknown as Parameters<T>[0]);
