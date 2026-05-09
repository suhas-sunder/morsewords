import { Navigate } from "react-router";

export function links() {
  return [{ rel: "canonical", href: "https://morsewords.com/audio" }];
}

export function meta() {
  return [
    { title: "Morse Code Audio Generator | MorseWords" },
    { name: "robots", content: "noindex,follow" },
  ];
}

export default function MorseCodeAudioGeneratorRedirect() {
  return <Navigate to="/audio" replace />;
}
