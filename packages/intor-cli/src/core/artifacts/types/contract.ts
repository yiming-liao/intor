import type { IntorGeneratedKey } from "intor";

export const GENERATED_INTERFACE_NAME = "IntorGeneratedTypes";

export const DEFAULT_CONFIG_KEY = "__default__";

export const GENERATED_FIELD = {
  locales: "Locales",
  messages: "Messages",
  replacements: "Replacements",
  rich: "Rich",
} as const;

export const INTOR_GENERATED_KEY =
  "__intor_generated__" as const satisfies IntorGeneratedKey;
