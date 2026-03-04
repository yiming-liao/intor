import type { LogryLevel, LogryPreset } from "logry";

/**
 * Logging configuration.
 *
 * @public
 */
export type LoggerOptions = {
  /**
   * Unique logger identifier.
   *
   * In most cases this is derived from the Intor config id.
   */
  id: string;

  /**
   * Minimum log level threshold.
   */
  level?: LogryLevel;

  /**
   * Logging output preset.
   */
  preset?: LogryPreset;
};
