import { usePathname as useNextPathname } from "next/navigation";
import { useIntor } from "@/client/react"; // NOTE: Internal imports are rewritten to `intor/react` via Rollup alias at build time.
import { localizePathname, type LocalizedPathname } from "@/routing";

/**
 * Get the resolved pathname variants for the current execution context.
 *
 * @example
 * ```ts
 * const { pathname, standardizedPathname, unprefixedPathname } = usePathname();
 * // pathname => "/en-US/about"
 * // standardizedPathname => "/{locale}/about"
 * // unprefixedPathname => "/about"
 * ```
 * @platform Next.js
 */
export const usePathname = (): LocalizedPathname => {
  const { config, locale } = useIntor();
  const rawPathname = useNextPathname();
  return localizePathname(config, rawPathname, locale);
};
