import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConfigProvider } from "@/client/react/contexts/config";
import { LocaleProvider, useLocale } from "@/client/react/contexts/locale";
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

describe("LocaleProvider (integration)", () => {
  it("updates locale when setLocale is called", async () => {
    function Consumer() {
      const { locale, setLocale } = useLocale();
      return (
        <>
          <div data-testid="locale">{locale}</div>
          <button data-testid="button" onClick={() => setLocale("zh-TW")}>
            switch
          </button>
        </>
      );
    }

    const user = userEvent.setup();
    const onLocaleChange = vi.fn();

    render(
      <ConfigProvider value={{ config: mockConfig }}>
        <LocaleProvider value={{ initialLocale: "en-US", onLocaleChange }}>
          <Consumer />
        </LocaleProvider>
      </ConfigProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en-US");

    await user.click(screen.getByTestId("button"));
    expect(screen.getByTestId("locale")).toHaveTextContent("zh-TW");
    expect(onLocaleChange).toHaveBeenCalledWith("zh-TW");
  });
});
