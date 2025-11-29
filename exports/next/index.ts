/** intor — next / main (client) */

// navigation
export {
  Link,
  usePathname,
  useRouter,
  redirect,
} from "../../src/adapters/next/navigation";

// client / react
export {
  // contexts
  IntorProvider,
  type IntorProviderProps,
  TranslateHandlersProvider,
  type TranslateHandlersProviderProps,

  // hooks
  useTranslator,
} from "../../src/client/react";
