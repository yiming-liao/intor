import { Locale, LocaleNamespaceMessages } from "intor-translator";
import { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";

// If generated util
export type IfGen<Then, Else = never> = IntorGeneratedTypes extends void
  ? Else
  : Then;

// Config keys
export type GenConfigKeys = IfGen<keyof IntorGeneratedTypes, string>;

// Config
export type GenConfig<C extends GenConfigKeys = "__default__"> =
  IntorGeneratedTypes extends void
    ? { Locales: string; Messages: LocaleNamespaceMessages } // fallback
    : C extends keyof IntorGeneratedTypes
      ? {
          Locales: IntorGeneratedTypes[C]["Locales"];
          Messages: {
            [K in IntorGeneratedTypes[C]["Locales"]]: IntorGeneratedTypes[C]["Messages"][typeof PREFIX_PLACEHOLDER];
          };
        }
      : never;

//====== Messages ======
export type GenMessages<C extends GenConfigKeys = "__default__"> =
  GenConfig<C>["Messages"];

//====== Locale ======
type GenLocaleFallback = Locale;

export type GenLocale<Config extends string = "__default__"> =
  Config extends keyof IntorGeneratedTypes
    ? IntorGeneratedTypes[Config]["Locales"]
    : GenLocaleFallback;
