import {
  type LogryLevel,
  type LogryPreset,
  type NormalizeConfig,
  type FormatConfig,
  type RenderConfig,
  type PrintConfig,
} from "logry";

// Logger options
export type LoggerOptions = {
  id: string;
  level?: LogryLevel;
  normalizeConfig?: NormalizeConfig;
  formatConfig?: FormatConfig;
  renderConfig?: RenderConfig;
  printConfig?: PrintConfig;
  preset?: LogryPreset;
};
