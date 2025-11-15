import type { StringKeyedMessages } from "@/modules/messages/load-local-messages/load-namespace-group/types";
import path from "node:path";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as parserModule from "@/modules/messages/load-local-messages/load-namespace-group//parse-message-file"; // 整個模組匯入
import { mergeNamespaceMessages } from "@/modules/messages/load-local-messages/load-namespace-group/merge-namespace-messages";

describe("mergeNamespaceMessages", () => {
  const loggerOptions = { id: "test" } as const;

  beforeEach(() => {
    // 重置 mock
    vi.restoreAllMocks();
  });

  it("merges index.json into base and other files into sub", async () => {
    // 模擬 parseMessageFile 回傳不同內容
    vi.spyOn(parserModule, "parseMessageFile").mockImplementation(
      async (filePath: string) => {
        const fileName = path.basename(filePath);
        if (fileName === "index.json")
          return { hello: "world" } as StringKeyedMessages;
        if (fileName === "sub.json")
          return { sub: 123 } as unknown as StringKeyedMessages;
        return null;
      },
    );
    const filePaths = ["/fake/index.json", "/fake/sub.json"];
    const result = await mergeNamespaceMessages(
      filePaths,
      false,
      loggerOptions,
    );

    expect(result.base).toEqual({ hello: "world" });
    expect(result.sub).toEqual({ sub: { sub: 123 } });
  });

  it("merges everything into base if isAtRoot is true", async () => {
    vi.spyOn(parserModule, "parseMessageFile").mockResolvedValue({
      data: "ok",
    });

    const filePaths = ["/fake/one.json", "/fake/two.json"];
    const result = await mergeNamespaceMessages(filePaths, true, loggerOptions);

    expect(result.base).toEqual({ data: "ok" });
    expect(result.sub).toEqual({});
  });

  it("skips null content", async () => {
    vi.spyOn(parserModule, "parseMessageFile").mockResolvedValue(null);

    const filePaths = ["/fake/nothing.json"];
    const result = await mergeNamespaceMessages(
      filePaths,
      false,
      loggerOptions,
    );

    expect(result.base).toEqual({});
    expect(result.sub).toEqual({});
  });
});
