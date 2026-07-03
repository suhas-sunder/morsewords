import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.numbers09Alias);

export default function RedirectAliasRoute() {
  return null;
}
