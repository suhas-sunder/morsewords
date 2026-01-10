import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("misc", "routes/misc/misc.tsx", [
    route("cookies-policy", "routes/misc/misc.cookies-policy.tsx"),
    route("faq", "routes/misc/misc.faq.tsx"),
    route("privacy-policy", "routes/misc/misc.privacy-policy.tsx"),
    route("socials", "routes/misc/misc.socials.tsx"),
    route("terms-of-service", "routes/misc/misc.terms-of-service.tsx"),
  ]),
] satisfies RouteConfig;
