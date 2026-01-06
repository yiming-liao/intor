import type { IntorResolvedConfig } from "@/config";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { IntorProvider, useIntor } from "@/client/react";
import { DEFAULT_ROUTING_OPTIONS, DEFAULT_COOKIE_OPTIONS } from "@/config";

// mock fetch
globalThis.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    "zh-TW": { hello: "世界" },
  }),
});

// mock component
function Component() {
  const { translator, setLocale } = useIntor();
  return (
    <>
      <div data-testid="text">{translator.t("hello")}</div>
      <button onClick={() => setLocale("zh-TW")}>switch</button>
    </>
  );
}

const mockMessages = {
  "en-US": { hello: "World" },
  "zh-TW": { hello: "世界" },
};

const mockConfig: IntorResolvedConfig = {
  id: "smoke-test",
  defaultLocale: "en-US",
  supportedLocales: ["en-US", "zh-TW"],
  fallbackLocales: {},
  messages: mockMessages,
  loader: { type: "remote", url: "" },
  cookie: DEFAULT_COOKIE_OPTIONS,
  routing: DEFAULT_ROUTING_OPTIONS,
  logger: { id: "test" },
};

describe("Contexts flow (smoke)", () => {
  it("switches locale and updates translated text", async () => {
    const user = userEvent.setup();

    render(
      <IntorProvider
        value={{
          config: mockConfig,
          locale: "en-US",
        }}
      >
        <Component />
      </IntorProvider>,
    );

    expect(screen.getByTestId("text")).toHaveTextContent("World");

    // switch locale
    await user.click(screen.getByText("switch"));
    expect(globalThis.fetch).toHaveBeenCalled();

    expect(await screen.findByText("世界")).toBeInTheDocument();
  });
});
