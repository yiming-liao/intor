import { resolceAdapterRuntimeLoader } from "@/modules/intor-adapter/resolve-adapter-runtime-loader";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";
import { IntorAdapter } from "@/modules/intor-config/types/intor-adapter-types";
import { IntorErrorCode } from "@/modules/intor-error";
import { intorMessagesLoader } from "@/modules/intor-messages-loader";
import { intorRuntime } from "@/modules/intor-runtime";
import { shouldLoadDynamicMessages } from "@/modules/intor-runtime/utils/should-load-dynamic-messages";

jest.mock("p-limit", () => {
  return () => {
    return (fn: () => Promise<unknown>) => fn();
  };
});
jest.mock("@/modules/intor-adapter/resolve-adapter-runtime-loader");
jest.mock("@/modules/intor-messages-loader");
jest.mock("@/modules/intor-runtime/utils/should-load-dynamic-messages", () => ({
  shouldLoadDynamicMessages: jest.fn(),
}));
jest.mock("logry", () => ({
  logry: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

describe("intorRuntime", () => {
  const mockAdapterRuntime = jest.fn();
  const mockMessagesLoader = jest.fn();

  const baseConfig = {
    id: "test-app",
    adapter: "next-server",
    messages: { en: { common: { hello: "world" } } },
    loaderOptions: undefined,
  } as unknown as IntorResolvedConfig;

  const mockRequest = { url: "/en/home" };

  beforeEach(() => {
    jest.clearAllMocks();

    (resolceAdapterRuntimeLoader as jest.Mock).mockResolvedValue(
      mockAdapterRuntime,
    );
    (intorMessagesLoader as jest.Mock).mockImplementation(mockMessagesLoader);
  });

  it("should initialize correctly and merge messages", async () => {
    mockAdapterRuntime.mockResolvedValue({ locale: "en", pathname: "/home" });
    (shouldLoadDynamicMessages as jest.Mock).mockReturnValue(false);

    const result = await intorRuntime({
      config: baseConfig,
      request: mockRequest,
    });

    expect(result.initialLocale).toBe("en");
    expect(result.pathname).toBe("/home");
    expect(result.messages).toEqual({
      en: { common: { hello: "world" } },
    });
    expect(mockMessagesLoader).not.toHaveBeenCalled();
  });

  it("should throw error on unsupported adapter", async () => {
    await expect(
      intorRuntime({
        config: {
          ...baseConfig,
          adapter: "unsupported-adapter" as IntorAdapter,
        },
        request: mockRequest,
      }),
    ).rejects.toMatchObject({
      code: IntorErrorCode.UNSUPPORTED_ADAPTER,
    });
  });

  it("should not load dynamic messages when shouldLoadDynamicMessages returns false", async () => {
    mockAdapterRuntime.mockResolvedValue({ locale: "en", pathname: "/home" });
    (shouldLoadDynamicMessages as jest.Mock).mockReturnValue(false);

    await intorRuntime({
      config: {
        ...baseConfig,
        loaderOptions: {
          type: "api",
          lazyLoad: true,
        },
      } as unknown as IntorResolvedConfig,
      request: mockRequest,
    });

    expect(mockMessagesLoader).not.toHaveBeenCalled();
  });

  it("should load dynamic messages when shouldLoadDynamicMessages returns true", async () => {
    mockAdapterRuntime.mockResolvedValue({ locale: "en", pathname: "/home" });
    (shouldLoadDynamicMessages as jest.Mock).mockReturnValue(true);

    const staticMessages = {
      en: { common: { hello: "world" } },
    };

    mockMessagesLoader.mockResolvedValue({
      en: { auth: { login: "Login" } },
    });

    const result = await intorRuntime({
      config: {
        ...baseConfig,
        messages: staticMessages,
        loaderOptions: {
          type: "import",
        },
      } as unknown as IntorResolvedConfig,
      request: mockRequest,
    });

    expect(mockMessagesLoader).toHaveBeenCalledWith({
      config: expect.any(Object),
      locale: "en",
      pathname: "/home",
    });

    expect(result.messages).toEqual({
      en: {
        common: { hello: "world" },
        auth: { login: "Login" },
      },
    });
  });
});
