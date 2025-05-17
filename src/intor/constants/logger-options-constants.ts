import type { ResolvedLoggerOptions } from "../core/intor-config/types/logger-options-types";
import {
  DEFAULT_BORDER_WIDTH,
  DEFAULT_IS_USE_COLOR,
  DEFAULT_LOG_LEVEL,
  DEFAULT_META_DEPTH,
} from "../core/intor-logger/intor-logger-constants";

// Default logger options
export const DEFAULT_LOGGER_OPTIONS: ResolvedLoggerOptions = {
  level: DEFAULT_LOG_LEVEL,
  metaDepth: DEFAULT_META_DEPTH,
  borderWidth: DEFAULT_BORDER_WIDTH,
  isUseColor: DEFAULT_IS_USE_COLOR,
};
