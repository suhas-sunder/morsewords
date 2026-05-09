import { Navigate } from "react-router";

export function links() {
  return [{ rel: "canonical", href: "https://morsewords.com/" }];
}

export function meta() {
  return [
    { title: "Morse Code Translator | MorseWords" },
    { name: "robots", content: "noindex,follow" },
  ];
}

export default function MorseCodeTranslatorRedirect() {
  return <Navigate to="/" replace />;
}
