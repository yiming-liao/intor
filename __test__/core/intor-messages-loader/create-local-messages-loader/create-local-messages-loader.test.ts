import type { LoadLocalMessagesOptions } from "../../../../src/intor/core/intor-messages-loader/load-local-messages";
import { createLocalMessagesLoader } from "../../../../src/intor/core/intor-messages-loader/create-local-messages-loader/create-local-messages-loader";
import { loadLocalMessages } from "../../../../src/intor/core/intor-messages-loader/load-local-messages";

jest.mock(
  "../../../../src/intor/core/intor-messages-loader/load-local-messages",
  () => ({
    loadLocalMessages: jest.fn(),
  }),
);

const mockedLoadLocalMessages = loadLocalMessages as jest.MockedFunction<
  typeof loadLocalMessages
>;

describe("createLocalMessagesLoader", () => {
  beforeEach(() => {
    mockedLoadLocalMessages.mockClear();
  });

  it("should call loadLocalMessages with fixed basePath", async () => {
    const fixedBasePath = "custom/messages";
    const loader = createLocalMessagesLoader(fixedBasePath);

    const options: LoadLocalMessagesOptions = {
      locale: "en",
      namespaces: ["common"],
    };

    const fakeResult = { common: {} };
    mockedLoadLocalMessages.mockResolvedValue(fakeResult);

    const result = await loader(options);

    expect(mockedLoadLocalMessages).toHaveBeenCalledWith({
      basePath: fixedBasePath,
      ...options,
    });

    expect(result).toBe(fakeResult);
  });

  it("should call loadLocalMessages with undefined basePath if not provided", async () => {
    const loader = createLocalMessagesLoader();

    const options: LoadLocalMessagesOptions = {
      locale: "en",
      namespaces: ["auth"],
    };

    const fakeResult = { auth: {} };
    mockedLoadLocalMessages.mockResolvedValue(fakeResult);

    const result = await loader(options);

    expect(mockedLoadLocalMessages).toHaveBeenCalledWith({
      basePath: undefined,
      ...options,
    });

    expect(result).toBe(fakeResult);
  });

  it("should override options.basePath with fixed basePath", async () => {
    const loader = createLocalMessagesLoader("factory/fixed");

    const options: LoadLocalMessagesOptions = {
      locale: "zh-TW",
      basePath: "should/be/ignored",
      namespaces: ["foo"],
    };

    await loader(options);

    expect(mockedLoadLocalMessages).toHaveBeenCalledWith({
      basePath: "factory/fixed",
      ...options,
    });
  });
});
