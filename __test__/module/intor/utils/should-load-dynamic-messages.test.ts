import { LoaderOptions } from "@/modules/config/types/loader.types";
import { shouldLoadMessages } from "@/modules/intor/utils/should-load-messages";

describe("shouldLoadMessages", () => {
  it("returns false if loaderOptions is undefined", () => {
    expect(shouldLoadMessages(undefined)).toBe(false);
  });

  it("returns true if type is 'import' (regardless of adapter or lazyLoad)", () => {
    expect(shouldLoadMessages({ type: "import", lazyLoad: false })).toBe(true);
  });

  it("returns true if type is 'api' and adapter is not 'next'", () => {
    expect(
      shouldLoadMessages(
        { type: "api", lazyLoad: false } as LoaderOptions,
        // @ts-expect-error any
        "custom-adapter",
      ),
    ).toBe(true);
  });

  it("returns true if type is 'api' and adapter is 'next' but lazyLoad is false", () => {
    expect(
      shouldLoadMessages({ type: "api", lazyLoad: false } as LoaderOptions),
    ).toBe(true);
  });

  it("returns false if type is 'api' and adapter is 'next' and lazyLoad is true", () => {
    expect(
      shouldLoadMessages({ type: "api", lazyLoad: true } as LoaderOptions),
    ).toBe(false);
  });
});
