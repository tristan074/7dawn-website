import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

type Layer = { ix: string; h5: string; body: string; value: string };
type CompeteRow = { rh: string; cells: { text: string; level: "y" | "p" | "n" }[] };

export default function Market() {
  const t = useTranslations("market");
  const layers = t.raw("tam.layers") as Layer[];
  const header = t.raw("compete.header") as string[];
  const rows = t.raw("compete.rows") as CompeteRow[];

  return (
    <section id="market" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Market"
            kicker="06 / 06"
            title={
              <>
                {t("titleLine1")}
                <br />
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        {/* TAM */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="border border-white/10 bg-white/[0.03] p-8">
            <svg viewBox="0 0 520 520" className="mx-auto block h-auto w-full max-w-[480px]">
              <circle cx="260" cy="260" r="240" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.22)" strokeDasharray="2 4" />
              <circle cx="260" cy="260" r="170" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.28)" />
              <circle cx="260" cy="260" r="100" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.5)" />
              <circle cx="260" cy="260" r="44" fill="#ffffff" stroke="#ffffff" />
              <g fontFamily="Geist Mono, monospace" fill="rgba(255,255,255,0.72)">
                <text x="260" y="50" textAnchor="middle" fontSize="13" fontStyle="italic">{t("tam.ringLabels.0")}</text>
                <text x="260" y="130" textAnchor="middle" fontSize="13" fontStyle="italic">{t("tam.ringLabels.1")}</text>
                <text x="260" y="210" textAnchor="middle" fontSize="13" fontStyle="italic" fill="#ffffff">{t("tam.ringLabels.2")}</text>
                <text x="260" y="258" textAnchor="middle" fontSize="15" fill="#1f2228" fontWeight="500">SOM</text>
                <text x="260" y="276" textAnchor="middle" fontSize="10" fill="#1f2228" letterSpacing="1">{t("tam.ringLabels.som")}</text>
              </g>
              <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none">
                <path d="M8 20 L8 8 L20 8" /><path d="M500 8 L512 8 L512 20" />
                <path d="M8 500 L8 512 L20 512" /><path d="M500 512 L512 512 L512 500" />
              </g>
              <g fontFamily="Geist Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)" letterSpacing="2">
                <text x="24" y="18">TAM · CHINA</text>
                <text x="496" y="18" textAnchor="end">2026-2031</text>
              </g>
            </svg>
          </div>

          <div className="flex flex-col">
            {layers.map((layer) => (
              <div
                key={layer.ix}
                className={`grid grid-cols-[56px_1fr_auto] items-center gap-5 border-b border-white/10 py-5 first:border-t first:border-white/20 ${
                  layer.ix === "SOM" ? "-mx-2.5 bg-white/[0.05] px-2.5" : ""
                }`}
              >
                <span className={`font-mono text-[11px] uppercase tracking-[1.6px] ${layer.ix === "SOM" ? "text-white" : "text-white/50"}`}>{layer.ix}</span>
                <div>
                  <h5 className="mb-0.5 font-mono text-sm font-normal text-white">{layer.h5}</h5>
                  <p className="text-[12.5px] leading-[1.5] text-white/70">{layer.body}</p>
                </div>
                <span className="whitespace-nowrap text-right font-mono text-lg font-light tracking-[-0.005em] text-white" dangerouslySetInnerHTML={{ __html: layer.value }} />
              </div>
            ))}
          </div>
        </div>

        {/* Compete */}
        <div className="mt-20">
          <h3 className="mb-7 font-mono text-[22px] font-normal tracking-[-0.01em]">{t("compete.h3")}</h3>
          <div className="border border-white/10">
            <div className="hidden grid-cols-[170px_repeat(5,1fr)] border-b border-white/10 bg-white/[0.05] font-mono text-[11px] uppercase tracking-[1.4px] text-white/50 md:grid">
              {header.map((h, i) => (
                <div key={i} className="flex items-center border-r border-white/10 px-4 py-3.5 last:border-r-0">{h}</div>
              ))}
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 border-b border-white/10 text-[13px] last:border-b-0 md:grid-cols-[170px_repeat(5,1fr)] ${
                  i === 0 ? "md:bg-white/[0.03]" : ""
                }`}
              >
                <div className="flex items-center border-b border-dashed border-white/10 px-4 py-2.5 font-mono font-normal text-white md:border-b-0 md:border-r">{row.rh}</div>
                {row.cells.map((cell, j) => (
                  <div
                    key={j}
                    className={`flex items-center border-b border-dashed border-white/10 px-4 py-2.5 font-mono md:border-b-0 md:border-r md:last:border-r-0 ${
                      cell.level === "y" ? "text-white" : cell.level === "p" ? "text-white/70" : "text-white/30"
                    }`}
                  >
                    {cell.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
