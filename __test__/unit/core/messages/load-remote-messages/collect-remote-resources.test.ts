import { describe, it, expect } from "vitest";
import { collectRemoteResources } from "@/core/messages/load-remote-messages/collect-remote-resources";

describe("collectRemoteResources", () => {
  const baseUrl = "https://api.example.com/messages";
  const locale = "en-US";

  it("returns only root index resource when namespaces are not provided", () => {
    const result = collectRemoteResources({
      baseUrl,
      locale,
    });
    expect(result).toEqual([
      {
        url: "https://api.example.com/messages/en-US/index.json",
        path: [],
      },
    ]);
  });

  it("returns only root index resource when namespaces is an empty array", () => {
    const result = collectRemoteResources({
      baseUrl,
      locale,
      namespaces: [],
    });
    expect(result).toEqual([
      {
        url: "https://api.example.com/messages/en-US/index.json",
        path: [],
      },
    ]);
  });

  it("includes root index and namespace resources when namespaces are provided", () => {
    const result = collectRemoteResources({
      baseUrl,
      locale,
      namespaces: ["common", "auth"],
    });
    expect(result).toEqual([
      {
        url: "https://api.example.com/messages/en-US/index.json",
        path: [],
      },
      {
        url: "https://api.example.com/messages/en-US/common.json",
        path: ["common"],
      },
      {
        url: "https://api.example.com/messages/en-US/auth.json",
        path: ["auth"],
      },
    ]);
  });
});
