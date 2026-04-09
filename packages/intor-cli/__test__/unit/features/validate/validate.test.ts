/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  collectNonDefaultLocaleMessages,
  discoverConfigs,
  prepareSchema,
} from "../../../../src/core";
import { collectMissing } from "../../../../src/features/validate/missing";
import { renderConfigSummary } from "../../../../src/features/validate/render-config-summary";
import { validate } from "../../../../src/features/validate/validate";
import { writeJsonReport } from "../../../../src/infrastructure";
import { renderTitle } from "../../../../src/shared";
import { FEATURES } from "../../../../src/shared";
import { spinner } from "../../../../src/shared/log/spinner";

vi.mock("../../../../src/core", () => ({
  discoverConfigs: vi.fn(),
  collectNonDefaultLocaleMessages: vi.fn(),
  prepareSchema: vi.fn(),
}));

vi.mock("../../../../src/shared", () => ({
  FEATURES: {
    discover: { name: "discover", title: "Discover intor configs" },
    generate: { name: "generate", title: "Generate types & schemas" },
    check: { name: "check", title: "Check translation usages" },
    validate: { name: "validate", title: "Validate messages" },
  },
  renderTitle: vi.fn(),
}));

vi.mock("../../../../src/shared/log/spinner", () => ({
  spinner: {
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

vi.mock("../../../../src/infrastructure", () => ({
  writeJsonReport: vi.fn(),
}));

vi.mock("../../../../src/features/validate/missing", () => ({
  collectMissing: vi.fn(),
}));

vi.mock("../../../../src/features/validate/render-config-summary", () => ({
  renderConfigSummary: vi.fn(),
}));

describe("validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects missing results per non-default locale and renders human output", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW", "ja"],
        },
      },
    ] as any);
    vi.mocked(prepareSchema).mockResolvedValue({
      schemaEntries: [{ id: "web", shapes: { messages: "m1" } }],
    } as any);
    vi.mocked(collectNonDefaultLocaleMessages).mockResolvedValue({
      "zh-TW": { greeting: "你好" },
    } as any);
    vi.mocked(collectMissing).mockReturnValue({
      missingMessages: ["home.title"],
      missingReplacements: [],
      missingRich: [],
    });

    await validate({});

    expect(renderTitle).toHaveBeenCalledWith(FEATURES.validate.title, true);
    expect(discoverConfigs).toHaveBeenCalledWith(false);
    expect(prepareSchema).toHaveBeenCalledWith(["web"]);
    expect(spinner.start).toHaveBeenCalledTimes(2);
    expect(spinner.stop).toHaveBeenCalledTimes(2);
    expect(collectMissing).toHaveBeenCalledTimes(1);
    expect(collectMissing).toHaveBeenCalledWith(
      { messages: "m1" },
      { greeting: "你好" },
    );
    expect(renderConfigSummary).toHaveBeenCalledWith(
      "web",
      {
        "zh-TW": {
          missingMessages: ["home.title"],
          missingReplacements: [],
          missingRich: [],
        },
      },
      true,
    );
    expect(writeJsonReport).not.toHaveBeenCalled();
  });

  it("writes a json report when json format is requested", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW"],
        },
      },
    ] as any);
    vi.mocked(prepareSchema).mockResolvedValue({
      schemaEntries: [{ id: "web", shapes: { messages: "m1" } }],
    } as any);
    vi.mocked(collectNonDefaultLocaleMessages).mockResolvedValue({
      "zh-TW": { greeting: "hello" },
    } as any);
    vi.mocked(collectMissing).mockReturnValue({
      missingMessages: [],
      missingReplacements: [{ key: "greeting", name: "name" }],
      missingRich: [],
    });

    await validate({ format: "json", output: "report.json", debug: true });

    expect(renderTitle).toHaveBeenCalledWith(FEATURES.validate.title, false);
    expect(discoverConfigs).toHaveBeenCalledWith(true);
    expect(spinner.start).not.toHaveBeenCalled();
    expect(spinner.stop).not.toHaveBeenCalled();
    expect(renderConfigSummary).toHaveBeenCalledWith(
      "web",
      {
        "zh-TW": {
          missingMessages: [],
          missingReplacements: [{ key: "greeting", name: "name" }],
          missingRich: [],
        },
      },
      false,
    );
    expect(writeJsonReport).toHaveBeenCalledWith(
      {
        web: {
          "zh-TW": {
            missingMessages: [],
            missingReplacements: [{ key: "greeting", name: "name" }],
            missingRich: [],
          },
        },
      },
      "report.json",
    );
  });

  it("skips locales when no messages are collected for them", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW", "ja"],
        },
      },
    ] as any);
    vi.mocked(prepareSchema).mockResolvedValue({
      schemaEntries: [{ id: "web", shapes: { messages: "m1" } }],
    } as any);
    vi.mocked(collectNonDefaultLocaleMessages).mockResolvedValue({
      ja: { greeting: "こんにちは" },
    } as any);
    vi.mocked(collectMissing).mockReturnValue({
      missingMessages: [],
      missingReplacements: [],
      missingRich: [],
    });

    await validate({});

    expect(collectMissing).toHaveBeenCalledTimes(1);
    expect(collectMissing).toHaveBeenCalledWith(
      { messages: "m1" },
      { greeting: "こんにちは" },
    );
    expect(renderConfigSummary).toHaveBeenCalledWith(
      "web",
      {
        ja: {
          missingMessages: [],
          missingReplacements: [],
          missingRich: [],
        },
      },
      true,
    );
  });

  it("throws failures from schema preparation", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW"],
        },
      },
    ] as any);
    vi.mocked(prepareSchema).mockRejectedValue(new Error("schema failed"));

    await expect(validate({})).rejects.toThrow("schema failed");

    expect(spinner.stop).toHaveBeenCalledTimes(1);
  });

  it("throws non-Error failures without stopping the spinner in json mode", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([
      {
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW"],
        },
      },
    ] as any);
    vi.mocked(prepareSchema).mockRejectedValue("boom");

    await expect(validate({ format: "json" })).rejects.toBe("boom");
    expect(spinner.stop).not.toHaveBeenCalled();
  });

  it("throws when no config is discovered", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([]);

    await expect(validate({})).rejects.toThrow("No Intor config found.");

    expect(prepareSchema).not.toHaveBeenCalled();
  });
});
