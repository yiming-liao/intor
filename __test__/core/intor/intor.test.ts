import type { IntorResolvedConfig } from "../../../src/intor/core/intor-config/types/define-intor-config-types";
import { intor } from "../../../src/intor/core/intor";
import {
  IntorError,
  IntorErrorCode,
} from "../../../src/intor/core/intor-error";
import { intorRuntime } from "../../../src/intor/core/intor-runtime";
import { intorTranslator } from "../../../src/intor/core/intor-translator";

jest.mock("../../../src/intor/core/intor-runtime", () => ({
  intorRuntime: jest.fn(),
}));
jest.mock("../../../src/intor/core/intor-translator", () => ({
  intorTranslator: jest.fn(),
}));
jest.mock("../../../src/intor/core/intor-logger", () => ({
  getOrCreateLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

describe("intor", () => {
  const baseConfig = {
    id: "test",
    adapter: "next-server" as const,
    fallbackLocales: ["en"],
    translator: { loadingMessage: "Loading..." },
  } as unknown as IntorResolvedConfig;

  const runtimeMockResult = {
    config: baseConfig,
    initialLocale: "en",
    pathname: "/",
    messages: {
      common: { hello: "Hello" },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a translator for 'next-server' adapter", async () => {
    (intorRuntime as jest.Mock).mockResolvedValue(runtimeMockResult);
    (intorTranslator as jest.Mock).mockReturnValue({
      t: jest.fn().mockReturnValue("translated text"),
    });

    const translator = await intor({ request: undefined, config: baseConfig });

    expect(intorRuntime).toHaveBeenCalledWith({
      request: undefined,
      config: baseConfig,
    });

    expect(intorTranslator).toHaveBeenCalledWith({
      locale: "en",
      messages: runtimeMockResult.messages,
      fallbackLocales: ["en"],
      loadingMessage: "Loading...",
      handlers: undefined,
    });

    expect(typeof translator).toBe("object");
    expect(translator.t("common.hello")).toBe("translated text");
  });

  it("should return runtime object for 'next-client' adapter", async () => {
    const config = { ...baseConfig, adapter: "next-client" as const };

    (intorRuntime as jest.Mock).mockResolvedValue(runtimeMockResult);

    const result = await intor({ request: undefined, config });

    expect(intorRuntime).toHaveBeenCalledWith({ request: undefined, config });
    expect(result).toEqual(runtimeMockResult);
  });

  it("should throw IntorError for unsupported adapter", async () => {
    const config = {
      ...baseConfig,
      adapter: "unsupported",
    } as unknown as IntorResolvedConfig;

    await expect(intor({ request: undefined, config })).rejects.toThrow(
      IntorError,
    );
    await expect(intor({ request: undefined, config })).rejects.toMatchObject({
      code: IntorErrorCode.UNSUPPORTED_ADAPTER,
    });
  });
});
