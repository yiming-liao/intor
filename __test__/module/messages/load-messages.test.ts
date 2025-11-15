/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLoadLocalMessages } from "@/modules/messages/create-load-local-messages";
import { loadApiMessages } from "@/modules/messages/load-api-messages";
import { loadMessages } from "@/modules/messages/load-messages";
import { getLogger } from "@/shared/logger/get-logger";
import { resolveNamespaces } from "@/shared/utils";

vi.mock("@/modules/messages/create-load-local-messages");
vi.mock("@/modules/messages/load-api-messages");
vi.mock("@/shared/logger/get-logger");
vi.mock("@/shared/utils");

describe("loadMessages", () => {
  let mockLogger: any;
  let mockChildLogger: any;

  beforeEach(() => {
    mockChildLogger = {
      debug: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
    };
    mockLogger = {
      child: vi.fn().mockReturnValue(mockChildLogger),
    };
    vi.mocked(getLogger).mockReturnValue(mockLogger);
    vi.mocked(resolveNamespaces).mockReturnValue(["ns1", "ns2"]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should warn and return undefined if loader is missing", async () => {
    const config = { id: "test", logger: {}, fallbackLocales: {} };
    const result = await loadMessages({
      config,
      locale: "en",
      pathname: "/",
    } as any);
    expect(result).toBeUndefined();
    expect(mockChildLogger.warn).toHaveBeenCalledWith(
      "No loader options have been configured in the current config.",
    );
  });

  it("should load messages using import loader", async () => {
    const messages = { hello: "world" } as any;
    const mockLoadLocalMessages = vi.fn().mockResolvedValue(messages);
    vi.mocked(createLoadLocalMessages).mockReturnValue(mockLoadLocalMessages);

    const config = {
      id: "test",
      loader: { type: "import", basePath: "/locales" },
      logger: {},
      fallbackLocales: { en: ["fr"] },
    };
    const result = await loadMessages({
      config,
      locale: "en",
      pathname: "/home",
    } as any);
    expect(createLoadLocalMessages).toHaveBeenCalledWith("/locales");
    expect(mockLoadLocalMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        fallbackLocales: ["fr"],
        namespaces: ["ns1", "ns2"],
      }),
    );
    expect(result).toBe(messages);
  });

  it("should load messages using api loader", async () => {
    const messages = { hi: "there" } as any;
    vi.mocked(loadApiMessages).mockResolvedValue(messages);

    const config = {
      id: "test",
      loader: { type: "api", apiUrl: "https://api.test" },
      logger: {},
      fallbackLocales: { en: ["fr"] },
    };
    const result = await loadMessages({
      config,
      locale: "en",
      pathname: "/home",
    } as any);

    expect(loadApiMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        fallbackLocales: ["fr"],
        namespaces: ["ns1", "ns2"],
      }),
    );
    expect(result).toBe(messages);
  });

  it("should warn if loaded messages is empty", async () => {
    vi.mocked(loadApiMessages).mockResolvedValue({});

    const config = {
      id: "test",
      loader: { type: "api", apiUrl: "https://api.test" },
      logger: {},
      fallbackLocales: { en: [] },
    };
    const result = await loadMessages({
      config,
      locale: "en",
      pathname: "/home",
    } as any);

    expect(result).toEqual({});
    expect(mockChildLogger.warn).toHaveBeenCalledWith(
      "No messages found.",
      expect.objectContaining({ locale: "en", namespaces: ["ns1", "ns2"] }),
    );
  });
});
