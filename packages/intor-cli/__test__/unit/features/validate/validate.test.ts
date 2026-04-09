/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { features } from "../../../../src/constants";
import {
  collectNonDefaultLocaleMessages,
  discoverConfigs,
} from "../../../../src/core";
import { prepareSchema } from "../../../../src/features/shared/prepare-schema";
import { spinner } from "../../../../src/features/shared/spinner";
import { writeJsonReport } from "../../../../src/features/shared/write-json-report";
import { collectMissing } from "../../../../src/features/validate/missing";
import { renderConfigSummary } from "../../../../src/features/validate/render-config-summary";
import { validate } from "../../../../src/features/validate/validate";
import { renderTitle } from "../../../../src/render";

vi.mock("../../../../src/core", () => ({
  discoverConfigs: vi.fn(),
  collectNonDefaultLocaleMessages: vi.fn(),
}));

vi.mock("../../../../src/render", () => ({
  renderTitle: vi.fn(),
}));

vi.mock("../../../../src/features/shared/prepare-schema", () => ({
  prepareSchema: vi.fn(),
}));

vi.mock("../../../../src/features/shared/spinner", () => ({
  spinner: {
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

vi.mock("../../../../src/features/shared/write-json-report", () => ({
  writeJsonReport: vi.fn(),
}));

vi.mock("../../../../src/features/validate/missing", () => ({
  collectMissing: vi.fn(),
}));

vi.mock("../../../../src/features/validate/render-config-summary", () => ({
  renderConfigSummary: vi.fn(),
}));

describe("validate", () => {
  const exitSpy = vi.spyOn(process, "exit").mockImplementation(((
    code?: number,
  ) => {
    throw new Error(`EXIT:${code}`);
  }) as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    exitSpy.mockRestore();
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

    expect(renderTitle).toHaveBeenCalledWith(features.validate.title, true);
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

    expect(renderTitle).toHaveBeenCalledWith(features.validate.title, false);
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

  it("prints failures from schema preparation and exits", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
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

    await expect(validate({})).rejects.toThrow("EXIT:1");

    expect(errorSpy).toHaveBeenCalledWith("schema failed");
    expect(spinner.stop).toHaveBeenCalledTimes(1);

    errorSpy.mockRestore();
  });

  it("throws when no config is discovered", async () => {
    vi.mocked(discoverConfigs).mockResolvedValue([]);

    await expect(validate({})).rejects.toThrow("No Intor config found.");

    expect(prepareSchema).not.toHaveBeenCalled();
  });
});
