import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FastifyRequest } from "fastify";
import {
  getLocaleFromAcceptLanguage,
  resolveInbound,
} from "../../../../src/routing";
import { parseCookieHeader } from "../../../../src/core";
import { createIntorHandler } from "../../../../src/adapters/fastify/create-intor-handler";
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
    request = {
      headers: {},
      query: {},
      hostname: "localhost",
      raw: { url: "/" } as any,
    };
    vi.clearAllMocks();
  });

  it("binds inbound context and forwards locale to translator", async () => {
    mockInbound("fr");
    const handler = createIntorHandler(config);
    await handler(request as FastifyRequest);
    expect(request.intor).toEqual({
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
      await handler(request as FastifyRequest);
      expect(request.locale).toBe("en");
      expect(request.t).toBe(t);
      expect(request.tRich).toBe(tRich);
      expect(request.hasKey).toBe(hasKey);
    });
    it("does not bind shortcuts when disabled", async () => {
      mockInbound("en");
      const handler = createIntorHandler(config, { shortcuts: false });
      await handler(request as FastifyRequest);
      expect(request.locale).toBeUndefined();
      expect(request.t).toBeUndefined();
      expect(request.tRich).toBeUndefined();
      expect(request.hasKey).toBeUndefined();
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
      await handler(request as FastifyRequest);
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
      await handler(request as FastifyRequest);
      expect(resolveInbound).toHaveBeenCalledWith(
        config,
        "/",
        expect.not.objectContaining({
          detected: expect.anything(),
        }),
      );
    });
  });

  it("falls back to '/' when raw.url is undefined", async () => {
    request.raw = { url: undefined } as any;
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
    expect(resolveInbound).toHaveBeenCalledWith(
      config,
      "/",
      expect.any(Object),
    );
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
    await handler(request as FastifyRequest);
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
