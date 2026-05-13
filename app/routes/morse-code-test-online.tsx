import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/morse-code-test", { status: 301 });
};

export default function MorseCodeTestOnlineRedirect() {
  return null;
}
