import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import {
  resolveNavigationTarget,
  type NavigationTarget,
} from "@/routing/resolve-navigation-target";

/**
 * Hook for resolving locale-aware navigation targets.
 *
 * This hook bridges Next.js navigation context with Intor's routing decision logic.
 */
export const useNavigationTarget = (localizedPathname: string) => {
  const { config } = useConfig();
  const { locale: currentLocale } = useLocale();

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
