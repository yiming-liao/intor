import type { NavigationTarget } from "@/routing/resolve-navigation-target";
import { useIntor } from "@/client/react/provider";
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
  const { config, setLocale } = useIntor();
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
