import type { Diagnostic } from "./diagnostics/types";

export interface CheckReport {
  configs: Array<{ id: string; diagnostics: Diagnostic[] }>;
}

export interface CheckOptions {
  tsconfigPath?: string;
  format?: "human" | "json";
  output?: string;
  debug?: boolean;
}
