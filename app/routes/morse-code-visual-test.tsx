import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeVisualTestAlias);

export default function RedirectAliasRoute() {
  return null;
}
