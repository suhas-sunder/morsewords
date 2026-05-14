import { redirect } from "react-router";

export function loader() {
  throw redirect("/morse-code-mp3-generator", { status: 301 });
}
