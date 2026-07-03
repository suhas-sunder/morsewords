import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.ituRM1677MorseCodeAlias);

export default function RedirectAliasRoute() {
  return null;
}
