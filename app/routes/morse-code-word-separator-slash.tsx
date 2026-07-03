import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.wordSeparatorSlashAlias);

export default function RedirectAliasRoute() {
  return null;
}
