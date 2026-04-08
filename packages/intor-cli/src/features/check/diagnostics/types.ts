/* v8 ignore file */

export interface Diagnostic {
  /** factory / method */
  origin: string;
  messageKey: string;
  code: string;
  message: string;
  file: string;
  line: number;
  column: number;
}

export interface DiagnosticGroup {
  origin: string;
  messageKey: string;
  problems: string[]; // list of bullet messages
  file: string;
  lines: number[]; // sorted, unique
}
