import { beforeEach, describe, expect, it, vi } from "vitest";

const { confirmMock, multiselectMock, textMock, isCancelMock, cancelMock } =
  vi.hoisted(() => ({
    confirmMock: vi.fn(),
    multiselectMock: vi.fn(),
    textMock: vi.fn(),
    isCancelMock: vi.fn(() => false),
    cancelMock: vi.fn(),
  }));

vi.mock("@clack/prompts", () => ({
  confirm: confirmMock,
  multiselect: multiselectMock,
  text: textMock,
  isCancel: isCancelMock,
}));

vi.mock("../../../../../src/cli/menu/utils/cancel", () => ({
  cancel: cancelMock,
}));

describe("readerOptionsOption", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isCancelMock.mockReturnValue(false);
  });

  it("returns empty reader options when additional readers are disabled", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");
    confirmMock.mockResolvedValue(false);

    await expect(readerOptionsOption.prompt()).resolves.toEqual({});
  });

  it("returns selected built-in reader extensions", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");
    confirmMock.mockResolvedValue(true);
    multiselectMock.mockResolvedValue(["md", "yaml"]);

    await expect(readerOptionsOption.prompt()).resolves.toEqual({
      exts: ["md", "yaml"],
      customReaders: {},
    });
  });

  it("returns custom reader mappings when requested", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");
    confirmMock.mockResolvedValue(true);
    multiselectMock.mockResolvedValue(["md", "custom"]);
    textMock.mockResolvedValue("md=./reader-md.ts, yaml=./reader-yaml.ts");

    await expect(readerOptionsOption.prompt()).resolves.toEqual({
      exts: ["md"],
      customReaders: {
        md: "./reader-md.ts",
        yaml: "./reader-yaml.ts",
      },
    });
  });

  it("cancels when the enable prompt is cancelled", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");
    const cancelError = new Error("cancelled");
    cancelMock.mockImplementation(() => {
      throw cancelError;
    });
    confirmMock.mockResolvedValue(Symbol("cancel"));
    isCancelMock.mockReturnValue(true);

    await expect(readerOptionsOption.prompt()).rejects.toThrow(cancelError);

    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  it("cancels when the reader multiselect is cancelled", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");
    const cancelError = new Error("cancelled");
    cancelMock.mockImplementation(() => {
      throw cancelError;
    });
    confirmMock.mockResolvedValue(true);
    multiselectMock.mockResolvedValue(Symbol("cancel"));
    isCancelMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

    await expect(readerOptionsOption.prompt()).rejects.toThrow(cancelError);

    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  it("cancels when the custom mapping prompt is cancelled", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");
    const cancelError = new Error("cancelled");
    cancelMock.mockImplementation(() => {
      throw cancelError;
    });
    confirmMock.mockResolvedValue(true);
    multiselectMock.mockResolvedValue(["custom"]);
    textMock.mockResolvedValue(Symbol("cancel"));
    isCancelMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    await expect(readerOptionsOption.prompt()).rejects.toThrow(cancelError);

    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  it("throws on invalid custom reader entries", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");
    confirmMock.mockResolvedValue(true);
    multiselectMock.mockResolvedValue(["custom"]);
    textMock.mockResolvedValue("broken");

    await expect(readerOptionsOption.prompt()).rejects.toThrow(
      'Invalid custom reader entry: "broken". Expected <ext=path>.',
    );
  });

  it("renders the reader summary rows", async () => {
    const { readerOptionsOption } =
      await import("../../../../../src/cli/menu/options/reader-options");

    expect(readerOptionsOption.extsSummary(["md", "yaml"])).toEqual([
      "exts",
      "md, yaml",
    ]);
    expect(readerOptionsOption.extsSummary(undefined)).toEqual([
      "exts",
      "(none)",
    ]);
    expect(
      readerOptionsOption.customReadersSummary({ md: "./reader-md.ts" }),
    ).toEqual(["custom readers", "md"]);
    expect(readerOptionsOption.customReadersSummary(undefined)).toEqual([
      "custom readers",
      "(none)",
    ]);
  });
});
