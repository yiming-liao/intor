import type { IntorConfig } from "../../config";
import type { GetTranslatorParams } from "../../server";
import type { FastifyInstance, FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { createIntorHandler } from "./create-intor-handler";

interface IntorFastifyPluginOptions
  extends Omit<GetTranslatorParams, "locale" | "fetch" | "allowCacheWrite"> {
  config: IntorConfig;

  /**
   * Bind DX shortcuts to request:
   * - request.locale
   * - request.hasKey
   * - request.t
   * - request.tRich
   *
   * Defaults to true
   */
  shortcuts?: boolean;
}

/** Internal helpers */
function decorateRequest(fastify: FastifyInstance, key: string) {
  if (fastify.hasRequestDecorator?.(key)) return;
  fastify.decorateRequest(key, null);
}

/**
 * Internal plugin implementation
 */
const intorFastifyPluginImpl: FastifyPluginCallback<
  IntorFastifyPluginOptions
> = (fastify: FastifyInstance, options, done) => {
  const {
    config,
    loader,
    readers,
    handlers,
    plugins,
    shortcuts = true,
  } = options;

  // --------------------------------------------------
  // Declare request structure (once per instance)
  // --------------------------------------------------
  decorateRequest(fastify, "intor");

  if (shortcuts) {
    decorateRequest(fastify, "locale");
    decorateRequest(fastify, "hasKey");
    decorateRequest(fastify, "t");
    decorateRequest(fastify, "tRich");
  }

  // --------------------------------------------------
  // Bind inbound handler
  // --------------------------------------------------
  fastify.addHook(
    "onRequest",
    createIntorHandler(config, {
      ...(loader !== undefined ? { loader } : {}),
      ...(readers !== undefined ? { readers } : {}),
      ...(handlers !== undefined ? { handlers } : {}),
      ...(plugins !== undefined ? { plugins } : {}),
      shortcuts,
    }),
  );

  done();
};

/**
 * Exported Fastify plugin (root-level, non-encapsulated)
 */
export const intorFastifyPlugin = fp(intorFastifyPluginImpl, {
  name: "@intor/fastify",
});
