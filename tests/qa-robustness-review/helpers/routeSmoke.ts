import { expect, test } from "@playwright/test";

import {
  blockExternalNetwork,
  collectConsoleErrors,
  gotoRoute,
  writeArtifact,
} from "../helpers";

function routeArtifactName(route: string) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}

export function defineRouteSmokeSuite(groupName: string, routes: readonly string[]) {
  test.describe(`route smoke: ${groupName}`, () => {
    for (const route of routes) {
      test(`${route} loads without route or console regressions`, async ({
        page,
      }, testInfo) => {
        await blockExternalNetwork(page);
        const consoleEntries = collectConsoleErrors(page);
        const response = await gotoRoute(page, route);

        expect(response?.status(), `${route} HTTP status`).toBeLessThan(400);
        await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

        if (consoleEntries.length > 0) {
          await writeArtifact(
            testInfo,
            `console-${routeArtifactName(route)}.json`,
            consoleEntries,
          );
        }

        expect(consoleEntries, `${route} console entries`).toEqual([]);
      });
    }
  });
}

