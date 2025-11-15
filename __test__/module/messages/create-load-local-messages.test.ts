/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoadLocalMessagesOptions } from "@/modules/messages/load-local-messages";
import type { LocaleMessages } from "intor-translator";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLoadLocalMessages } from "@/modules/messages/create-load-local-messages";
import { loadLocalMessages } from "@/modules/messages/load-local-messages";

vi.mock("@/modules/messages/load-local-messages");

describe("createLoadLocalMessages", () => {
  const mockLoadLocalMessages = vi.mocked(loadLocalMessages);

  beforeEach(() => {
    mockLoadLocalMessages.mockReset();
  });

  it("should return a function", () => {
    const loader = createLoadLocalMessages("/base/path");
    expect(typeof loader).toBe("function");
  });

  it("should call loadLocalMessages with basePath and options", async () => {
    const loader = createLoadLocalMessages("/fixed/path");
    const options: LoadLocalMessagesOptions = {
      locale: "en",
      fallbackLocales: ["fr"],
      namespaces: ["common"],
      cache: { enabled: true, ttl: 1000 },
      logger: { id: "test" },
    };
    const mockResult: LocaleMessages = { hello: "world" } as any;
    mockLoadLocalMessages.mockResolvedValue(mockResult);

    const result = await loader(options);

    expect(mockLoadLocalMessages).toHaveBeenCalledWith({
      basePath: "/fixed/path",
      ...options,
    });
    expect(result).toBe(mockResult);
  });

  it("should handle undefined basePath", async () => {
    const loader = createLoadLocalMessages();
    const options: LoadLocalMessagesOptions = {
      locale: "en",
      fallbackLocales: [],
      namespaces: [],
      cache: { enabled: false, ttl: 0 },
      logger: { id: "test" },
    };
    const mockResult: LocaleMessages = { hi: "there" } as any;
    mockLoadLocalMessages.mockResolvedValue(mockResult);

    const result = await loader(options);

    expect(mockLoadLocalMessages).toHaveBeenCalledWith({
      basePath: undefined,
      ...options,
    });
    expect(result).toBe(mockResult);
  });
});
