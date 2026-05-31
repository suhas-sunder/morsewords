// app/routes/morse-code-translator.tsx
import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/", { status: 301 });
};

export default function MorseCodeTranslatorRedirect() {
  return null;
}
