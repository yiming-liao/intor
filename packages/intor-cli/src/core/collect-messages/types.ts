import type { ExtraExt } from "../constants";
import type { LocaleMessages, MergeMessagesEvent } from "intor";

export interface ReaderOptions {
  exts?: Array<ExtraExt>;
  customReaders?: Record<string, string>; // {ext, customReaderFilePath}
}

export interface CollectRuntimeMessagesResult {
  messages: LocaleMessages;
  overrides: MergeOverrides[];
}

export interface MergeOverrides extends MergeMessagesEvent {
  layer: "clientOverServer" | "runtimeOverStatic";
  locale: string;
  configId: string;
}
