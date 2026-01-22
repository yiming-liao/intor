import { describe, it, expect } from "vitest";
import { resolveRemoteResources } from "@/core/messages/load-remote-messages/resolve-remote-resources";

describe("resolveRemoteResources", () => {
  it("returns root messages when a single root resource is provided", () => {
    const result = resolveRemoteResources([
      {
        path: [],
        data: { hello: "world" },
      },
    ]);
    expect(result).toEqual({
      hello: "world",
    });
  });

  it("nests messages under namespace path", () => {
    const result = resolveRemoteResources([
      {
        path: ["common"],
        data: { hello: "world" },
      },
    ]);
    expect(result).toEqual({
      common: {
        hello: "world",
      },
    });
  });

  it("merges root and namespace resources correctly", () => {
    const result = resolveRemoteResources([
      {
        path: [],
        data: { title: "Home" },
      },
      {
        path: ["common"],
        data: { ok: "OK" },
      },
    ]);
    expect(result).toEqual({
      title: "Home",
      common: {
        ok: "OK",
      },
    });
  });

  it("deep merges multiple namespace resources", () => {
    const result = resolveRemoteResources([
      {
        path: ["common"],
        data: { ok: "OK" },
      },
      {
        path: ["common"],
        data: { cancel: "Cancel" },
      },
    ]);
    expect(result).toEqual({
      common: {
        ok: "OK",
        cancel: "Cancel",
      },
    });
  });

  it("ignores resources with undefined data", () => {
    const result = resolveRemoteResources([
      {
        path: [],
        data: undefined,
      },
      {
        path: ["common"],
        data: { hello: "world" },
      },
    ]);
    expect(result).toEqual({
      common: {
        hello: "world",
      },
    });
  });

  it("returns an empty object when no valid resources are provided", () => {
    const result = resolveRemoteResources([
      {
        path: [],
        data: undefined,
      },
      {
        path: ["common"],
        data: undefined,
      },
    ]);
    expect(result).toEqual({});
  });
});
