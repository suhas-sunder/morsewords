import compression from "compression";
import express from "express";
import morgan from "morgan";
import {
  createReadableStreamFromReadable,
  writeReadableStreamToWritable,
} from "@react-router/node";

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/server.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const DEFAULT_PORT = DEVELOPMENT ? "3001" : "3000";
const PORT = Number.parseInt(process.env.PORT || DEFAULT_PORT);

const app = express();

app.use(compression());
app.disable("x-powered-by");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Request}
 */
function createFetchRequest(req, res) {
  const [, forwardedHostPort] = req.get("X-Forwarded-Host")?.split(":") ?? [];
  const [, hostPort] = req.get("host")?.split(":") ?? [];
  const port = Number.isSafeInteger(Number.parseInt(forwardedHostPort, 10))
    ? Number.parseInt(forwardedHostPort, 10)
    : Number.isSafeInteger(Number.parseInt(hostPort, 10))
      ? Number.parseInt(hostPort, 10)
      : "";
  const resolvedHost = `${req.hostname}${port ? `:${port}` : ""}`;
  const url = new URL(`${req.protocol}://${resolvedHost}${req.originalUrl}`);
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
      server: { middlewareMode: true },
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
  const handleRequest = await import(BUILD_PATH).then((mod) => mod.default);
  if (typeof handleRequest !== "function") {
    throw new TypeError(`Expected ${BUILD_PATH} to export a request handler`);
  }
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
