import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeOfficialChartAlias);

export default function RedirectAliasRoute() {
  return null;
}
