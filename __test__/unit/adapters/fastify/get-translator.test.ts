/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FastifyRequest } from "fastify";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTranslator } from "../../../../src/adapters/fastify/get-translator";
import { getTranslator as getTranslatorCore } from "../../../../src/server";

vi.mock("../../../../src/server", () => ({
  getTranslator: vi.fn(),
}));

describe("getTranslator (Fastify adapter)", () => {
  const config = {
    defaultLocale: "en",
  } as any;

  let request: Partial<FastifyRequest> & Record<string, any>;

  beforeEach(() => {
    request = {};
    vi.clearAllMocks();
  });

  it("uses locale from request.intor", async () => {
    (request.intor as any) = { locale: "fr" };
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, request as FastifyRequest);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });

  it("falls back to defaultLocale when request.intor is missing", async () => {
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, request as FastifyRequest);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "en",
    });
  });

  it("falls back to defaultLocale when request.intor.locale is undefined", async () => {
    (request.intor as any) = {};
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, request as FastifyRequest);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "en",
    });
  });

  it("forwards params along with locale", async () => {
    (request.intor as any) = { locale: "fr" };
    (getTranslatorCore as any).mockResolvedValue("translator");
    const params = {
      loader: { mode: "runtime" },
      preKey: "foo",
    } as any;
    await getTranslator(config, request as FastifyRequest, params);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
      ...params,
    });
  });

  it("does not spread params when undefined", async () => {
    (request.intor as any) = { locale: "fr" };
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config, request as FastifyRequest);
    expect(getTranslatorCore).toHaveBeenCalledTimes(1);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });
});
