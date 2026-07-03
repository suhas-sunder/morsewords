import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.audioTranslatorAlias);

export default function RedirectAliasRoute() {
  return null;
}
