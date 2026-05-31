import { redirect, type LoaderFunction } from "react-router";

import { REDIRECT_ALIASES, type RedirectAliasPath } from "~/client/data/routes";

export function makeRedirectAliasLoader(aliasPath: RedirectAliasPath): LoaderFunction {
  return async () => {
    throw redirect(REDIRECT_ALIASES[aliasPath], { status: 301 });
  };
}
