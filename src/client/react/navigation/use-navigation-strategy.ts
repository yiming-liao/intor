import type { NavigationTarget } from "@/routing";
import {
  resolveLoaderOptions,
  type GenConfigKeys,
  type GenLocale,
} from "@/core";
import { setLocaleCookieBrowser } from "../../shared/utils";
import { useIntor } from "../provider";

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
export const useNavigationStrategy = <
  CK extends GenConfigKeys = "__default__",
>() => {
  const { config, setLocale } = useIntor<CK>();
  const loader = resolveLoaderOptions(config, "client");

  /** Decide how the given navigation target should be handled. */
  const decideNavigation = (target: NavigationTarget): NavigationStrategy => {
    if (target.isExternal) {
      return { kind: "external" };
    }

    const shouldFullReload =
      loader?.type === "local" || config.routing.forceFullReload;

    if (shouldFullReload) {
      setLocaleCookieBrowser(config.cookie, target.locale); // Persist locale before full page reload
      return { kind: "reload" };
    }

    setLocale(target.locale as GenLocale<CK>); // Sync locale state for client-side navigation
    return { kind: "client" };
  };

  return { decideNavigation };
};
