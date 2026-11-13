import express from "express";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";
import path from "node:path";

/** Local-only harness for the actual adapter output. Never a deployment entrypoint. */
export async function startNetlifyBuildServer(port = 0, { configure } = {}) {
  process.env.NODE_ENV ??= "production";
  const { default: handler } = await import(pathToFileURL(path.resolve("build/server/server.js")).href);
  const app = express();
  configure?.(app);
  app.use(express.static("build/client"));
  app.use(async (req, res) => {
    try {
      const response = await handler(new Request(`http://127.0.0.1:${server.address().port}${req.originalUrl}`, {
        method: req.method, headers: req.headers,
      }), { requestId: "local-production-quality-gate" });
      res.status(response.status);
      response.headers.forEach((value, name) => res.setHeader(name, value));
      if (response.body) Readable.fromWeb(response.body).pipe(res);
      else res.end();
    } catch (error) {
      console.error(error);
      res.status(500).end("Built Netlify handler failed");
    }
  });
  const server = await new Promise((resolve, reject) => {
    const listening = app.listen(port, "127.0.0.1", () => resolve(listening));
    listening.on("error", reject);
  });
  return { baseUrl: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = await startNetlifyBuildServer(Number(process.env.PORT || 43220));
  console.log(`Built Netlify handler: ${server.baseUrl}`);
}
