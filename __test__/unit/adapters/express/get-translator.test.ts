/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request } from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTranslator } from "../../../../src/adapters/express/get-translator";
import { getTranslator as getTranslatorCore } from "../../../../src/server";

vi.mock("../../../../src/server", () => ({
  getTranslator: vi.fn(),
}));

describe("getTranslator (Express adapter)", () => {
  const config = {
    defaultLocale: "en",
  } as any;

  let req: Partial<Request> & Record<string, any>;

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  it("uses locale from req.intor", async () => {
    (req.intor as any) = { locale: "fr" };
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, req as Request);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });

  it("falls back to defaultLocale when req.intor is missing", async () => {
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, req as Request);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "en",
    });
  });

  it("falls back to defaultLocale when req.intor.locale is undefined", async () => {
    (req.intor as any) = {};
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, req as Request);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "en",
    });
  });

  it("forwards params along with locale", async () => {
    (req.intor as any) = { locale: "fr" };
    (getTranslatorCore as any).mockResolvedValue("translator");
    const params = {
      loader: { mode: "runtime" },
      preKey: "foo",
    } as any;
    await getTranslator(config, req as Request, params);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
      ...params,
    });
  });

  it("does not spread params when undefined", async () => {
    (req.intor as any) = { locale: "fr" };
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, req as Request);
    expect(getTranslatorCore).toHaveBeenCalledTimes(1);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });
});
