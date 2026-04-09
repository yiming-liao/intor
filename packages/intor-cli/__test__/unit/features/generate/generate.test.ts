/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFile } from "node:fs/promises";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildSchema,
  buildTypes,
  collectMessages,
  discoverConfigs,
  inferShapes,
} from "../../../../src/core";
import { generate } from "../../../../src/features/generate/generate";
import { renderOverrides } from "../../../../src/features/generate/render-overrides";
import { renderSummary } from "../../../../src/features/generate/render-summary";
import { resolveMessageSource } from "../../../../src/features/generate/utils/resolve-message-source";
import { validateMessageSource } from "../../../../src/features/generate/utils/validate-message-source";
import { ensureDirAndWriteFile } from "../../../../src/infrastructure";
import { renderConfigs, renderTitle, br } from "../../../../src/shared";
import {
  DEFAULT_TYPES_FILE_PATH,
  DEFAULT_SCHEMA_FILE_PATH,
  FEATURES,
  toRelativePath,
} from "../../../../src/shared";
import { spinner } from "../../../../src/shared/log/spinner";

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
}));

vi.mock("../../../../src/core", () => ({
  discoverConfigs: vi.fn(),
  collectMessages: vi.fn(),
  inferShapes: vi.fn(),
  buildTypes: vi.fn(),
  buildSchema: vi.fn(),
}));

vi.mock("../../../../src/infrastructure", () => ({
  ensureDirAndWriteFile: vi.fn(),
}));

vi.mock("../../../../src/shared", () => ({
  FEATURES: {
    discover: { name: "discover", title: "Discover intor configs" },
    generate: { name: "generate", title: "Generate types & schemas" },
    check: { name: "check", title: "Check translation usages" },
    validate: { name: "validate", title: "Validate messages" },
  },
  DEFAULT_OUT_DIR: ".intor",
  DEFAULT_TYPES_FILE_PATH: ".intor/types.d.ts",
  DEFAULT_SCHEMA_FILE_PATH: ".intor/schema.json",
  br: vi.fn(),
  renderConfigs: vi.fn(),
  renderTitle: vi.fn(),
  toRelativePath: vi.fn(),
}));

