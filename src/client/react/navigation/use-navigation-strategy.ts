import type { NavigationTarget } from "@/routing/resolve-navigation-target";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import { setLocaleCookieBrowser } from "@/client/shared/utils";

/**
 * Strategy describing how a navigation should be executed.
 */
export type NavigationStrategy =
  | { kind: "external" } // let the browser handle it
  | { kind: "client" } // client-side navigation
  | { kind: "reload" }; // full page reload

/**
 * Determines the navigation strategy for a resolved navigation target.
 *
 * - Decides how navigation should be executed
 * - Applies required locale side effects (cookie / state)
 *
 * No navigation is performed here.
 */
export const useNavigationStrategy = () => {
  const { config } = useConfig();
  const { setLocale } = useLocale();
  const { loader, cookie } = config;

  /** Decide how the given navigation target should be handled. */
  const decideNavigation = (target: NavigationTarget): NavigationStrategy => {
    if (target.isExternal) {
      return { kind: "external" };
    }

    const fullReloadRequired = loader?.type === "local";

    if (fullReloadRequired) {
      setLocaleCookieBrowser(cookie, target.locale); // Persist locale before full page reload
      return { kind: "reload" };
    }

    setLocale(target.locale); // Sync locale state for client-side navigation
    return { kind: "client" };
  };

  return { decideNavigation };
};
