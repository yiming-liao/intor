/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import type { LoaderOptions } from "@/config/types/loader";
import { describe, it, expect } from "vitest";
import { resolveLoaderOptions } from "@/core/utils/resolve-loader-options";

function mockClientLoader() {
  return {
    url: "https://example.com/messages",
  };
}

function mockServerLoader(type: "local" | "remote"): LoaderOptions {
  return { type } as LoaderOptions;
}

function mockConfig(partial: Partial<IntorResolvedConfig>) {
  return {
    id: "test",
    defaultLocale: "en",
    supportedLocales: ["en"],
    fallbackLocales: {},
    cookie: {} as any,
    routing: {} as any,
    cache: { enabled: false, ttl: 0 },
    ...partial,
  } as IntorResolvedConfig;
}

describe("resolveLoaderOptions – server runtime", () => {
  it("uses server.loader when provided", () => {
    const serverLoader = mockServerLoader("remote");
    const config = mockConfig({
      server: { loader: serverLoader },
      loader: mockServerLoader("local"),
    });
    expect(resolveLoaderOptions(config, "server")).toBe(serverLoader);
  });

  it("falls back to root loader when server.loader is missing", () => {
    const rootLoader = mockServerLoader("local");
    const config = mockConfig({ loader: rootLoader });
    expect(resolveLoaderOptions(config, "server")).toBe(rootLoader);
  });
});

describe("resolveLoaderOptions – client runtime", () => {
  it("treats client.loader as remote loader implicitly", () => {
    const clientLoader = mockClientLoader();
    const config = mockConfig({
      client: { loader: clientLoader as any },
    });
    const resolved = resolveLoaderOptions(config, "client");
    expect(resolved).toEqual({
      type: "remote",
      ...clientLoader,
    });
  });

  it("inherits server.loader when client.loader is missing", () => {
    const serverLoader = mockServerLoader("remote");
    const config = mockConfig({
      server: { loader: serverLoader },
    });
    const resolved = resolveLoaderOptions(config, "client");
    expect(resolved).toBe(serverLoader);
  });

  it("falls back to root loader when both client and server loaders are missing", () => {
    const rootLoader = mockServerLoader("local");
    const config = mockConfig({
      loader: rootLoader,
    });
    const resolved = resolveLoaderOptions(config, "client");
    expect(resolved).toBe(rootLoader);
  });
});

describe("resolveLoaderOptions – edge cases", () => {
  it("returns undefined when no loaders are configured", () => {
    const config = mockConfig({});
    expect(resolveLoaderOptions(config, "client")).toBeUndefined();
    expect(resolveLoaderOptions(config, "server")).toBeUndefined();
  });
});
