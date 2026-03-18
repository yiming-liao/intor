/**
 * Registry of supported Intor translator factories and methods for static key extraction.
 */

// Factories
export const TRANSLATOR_FACTORY = {
  getTranslator: "getTranslator",
  useTranslator: "useTranslator",
} as const;
export const TRANSLATOR_FACTORIES = Object.values(TRANSLATOR_FACTORY);
export type TranslatorFactory = (typeof TRANSLATOR_FACTORIES)[number];

// Methods
export const TRANSLATOR_METHOD = {
  hasKey: "hasKey",
  t: "t",
  tRich: "tRich",
} as const;
export const TRANSLATOR_METHODS = Object.values(TRANSLATOR_METHOD);
export type TranslatorMethod = (typeof TRANSLATOR_METHODS)[number];
