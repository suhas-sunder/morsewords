import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/morse-code-alphabet", { status: 301 });
};

export default function MorseCodeLettersRedirect() {
  return null;
}
