import type { MissingResult } from "./missing";

export interface MissingByLocale {
  [locale: string]: MissingResult;
}

export interface MissingReport {
  [configId: string]: MissingByLocale;
}
