import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import type { Writable } from "svelte/store";
import { createRefetchMessages } from "../../../shared/messages";

export function attachMessagesEffects({
  locale,
  config,
  runtimeMessages,
  internalIsLoading,
}: {
  locale: Writable<string>;
  config: IntorResolvedConfig;
  runtimeMessages: Writable<LocaleMessages | null>;
  internalIsLoading: Writable<boolean>;
}): () => void {
  // Prepares message refetch function.
  const refetchMessages = createRefetchMessages({
    config,
    onLoadingStart: () => internalIsLoading.set(true),
    onLoadingEnd: () => internalIsLoading.set(false),
    onMessages: (messages) => runtimeMessages.set(messages),
  });

  // Refetch messages when locale changes (except initial render).
  let isInitial = true;
  const unsubscribe = locale.subscribe((value) => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    refetchMessages(value);
  });

  return unsubscribe;
}
