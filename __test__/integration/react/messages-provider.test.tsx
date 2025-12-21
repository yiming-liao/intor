import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { LocaleMessages } from "intor-translator";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ConfigProvider } from "@/client/react/contexts/config";
import { LocaleProvider } from "@/client/react/contexts/locale";
import {
  MessagesProvider,
  useMessages,
} from "@/client/react/contexts/messages";
import {
  DEFAULT_CACHE_OPTIONS,
  DEFAULT_COOKIE_OPTIONS,
  DEFAULT_ROUTING_OPTIONS,
} from "@/config";

vi.mock("@/client/react/contexts/messages/utils/use-refetch-messages", () => ({
  useRefetchMessages: () => ({
    refetchMessages: vi.fn(),
  }),
}));

const mockMessages = {
  "en-US": { hello: "World" },
  "zh-TW": { hello: "世界" },
};

const mockConfig: IntorResolvedConfig = {
  id: "test-intor",
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW"],
  fallbackLocales: {},
  messages: mockMessages,
  cache: DEFAULT_CACHE_OPTIONS,
  cookie: DEFAULT_COOKIE_OPTIONS,
  routing: DEFAULT_ROUTING_OPTIONS,
};

describe("MessagesProvider (integration)", () => {
  it("provides initial messages and loading state to consumers", () => {
    let receivedMessages: Readonly<LocaleMessages> = {};
    let receivedLoading = true;

    function Consumer() {
      const { messages, isLoading } = useMessages();
      receivedMessages = messages;
      receivedLoading = isLoading;
      return null;
    }

    render(
      <ConfigProvider value={{ config: mockConfig }}>
        <LocaleProvider value={{ initialLocale: "en-US" }}>
          <MessagesProvider value={{ messages: mockConfig.messages }}>
            <Consumer />
          </MessagesProvider>
        </LocaleProvider>
      </ConfigProvider>,
    );

    expect(receivedMessages).toBe(mockMessages);
    expect(receivedLoading).toBe(false);
  });
});
