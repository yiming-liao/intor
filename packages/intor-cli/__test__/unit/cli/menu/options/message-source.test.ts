/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const { confirmMock, textMock, isCancelMock, cancelMock } = vi.hoisted(() => ({
  confirmMock: vi.fn(),
  textMock: vi.fn(),
  isCancelMock: vi.fn(() => false),
  cancelMock: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
  confirm: confirmMock,
  text: textMock,
  isCancel: isCancelMock,
}));

vi.mock("../../../../../src/cli/menu/utils/cancel", () => ({
  cancel: cancelMock,
}));

const singleConfig = [
  {
    config: {
      id: "web",
    },
  },
] as any;

const multiConfig = [
  {
    config: {
      id: "web",
    },
  },
  {
    config: {
      id: "admin",
    },
  },
] as any;

describe("messageSourceOption", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isCancelMock.mockReturnValue(false);
  });

  it("uses the loader when message files are disabled", async () => {
    const { messageSourceOption } =
      await import("../../../../../src/cli/menu/options/message-source");
    confirmMock.mockResolvedValue(false);

    await expect(messageSourceOption.prompt(singleConfig)).resolves.toEqual({
      mode: "none",
    });
  });

  it("prompts a single message file when there is one config", async () => {
    const { messageSourceOption } =
      await import("../../../../../src/cli/menu/options/message-source");
    confirmMock.mockResolvedValue(true);
    textMock.mockResolvedValue("messages/en/web.json");

    await expect(messageSourceOption.prompt(singleConfig)).resolves.toEqual({
      mode: "single",
      file: "messages/en/web.json",
    });
  });

  it("prompts per-config message files when there are multiple configs", async () => {
    const { messageSourceOption } =
      await import("../../../../../src/cli/menu/options/message-source");
    confirmMock.mockResolvedValue(true);
    textMock
      .mockResolvedValueOnce("messages/en/web.json")
      .mockResolvedValueOnce("messages/en/admin.json");

    await expect(messageSourceOption.prompt(multiConfig)).resolves.toEqual({
      mode: "mapping",
      files: {
        web: "messages/en/web.json",
        admin: "messages/en/admin.json",
      },
    });
  });

  it("cancels when the enable prompt is cancelled", async () => {
    const { messageSourceOption } =
      await import("../../../../../src/cli/menu/options/message-source");
    const cancelError = new Error("cancelled");
    cancelMock.mockImplementation(() => {
      throw cancelError;
    });
    confirmMock.mockResolvedValue(Symbol("cancel"));
    isCancelMock.mockReturnValue(true);

    await expect(messageSourceOption.prompt(singleConfig)).rejects.toThrow(
      cancelError,
    );

    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  it("cancels when the single file prompt is cancelled", async () => {
    const { messageSourceOption } =
      await import("../../../../../src/cli/menu/options/message-source");
    const cancelError = new Error("cancelled");
    cancelMock.mockImplementation(() => {
      throw cancelError;
    });
    confirmMock.mockResolvedValue(true);
    textMock.mockResolvedValue(Symbol("cancel"));
    isCancelMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

    await expect(messageSourceOption.prompt(singleConfig)).rejects.toThrow(
      cancelError,
    );

    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  it("cancels when a mapping file prompt is cancelled", async () => {
    const { messageSourceOption } =
      await import("../../../../../src/cli/menu/options/message-source");
    const cancelError = new Error("cancelled");
    cancelMock.mockImplementation(() => {
      throw cancelError;
    });
    confirmMock.mockResolvedValue(true);
    textMock.mockResolvedValueOnce(Symbol("cancel"));
    isCancelMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

    await expect(messageSourceOption.prompt(multiConfig)).rejects.toThrow(
      cancelError,
    );

    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  it("renders summary rows for each message source mode", async () => {
    const { messageSourceOption } =
      await import("../../../../../src/cli/menu/options/message-source");

    expect(messageSourceOption.summary({ mode: "none" })).toEqual([
      "message files",
      "(loader)",
    ]);
    expect(
      messageSourceOption.summary({
        mode: "single",
        file: "messages/en/web.json",
      }),
    ).toEqual(["message files", "messages/en/web.json"]);
    expect(
      messageSourceOption.summary({
        mode: "mapping",
        files: {
          web: "messages/en/web.json",
          admin: "messages/en/admin.json",
        },
      }),
    ).toEqual([
      "message files",
      "web: messages/en/web.json, admin: messages/en/admin.json",
    ]);
  });
});
