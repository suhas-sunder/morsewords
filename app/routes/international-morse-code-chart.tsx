import { redirect, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  throw redirect("/morse-code-chart", { status: 301 });
};

export default function InternationalMorseCodeChartRedirect() {
  return null;
}
