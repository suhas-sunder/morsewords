import * as React from "react";

import Button from "~/client/components/practice/Button";

type Props = {
  title: string;
  subtitle?: string;
  stats: {
    // Number of answer checks (includes failed tries). This drives accuracy.
    attempts: number;
    correct: number;
    // Questions completed in the 10-question run.
    progress: number;
    streak: number;
    bestStreak: number;
    totalQuestions: number;
  };
  runStartedAt: number | null;
};

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

const SHARE_URL = "www.morswords.com";

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

  // Shadow
  ctx.fillStyle = "rgba(15, 23, 42, 0.10)";
  roundRect(ctx, cardX, cardY + 10, cardW, cardH, r);
  ctx.fill();

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

  const attempts = Math.max(0, args.stats.attempts);
  const progress = Math.max(0, args.stats.progress);
  const total = Math.max(1, args.stats.totalQuestions);
  const correct = Math.max(0, args.stats.correct);
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  const cardsTop = y + 18;
  const cardsLeft = left;
  const cardsRight = cardX + cardW - pad;
  const cardsW = cardsRight - cardsLeft;
  const gap = 20;

  // 3x2 stat grid to match the in-quiz bar (Questions/Attempts/Correct/Accuracy/Streak/Best).
  const cols = 3;
  const rows = 2;
  const colW = (cardsW - gap * (cols - 1)) / cols;
  const rowH = 112;

  const card = (cx: number, cy: number, label: string, value: string) => {
    // soft shadow
    ctx.fillStyle = "rgba(15, 23, 42, 0.06)";
    roundRect(ctx, cx, cy + 6, colW, rowH, 20);
    ctx.fill();

    // bg
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, cx, cy, colW, rowH, 20);
    ctx.fill();

    // border
    ctx.strokeStyle = "rgba(15, 23, 42, 0.10)";
    ctx.lineWidth = 1;
    roundRect(ctx, cx + 0.5, cy + 0.5, colW - 1, rowH - 1, 20);
    ctx.stroke();

    // label
    ctx.fillStyle = "rgba(15, 23, 42, 0.70)";
    ctx.font =
      "700 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(label, cx + 28, cy + 24);

    // value
    ctx.fillStyle = "#0F172A";
    ctx.font =
      "900 56px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(value, cx + 28, cy + 58);
  };

  const row1 = cardsTop;
  const row2 = cardsTop + rowH + gap;

  const col1 = cardsLeft;
  const col2 = cardsLeft + colW + gap;
  const col3 = cardsLeft + (colW + gap) * 2;

  card(
    col1,
    row1,
    "Questions",
    `${clamp(args.stats.progress, 0, total)}/${total}`,
  );
  card(col2, row1, "Attempts", String(Math.max(0, attempts)));
  card(col3, row1, "Correct", String(Math.max(0, correct)));

  card(col1, row2, "Accuracy", `${clamp(accuracy, 0, 100)}%`);
  card(col2, row2, "Streak", String(Math.max(0, args.stats.streak)));
  card(col3, row2, "Best", String(Math.max(0, args.stats.bestStreak)));

  // Footer (separate row under cards to avoid overlap)
  const footerY = cardY + cardH - 56;
  const now = new Date();
  const dateStr = now.toLocaleString(undefined, {
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

  // Auto-generate as soon as the modal opens.
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
    const file = await blobToFile(blob, "morse-practice-results.png");
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
        onClick={() => {
          setOpen(true);
        }}
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
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
              <div>
                <div className="text-base font-bold text-neutral-900">Share results</div>
                <div className="text-sm text-gray-600">
                  Generates a shareable image.
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
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
                    className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                    href={pngUrl || undefined}
                    download="morse-practice-results.png"
                  >
                    Download PNG
                  </a>
                ) : null}
              </div>

              {pngUrl ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={pngUrl}
                    alt="Shareable results preview"
                    className="w-full h-auto block"
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
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
