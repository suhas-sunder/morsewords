import { PRINTABLE_CHARTS } from "../app/client/data/printableCharts.ts";

// Public GETs only. Images stay remote and are never written into the app or build.
let failures = 0;
for (let offset = 0; offset < PRINTABLE_CHARTS.length; offset += 4) {
  const results = await Promise.all(PRINTABLE_CHARTS.slice(offset, offset + 4).map(async (chart) => {
    try {
      const response = await fetch(chart.url, { signal: AbortSignal.timeout(30_000) });
      const body = Buffer.from(await response.arrayBuffer());
      const isPng = body.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const type = response.headers.get("content-type")?.split(";")[0];
      const passed = response.ok && type === "image/png" && isPng &&
        body.readUInt32BE(16) === chart.width && body.readUInt32BE(20) === chart.height;
      return { key: chart.key, status: response.status, type, bytes: body.length, passed };
    } catch (error) {
      return { key: chart.key, passed: false, error: String(error) };
    }
  }));
  for (const result of results) {
    console.log(JSON.stringify(result));
    if (!result.passed) failures++;
  }
}
console.log(`${PRINTABLE_CHARTS.length - failures}/${PRINTABLE_CHARTS.length} public PNG assets passed.`);
if (failures) process.exitCode = 1;
