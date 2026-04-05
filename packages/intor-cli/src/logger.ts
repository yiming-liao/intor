import { dim, green, red, yellow } from "./render";

export interface Logger {
  header: (message?: string, options?: LogOptions) => void;
  log: (message?: string, options?: LogOptions) => void;
  footer: (message?: string, options?: LogOptions) => void;
  process: (tag: ProcessTag, message: string) => void;
  ok: (message?: string) => void;
  error: (message?: string) => void;
}

const noop = () => {};
const noopLogger: Logger = {
  header: noop,
  log: noop,
  footer: noop,
  process: noop,
  ok: noop,
  error: noop,
};

interface LogOptions {
  prefix?: string;
  kind?: "process";
  lineBreakBefore?: number;
  lineBreakAfter?: number;
}

const SPACER = dim("│  ");
const log = console.log;

export function createLogger(enabled = true): Logger {
  if (!enabled) return noopLogger;

  return {
    header: (message = "", options: LogOptions = {}) => {
      const prefix = options.prefix ?? "";
      const symbol = options.kind === "process" ? dim("○ ") : "";
      const before = options.lineBreakBefore ?? 0;
      const after = options.lineBreakAfter ?? 0;

      for (let i = 0; i < before; i++) log(SPACER);
      log(prefix + dim("┌─ ") + symbol + message);
      for (let i = 0; i < after; i++) log(SPACER);
    },

    log: (message = "", options: LogOptions = {}) => {
      const prefix = options.prefix ?? "";
      log(prefix + SPACER + message);
    },

    footer: (message = "", options: LogOptions = {}) => {
      const prefix = options.prefix ?? "";
      const symbol = options.kind === "process" ? dim("● ") : "";
      const before = options.lineBreakBefore ?? 0;
      const after = options.lineBreakAfter ?? 0;

      for (let i = 0; i < before; i++) log(SPACER);
      log(prefix + dim("└─ ") + symbol + message);
      for (let i = 0; i < after; i++) log(SPACER);
    },

    process: (tag: ProcessTag, message: string) => {
      log(...formatProcessLog(tag, message));
    },

    ok: (message = "") => {
      log(dim("╶─ ") + green("✔ ") + message);
    },

    error: (message = "") => {
      log(dim("╶─ ") + red("✖ ") + message);
    },
  };
}

// Format process log
type ProcessTag = "ok" | "warn" | "skip" | "load";
interface TagStyle {
  color?: (s: string) => string;
  dimMessage?: boolean;
}
const TAG_STYLES: Record<string, TagStyle> = {
  ok: { color: green },
  warn: { color: yellow },
  skip: { color: dim, dimMessage: true },
  load: {},
};
const formatProcessLog = (tag: ProcessTag, message: string) => {
  const style = TAG_STYLES[tag] ?? {};
  const paddedTag = tag.padEnd(4, " ");
  const finalTag = style.color ? style.color(paddedTag) : paddedTag;
  const finalMessage = style.dimMessage ? dim(message) : message;
  return [SPACER + dim("│ ") + finalTag + dim(" │ ") + finalMessage];
};
