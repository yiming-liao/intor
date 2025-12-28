import { resolveNavigationTarget, type NavigationTarget } from "@/routing";
import { useIntor } from "../provider";

/**
 * Hook for resolving locale-aware navigation targets.
 *
 * This hook bridges Next.js navigation context with Intor's routing decision logic.
 */
export const useNavigationTarget = (localizedPathname: string) => {
  const { config, locale: currentLocale } = useIntor();

  const resolveNavigation = (input: {
    destination?: string;
    locale?: string;
  }): NavigationTarget => {
    return resolveNavigationTarget(config, currentLocale, localizedPathname, {
      ...input,
    });
  };

  return { resolveNavigation };
};
