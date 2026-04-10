import { beforeEach, describe, expect, it, vi } from "vitest";

const { confirmMock, selectMock, textMock, isCancelMock, cancelMock } =
  vi.hoisted(() => ({
    confirmMock: vi.fn(),
    selectMock: vi.fn(),
    textMock: vi.fn(),
    isCancelMock: vi.fn(() => false),
    cancelMock: vi.fn(),
  }));

vi.mock("@clack/prompts", () => ({
  confirm: confirmMock,
  select: selectMock,
  text: textMock,
  isCancel: isCancelMock,
}));

vi.mock("../../../../../src/cli/menu/utils/cancel", () => ({
  cancel: cancelMock,
}));

describe("basic menu options", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isCancelMock.mockReturnValue(false);
  });

  describe("debugOption", () => {
    it("returns the selected debug flag", async () => {
      const { debugOption } =
        await import("../../../../../src/cli/menu/options/debug");
      confirmMock.mockResolvedValue(true);

      await expect(debugOption.prompt()).resolves.toBe(true);
      expect(confirmMock).toHaveBeenCalledWith({
        message: "Enable debug mode?",
        initialValue: false,
      });
    });

    it("cancels when the confirm prompt is cancelled", async () => {
      const { debugOption } =
        await import("../../../../../src/cli/menu/options/debug");
      const cancelError = new Error("cancelled");
      cancelMock.mockImplementation(() => {
        throw cancelError;
      });
      confirmMock.mockResolvedValue(Symbol("cancel"));
      isCancelMock.mockReturnValue(true);

      await expect(debugOption.prompt()).rejects.toThrow(cancelError);

      expect(cancelMock).toHaveBeenCalledTimes(1);
    });

    it("renders the debug summary row", async () => {
      const { debugOption } =
        await import("../../../../../src/cli/menu/options/debug");

      expect(debugOption.summary(true)).toEqual(["debug", "on"]);
      expect(debugOption.summary(false)).toEqual(["debug", "off"]);
    });
  });

  describe("formatOption", () => {
    it("returns the selected format", async () => {
      const { formatOption } =
        await import("../../../../../src/cli/menu/options/format");
      selectMock.mockResolvedValue("json");

      await expect(formatOption.prompt()).resolves.toBe("json");
      expect(selectMock).toHaveBeenCalledWith({
        message: "Choose an output format",
        options: [
          { value: "human", label: "Human-readable" },
          { value: "json", label: "JSON (machine-readable)" },
        ],
        initialValue: "human",
      });
    });

    it("cancels when the format prompt is cancelled", async () => {
      const { formatOption } =
        await import("../../../../../src/cli/menu/options/format");
      const cancelError = new Error("cancelled");
      cancelMock.mockImplementation(() => {
        throw cancelError;
      });
      selectMock.mockResolvedValue(Symbol("cancel"));
      isCancelMock.mockReturnValue(true);

      await expect(formatOption.prompt()).rejects.toThrow(cancelError);

      expect(cancelMock).toHaveBeenCalledTimes(1);
    });

    it("renders the format summary row", async () => {
      const { formatOption } =
        await import("../../../../../src/cli/menu/options/format");

      expect(formatOption.summary("human")).toEqual(["format", "human"]);
      expect(formatOption.summary("json")).toEqual(["format", "json"]);
    });
  });

  describe("modeOption", () => {
    it("returns the selected mode", async () => {
      const { modeOption } =
        await import("../../../../../src/cli/menu/options/mode");
      selectMock.mockResolvedValue("custom");

      await expect(modeOption.prompt()).resolves.toBe("custom");
      expect(selectMock).toHaveBeenCalledWith({
        message: "Select a mode",
        options: [
          { value: "default", label: "Default" },
          { value: "custom", label: "Custom" },
        ],
      });
    });

    it("cancels when the mode prompt is cancelled", async () => {
      const { modeOption } =
        await import("../../../../../src/cli/menu/options/mode");
      const cancelError = new Error("cancelled");
      cancelMock.mockImplementation(() => {
        throw cancelError;
      });
      selectMock.mockResolvedValue(Symbol("cancel"));
      isCancelMock.mockReturnValue(true);

      await expect(modeOption.prompt()).rejects.toThrow(cancelError);

      expect(cancelMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("outputOption", () => {
    it("returns an empty path when file output is disabled", async () => {
      const { outputOption } =
        await import("../../../../../src/cli/menu/options/output");
      confirmMock.mockResolvedValue(false);

      await expect(outputOption.prompt()).resolves.toBe("");
    });

    it("returns the prompted output path", async () => {
      const { outputOption } =
        await import("../../../../../src/cli/menu/options/output");
      confirmMock.mockResolvedValue(true);
      textMock.mockResolvedValue("report.json");

      await expect(outputOption.prompt()).resolves.toBe("report.json");
      expect(textMock).toHaveBeenCalledWith({
        message: "Output file path",
        placeholder: "report.json",
        defaultValue: "report.json",
      });
    });

    it("cancels when the enable prompt is cancelled", async () => {
      const { outputOption } =
        await import("../../../../../src/cli/menu/options/output");
      const cancelError = new Error("cancelled");
      cancelMock.mockImplementation(() => {
        throw cancelError;
      });
      confirmMock.mockResolvedValue(Symbol("cancel"));
      isCancelMock.mockReturnValue(true);

      await expect(outputOption.prompt()).rejects.toThrow(cancelError);

      expect(cancelMock).toHaveBeenCalledTimes(1);
      expect(textMock).not.toHaveBeenCalled();
    });

    it("cancels when the output path prompt is cancelled", async () => {
      const { outputOption } =
        await import("../../../../../src/cli/menu/options/output");
      const cancelError = new Error("cancelled");
      cancelMock.mockImplementation(() => {
        throw cancelError;
      });
      confirmMock.mockResolvedValue(true);
      textMock.mockResolvedValue(Symbol("cancel"));
      isCancelMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

      await expect(outputOption.prompt()).rejects.toThrow(cancelError);

      expect(cancelMock).toHaveBeenCalledTimes(1);
    });

    it("renders the output summary row", async () => {
      const { outputOption } =
        await import("../../../../../src/cli/menu/options/output");

      expect(outputOption.summary("report.json")).toEqual([
        "output",
        "report.json",
      ]);
      expect(outputOption.summary()).toEqual(["output", "stdout"]);
    });
  });

  describe("tsconfigPathOption", () => {
    it("returns an empty path when the default tsconfig is used", async () => {
      const { tsconfigPathOption } =
        await import("../../../../../src/cli/menu/options/tsconfig-path");
      confirmMock.mockResolvedValue(false);

      await expect(tsconfigPathOption.prompt()).resolves.toBe("");
    });

    it("returns the prompted tsconfig path", async () => {
      const { tsconfigPathOption } =
        await import("../../../../../src/cli/menu/options/tsconfig-path");
      confirmMock.mockResolvedValue(true);
      textMock.mockResolvedValue("tsconfig.app.json");

      await expect(tsconfigPathOption.prompt()).resolves.toBe(
        "tsconfig.app.json",
      );
      expect(textMock).toHaveBeenCalledWith({
        message: "Path to tsconfig file",
        placeholder: "tsconfig.json",
        defaultValue: "tsconfig.json",
      });
    });

    it("cancels when the tsconfig confirm prompt is cancelled", async () => {
      const { tsconfigPathOption } =
        await import("../../../../../src/cli/menu/options/tsconfig-path");
      const cancelError = new Error("cancelled");
      cancelMock.mockImplementation(() => {
        throw cancelError;
      });
      confirmMock.mockResolvedValue(Symbol("cancel"));
      isCancelMock.mockReturnValue(true);

      await expect(tsconfigPathOption.prompt()).rejects.toThrow(cancelError);

      expect(cancelMock).toHaveBeenCalledTimes(1);
      expect(textMock).not.toHaveBeenCalled();
    });

    it("cancels when the tsconfig path prompt is cancelled", async () => {
      const { tsconfigPathOption } =
        await import("../../../../../src/cli/menu/options/tsconfig-path");
      const cancelError = new Error("cancelled");
      cancelMock.mockImplementation(() => {
        throw cancelError;
      });
      confirmMock.mockResolvedValue(true);
      textMock.mockResolvedValue(Symbol("cancel"));
      isCancelMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

      await expect(tsconfigPathOption.prompt()).rejects.toThrow(cancelError);

      expect(cancelMock).toHaveBeenCalledTimes(1);
    });

    it("renders the tsconfig summary row", async () => {
      const { tsconfigPathOption } =
        await import("../../../../../src/cli/menu/options/tsconfig-path");

      expect(tsconfigPathOption.summary("tsconfig.app.json")).toEqual([
        "tsconfig",
        "tsconfig.app.json",
      ]);
      expect(tsconfigPathOption.summary()).toEqual([
        "tsconfig",
        "tsconfig.json",
      ]);
    });
  });
});
