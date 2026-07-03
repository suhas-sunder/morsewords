import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.wordsPracticeAlias);

export default function RedirectAliasRoute() {
  return null;
}
