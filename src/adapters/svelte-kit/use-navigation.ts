/* eslint-disable import/no-unresolved */
import type { GenConfigKeys, GenLocale } from "@/core";
import { get } from "svelte/store";
import { executeNavigation } from "@/client";
import { useIntorContext } from "@/client/svelte"; // NOTE: Internal imports are rewritten to `intor/svelte` via Rollup alias at build time.
import { resolveOutbound } from "@/routing";
import { goto as svelteGoto } from "$app/navigation";
import { page } from "$app/state";

/**
 * Locale-aware navigation utilities for SvelteKit.
 *
 * Provides imperative navigation helpers that integrate
 * Intor's locale-aware routing and side effects.
 *
 * @platform SvelteKit
 */
export function useNavigation<CK extends GenConfigKeys = "__default__">() {
  const { config, locale: currentLocale, setLocale } = useIntorContext();

  async function goto(
    url: string,
    opts?: Parameters<typeof svelteGoto>[1] & { locale?: GenLocale<CK> },
  ) {
    const { locale, ...rest } = opts || {};

    const outboundResult = resolveOutbound(
      config,
      get(currentLocale),
      page.url.pathname,
      { destination: url, locale },
    );

    executeNavigation(outboundResult, {
      config,
      currentLocale: get(currentLocale),
      setLocale,
    });
    return svelteGoto(outboundResult.destination, rest);
  }

  return {
    goto,
  };
}
