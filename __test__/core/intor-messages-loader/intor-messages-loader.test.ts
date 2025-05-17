import type { IntorResolvedConfig } from "../../../src/intor/core/intor-config/types/define-intor-config-types";
import type pLimit from "p-limit";
import { IntorError } from "../../../src/intor/core/intor-error";
import { getOrCreateLogger } from "../../../src/intor/core/intor-logger";
import { intorMessagesLoader } from "../../../src/intor/core/intor-messages-loader";
import { createLocalMessagesLoader } from "../../../src/intor/core/intor-messages-loader/create-local-messages-loader/create-local-messages-loader";
import { fetchApiMessages } from "../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetch-api-messages";
import { resolveNamespaces } from "../../../src/intor/core/utils/resolve-namespaces";

jest.mock(
  "../../../src/intor/core/intor-messages-loader/create-local-messages-loader/create-local-messages-loader",
);
jest.mock(
  "../../../src/intor/core/intor-messages-loader/fetch-api-messages/fetch-api-messages",
);
jest.mock("../../../src/intor/core/intor-logger");
jest.mock("../../../src/intor/core/utils/resolve-namespaces");
jest.mock("p-limit", () => {
  return () => ((fn: () => Promise<void>) => fn()) as ReturnType<typeof pLimit>;
});
const mockLogger = {
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const defaultConfig = {
  id: "test-app",
  loaderOptions: { type: "import", basePath: "/locales" },
  fallbackLocales: {
    en: ["zh", "fr"],
  },
} as unknown as IntorResolvedConfig;

const defaultOptions = {
  config: defaultConfig,
  locale: "en",
  pathname: "/about",
};

describe("intorMessagesLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getOrCreateLogger as jest.Mock).mockReturnValue(mockLogger);
    (resolveNamespaces as jest.Mock).mockReturnValue(["common", "about"]);
  });

  it("loads messages using import loader", async () => {
    const mockLoadLocalMessages = jest
      .fn()
      .mockResolvedValue({ common: { title: "Hello" } });
    (createLocalMessagesLoader as jest.Mock).mockReturnValue(
      mockLoadLocalMessages,
    );

    const result = await intorMessagesLoader(defaultOptions);

    expect(mockLoadLocalMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        fallbackLocales: ["zh", "fr"],
        namespaces: ["common", "about"],
        loggerId: "test-app",
      }),
    );
    expect(result).toEqual({ common: { title: "Hello" } });
    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith("Loader type selected:", {
      loaderType: "import",
    });
  });

  it("loads messages using api loader", async () => {
    const apiOptions = {
      ...defaultOptions,
      config: {
        ...defaultConfig,
        loaderOptions: { type: "api", endpoint: "https://api.test" },
      } as unknown as IntorResolvedConfig,
    };

    (fetchApiMessages as jest.Mock).mockResolvedValue({
      about: { title: "From API" },
    });

    const result = await intorMessagesLoader(apiOptions);

    expect(fetchApiMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "en",
        fallbackLocales: ["zh", "fr"],
        namespaces: ["common", "about"],
        loggerId: "test-app",
      }),
    );
    expect(result).toEqual({ about: { title: "From API" } });
  });

  it("throws an error for unknown loader type", async () => {
    const invalidOptions = {
      ...defaultOptions,
      config: {
        ...defaultConfig,
        loaderOptions: { type: "unknown" },
      } as unknown as IntorResolvedConfig,
    };

    await expect(intorMessagesLoader(invalidOptions)).rejects.toThrow(
      IntorError,
    );
    await expect(intorMessagesLoader(invalidOptions)).rejects.toThrow(
      /Unknown loader type: unknown/,
    );
  });

  it("logs a warning if no messages are found", async () => {
    const mockLoadLocalMessages = jest.fn().mockResolvedValue({});
    (createLocalMessagesLoader as jest.Mock).mockReturnValue(
      mockLoadLocalMessages,
    );

    await intorMessagesLoader(defaultOptions);

    expect(mockLogger.warn).toHaveBeenCalledWith("No messages found.", {
      locale: "en",
      namespaces: ["common", "about"],
    });
  });

  it("logs namespace info and fallbackLocales correctly", async () => {
    const mockLoadLocalMessages = jest.fn().mockResolvedValue({ common: {} });
    (createLocalMessagesLoader as jest.Mock).mockReturnValue(
      mockLoadLocalMessages,
    );

    await intorMessagesLoader(defaultOptions);

    expect(mockLogger.info).toHaveBeenCalledWith(
      "Namespaces ready for loading:",
      {
        namespaces: { count: 2, list: ["common", "about"] },
      },
    );
  });

  it("falls back to empty array when fallbackLocales is not defined for locale", async () => {
    const options = {
      config: {
        ...defaultConfig,
        fallbackLocales: {
          en: ["fr"],
        },
      },
      locale: "ja",
      pathname: "/home",
    };

    const mockLoadLocalMessages = jest
      .fn()
      .mockResolvedValue({ home: { title: "こんにちは" } });
    (createLocalMessagesLoader as jest.Mock).mockReturnValue(
      mockLoadLocalMessages,
    );

    await intorMessagesLoader(options);

    expect(mockLoadLocalMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: "ja",
        fallbackLocales: [],
      }),
    );
  });

  it('logs "All" when resolved namespaces is empty', async () => {
    (resolveNamespaces as jest.Mock).mockReturnValue([]);

    const mockLoadLocalMessages = jest.fn().mockResolvedValue({});
    (createLocalMessagesLoader as jest.Mock).mockReturnValue(
      mockLoadLocalMessages,
    );

    await intorMessagesLoader({
      config: {
        ...defaultConfig,
      },
      locale: "en",
      pathname: "/no-namespaces",
    });

    expect(mockLogger.info).toHaveBeenCalledWith(
      "Namespaces ready for loading:",
      {
        namespaces: "All",
      },
    );

    jest.restoreAllMocks();
  });

  it("handles empty fallbackLocales gracefully", async () => {
    const configWithEmptyFallback = {
      ...defaultConfig,
      fallbackLocales: {},
    };

    const mockLoadLocalMessages = jest.fn().mockResolvedValue({
      common: { title: "Empty Fallback" },
    });
    (createLocalMessagesLoader as jest.Mock).mockReturnValue(
      mockLoadLocalMessages,
    );

    const result = await intorMessagesLoader({
      config: configWithEmptyFallback,
      locale: "en",
      pathname: "/about",
    });

    expect(mockLoadLocalMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLocales: [],
      }),
    );
    expect(result).toEqual({ common: { title: "Empty Fallback" } });
  });

  it('logs "All" when resolved namespaces is empty', async () => {
    (resolveNamespaces as jest.Mock).mockReturnValue([]);

    const mockLoadLocalMessages = jest.fn().mockResolvedValue({});
    (createLocalMessagesLoader as jest.Mock).mockReturnValue(
      mockLoadLocalMessages,
    );

    await intorMessagesLoader(defaultOptions);

    expect(mockLogger.info).toHaveBeenCalledWith(
      "Namespaces ready for loading:",
      {
        namespaces: "All",
      },
    );
  });
});
