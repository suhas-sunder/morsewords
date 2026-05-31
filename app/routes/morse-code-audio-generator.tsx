// app/routes/morse-code-audio-generator.tsx
import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/audio", { status: 301 });
};

export default function MorseCodeTranslatorRedirect() {
  return null;
}
