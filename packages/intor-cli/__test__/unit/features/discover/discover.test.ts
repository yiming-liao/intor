/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { discoverConfigs } from "../../../../src/core";
import { discover } from "../../../../src/features/discover/discover";
import { br, renderConfigs, renderTitle } from "../../../../src/shared";
import { FEATURES } from "../../../../src/shared";

vi.mock("../../../../src/core", () => ({
  discoverConfigs: vi.fn(),
}));

vi.mock("../../../../src/shared", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../../src/shared")>();
  return {
    ...actual,
    br: vi.fn(),
    renderConfigs: vi.fn(),
    renderTitle: vi.fn(),
  };
});

describe("discover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders discovered configs", async () => {
    const entries = [
      {
        filePath: "/repo/intor.config.ts",
        config: {
          id: "web",
          defaultLocale: "en",
          supportedLocales: ["en", "zh-TW"],
        },
      },
    ];
    vi.mocked(discoverConfigs).mockResolvedValue(entries as any);

    await discover({});

    expect(renderTitle).toHaveBeenCalledWith(FEATURES.discover.title);
    expect(discoverConfigs).toHaveBeenCalledWith(false);
    expect(br).toHaveBeenCalledTimes(1);
    expect(renderConfigs).toHaveBeenCalledWith(entries);
  });

  it("prints an empty-state message when no config is found", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.mocked(discoverConfigs).mockResolvedValue([]);

    await discover({ debug: true });

    expect(renderTitle).toHaveBeenCalledWith(FEATURES.discover.title);
    expect(discoverConfigs).toHaveBeenCalledWith(true);
    expect(br).toHaveBeenCalledTimes(1);
    expect(renderConfigs).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(" No Intor config found.\n");

    logSpy.mockRestore();
  });
});
