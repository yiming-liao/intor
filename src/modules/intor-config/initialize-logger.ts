import type { InitLoggerOptions } from "./types/logger-options-types";
import type { Logger } from "logry/edge";
import { logry } from "logry/edge";

type InitializeLoggerOptions = {
  id: string;
  scope: string | string[];
  loggerOptions?: InitLoggerOptions;
};

export const initializeLogger = ({
  id,
  scope,
  loggerOptions,
}: InitializeLoggerOptions): Logger => {
  const logger = logry({
    id,
    level: loggerOptions?.level,
    scope,
    ...loggerOptions,
  });

  return logger;
};
