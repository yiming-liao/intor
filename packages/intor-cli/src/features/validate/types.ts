import type { ReaderOptions } from "../../core";
import type { MissingRequirements } from "./missing/collect-missing-requirements";

export type MissingRequirementsByLocale = {
  [locale: string]: MissingRequirements;
};

export type MissingReport = { [configId: string]: MissingRequirementsByLocale };

export interface ValidateOptions extends ReaderOptions {
  format?: "human" | "json";
  output?: string;
  debug?: boolean;
}
