import { Navigate } from "react-router";

export function links() {
  return [
    { rel: "canonical", href: "https://morsewords.com/morse-code-visual-quiz" },
  ];
}

export function meta() {
  return [
    { title: "Morse Code Visual Quiz | MorseWords" },
    { name: "robots", content: "noindex,follow" },
  ];
}

export default function MorseCodeVidualQuizRedirect() {
  return <Navigate to="/morse-code-visual-quiz" replace />;
}
