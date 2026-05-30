import { expect, test } from "@playwright/test";

import {
  buildMorseEvents,
  estimateMorseDurationMs,
  farnsworthGapScale,
  getDotMs,
  normalizePlayableMorse,
} from "../../app/client/components/shared/morseTiming";
import {
  morseDurationMs,
  morseVisualEvents,
} from "../../app/client/components/shared/playMorsePattern";

function eventNames(code: string) {
  return buildMorseEvents(code, { charWpm: 20 }).map((event) =>
    event.type === "mark" ? event.symbol : event.gap,
  );
}

test.describe("shared Morse timing", () => {
  test("dot duration at 20 WPM is 60 ms", () => {
    expect(getDotMs(20)).toBe(60);
  });

  test("does not apply Farnsworth slowdown when effective WPM is missing", () => {
    expect(farnsworthGapScale(20)).toBe(1);
  });

  test("does not apply Farnsworth slowdown when effective WPM is equal or greater", () => {
    expect(farnsworthGapScale(20, 20)).toBe(1);
    expect(farnsworthGapScale(20, 25)).toBe(1);
  });

  test("uses PARIS-style Farnsworth spacing for 18 character WPM at 12 effective WPM", () => {
    const scale = farnsworthGapScale(18, 12);
    const events = buildMorseEvents(". . / .", {
      charWpm: 18,
      farnsworthWpm: 12,
    });
    const letterGap = events.find(
      (event) => event.type === "gap" && event.gap === "letter",
    );
    const wordGap = events.find(
      (event) => event.type === "gap" && event.gap === "word",
    );

    expect(scale).toBeCloseTo(44 / 19, 8);
    expect(getDotMs(18)).toBeCloseTo(1200 / 18, 8);
    expect(letterGap?.units).toBeCloseTo(3 * (44 / 19), 8);
    expect(wordGap?.units).toBeCloseTo(7 * (44 / 19), 8);
  });

  test("SOS creates the correct mark and gap sequence", () => {
    expect(eventNames("...   ---   ...")).toEqual([
      ".",
      "intra-symbol",
      ".",
      "intra-symbol",
      ".",
      "letter",
      "-",
      "intra-symbol",
      "-",
      "intra-symbol",
      "-",
      "letter",
      ".",
      "intra-symbol",
      ".",
      "intra-symbol",
      ".",
    ]);
  });

  test("SOS HELP produces a word gap between words", () => {
    const gaps = buildMorseEvents("... --- ... / .... . .-.. .--.", {
      charWpm: 20,
    }).filter((event) => event.type === "gap");

    expect(gaps.some((event) => event.gap === "word")).toBe(true);
  });

  test("slash and seven spaces are treated as word breaks", () => {
    const slashEvents = eventNames(".../...");
    const spacedEvents = eventNames("...       ...");

    expect(slashEvents).toEqual(spacedEvents);
    expect(slashEvents).toContain("word");
  });

  test("duration estimation equals the sum of generated event durations", () => {
    const options = { charWpm: 18, farnsworthWpm: 12 };
    const events = buildMorseEvents("... --- ... / .... . .-.. .--.", options);
    const sum = events.reduce((total, event) => total + event.ms, 0);

    expect(estimateMorseDurationMs("... --- ... / .... . .-.. .--.", options)).toBeCloseTo(
      sum,
      8,
    );
  });

  test("compact Morse with single spaces between letters parses correctly", () => {
    expect(eventNames(". -")).toEqual([".", "letter", "-"]);
  });

  test("normalizes pasted dot and dash lookalikes safely", () => {
    expect(
      normalizePlayableMorse(
        "\u00c2\u00b7 \u00e2\u20ac\u00a2 / \u00e2\u20ac\u201c \u00e2\u20ac\u201d \u00e2\u02c6\u2019",
      ),
    ).toBe(". .       - - -");
  });

  test("visual helper exports keep the existing on/ms shape and shared timing", () => {
    const code = "... / ...";
    const visualEvents = morseVisualEvents(code, 18, 12);
    const sharedEvents = buildMorseEvents(code, {
      charWpm: 18,
      farnsworthWpm: 12,
    }).map((event) => ({
      on: event.on,
      ms: event.ms,
    }));

    expect(visualEvents).toEqual(sharedEvents);
    expect(morseDurationMs(code, 18, 12)).toBeCloseTo(
      sharedEvents.reduce((total, event) => total + event.ms, 0),
      8,
    );
  });
});
