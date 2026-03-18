export interface Diagnostic {
  severity: "error" | "warn";
  origin: string;
  messageKey: string;
  code: string;
  message: string;
  file: string;
  line: number;
  column: number;
}

export interface DiagnosticGroup {
  severity: "error" | "warn";
  origin: string;
  messageKey: string;
  problems: string[]; // list of bullet messages
  file: string;
  lines: number[]; // sorted, unique
}
