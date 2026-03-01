import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import {
  getLocaleFromAcceptLanguage,
  resolveInbound,
} from "../../../../src/routing";
import { parseCookieHeader } from "../../../../src/core";
import { createIntorHandler } from "../../../../src/adapters/express/create-intor-handler";
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

describe("createIntorHandler (Express)", () => {
  const config = {
    supportedLocales: ["en", "fr"],
    defaultLocale: "en",
    cookie: { name: "locale" },
  } as any;

  let req: Partial<Request> & Record<string, any>;
  let res: Partial<Response>;
  let next: NextFunction;

  function mockInbound(locale = "en") {
    (getLocaleFromAcceptLanguage as any).mockReturnValue(locale);
    (parseCookieHeader as any).mockReturnValue({});
    (resolveInbound as any).mockReturnValue({
      locale,
      localeSource: "default",
      pathname: "/",
    });
    (getTranslator as any).mockResolvedValue({
      hasKey: vi.fn(),
      t: vi.fn(),
      tRich: vi.fn(),
    });
  }

  beforeEach(() => {
    req = { headers: {}, query: {}, path: "/", hostname: "localhost" };
    res = {};
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("binds inbound context and forwards locale to translator", async () => {
    mockInbound("fr");
    const handler = createIntorHandler(config);
    await handler(req as Request, res as Response, next);
    expect(req.intor).toEqual({
      locale: "fr",
      localeSource: "default",
      pathname: "/",
    });
    expect(getTranslator).toHaveBeenCalledWith(
      config,
      expect.objectContaining({
        locale: "fr",
        allowCacheWrite: true,
      }),
    );
    expect(next).toHaveBeenCalled();
  });

  describe("shortcuts", () => {
    it("binds shortcuts by default", async () => {
      const t = vi.fn();
      const tRich = vi.fn();
      const hasKey = vi.fn();
      mockInbound("en");
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
      mockInbound("en");
      const handler = createIntorHandler(config, { shortcuts: false });
      await handler(req as Request, res as Response, next);
      expect(req.locale).toBeUndefined();
      expect(req.t).toBeUndefined();
      expect(req.tRich).toBeUndefined();
      expect(req.hasKey).toBeUndefined();
    });
  });

  describe("inbound param forwarding", () => {
    it("forwards cookie when present", async () => {
      (getLocaleFromAcceptLanguage as any).mockReturnValue(undefined);
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
    it("does not pass detected when localeFromAcceptLanguage is undefined", async () => {
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
      await handler(req as Request, res as Response, next);
      expect(resolveInbound).toHaveBeenCalledWith(
        config,
        "/",
        expect.not.objectContaining({
          detected: expect.anything(),
        }),
      );
    });
  });

  it("forwards loader, readers, handlers and hooks to getTranslator", async () => {
    const loader = { mode: "runtime" } as any;
    const readers = { json: vi.fn() } as any;
    const handlers = { loadingHandler: vi.fn() } as any;
    const hooks = [vi.fn()] as any;
    mockInbound("en");
    const handler = createIntorHandler(config, {
      loader,
      readers,
      handlers,
      hooks,
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
        hooks,
      }),
    );
  });
});
