import {
  resolveNavigation as resolveNavigationCore,
  type NavigationResult,
} from "@/routing";
import { useIntor } from "../provider";

export function useResolveNavigation() {
  const { config, locale: currentLocale } = useIntor();

  function resolveNavigation(
    currentPathname: string,
    intent: { destination?: string; locale?: string },
  ): NavigationResult {
    return resolveNavigationCore(
      config,
      currentLocale,
      currentPathname,
      intent,
    );
  }

  return resolveNavigation;
}
