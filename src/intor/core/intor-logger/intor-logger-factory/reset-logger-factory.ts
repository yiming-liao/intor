import { intorLoggerCoreMap } from "./intor-logger-core-map";

/*
 * Resets the logger factory by clearing the stored logger instances.
 * This will remove all existing logger cores.
 */
export function resetLoggerFactory() {
  intorLoggerCoreMap.clear();
}
