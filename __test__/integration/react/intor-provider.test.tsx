import type { IntorResolvedConfig } from "@/config";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IntorProvider, useIntor } from "@/client/react";
import { DEFAULT_ROUTING_OPTIONS, DEFAULT_COOKIE_OPTIONS } from "@/config";

const mockConfig: IntorResolvedConfig = {
  id: "test-intor",
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW"],
  fallbackLocales: {},
  messages: {},
  cookie: DEFAULT_COOKIE_OPTIONS,
  routing: DEFAULT_ROUTING_OPTIONS,
  logger: { id: "test" },
};

describe("IntorProvider (integration)", () => {
  it("provides locale through context", () => {
    function Consumer() {
      const { locale } = useIntor();
      return <div data-testid="locale">{locale}</div>;
    }

    render(
      <IntorProvider
        value={{
          config: mockConfig,
          locale: "en-US",
        }}
      >
        <Consumer />
      </IntorProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en-US");
  });
});
