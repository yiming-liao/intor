import type { ReaderOptions } from "../../core";

export type MessageSource =
  | { mode: "single"; file: string }
  | { mode: "mapping"; files: Record<string, string> }
  | { mode: "none" };

export interface GenerateOptions extends ReaderOptions {
  messageSource?: MessageSource;
  debug?: boolean;
  toolVersion?: string;
}
