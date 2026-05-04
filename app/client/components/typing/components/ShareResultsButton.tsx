import * as React from "react";

import Button from "~/client/components/shared/Button";

type Props = {
  title: string;
  subtitle?: string;
  completedAt: number | null;
  stats: {
    durationSec: number;
    letters: number;
    words: number;
    lettersPerMin: number;
    invalid: number;
  };
};

const SHARE_URL = "www.morsewords.com";

function fmtMMSS(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

async function blobToFile(blob: Blob, filename: string) {
  return new File([blob], filename, { type: blob.type || "image/png" });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function renderShareImage(args: Props): Promise<Blob> {
  const W = 1200;
  const H = 630;

  const canvas = document.createElement("canvas");
  const scale = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  canvas.width = W * scale;
  canvas.height = H * scale;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = "#F8FAFC";
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = "rgba(15, 23, 42, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }

  // Main card
  const cardX = 70;
  const cardY = 55;
  const cardW = W - 140;
  const cardH = H - 110;
  const r = 34;

  // Card background
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, cardX, cardY, cardW, cardH, r);
  ctx.fill();

  // Accent bar
  ctx.fillStyle = "#0F172A";
  roundRect(ctx, cardX, cardY, cardW, 12, 10);
  ctx.fill();

  const pad = 56;
  const left = cardX + pad;
  let y = cardY + pad;

  // Title
  ctx.fillStyle = "#0F172A";
  ctx.textBaseline = "top";
  ctx.font =
    "800 64px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText(args.title, left, y);
  y += 74;

  // Subtitle
  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.font =
    "600 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText(args.subtitle || "Results summary", left, y);
  y += 52;

  const cardsTop = y + 18;
  const cardsLeft = left;
  const cardsRight = cardX + cardW - pad;
  const cardsW = cardsRight - cardsLeft;
  const gap = 20;

  const cols = 3;
  const rows = 2;
  const colW = (cardsW - gap * (cols - 1)) / cols;
  const rowH = 112;

  const card = (cx: number, cy: number, label: string, value: string) => {
    ctx.fillStyle = "#F1F5F9";
    roundRect(ctx, cx, cy, colW, rowH, 20);
    ctx.fill();

    ctx.fillStyle = "rgba(15, 23, 42, 0.70)";
    ctx.font =
      "700 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(label, cx + 28, cy + 24);

    ctx.fillStyle = "#0F172A";
    // Dynamic sizing to avoid overflow (e.g., large counts like 12345).
    // Keep the design aligned with Practice, but slightly more conservative.
    const valueSize = clamp(74 - value.length * 6, 40, 52);
    ctx.font =
      `900 ${valueSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
    ctx.fillText(value, cx + 28, cy + 56);
  };

  const row1 = cardsTop;
  const row2 = cardsTop + rowH + gap;

  const col1 = cardsLeft;
  const col2 = cardsLeft + colW + gap;
  const col3 = cardsLeft + (colW + gap) * 2;

  card(col1, row1, "Duration", fmtMMSS(args.stats.durationSec));
  card(col2, row1, "Letters", String(Math.max(0, args.stats.letters)));
  card(col3, row1, "Words", String(Math.max(0, args.stats.words)));

  card(col1, row2, "Letters/min", String(Math.max(0, args.stats.lettersPerMin)));
  card(col2, row2, "Invalid", String(Math.max(0, args.stats.invalid)));
  card(col3, row2, "Mode", "Freeform");

  // Footer
  const footerY = cardY + cardH - 56;
  const dt = new Date(args.completedAt || Date.now());
  const dateStr = dt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  ctx.fillStyle = "rgba(15, 23, 42, 0.70)";
  ctx.font =
    "600 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.textAlign = "left";
  ctx.fillText(dateStr, left, footerY);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(15, 23, 42, 0.90)";
  ctx.font =
    "800 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText(SHARE_URL, cardX + cardW - pad, footerY);
  ctx.textAlign = "left";

  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), "image/png", 1);
  });

  return blob;
}

export default function ShareResultsButton(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [pngUrl, setPngUrl] = React.useState<string | null>(null);
  const [pngBlob, setPngBlob] = React.useState<Blob | null>(null);
  const [busy, setBusy] = React.useState(false);

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  React.useEffect(() => {
    return () => {
      if (pngUrl) URL.revokeObjectURL(pngUrl);
    };
  }, [pngUrl]);

  React.useEffect(() => {
    if (!open) return;
    if (pngUrl || busy) return;
    void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function generate() {
    setBusy(true);
    try {
      const blob = await renderShareImage(props);
      const url = URL.createObjectURL(blob);
      setPngBlob(blob);
      setPngUrl(url);
      return { blob, url };
    } finally {
      setBusy(false);
    }
  }

  async function shareNative() {
    if (!canShare) return;
    const blob = pngBlob || (await generate())?.blob;
    if (!blob) return;
    const file = await blobToFile(blob, "morse-typing-results.png");
    await navigator.share({
      files: [file],
      title: props.title,
      text: props.subtitle || "Results summary",
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
        aria-label="Share results"
      >
        Share results
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-[#fffdf8] outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.1)]">
            <div className="flex items-center justify-between bg-[#fffaf2] p-4 sm:p-5">
              <div>
                <div className="text-base font-extrabold text-sky-950">Share results</div>
                <div className="text-sm text-slate-600">Generates a shareable image.</div>
              </div>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-900 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.1)] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                {canShare ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={shareNative}
                    disabled={busy || !pngBlob}
                    aria-label="Share via system dialog"
                  >
                    Share
                  </Button>
                ) : null}

                {pngBlob ? (
                  <a
                    className="inline-flex cursor-pointer items-center rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-slate-900 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.1)] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                    href={pngUrl || undefined}
                    download="morse-typing-results.png"
                  >
                    Download PNG
                  </a>
                ) : null}
              </div>

              {pngUrl ? (
                <div className="mt-4 overflow-hidden rounded-2xl bg-[#fffdf8]">
                  <img
                    src={pngUrl}
                    alt="Shareable results preview"
                    className="w-full h-auto block"
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-[#fffdf8] p-4 text-sm text-slate-700">
                  {busy ? "Generating your share card..." : "Generating your share card..."}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
