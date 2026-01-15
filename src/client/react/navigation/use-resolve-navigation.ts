import {
  resolveNavigation as resolveNavigationCore,
  type NavigationResult,
} from "@/routing";
import { useIntorContext } from "../provider";

export function useResolveNavigation() {
  const { config, locale: currentLocale } = useIntorContext();

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
