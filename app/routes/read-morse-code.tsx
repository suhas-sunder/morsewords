import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = () => {
  throw redirect("/morse-code-reader", { status: 301 });
};

export default function ReadMorseCodeAlias() {
  return null;
}
