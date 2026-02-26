import type { FastifyRequest } from "fastify";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createIntorHandler } from "../../../../src/adapters/fastify/create-intor-handler";
import {
  resolveInbound,
  getLocaleFromAcceptLanguage,
} from "../../../../src/routing";
import { parseCookieHeader } from "../../../../src/core";
import { getTranslator } from "../../../../src/server";

vi.mock("../../../../src/routing", () => ({
  resolveInbound: vi.fn(),
  getLocaleFromAcceptLanguage: vi.fn(),
}));

vi.mock("../../../../src/core", () => ({
  normalizeQuery: (q: unknown) => q,
  parseCookieHeader: vi.fn(),
}));

vi.mock("../../../../src/server", () => ({
  getTranslator: vi.fn(),
}));

describe("createIntorHandler (Fastify)", () => {
  const config = {
    supportedLocales: ["en", "fr"],
    defaultLocale: "en",
    cookie: { name: "locale" },
  } as any;

  let request: Partial<FastifyRequest> & Record<string, any>;

  beforeEach(() => {
    request = {
      headers: {},
      query: {},
      hostname: "localhost",
      raw: { url: "/" },
    } as any;
    vi.clearAllMocks();
  });

  it("binds inbound routing context to request.intor", async () => {
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
    await handler(request as FastifyRequest);
    expect(request.intor).toEqual({
      locale: "fr",
      localeSource: "header",
      pathname: "/",
    });
  });

  it("passes correct locale to getTranslator", async () => {
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
    await handler(request as FastifyRequest);
    expect(getTranslator).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        locale: "en",
        allowCacheWrite: true,
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
    await handler(request as FastifyRequest);
    expect(request.locale).toBe("en");
    expect(request.t).toBe(t);
    expect(request.tRich).toBe(tRich);
    expect(request.hasKey).toBe(hasKey);
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
    await handler(request as FastifyRequest);
    expect(request.locale).toBeUndefined();
    expect(request.t).toBeUndefined();
    expect(request.tRich).toBeUndefined();
    expect(request.hasKey).toBeUndefined();
  });

  it("forwards loader, readers, handlers and plugins", async () => {
    const loader = { mode: "runtime" } as any;
    const readers = { json: vi.fn() } as any;
    const handlers = { loadingHandler: vi.fn() } as any;
    const plugins = [vi.fn()] as any;
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
    const handler = createIntorHandler(config, {
      loader,
      readers,
      handlers,
      plugins,
    });
    await handler(request as FastifyRequest);
    expect(getTranslator).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        locale: "en",
        allowCacheWrite: true,
        loader,
        readers,
        handlers,
        plugins,
      }),
    );
  });

  it("reads raw pathname correctly from request.raw.url", async () => {
    (request.raw as any).url = "/fr/dashboard?foo=bar";
    (getLocaleFromAcceptLanguage as any).mockReturnValue(null);
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale: "fr",
      localeSource: "path",
      pathname: "/dashboard",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
    const handler = createIntorHandler(config);
    await handler(request as FastifyRequest);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/fr/dashboard",
      expect.any(Object),
    );
  });

  it("falls back to '/' when request.raw.url is undefined", async () => {
    (request.raw as any).url = undefined;
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
    await handler(request as FastifyRequest);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/", // fallback
      expect.any(Object),
    );
  });

  it("forwards cookie when present", async () => {
    (request.headers as any).cookie = "locale=fr";
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
    await handler(request as FastifyRequest);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.objectContaining({
        cookie: "fr",
      }),
    );
  });
});
