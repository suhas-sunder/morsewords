import { redirect, type LoaderFunction } from "react-router";

import { REDIRECT_ALIASES, type RedirectAliasPath } from "~/client/data/routes";

export function makeRedirectAliasLoader(aliasPath: RedirectAliasPath): LoaderFunction {
  return async ({ request }) => {
    const sourceUrl = new URL(request.url);
    throw redirect(`${REDIRECT_ALIASES[aliasPath]}${sourceUrl.search}`, {
      status: 301,
    });
  };
}
