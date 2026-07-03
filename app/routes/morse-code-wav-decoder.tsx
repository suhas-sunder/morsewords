import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.morseCodeWavDecoderAlias);

export default function RedirectAliasRoute() {
  return null;
}
