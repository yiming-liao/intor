import type { IntorLogger } from "../../../../../src/intor/core/intor-logger/intor-logger";
import { mergeNamespaceMessages } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group/merge-namespace-messages";
import { parseMessageFile } from "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group/parse-message-file";

// Mock parseMessageFile function
jest.mock(
  "../../../../../src/intor/core/intor-messages-loader/load-local-messages/load-namespace-group/parse-message-file",
);

describe("mergeNamespaceMessages", () => {
  const mockLogDebug = jest.fn();
  const mockLogger = {
    child: jest.fn().mockReturnValue({
      warn: mockLogDebug,
    }),
  } as unknown as IntorLogger;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should merge base and sub message records correctly", async () => {
    const filePaths = [
      "/path/to/index.json",
      "/path/to/other.json",
      "/path/to/another.json",
    ];

    // Mock `parseMessageFile` response
    (parseMessageFile as jest.Mock).mockResolvedValueOnce({
      key1: "value1",
      key2: "value2",
    }); // for index.json
    (parseMessageFile as jest.Mock).mockResolvedValueOnce({
      key3: "value3",
    }); // for other.json
    (parseMessageFile as jest.Mock).mockResolvedValueOnce({
      key4: "value4",
    }); // for another.json

    const { base, sub } = await mergeNamespaceMessages(
      filePaths,
      false,
      mockLogger,
    );

    expect(base).toEqual({
      key1: "value1",
      key2: "value2",
    });
    expect(sub).toEqual({
      other: {
        key3: "value3",
      },
      another: {
        key4: "value4",
      },
    });
  });

  it("should skip files that return null content", async () => {
    const filePaths = ["/path/to/index.json", "/path/to/empty.json"];

    // Mock `parseMessageFile` response
    (parseMessageFile as jest.Mock).mockResolvedValueOnce({
      key1: "value1",
    }); // for index.json
    (parseMessageFile as jest.Mock).mockResolvedValueOnce(null); // for empty.json

    const { base, sub } = await mergeNamespaceMessages(
      filePaths,
      false,
      mockLogger,
    );

    expect(base).toEqual({
      key1: "value1",
    });
    expect(sub).toEqual({});
  });

  it("should assign to base if file is index.json or at root level", async () => {
    const filePaths = ["/path/to/index.json", "/path/to/sub.json"];

    // Mock `parseMessageFile` response
    (parseMessageFile as jest.Mock).mockResolvedValueOnce({
      key1: "value1",
    }); // for index.json
    (parseMessageFile as jest.Mock).mockResolvedValueOnce({
      key2: "value2",
    }); // for sub.json

    const { base, sub } = await mergeNamespaceMessages(
      filePaths,
      true,
      mockLogger,
    );

    expect(base).toEqual({
      key1: "value1",
      key2: "value2",
    });
    expect(sub).toEqual({});
  });
});