vi.mock("../../../../src/shared/log/spinner", () => ({
  spinner: {
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

vi.mock("../../../../src/features/generate/render-overrides", () => ({
  renderOverrides: vi.fn(),
}));

vi.mock("../../../../src/features/generate/render-summary", () => ({
  renderSummary: vi.fn(),
}));

vi.mock(
  "../../../../src/features/generate/utils/resolve-message-source",
  () => ({
    resolveMessageSource: vi.fn(),
  }),
);

vi.mock(
  "../../../../src/features/generate/utils/validate-message-source",
  () => ({
    validateMessageSource: vi.fn(),
  }),
);

describe("generate", () => {
  const exitSpy = vi.spyOn(process, "exit").mockImplementation(((
    code?: number,
  ) => {
    throw new Error(`EXIT:${code}`);
  }) as never);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(performance, "now")
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(3100);
  });

  afterAll(() => {
    exitSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it("collects runtime messages, writes artifacts, and renders the summary", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW"],
        },
      },
    ] as any);
    vi.mocked(resolveMessageSource).mockReturnValue(undefined);
    vi.mocked(collectMessages).mockResolvedValue({
      messages: { en: { greeting: "Hello" } },
      overrides: [
        {
          kind: "override",
          layer: "clientOverServer",
          path: "greeting",
          prev: "Hey",
          next: "Hello",
        },
      ],
    } as any);
    vi.mocked(inferShapes).mockReturnValue({ messages: "shape" } as any);
    vi.mocked(buildTypes).mockReturnValue("types");
    vi.mocked(buildSchema).mockReturnValue("schema");
    vi.mocked(toRelativePath).mockReturnValue(".intor");

    await generate({ debug: true, toolVersion: "1.2.3" });

    expect(renderTitle).toHaveBeenCalledWith(FEATURES.generate.title);
    expect(discoverConfigs).toHaveBeenCalledWith(true);
    expect(validateMessageSource).toHaveBeenCalledWith(
      { mode: "none" },
      vi.mocked(discoverConfigs).mock.results[0]?.value
        ? await vi.mocked(discoverConfigs).mock.results[0]!.value
        : [],
    );
    expect(br).toHaveBeenNthCalledWith(1);
    expect(renderConfigs).toHaveBeenCalledWith(
      await vi.mocked(discoverConfigs).mock.results[0]!.value,
      true,
    );
    expect(br).toHaveBeenNthCalledWith(2, 1, true);
    expect(collectMessages).toHaveBeenCalledWith(
      "en",
      {
        id: "web",
        defaultLocale: "en",
        supportedLocales: ["en", "zh-TW"],
      },
      {},
    );
    expect(readFile).not.toHaveBeenCalled();
    expect(renderOverrides).toHaveBeenCalledWith(
      "web",
      [
        {
          kind: "override",
          layer: "clientOverServer",
          path: "greeting",
          prev: "Hey",
          next: "Hello",
        },
      ],
      true,
    );
    expect(buildTypes).toHaveBeenCalledWith([
      {
        id: "web",
        locales: ["en", "zh-TW"],
        shapes: { messages: "shape" },
      },
    ]);
    expect(buildSchema).toHaveBeenCalledWith(
      [
        {
          id: "web",
          locales: ["en", "zh-TW"],
          shapes: { messages: "shape" },
        },
      ],
      "1.2.3",
    );
    expect(ensureDirAndWriteFile).toHaveBeenNthCalledWith(
      1,
      DEFAULT_TYPES_FILE_PATH,
      "types",
    );
    expect(ensureDirAndWriteFile).toHaveBeenNthCalledWith(
      2,
      DEFAULT_SCHEMA_FILE_PATH,
      "schema",
    );
    expect(renderSummary).toHaveBeenCalledWith(".intor", 3000, true);
  });

  it("reads messages from a file source when provided", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en"],
        },
      },
    ] as any);
    vi.mocked(resolveMessageSource).mockReturnValue("messages.json");
    vi.mocked(readFile).mockResolvedValue('{ "title": "Hello" }');
    vi.mocked(inferShapes).mockReturnValue({ messages: "shape" } as any);
    vi.mocked(buildTypes).mockReturnValue("types");
    vi.mocked(buildSchema).mockReturnValue("schema");
    vi.mocked(toRelativePath).mockReturnValue(".intor");

    await generate({
      messageSource: { mode: "single", file: "messages.json" },
    });

    expect(readFile).toHaveBeenCalledWith("messages.json", "utf8");
    expect(collectMessages).not.toHaveBeenCalled();
    expect(renderOverrides).not.toHaveBeenCalled();
    expect(inferShapes).toHaveBeenCalledWith({ title: "Hello" });
  });

  it("falls back to an empty message object when the default locale is missing", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW"],
        },
      },
    ] as any);
    vi.mocked(resolveMessageSource).mockReturnValue(undefined);
    vi.mocked(collectMessages).mockResolvedValue({
      messages: { "zh-TW": { greeting: "你好" } },
      overrides: [],
    } as any);
    vi.mocked(inferShapes).mockReturnValue({ messages: "shape" } as any);
    vi.mocked(buildTypes).mockReturnValue("types");
    vi.mocked(buildSchema).mockReturnValue("schema");
    vi.mocked(toRelativePath).mockReturnValue(".intor");

    await generate({});

    expect(inferShapes).toHaveBeenCalledWith({});
    expect(renderOverrides).not.toHaveBeenCalled();
  });

  it("prints an error and exits when no config is discovered", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(discoverConfigs).mockResolvedValue([]);

    await expect(generate({})).rejects.toThrow("EXIT:1");

    expect(errorSpy).toHaveBeenCalledWith("No Intor config found.");
    expect(spinner.stop).toHaveBeenCalledTimes(1);

    errorSpy.mockRestore();
  });

  it("prints failures and exits", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(discoverConfigs).mockRejectedValue(new Error("discover failed"));

    await expect(generate({})).rejects.toThrow("EXIT:1");

    expect(spinner.stop).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith("discover failed");

    errorSpy.mockRestore();
  });

  it("prints non-Error failures and exits", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(discoverConfigs).mockRejectedValue("boom");

    await expect(generate({})).rejects.toThrow("EXIT:1");

    expect(errorSpy).toHaveBeenCalledWith("boom");

    errorSpy.mockRestore();
  });
});
