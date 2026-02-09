<script lang="ts">
  import { createIntorStore } from "./create-intor-store";
  const { value, children } = $props();
  // svelte-ignore state_referenced_locally
  createIntorStore(value);
</script>

{@render children()}
