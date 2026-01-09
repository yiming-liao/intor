import { usePathname as useNextPathname } from "next/navigation";
import { useIntor } from "@/client/react"; // NOTE: Internal imports are rewritten to `intor/react` via Rollup alias at build time.
import { localizePathname, type LocalizedPathname } from "@/routing";

/**
 * Get the resolved pathname variants for the current execution context.
 *
 * @example
 * ```ts
 * const { pathname, unprefixedPathname, templatedPathname } = usePathname();
 * // pathname => "/app/en-US/about"
 * // unprefixedPathname => "/about"
 * // templatedPathname => "/app/{locale}/about"
 * ```
 * @platform Next.js
 */
export const usePathname = (): LocalizedPathname => {
  const { config, locale } = useIntor();
  const rawPathname = useNextPathname();
  return localizePathname(rawPathname, config, locale);
};
