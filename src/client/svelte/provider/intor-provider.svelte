<script lang="ts">
  import type { IntorProviderProps } from "./types";
  import { createIntorStore } from "./create-intor-store";
  const { value, children } = $props<{
    value: IntorProviderProps["value"];
    children: IntorProviderProps["children"];
  }>();
  // svelte-ignore state_referenced_locally
  createIntorStore(value);
</script>

{@render children()}
