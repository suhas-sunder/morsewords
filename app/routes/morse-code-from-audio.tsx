import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/morse-code-audio-decoder", { status: 301 });
};

export default function MorseCodeFromAudioRedirect() {
  return null;
}
