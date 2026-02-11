import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";

/**
 * Runtime message loader override.
 *
 * Loads locale messages imperatively at runtime, bypassing
 * message loading defined in the Intor config.
 */
export type MessagesLoader = (
  config: IntorResolvedConfig,
  locale: string,
) => Promise<LocaleMessages>;
