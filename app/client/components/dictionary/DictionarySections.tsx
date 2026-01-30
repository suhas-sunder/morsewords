import * as React from "react";
import styles from "~/client/components/home/styles";
import { TEXT_TO_MORSE } from "~/client/components/home/morseMaps";
import { PHRASE_ROWS, type PhraseRow } from "./dictionaryData";

type CharCategory = "All" | "Letters" | "Numbers" | "Punctuation";

type CopyState = { key: string; at: number } | null;

// Mobile-first responsiveness is handled via a small, route-local style block.
// We render both a table view and a card-list view and toggle them with media queries.
const responsiveCss = `
  .mwDictQuickLinks::-webkit-scrollbar{display:none}
  .mwDictQuickLinks{scrollbar-width:none}

  .mwDictTableWrap{display:block}
  .mwDictMobileCards{display:none}

  /* Slightly reduce required horizontal scrolling on tablets */
  @media (max-width: 900px){
    .mwDictTableWrap table{min-width: 640px !important}
  }

  /* Mobile: use card layout instead of a wide table */
  @media (max-width: 720px){
    .mwDictTableWrap{display:none}
    .mwDictMobileCards{display:grid; gap:12px}
    .mwDictMobileBackTop{display:flex}
  }

  .mwDictCard{
    border: 1px solid #e6e8ef;
    background: #fff;
    border-radius: 14px;
    padding: 12px;
  }
  .mwDictCardRow{display:flex; gap:10px; align-items:flex-start; justify-content:space-between}
  .mwDictCardLabel{color:#5a616c; font-size:.82rem; font-weight:800; letter-spacing:.2px}
  .mwDictCardValue{color:#0b2447; font-weight:900; margin-top:2px}
  .mwDictMono{font: 800 0.98rem/1.25 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"}
  .mwDictCardBtns{display:flex; gap:10px; margin-top:10px}
  .mwDictCardBtns > button{flex:1}
`;

function useCopy() {
  const [copied, setCopied] = React.useState<CopyState>(null);

  const copy = React.useCallback(async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied({ key, at: Date.now() });
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied({ key, at: Date.now() });
      } finally {
        document.body.removeChild(ta);
      }
    }
  }, []);

  return { copied, copy };
}

