import type { MissingResult } from "./missing";
import type { ReaderOptions } from "../../core";

export interface MissingByLocale {
  [locale: string]: MissingResult;
}

export interface MissingReport {
  [configId: string]: MissingByLocale;
}

export interface ValidateOptions extends ReaderOptions {
  format?: "human" | "json";
  output?: string;
  debug?: boolean;
}
