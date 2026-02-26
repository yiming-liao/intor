/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createIntorHandler } from "../../../../src/adapters/fastify/create-intor-handler";
import { intorFastifyPlugin } from "../../../../export/fastify";

vi.mock("../../../../src/adapters/fastify/create-intor-handler", () => ({
  createIntorHandler: vi.fn(() => vi.fn()),
}));

vi.mock("fastify-plugin", () => ({ default: (fn: any) => fn }));

describe("intorFastifyPlugin", () => {
  let fastify: any;
  let done: any;

  const config = { defaultLocale: "en" } as any;

  beforeEach(() => {
    fastify = {
      decorateRequest: vi.fn(),
      hasRequestDecorator: vi.fn(() => false),
      addHook: vi.fn(),
    };
    done = vi.fn();
    vi.clearAllMocks();
  });

  it("decorates request.intor always", () => {
    intorFastifyPlugin(fastify, { config }, done);
    expect(fastify.decorateRequest).toHaveBeenCalledWith("intor", null);
  });

  it("decorates DX shortcuts when shortcuts=true (default)", () => {
    intorFastifyPlugin(fastify, { config }, done);
    expect(fastify.decorateRequest).toHaveBeenCalledWith("locale", null);
    expect(fastify.decorateRequest).toHaveBeenCalledWith("hasKey", null);
    expect(fastify.decorateRequest).toHaveBeenCalledWith("t", null);
    expect(fastify.decorateRequest).toHaveBeenCalledWith("tRich", null);
  });

  it("does not decorate shortcuts when shortcuts=false", () => {
    intorFastifyPlugin(fastify, { config, shortcuts: false }, done);
    expect(fastify.decorateRequest).toHaveBeenCalledWith("intor", null);
    expect(fastify.decorateRequest).not.toHaveBeenCalledWith("locale", null);
    expect(fastify.decorateRequest).not.toHaveBeenCalledWith("hasKey", null);
    expect(fastify.decorateRequest).not.toHaveBeenCalledWith("t", null);
    expect(fastify.decorateRequest).not.toHaveBeenCalledWith("tRich", null);
  });

  it("skips decoration if request decorator already exists", () => {
    fastify.hasRequestDecorator = vi.fn(() => true);
    intorFastifyPlugin(fastify, { config }, done);
    expect(fastify.decorateRequest).not.toHaveBeenCalled();
  });

  it("registers onRequest hook", () => {
    intorFastifyPlugin(fastify, { config }, done);
    expect(fastify.addHook).toHaveBeenCalledWith(
      "onRequest",
      expect.any(Function),
    );
  });

  it("forwards options to createIntorHandler", () => {
    const loader = {} as any;
    const readers = { json: vi.fn() };
    const handlers = { loadingHandler: vi.fn() };
    const plugins = [] as any;
    intorFastifyPlugin(
      fastify,
      { config, loader, readers, handlers, plugins },
      done,
    );
    expect(createIntorHandler).toHaveBeenCalledWith(config, {
      loader,
      readers,
      handlers,
      plugins,
      shortcuts: true,
    });
  });

  it("calls done()", () => {
    intorFastifyPlugin(fastify, { config }, done);
    expect(done).toHaveBeenCalled();
  });
});
