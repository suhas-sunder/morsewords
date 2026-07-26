import compression from "compression";
import express from "express";
import morgan from "morgan";
import {
  createReadableStreamFromReadable,
  writeReadableStreamToWritable,
} from "@react-router/node";
import { createRequestHandler } from "react-router";

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/index.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const DEFAULT_PORT = DEVELOPMENT ? "3001" : "3000";
const PORT = Number.parseInt(process.env.PORT || DEFAULT_PORT);
const DISABLE_DEV_HMR = process.env.MORSEWORDS_DISABLE_DEV_HMR === "1";

const app = express();

// The application is reached through the single Caddy reverse-proxy hop in
// production. This preserves the original public request URL for SSR metadata,
// redirects, same-origin checks, and cookies.
app.set("trust proxy", 1);
app.use(compression());
app.disable("x-powered-by");

/**
 * @param {import("express").Request} req
 * @param {string} name
 */
function firstForwardedValue(req, name) {
  return req.get(name)?.split(",")[0]?.trim();
}

/** @param {import("express").Request} req */
function originalRequestUrl(req) {
  const protocol = firstForwardedValue(req, "X-Forwarded-Proto") || req.protocol;
  const host = firstForwardedValue(req, "X-Forwarded-Host") || req.get("host");
  const forwardedPort = firstForwardedValue(req, "X-Forwarded-Port");

  if (!host) throw new TypeError("Expected request host header");

  const base = new URL(`${protocol}://${host}`);
  const hasExplicitPort = Boolean(base.port);
  const defaultPort = protocol === "https" ? "443" : "80";
  if (
    !hasExplicitPort &&
    forwardedPort &&
    /^\d{1,5}$/.test(forwardedPort) &&
    forwardedPort !== defaultPort
  ) {
    base.port = forwardedPort;
  }

  return new URL(req.originalUrl, base);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Request}
 */
function createFetchRequest(req, res) {
  const url = originalRequestUrl(req);
  const controller = new AbortController();
  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (!values) continue;
    if (Array.isArray(values)) {
      for (const value of values) headers.append(key, value);
    } else {
      headers.set(key, values);
    }
  }

  res.on("finish", () => controller.abort());
  res.on("close", () => controller.abort());

  /** @type {RequestInit & { duplex?: "half" }} */
  const init = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = createReadableStreamFromReadable(req);
    init.duplex = "half";
  }

  return new Request(url.href, init);
}

/**
 * @param {import("express").Response} res
 * @param {Response} response
 */
async function sendFetchResponse(res, response) {
  res.statusMessage = response.statusText;
  res.status(response.status);
  const getSetCookie = Reflect.get(response.headers, "getSetCookie");

  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === "set-cookie" && typeof getSetCookie === "function") {
      for (const cookie of getSetCookie.call(response.headers)) {
        res.append(key, cookie);
      }
    } else {
      res.append(key, value);
    }
  }

  if (response.headers.get("Content-Type")?.match(/text\/event-stream/i)) {
    res.flushHeaders();
  }

  if (response.body) {
    await writeReadableStreamToWritable(response.body, res);
  } else {
    res.end();
  }
}

if (DEVELOPMENT) {
  console.log("Starting development server");
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: {
        middlewareMode: true,
        hmr: DISABLE_DEV_HMR ? false : undefined,
        ws: DISABLE_DEV_HMR ? false : undefined,
      },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log("Starting production server");
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
  app.use(morgan("tiny"));
  app.use(express.static("build/client", { maxAge: "1h" }));
  const build = await import(BUILD_PATH);
  const handleRequest = createRequestHandler(build, process.env.NODE_ENV);
  app.use(async (req, res, next) => {
    try {
      const request = createFetchRequest(req, res);
      const response = await handleRequest(request, {});
      await sendFetchResponse(res, response);
    } catch (error) {
      next(error);
    }
  });
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

let shuttingDown = false;
/** @param {"SIGTERM" | "SIGINT"} signal */
function shutDown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}; closing the HTTP server.`);

  const forceExitTimeout = setTimeout(() => {
    console.error("Forced shutdown after waiting for active requests.");
    process.exit(1);
  }, 30_000);
  forceExitTimeout.unref();

  server.close((error) => {
    clearTimeout(forceExitTimeout);
    if (error) {
      console.error("HTTP server shutdown failed.", error);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.once("SIGTERM", () => shutDown("SIGTERM"));
process.once("SIGINT", () => shutDown("SIGINT"));
