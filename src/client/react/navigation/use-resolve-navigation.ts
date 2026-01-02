import {
  resolveNavigation as resolveNavigationCore,
  type NavigationResult,
} from "@/routing";
import { useIntor } from "../provider";

export function useResolveNavigation() {
  const { config, locale: currentLocale } = useIntor();

  const resolveNavigation = (
    currentPathname: string,
    options: { destination?: string; locale?: string },
  ): NavigationResult => {
    return resolveNavigationCore(
      config,
      currentLocale,
      currentPathname,
      options,
    );
  };

  return { resolveNavigation };
}
