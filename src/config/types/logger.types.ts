import {
  type FormatterConfig,
  type Level,
  type LoggerPreset,
  type NormalizerConfig,
} from "logry/edge";

// Logger options
export type LoggerOptions = {
  level?: Level;
  normalizerConfig?: NormalizerConfig;
  formatterConfig?: FormatterConfig;
  preset?: LoggerPreset;
};
