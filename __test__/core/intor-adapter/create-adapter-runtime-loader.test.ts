import type { IntorResolvedConfig } from "../../../src/intor/core/intor-config/types/define-intor-config-types";
import type { IntorAdapter } from "../../../src/intor/core/intor-config/types/intor-adapter-types";
import { createAdapterRuntimeLoader } from "../../../src/intor/core/intor-adapter/create-adapter-runtime-loader";
import { loadAdapterRuntime } from "../../../src/intor/core/intor-adapter/load-adapter-runtime";
import {
  IntorError,
  IntorErrorCode,
} from "../../../src/intor/core/intor-error";

jest.mock("../../../src/intor/core/intor-adapter/load-adapter-runtime", () => ({
  loadAdapterRuntime: jest.fn(),
}));

describe("createAdapterRuntimeLoader", () => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});

  it("should correctly loads a valid adapter runtime function", async () => {
    (loadAdapterRuntime as jest.Mock).mockResolvedValue({
      default: () => "mocked adapter",
    });

    const result = await createAdapterRuntimeLoader({
      config: {
        id: "adapter-id",
        adapter: "next-client",
      } as unknown as IntorResolvedConfig,
    });

    expect(
      result(
        {} as {
          config: IntorResolvedConfig;
          request?: unknown;
        },
      ),
    ).toBe("mocked adapter");
  });

  it("should thrown an IntorError if default is not a function", async () => {
    (loadAdapterRuntime as jest.Mock).mockResolvedValue({
      default: { notAFunction: true },
    });

    await expect(
      createAdapterRuntimeLoader({
        config: {
          id: "adapter-id",
          adapter: "invalid-adapter" as IntorAdapter,
        } as unknown as IntorResolvedConfig,
      }),
    ).rejects.toThrow(
      new IntorError({
        id: "adapter-id",
        code: IntorErrorCode.ADAPTER_RUNTIME_LOAD_FAILED,
        message: `Adapter "invalid-adapter" does not export a valid runtime function.`,
      }),
    );
  });

  it("should throw the original error if the module fails to load", async () => {
    (loadAdapterRuntime as jest.Mock).mockRejectedValue(
      new Error("Module not found"),
    );

    await expect(
      createAdapterRuntimeLoader({
        config: {
          id: "adapter-id",
          adapter: "missing-adapter",
        } as unknown as IntorResolvedConfig,
      }),
    ).rejects.toThrow("Module not found");
  });
});
