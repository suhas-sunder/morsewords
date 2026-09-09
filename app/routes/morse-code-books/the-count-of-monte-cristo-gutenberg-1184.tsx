import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "../redirectAliases";

export const loader = makeRedirectAliasLoader(
  ROUTES.countOfMonteCristoGutenberg1184BookAlias,
);

export default function RedirectAliasRoute() {
  return null;
}
