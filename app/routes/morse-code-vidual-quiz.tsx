import { redirect } from "react-router";

export function loader() {
  return redirect("/morse-code-visual-quiz", 301);
}

export default function MorseCodeVidualQuizRedirect() {
  return null;
}

