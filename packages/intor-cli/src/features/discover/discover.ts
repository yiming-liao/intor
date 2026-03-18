import { features } from "../../constants";
import { discoverConfigs } from "../../core";
import { br, renderConfigs, renderTitle } from "../../render";

export interface DiscoverOptions {
  debug?: boolean;
}

export async function discover({ debug = false }: DiscoverOptions) {
  renderTitle(features.discover.title);

  const entries = await discoverConfigs(debug);

  if (entries.length === 0) {
    br();
    console.log(" No Intor config found.\n");
    return;
  }

  br();
  renderConfigs(entries);
}
