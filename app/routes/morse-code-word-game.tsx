import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/morse-code-word-trainer", { status: 301 });
};

export default function MorseCodeWordGameRedirect() {
  return null;
}
