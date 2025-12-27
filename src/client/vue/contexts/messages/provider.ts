import type { IntorResolvedConfig } from "@/config";
import type { LocaleMessages } from "intor-translator";
import { ref, computed, provide, watch, type Ref } from "vue";
import {
  createRefetchMessages,
  type RefetchMessagesFn,
} from "@/client/shared/utils/create-refetch-messages";
import { MessagesContextKey } from "./context";

interface ProvideMessagesProps {
  config: IntorResolvedConfig;
  localeRef: Ref<string>;
  initialMessagesRef?: Ref<LocaleMessages | undefined>;
}

export function provideMessages({
  config,
  localeRef,
  initialMessagesRef,
}: ProvideMessagesProps) {
  const runtimeMessages = ref<LocaleMessages | null>(null);
  const isLoadingMessagesRef = ref(false);

  // Prepares message refetch function.
  const refetchMessages: RefetchMessagesFn = createRefetchMessages({
    config,
    onLoadingStart: () => {
      isLoadingMessagesRef.value = true;
    },
    onLoadingEnd: () => {
      isLoadingMessagesRef.value = false;
    },
    onMessages: (messages) => {
      runtimeMessages.value = messages;
    },
  });

  // Refetch messages when locale changes (except initial render).
  watch(
    () => localeRef.value,
    (newLocale) => {
      refetchMessages(newLocale);
    },
  );

  const contextValue = computed(() => ({
    messages: runtimeMessages.value || initialMessagesRef?.value || {},
    isLoading: isLoadingMessagesRef.value,
  }));

  provide(MessagesContextKey, contextValue);

  return {
    messagesRef: computed(() => contextValue.value.messages),
    isLoadingRef: isLoadingMessagesRef,
  };
}
