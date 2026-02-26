/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from "hono";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTranslator } from "../../../../src/adapters/hono/get-translator";
import { getTranslator as getTranslatorCore } from "../../../../src/edge";

vi.mock("../../../../src/edge", () => ({
  getTranslator: vi.fn(),
}));

describe("getTranslator (Hono adapter)", () => {
  const config = { defaultLocale: "en" } as any;

  let c: Partial<Context> & Record<string, any>;

  beforeEach(() => {
    c = { get: vi.fn() } as any;
    vi.clearAllMocks();
  });

  it('uses locale from c.get("intor")', async () => {
    c.get = vi.fn((key: string) =>
      key === "intor" ? { locale: "fr" } : undefined,
    );
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, c as Context);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });

  it("falls back to defaultLocale when intor context is missing", async () => {
    c.get = vi.fn(() => undefined);
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, c as Context);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "en",
    });
  });

  it("falls back when intor exists but locale is undefined", async () => {
    c.get = vi.fn(() => ({}));
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, c as Context);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "en",
    });
  });

  it("forwards params along with locale", async () => {
    c.get = vi.fn(() => ({ locale: "fr" }));
    (getTranslatorCore as any).mockResolvedValue("translator");
    const params = {
      handlers: { loadingHandler: vi.fn() },
      preKey: "foo",
    } as any;
    await getTranslator(config, c as Context, params);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
      ...params,
    });
  });

  it("does not spread params when undefined", async () => {
    c.get = vi.fn(() => ({ locale: "fr" }));
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, c as Context);
    expect(getTranslatorCore).toHaveBeenCalledTimes(1);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });
});
