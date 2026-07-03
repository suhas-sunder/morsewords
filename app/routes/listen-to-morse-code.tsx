import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.listenToMorseCodeAlias);

export default function RedirectAliasRoute() {
  return null;
}
