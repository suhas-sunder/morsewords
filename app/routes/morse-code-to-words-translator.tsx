import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeToWordsTranslatorAlias);

export default function RedirectAliasRoute() {
  return null;
}
