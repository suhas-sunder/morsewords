import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/dictionary", { status: 301 });
};

export default function MorseCodeDictionaryRedirect() {
  return null;
}
