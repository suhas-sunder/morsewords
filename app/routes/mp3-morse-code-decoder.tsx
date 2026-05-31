import { ROUTES } from "~/client/data/routes";
import { makeRedirectAliasLoader } from "./redirectAliases";

export const loader = makeRedirectAliasLoader(ROUTES.mp3AudioDecoderAlias);

export default function RedirectAliasRoute() {
  return null;
}