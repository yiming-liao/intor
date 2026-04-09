import { discoverConfigs } from "../../core";
import { br, renderConfigs, renderTitle } from "../../shared";
import { FEATURES } from "../../shared";

export interface DiscoverOptions {
  debug?: boolean;
}

export async function discover({ debug = false }: DiscoverOptions) {
  renderTitle(FEATURES.discover.title);

  const entries = await discoverConfigs(debug);

  if (entries.length === 0) {
    br();
    console.log(" No Intor config found.\n");
    return;
  }

  br();
  renderConfigs(entries);
}
