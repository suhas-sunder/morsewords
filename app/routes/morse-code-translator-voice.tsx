import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeTranslatorVoiceAlias);

export default function RedirectAliasRoute() {
  return null;
}
