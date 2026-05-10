import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/morse-code-encoder", { status: 301 });
};

export default function TextToMorseCodeRedirect() {
  return null;
}
