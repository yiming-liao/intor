import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IntorProvider } from "@/client/react";
import { useLocale } from "@/client/react/contexts/locale";
import { DEFAULT_CACHE_OPTIONS } from "@/config/constants/cache.constants";
import { DEFAULT_COOKIE_OPTIONS } from "@/config/constants/cookie.constants";
import { DEFAULT_ROUTING_OPTIONS } from "@/config/constants/routing.constants";

const mockConfig: IntorResolvedConfig = {
  id: "test-intor",
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW"],
  fallbackLocales: {},
  messages: {},
  cache: DEFAULT_CACHE_OPTIONS,
  cookie: DEFAULT_COOKIE_OPTIONS,
  routing: DEFAULT_ROUTING_OPTIONS,
};

describe("IntorProvider (integration)", () => {
  it("provides locale through context", () => {
    function Consumer() {
      const { locale } = useLocale();
      return <div data-testid="locale">{locale}</div>;
    }

    render(
      <IntorProvider
        value={{
          config: mockConfig,
          initialLocale: "en-US",
        }}
      >
        <Consumer />
      </IntorProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en-US");
  });
});
