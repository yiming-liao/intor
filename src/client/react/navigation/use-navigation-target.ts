import { usePathname } from "@/adapters/next/navigation/use-pathname";
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
export const useNavigationTarget = () => {
  const { config } = useConfig();
  const { locale: currentLocale } = useLocale();
  const { localizedPathname: currentPathname } = usePathname();

  const resolveNavigation = (input: {
    destination?: string;
    locale?: string;
  }): NavigationTarget => {
    return resolveNavigationTarget(config, currentLocale, currentPathname, {
      ...input,
    });
  };

  return { resolveNavigation };
};
