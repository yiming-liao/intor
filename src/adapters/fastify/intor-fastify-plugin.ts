/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IntorResolvedConfig } from "@/config";
import type { GetTranslatorParams } from "@/server";
import type { FastifyInstance } from "fastify";
import { createIntorHandler } from "./create-intor-handler";

interface IntorFastifyPluginOptions
  extends Pick<GetTranslatorParams, "handlers" | "plugins" | "readers"> {
  config: IntorResolvedConfig;
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

/**
 * Intor Fastify adapter plugin
 */
export function intorFastifyPlugin(
  fastify: FastifyInstance,
  options: IntorFastifyPluginOptions,
) {
  const { config, shortcuts = true, handlers, plugins, readers } = options;

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
    createIntorHandler(config, { handlers, plugins, readers }),
  );
}

/** Fastify plugin metadata (without fastify-plugin) */
(intorFastifyPlugin as any)[Symbol.for("fastify.display-name")] =
  "@intor/fastify";
(intorFastifyPlugin as any)[Symbol.for("skip-override")] = true;

/** Internal helpers */
function decorateRequest(fastify: FastifyInstance, key: string) {
  if ((fastify as any).hasRequestDecorator?.(key)) return;
  fastify.decorateRequest(key, null);
}
