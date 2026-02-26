/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTranslator as getTranslatorCore } from "../../../../../src/server";
import { getTranslator } from "../../../../../src/adapters/next/server/get-translator";
import { getLocale } from "../../../../../src/adapters/next/server/get-locale";

vi.mock("../../../../../src/server", () => ({
  getTranslator: vi.fn(),
}));

vi.mock("../../../../../src/adapters/next/server/get-locale", () => ({
  getLocale: vi.fn(),
}));

describe("getTranslator (Next adapter)", () => {
  const config = {
    defaultLocale: "en",
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses locale returned from getLocale", async () => {
    (getLocale as any).mockResolvedValue("fr");
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config);
    expect(getLocale).toHaveBeenCalledWith(config);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });

  it("forwards params along with locale", async () => {
    (getLocale as any).mockResolvedValue("fr");
    (getTranslatorCore as any).mockResolvedValue("translator");
    const params = {
      loader: { mode: "runtime" },
      preKey: "foo",
    } as any;
    await getTranslator(config, params);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
      ...params,
    });
  });

  it("does not spread params when undefined", async () => {
    (getLocale as any).mockResolvedValue("fr");
    (getTranslatorCore as any).mockResolvedValue("translator");
    await getTranslator(config);
    expect(getTranslatorCore).toHaveBeenCalledTimes(1);
    expect(getTranslatorCore).toHaveBeenCalledWith(config, {
      locale: "fr",
    });
  });

  it("awaits getLocale before calling getTranslatorCore", async () => {
    const spy = vi.fn();
    (getLocale as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve("fr"), 10);
        }),
    );
    (getTranslatorCore as any).mockImplementation(spy);
    await getTranslator(config);
    expect(spy).toHaveBeenCalledWith(config, { locale: "fr" });
  });
});
