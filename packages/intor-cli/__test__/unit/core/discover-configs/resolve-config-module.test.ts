/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { isIntorResolvedConfig } from "../../../../src/core/discover-configs/is-intor-resolved-config";
import { resolveConfigModule } from "../../../../src/core/discover-configs/resolve-config-module";

vi.mock(
  "../../../../src/core/discover-configs/is-intor-resolved-config",
  () => ({
    isIntorResolvedConfig: vi.fn(),
  }),
);

vi.mock("../../../../src/shared", () => ({ cyan: (s: string) => s }));

describe("resolveConfigModule", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createLogger() {
    return {
      process: vi.fn(),
    } as any;
  }

  it("returns [] and warns when module import fails", async () => {
    const logger = createLogger();
    const result = await resolveConfigModule({
      ids: new Set<string>(),
      absPath: "/abs/a.ts",
      relPath: "a.ts",
      logger,
      loadModule: vi.fn().mockRejectedValue(new Error("import failed")),
    });
    expect(result).toEqual([]);
    expect(logger.process).toHaveBeenCalledWith(
      "warn",
      "failed to import module (a.ts)",
    );
  });

  it("collects valid config exports", async () => {
    const logger = createLogger();
    vi.mocked(isIntorResolvedConfig).mockImplementation(
      (v) => (v as any)?.id === "my-intor",
    );
    const result = await resolveConfigModule({
      ids: new Set<string>(),
      absPath: "/abs/a.ts",
      relPath: "a.ts",
      logger,
      loadModule: vi.fn().mockResolvedValue({
        foo: {},
        config: {
          id: "my-intor",
          defaultLocale: "en",
          supportedLocales: ["en"],
        },
      }),
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.config.id).toBe("my-intor");
    expect(logger.process).toHaveBeenCalledWith(
      "ok",
      expect.stringContaining("my-intor"),
    );
  });

  it("warns and skips duplicate config ids", async () => {
    const logger = createLogger();
    vi.mocked(isIntorResolvedConfig).mockReturnValue(true);
    const ids = new Set<string>(["my-intor"]);
    const result = await resolveConfigModule({
      ids,
      absPath: "/abs/a.ts",
      relPath: "a.ts",
      logger,
      loadModule: vi.fn().mockResolvedValue({
        config: {
          id: "my-intor",
          defaultLocale: "en",
          supportedLocales: ["en"],
        },
      }),
    });
    expect(result).toEqual([]);
    expect(logger.process).toHaveBeenCalledWith(
      "warn",
      'duplicate config id "my-intor" (ignored, a.ts)',
    );
    expect(logger.process).toHaveBeenCalledWith(
      "warn",
      "no usable Intor config export (a.ts)",
    );
  });

  it("does not emit no-usable warning when no export matched config shape", async () => {
    const logger = createLogger();
    vi.mocked(isIntorResolvedConfig).mockReturnValue(false);
    const result = await resolveConfigModule({
      ids: new Set<string>(),
      absPath: "/abs/a.ts",
      relPath: "a.ts",
      logger,
      loadModule: vi.fn().mockResolvedValue({ foo: {}, bar: 1 }),
    });
    expect(result).toEqual([]);
    expect(logger.process).not.toHaveBeenCalledWith(
      "warn",
      "no usable Intor config export (a.ts)",
    );
  });

  it("adds resolved ids into the shared set", async () => {
    const logger = createLogger();
    vi.mocked(isIntorResolvedConfig).mockReturnValue(true);
    const ids = new Set<string>();
    await resolveConfigModule({
      ids,
      absPath: "/abs/a.ts",
      relPath: "a.ts",
      logger,
      loadModule: vi.fn().mockResolvedValue({
        c1: { id: "id-1", defaultLocale: "en", supportedLocales: ["en"] },
      }),
    });
    expect(ids.has("id-1")).toBe(true);
  });

  it("uses default loader when loadModule is not provided", async () => {
    const logger = createLogger();
    const result = await resolveConfigModule({
      ids: new Set<string>(),
      absPath: "/__not_exists__/intor-config.mjs",
      relPath: "intor-config.mjs",
      logger,
    });
    expect(result).toEqual([]);
    expect(logger.process).toHaveBeenCalledWith(
      "warn",
      "failed to import module (intor-config.mjs)",
    );
  });
});
