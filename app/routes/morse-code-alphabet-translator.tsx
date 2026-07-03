import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeAlphabetTranslatorAlias);

export default function RedirectAliasRoute() {
  return null;
}
