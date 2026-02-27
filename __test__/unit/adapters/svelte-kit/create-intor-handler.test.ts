/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Handle } from "@sveltejs/kit";
import { resolveInbound } from "../../../../src/routing";
import { getLocaleFromAcceptLanguage } from "../../../../src/routing";
import { isSvelteKitSSG } from "../../../../src/adapters/svelte-kit/utils/is-svelte-kit-ssg";
import { createIntorHandler } from "../../../../src/adapters/svelte-kit/create-intor-handler";

const mockRedirect = vi.fn();

vi.mock("@sveltejs/kit", () => ({
  redirect: vi.fn((code: number, location: string) => {
    mockRedirect(code, location);
    throw new Error("REDIRECT");
  }),
}));

vi.mock("../../../../src/routing", () => ({
  resolveInbound: vi.fn(),
  getLocaleFromAcceptLanguage: vi.fn(),
}));

vi.mock("../../../../src/adapters/svelte-kit/utils/is-svelte-kit-ssg", () => ({
  isSvelteKitSSG: vi.fn(),
}));

describe("createIntorHandler (SvelteKit)", () => {
  const config = {
    defaultLocale: "en",
    supportedLocales: ["en", "fr"],
    cookie: { name: "locale" },
  } as any;

  let event: any;
  let resolve: any;

  beforeEach(() => {
    event = {
      request: { headers: new Headers() },
      cookies: { get: vi.fn() },
      url: new URL("https://example.com/about"),
      locals: {},
      params: {},
    };
    resolve = vi.fn(async (_event, opts) => {
      const html = opts?.transformPageChunk?.({ html: "<html>%lang%</html>" });
      return { body: html };
    });
    vi.clearAllMocks();
  });

  it("uses path locale in SSG mode", async () => {
    (isSvelteKitSSG as any).mockReturnValue(true);
    event.params = { locale: "fr" };
    const handler: Handle = createIntorHandler(config);
    const response = await handler({ event, resolve });
    expect(event.locals.intor.locale).toBe("fr");
    expect(response.body).toContain("fr");
  });

  it("throws when locale param missing in SSG mode", async () => {
    (isSvelteKitSSG as any).mockReturnValue(true);
    const handler: Handle = createIntorHandler(config);
    await expect(handler({ event, resolve })).rejects.toThrow(
      "Locale param is missing in SSG mode.",
    );
  });

  it("calls resolveInbound and binds locals", async () => {
    (isSvelteKitSSG as any).mockReturnValue(false);
    (getLocaleFromAcceptLanguage as any).mockReturnValue("fr");
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "header",
      pathname: "/fr/about",
      shouldRedirect: false,
    });
    const handler: Handle = createIntorHandler(config);
    await handler({ event, resolve });
    expect(resolveInbound).toHaveBeenCalled();
    expect(event.locals.intor.locale).toBe("fr");
  });

  it("redirects when shouldRedirect is true", async () => {
    (isSvelteKitSSG as any).mockReturnValue(false);
    (getLocaleFromAcceptLanguage as any).mockReturnValue("fr");
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "header",
      pathname: "/fr/about",
      shouldRedirect: true,
    });
    const handler: Handle = createIntorHandler(config);
    await expect(handler({ event, resolve })).rejects.toThrow("REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith(307, "/fr/about");
  });

  it("forwards cookie when present", async () => {
    (isSvelteKitSSG as any).mockReturnValue(false);
    (getLocaleFromAcceptLanguage as any).mockReturnValue(undefined);
    event.cookies.get = vi.fn(() => "fr");
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "cookie",
      pathname: "/fr/about",
      shouldRedirect: false,
    });
    const handler: Handle = createIntorHandler(config);
    await handler({ event, resolve });
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/about",
      expect.objectContaining({ cookie: "fr" }),
    );
  });

  it("does not pass detected when Accept-Language is not detected", async () => {
    (isSvelteKitSSG as any).mockReturnValue(false);
    (getLocaleFromAcceptLanguage as any).mockReturnValue(undefined);
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/about",
      shouldRedirect: false,
    });
    const handler: Handle = createIntorHandler(config);
    await handler({ event, resolve });
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/about",
      expect.not.objectContaining({
        detected: expect.anything(),
      }),
    );
  });
});
