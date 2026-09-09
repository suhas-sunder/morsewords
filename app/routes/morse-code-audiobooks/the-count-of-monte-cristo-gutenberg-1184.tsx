import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "../redirectAliases";

export const loader = makeRedirectAliasLoader(
  ROUTES.countOfMonteCristoGutenberg1184AudiobookAlias,
);

export default function RedirectAliasRoute() {
  return null;
}
