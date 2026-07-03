import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeQuizzesAlias);

export default function RedirectAliasRoute() {
  return null;
}
