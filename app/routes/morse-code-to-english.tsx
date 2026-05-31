import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeToEnglishAlias);

export default function RedirectAliasRoute() {
  return null;
}