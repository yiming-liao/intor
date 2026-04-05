import type { MergeOverrides } from "./types";
import type { LocaleMessages } from "intor-translator";
import { mergeMessages, type IntorResolvedConfig } from "intor";

interface MergeMessagesByLayerCtx {
  config: IntorResolvedConfig;
  locale: string;
  overrides: MergeOverrides[];
}

/**
 * Merge two message layers and collect merge override events.
 */
export function mergeMessagesByLayer(
  layer: MergeOverrides["layer"],
  base: LocaleMessages | undefined,
  incoming: LocaleMessages | undefined,
  { config, locale, overrides }: MergeMessagesByLayerCtx,
): LocaleMessages {
  return mergeMessages(base, incoming, {
    config,
    locale,
    onEvent: (event) => {
      overrides.push({
        ...event,
        layer,
        locale,
        configId: config.id,
      });
    },
  });
}
