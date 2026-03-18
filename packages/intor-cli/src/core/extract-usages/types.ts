import type {
  TranslatorFactory,
  TranslatorMethod,
} from "./translator-registry";

/** Describes a local translator binding resolved from a factory and method. */
export interface TranslatorBinding {
  configKey?: string;
  factory: TranslatorFactory;
  method: TranslatorMethod;
}

/** Map of local binding names to their translator bindings. */
export type TranslatorBindingMap = Map<string, TranslatorBinding>;

/** Map of local binding names to their resolved preKey context. */
export type PreKeyMap = Map<string, string>;

interface SourceLocation {
  file: string;
  line: number;
  column: number;
}

/** Static translation prreKey usage extracted from a source file. */
export interface PreKeyUsage
  extends Omit<TranslatorBinding, "method">, SourceLocation {
  localName: string;
  preKey?: string;
}

/** Static translation key usage extracted from a source file. */
export interface KeyUsage extends TranslatorBinding, SourceLocation {
  localName: string; // local binding name (e.g. `t`, `hasKey`)
  key: string;
  preKey?: string;
}

/** Static replacement usage extracted from a translation call. */
export interface ReplacementUsage extends TranslatorBinding, SourceLocation {
  localName: string;
  key: string;
  replacements: string[];
  preKey?: string;
}

/** Static rich-tag usage extracted from a rich translation call. */
export interface RichUsage extends TranslatorBinding, SourceLocation {
  localName: string;
  key: string;
  rich: string[];
  preKey?: string;
}

export interface TransUsage extends SourceLocation {
  key: string;
  configKey?: string;
}

/** Aggregated static translator usages extracted from a project. */
export interface ExtractedUsages {
  preKey: PreKeyUsage[];
  key: KeyUsage[];
  replacement: ReplacementUsage[];
  rich: RichUsage[];
  trans: TransUsage[];
}
