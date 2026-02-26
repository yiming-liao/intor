import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import {
  getLocaleFromAcceptLanguage,
  resolveInbound,
} from "../../../../src/routing";
import { parseCookieHeader } from "../../../../src/core";
import { createIntorHandler } from "../../../../src/adapters/express/create-intor-handler";
import { getTranslator } from "../../../../src/server";

vi.mock("../../../../src/routing", async () => ({
  resolveInbound: vi.fn(),
  getLocaleFromAcceptLanguage: vi.fn(),
}));

vi.mock("../../../../src/core", async () => ({
  normalizeQuery: (q: unknown) => q,
  parseCookieHeader: vi.fn(),
}));

vi.mock("../../../../src/server", async () => ({
  getTranslator: vi.fn(),
}));

describe("createIntorHandler (Express)", () => {
  const config = {
    supportedLocales: ["en", "fr"],
    defaultLocale: "en",
    cookie: { name: "locale" },
  } as any;

  let req: Partial<Request> & Record<string, any>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {}, query: {}, path: "/", hostname: "localhost" };
    res = {};
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("binds inbound routing context to req.intor", async () => {
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
    await handler(req as Request, res as Response, next);
    expect(req.intor).toEqual({
      locale: "fr",
      localeSource: "header",
      pathname: "/",
    });
    expect(next).toHaveBeenCalled();
  });

  it("passes correct locale to getTranslator", async () => {
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
    await handler(req as Request, res as Response, next);
    expect(getTranslator).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        locale: "fr",
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
    await handler(req as Request, res as Response, next);
    expect(req.locale).toBe("en");
    expect(req.t).toBe(t);
    expect(req.tRich).toBe(tRich);
    expect(req.hasKey).toBe(hasKey);
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
    await handler(req as Request, res as Response, next);
    expect(req.locale).toBeUndefined();
    expect(req.t).toBeUndefined();
    expect(req.tRich).toBeUndefined();
    expect(req.hasKey).toBeUndefined();
  });

  it("reads locale from cookie when present", async () => {
    (getLocaleFromAcceptLanguage as any).mockReturnValue(null);
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
    await handler(req as Request, res as Response, next);
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.objectContaining({
        cookie: "fr",
      }),
    );
  });

  it("forwards loader, readers, handlers and plugins to getTranslator", async () => {
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
    await handler(req as Request, res as Response, next);
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
});
