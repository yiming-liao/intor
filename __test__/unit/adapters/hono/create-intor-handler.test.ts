import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context, Next } from "hono";
import { createIntorHandler } from "../../../../src/adapters/hono/create-intor-handler";
import {
  resolveInbound,
  getLocaleFromAcceptLanguage,
} from "../../../../src/routing";
import { parseCookieHeader, normalizeQuery } from "../../../../src/core";
import { getTranslator } from "../../../../src/edge";

vi.mock("../../../../src/routing", () => ({
  resolveInbound: vi.fn(),
  getLocaleFromAcceptLanguage: vi.fn(),
}));

vi.mock("../../../../src/core", () => ({
  normalizeQuery: vi.fn((q) => q),
  parseCookieHeader: vi.fn(),
}));

vi.mock("../../../../src/edge", () => ({
  getTranslator: vi.fn(),
}));

describe("createIntorHandler (Hono)", () => {
  const config = {
    supportedLocales: ["en", "fr"],
    defaultLocale: "en",
    cookie: { name: "locale" },
  } as any;

  let c: Partial<Context> & Record<string, any>;
  let next: Next;

  beforeEach(() => {
    c = {
      req: { url: "http://localhost/", header: vi.fn(() => undefined) },
      set: vi.fn(),
    } as any;
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("binds inbound routing context to c.set('intor')", async () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue("fr");
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "header",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config);
    await handler(c as Context, next);
    expect(c.set).toHaveBeenCalledWith("intor", {
      locale: "fr",
      localeSource: "header",
      pathname: "/",
    });
    expect(next).toHaveBeenCalled();
  });

  it("forwards locale to getTranslator", async () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config);
    await handler(c as Context, next);
    expect(getTranslator).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        locale: "en",
      }),
    );
  });

  it("binds DX shortcuts by default", async () => {
    const t = vi.fn();
    const tRich = vi.fn();
    const hasKey = vi.fn();
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey,
      t,
      tRich,
    });
    const handler = createIntorHandler(config);
    await handler(c as Context, next);
    expect(c.set).toHaveBeenCalledWith("locale", "en");
    expect(c.set).toHaveBeenCalledWith("t", t);
    expect(c.set).toHaveBeenCalledWith("tRich", tRich);
    expect(c.set).toHaveBeenCalledWith("hasKey", hasKey);
  });

  it("does not bind shortcuts when disabled", async () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config, { shortcuts: false });
    await handler(c as Context, next);
    expect(c.set).not.toHaveBeenCalledWith("locale", expect.anything());
  });

  it("forwards handlers and plugins", async () => {
    const handlers = { loadingHandler: vi.fn() };
    const plugins = [vi.fn()];
    (getLocaleFromAcceptLanguage as any).mockReturnValue("en");
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config, { handlers, plugins } as any);
    await handler(c as Context, next);
    expect(getTranslator).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        locale: "en",
        handlers,
        plugins,
      }),
    );
  });

  it("forwards cookie when present", async () => {
    (c.req as any).header = vi.fn((key: string) =>
      key === "cookie" ? "locale=fr" : undefined,
    );
    (parseCookieHeader as any).mockReturnValue({
      locale: "fr",
    });
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "cookie",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config);
    await handler(c as Context, next);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.objectContaining({
        cookie: "fr",
      }),
    );
  });

  it("normalizes query before passing to resolveInbound", async () => {
    (c.req as any).url = "http://localhost/?foo=bar";
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config);
    await handler(c as Context, next);
    expect(normalizeQuery).toHaveBeenCalledWith({ foo: "bar" });
  });

  it("does not pass detected when accept-language is missing", async () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue(undefined);
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "en",
      localeSource: "default",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config);
    await handler(c as Context, next);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.not.objectContaining({
        detected: expect.anything(),
      }),
    );
  });
});