function ActionButton(props: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  kind?: "primary" | "secondary";
  compact?: boolean;
}) {
  const { onClick, children, title, kind = "secondary", compact } = props;
  const [hover, setHover] = React.useState(false);

  const base =
    kind === "primary"
      ? styles.btnPrimary
      : styles.btnSecondary;

  const style: React.CSSProperties = {
    ...base,
    padding: compact ? "8px 10px" : base.padding,
    borderRadius: 10,
    whiteSpace: "nowrap",
    lineHeight: 1.15,
    transition: "transform 120ms ease, filter 120ms ease, background 120ms ease, color 120ms ease",
    filter: hover ? "brightness(0.96)" : "none",
    transform: hover ? "translateY(-1px)" : "translateY(0px)",
    cursor: "pointer",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}

function ChipButton(props: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const { active, onClick, children } = props;
  const [hover, setHover] = React.useState(false);

  const style: React.CSSProperties = {
    border: "1px solid " + (active ? "#0b2447" : "#e6e8ef"),
    background: active ? "#0b2447" : "#fff",
    color: active ? "#fff" : "#0b2447",
    padding: "8px 10px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: ".92rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "filter 120ms ease, transform 120ms ease, background 120ms ease, color 120ms ease",
    filter: hover ? "brightness(0.96)" : "none",
    transform: hover ? "translateY(-1px)" : "translateY(0px)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}

function SectionHeader(props: { title: string; id: string }) {
  return (
    <div id={props.id} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
      <h2 style={{ ...styles.sectionTitle, margin: "0 0 10px" }}>{props.title}</h2>
      <a
        href="#top"
        style={{
          color: "#0b2447",
          fontWeight: 800,
          textDecoration: "none",
          border: "1px solid #e6e8ef",
          background: "#fff",
          padding: "8px 10px",
          borderRadius: 999,
          cursor: "pointer",
          transition: "filter 120ms ease, transform 120ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(0.96)";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.filter = "none";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
        }}
      >
        Top
      </a>
    </div>
  );
}

function TableShell(props: { children: React.ReactNode }) {
  return (
    <div style={{ ...styles.card, overflow: "hidden" }}>
      <div style={{ padding: 0 }}>{props.children}</div>
    </div>
  );
}

function ScrollTable(props: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" as any }}>
      {props.children}
    </div>
  );
}

function TableBase(props: {
  columns: { key: string; label: string; width?: number | string; align?: "left" | "right" | "center" }[];
  rows: React.ReactNode;
}) {
  const { columns, rows } = props;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: c.align ?? "left",
                padding: "12px 12px",
                background: "#fbfcff",
                borderBottom: "1px solid #e6e8ef",
                fontSize: ".9rem",
                color: "#5a616c",
                letterSpacing: 0.2,
                width: c.width,
                position: "sticky",
                top: 56, // below quick links bar
                zIndex: 1,
              }}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function RowTd(props: { children: React.ReactNode; mono?: boolean; align?: "left" | "right" | "center" }) {
  return (
    <td
      style={{
        padding: "12px 12px",
        borderBottom: "1px solid #eef0f6",
        font: props.mono
          ? '700 0.98rem/1.25 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"'
          : undefined,
        textAlign: props.align ?? "left",
        verticalAlign: "top",
      }}
    >
      {props.children}
    </td>
  );
}

function QuickLinks(props: { items: { id: string; label: string }[] }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "#f7f8fb",
        padding: "10px 0 12px",
        borderBottom: "1px solid #e6e8ef",
        marginBottom: 14,
      }}
    >
      <div
        className="mwDictQuickLinks"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch" as any,
          paddingBottom: 4,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {props.items.map((i) => (
          <a
            key={i.id}
            href={"#" + i.id}
            style={{
              border: "1px solid #e6e8ef",
              background: "#fff",
              color: "#0b2447",
              padding: "8px 10px",
              borderRadius: 999,
              fontWeight: 800,
              textDecoration: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "filter 120ms ease, transform 120ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(0.96)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "none";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0px)";
            }}
          >
            {i.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function normalize(q: string) {
  return q.trim().toLowerCase();
}

function DictionarySections() {
  const { copied, copy } = useCopy();

  const [query, setQuery] = React.useState("");
  const q = normalize(query);

  const [charCat, setCharCat] = React.useState<CharCategory>("All");

  const charRows = React.useMemo(() => {
    const entries = Object.entries(TEXT_TO_MORSE).map(([ch, morse]) => {
      const category =
        /^[A-Z]$/.test(ch) ? "Letters" : /^[0-9]$/.test(ch) ? "Numbers" : "Punctuation";
      return { ch, morse, category };
    });

    const filtered = entries.filter((r) => {
      if (charCat !== "All" && r.category !== charCat) return false;
      if (!q) return true;
      return (
        r.ch.toLowerCase().includes(q) ||
        r.morse.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });

    // stable-ish order: letters, numbers, punctuation
    const order = { Letters: 0, Numbers: 1, Punctuation: 2 } as const;
    filtered.sort((a, b) => order[a.category as keyof typeof order] - order[b.category as keyof typeof order] || a.ch.localeCompare(b.ch));
    return filtered;
  }, [q, charCat]);

  const phraseRows = React.useMemo(() => {
    const filtered = PHRASE_ROWS.filter((r) => {
      if (!q) return true;
      return (
        r.phrase.toLowerCase().includes(q) ||
        r.morse.toLowerCase().includes(q) ||
        r.meaning.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });

    const catOrder: Record<PhraseRow["category"], number> = {
      Prosigns: 0,
      "Q-codes": 1,
      Abbreviations: 2,
      Phrases: 3,
    };

    filtered.sort((a, b) => catOrder[a.category] - catOrder[b.category] || a.phrase.localeCompare(b.phrase));
    return filtered;
  }, [q]);

  const quickLinks = [
    { id: "chars", label: "Characters" },
    { id: "signals", label: "Prosigns" },
    { id: "qcodes", label: "Q-codes" },
    { id: "abbr", label: "Abbreviations" },
    { id: "phrases", label: "Phrases" },
  ];

  const copiedLabel = React.useMemo(() => {
    if (!copied) return "";
    if (Date.now() - copied.at > 1400) return "";
    return "Copied";
  }, [copied]);

  React.useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => {
      // allow label to clear
      setQuery((s) => s);
    }, 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <div id="top">
      <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      <div style={{ ...styles.section, paddingTop: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <h1 style={styles.h1}>Morse Code Dictionary</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontSize: ".9rem", color: "#5a616c" }}>{copiedLabel}</div>
          </div>
        </div>

        <QuickLinks items={quickLinks} />

        <div style={{ ...styles.card, ...styles.cardPad }}>
          <div style={{ display: "grid", gap: 10 }}>
            <label style={styles.label} htmlFor="dict-filter">
              Filter
            </label>
            <input
              id="dict-filter"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="A, .- , QRL, SOS"
              style={styles.input}
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
            />

            <div style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" as any, paddingBottom: 2 }}>
              <ChipButton active={charCat === "All"} onClick={() => setCharCat("All")}>
                All
              </ChipButton>
              <ChipButton active={charCat === "Letters"} onClick={() => setCharCat("Letters")}>
                Letters
              </ChipButton>
              <ChipButton active={charCat === "Numbers"} onClick={() => setCharCat("Numbers")}>
                Numbers
              </ChipButton>
              <ChipButton active={charCat === "Punctuation"} onClick={() => setCharCat("Punctuation")}>
                Punctuation
              </ChipButton>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <SectionHeader title="Characters" id="chars" />

        {/* Desktop/tablet table view */}
        <div className="mwDictTableWrap">
          <TableShell>
            <ScrollTable>
              <TableBase
                columns={[
                  { key: "char", label: "Character", width: 160 },
                  { key: "morse", label: "Morse", width: 260 },
                  { key: "cat", label: "Category", width: 180 },
                  { key: "copy", label: "Copy", width: 220, align: "right" },
                ]}
                rows={
                  <>
                    {charRows.map((r) => {
                      const key = `char:${r.ch}`;
                      return (
                        <tr key={key}>
                          <RowTd mono>{r.ch}</RowTd>
                          <RowTd mono>{r.morse}</RowTd>
                          <RowTd>{r.category}</RowTd>
                          <RowTd align="right">
                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "nowrap" }}>
                              <ActionButton onClick={() => copy(r.morse, key + ":m")} compact>
                                Copy Morse
                              </ActionButton>
                              <ActionButton onClick={() => copy(r.ch, key + ":c")} compact kind="primary">
                                Copy Char
                              </ActionButton>
                            </div>
                          </RowTd>
                        </tr>
                      );
                    })}
                  </>
                }
              />
            </ScrollTable>
          </TableShell>
        </div>

        {/* Mobile card view */}
        <div className="mwDictMobileCards">
          {charRows.map((r) => {
            const key = `char:${r.ch}`;
            return (
              <div key={key} className="mwDictCard">
                <div style={{ display: "grid", gap: 10 }}>
                  <div className="mwDictCardRow">
                    <div>
                      <div className="mwDictCardLabel">Character</div>
                      <div className={`mwDictCardValue mwDictMono`}>{r.ch}</div>
                    </div>

          <div className="mwDictMobileBackTop">
            <a href="#top" aria-label="Back to top">Back to top</a>
          </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mwDictCardLabel">Category</div>
                      <div className="mwDictCardValue">{r.category}</div>
                    </div>
                  </div>

                  <div>
                    <div className="mwDictCardLabel">Morse</div>
                    <div className={`mwDictCardValue mwDictMono`}>{r.morse}</div>
                  </div>

                  <div className="mwDictCardBtns">
                    <ActionButton onClick={() => copy(r.morse, key + ":m")} compact>
                      Copy Morse
                    </ActionButton>
                    <ActionButton onClick={() => copy(r.ch, key + ":c")} compact kind="primary">
                      Copy Char
                    </ActionButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.section}>
        <SectionHeader title="Prosigns" id="signals" />
        <LookupTable rows={phraseRows.filter((r) => r.category === "Prosigns")} copy={copy} tableKey="prosigns" />
      </div>

      <div style={styles.section}>
        <SectionHeader title="Q-codes" id="qcodes" />
        <LookupTable rows={phraseRows.filter((r) => r.category === "Q-codes")} copy={copy} tableKey="qcodes" />
      </div>

      <div style={styles.section}>
        <SectionHeader title="Abbreviations" id="abbr" />
        <LookupTable
          rows={phraseRows.filter((r) => r.category === "Abbreviations")}
          copy={copy}
          tableKey="abbr"
        />
      </div>

      <div style={{ ...styles.section, paddingBottom: 6 }}>
        <SectionHeader title="Phrases" id="phrases" />
        <LookupTable rows={phraseRows.filter((r) => r.category === "Phrases")} copy={copy} tableKey="phrases" />
      </div>
    </div>
  );
}

function LookupTable(props: {
  rows: PhraseRow[];
  copy: (value: string, key: string) => Promise<void>;
  tableKey: string;
}) {
  const { rows, copy, tableKey } = props;

  return (
    <>
      {/* Desktop/tablet table view */}
      <div className="mwDictTableWrap">
        <TableShell>
          <ScrollTable>
            <TableBase
              columns={[
                { key: "phrase", label: "Label", width: 260 },
                { key: "morse", label: "Morse", width: 320 },
                { key: "meaning", label: "Meaning", width: 260 },
                { key: "copy", label: "Copy", width: 240, align: "right" },
              ]}
              rows={
                <>
                  {rows.map((r, idx) => {
                    const key = `${tableKey}:${idx}:${r.phrase}`;
                    return (
                      <tr key={key}>
                        <RowTd mono>{r.phrase}</RowTd>
                        <RowTd mono>{r.morse}</RowTd>
                        <RowTd>{r.meaning}</RowTd>
                        <RowTd align="right">
                          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "nowrap" }}>
                            <ActionButton onClick={() => copy(r.morse, key + ":m")} compact>
                              Copy Morse
                            </ActionButton>
                            <ActionButton onClick={() => copy(r.phrase, key + ":p")} compact kind="primary">
                              Copy Label
                            </ActionButton>
                          </div>
                        </RowTd>
                      </tr>
                    );
                  })}
                </>
              }
            />
          </ScrollTable>
        </TableShell>
      </div>

      {/* Mobile card view */}
      <div className="mwDictMobileCards">
        {rows.map((r, idx) => {
          const key = `${tableKey}:${idx}:${r.phrase}`;
          return (
            <div key={key} className="mwDictCard">
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div className="mwDictCardLabel">Label</div>
                  <div className={`mwDictCardValue mwDictMono`}>{r.phrase}</div>
                </div>

          <div className="mwDictMobileBackTop">
            <a href="#top" aria-label="Back to top">Back to top</a>
          </div>
                <div>
                  <div className="mwDictCardLabel">Morse</div>
                  <div className={`mwDictCardValue mwDictMono`}>{r.morse}</div>
                </div>
                <div>
                  <div className="mwDictCardLabel">Meaning</div>
                  <div className="mwDictCardValue">{r.meaning}</div>
                </div>
                <div className="mwDictCardBtns">
                  <ActionButton onClick={() => copy(r.morse, key + ":m")} compact>
                    Copy Morse
                  </ActionButton>
                  <ActionButton onClick={() => copy(r.phrase, key + ":p")} compact kind="primary">
                    Copy Label
                  </ActionButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DictionarySections;
