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
    hooks,
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
      ...(hooks !== undefined ? { hooks } : {}),
      shortcuts,
    }),
  );

  done();
};

/**
 * Fastify plugin for Intor.
 *
 * Registers inbound routing resolution and binds
 * locale-aware translation helpers to each request.
 *
 * @public
 */
export const intorFastifyPlugin = fp(intorFastifyPluginImpl, {
  name: "@intor/fastify",
});
