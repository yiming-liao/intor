import type { LoaderOptions } from "../../../../src/intor/core/intor-config/types/loader-options-types";
import { shouldLoadDynamicMessages } from "../../../../src/intor/core/intor-runtime/utils/should-load-dynamic-messages";

describe("shouldLoadDynamicMessages", () => {
  it("returns false if loaderOptions is undefined", () => {
    expect(shouldLoadDynamicMessages(undefined, "next-client")).toBe(false);
  });

  it("returns true if type is 'import' (regardless of adapter or lazyLoad)", () => {
    expect(
      shouldLoadDynamicMessages(
        { type: "import", lazyLoad: false },
        "next-client",
      ),
    ).toBe(true);
    expect(
      shouldLoadDynamicMessages(
        { type: "import", lazyLoad: true },
        "next-server",
      ),
    ).toBe(true);
  });

  it("returns true if type is 'api' and adapter is not 'next-client'", () => {
    expect(
      shouldLoadDynamicMessages(
        { type: "api", lazyLoad: true } as LoaderOptions,
        "next-server",
      ),
    ).toBe(true);
    expect(
      shouldLoadDynamicMessages(
        { type: "api", lazyLoad: false } as LoaderOptions,
        "custom-adapter",
      ),
    ).toBe(true);
  });

  it("returns true if type is 'api' and adapter is 'next-client' but lazyLoad is false", () => {
    expect(
      shouldLoadDynamicMessages(
        { type: "api", lazyLoad: false } as LoaderOptions,
        "next-client",
      ),
    ).toBe(true);
  });

  it("returns false if type is 'api' and adapter is 'next-client' and lazyLoad is true", () => {
    expect(
      shouldLoadDynamicMessages(
        { type: "api", lazyLoad: true } as LoaderOptions,
        "next-client",
      ),
    ).toBe(false);
  });

  it("returns false for unknown type", () => {
    expect(
      shouldLoadDynamicMessages(
        { type: "unknown" as unknown, lazyLoad: false } as LoaderOptions,
        "next-client",
      ),
    ).toBe(false);
  });
});
