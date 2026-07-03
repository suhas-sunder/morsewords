import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.toMorseAlias);

export default function RedirectAliasRoute() {
  return null;
}
