<script lang="ts">
  import { createIntorStore } from "./create-intor-store";
  export let value;
  createIntorStore(value);
</script>

<slot />
