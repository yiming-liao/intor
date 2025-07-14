import {
  type FormatterConfig,
  type Level,
  type LoggerPreset,
  type NormalizerConfig,
} from "logry/edge";

// Init logger options
export type InitLoggerOptions = {
  level?: Level;
  normalizerConfig?: NormalizerConfig;
  formatterConfig?: FormatterConfig;
  preset?: LoggerPreset;
};

export type ResolvedLoggerOptions = InitLoggerOptions;
