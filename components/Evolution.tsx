import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

export default function Evolution() {
  const t = useTranslations("evolution");
  const stats = [0, 1, 2, 3] as const;

  return (
    <section id="evolution" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Evolution"
            kicker="05 / 06"
            title={
              <>
                {t("titleBefore")}
                <em>{t("titleEm")}</em>
                {t("titleAfter")}
              </>
            }
            lead={t("lead")}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Chart panel */}
          <div className="flex flex-col gap-3.5 border border-white/10 bg-white/[0.03] px-6 py-6">
            <div className="flex items-baseline justify-between">
              <h4 className="font-mono text-[11px] uppercase tracking-[2px] text-white/50">{t("chart.head")}</h4>
              <div className="font-mono text-3xl font-light tracking-[-0.01em] text-white">
                {t("chart.now")}
                <span className="ml-0.5 font-mono text-sm text-white/50">%</span>
              </div>
            </div>
            <svg className="block h-[260px] w-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
                <line x1="0" y1="40" x2="800" y2="40" />
                <line x1="0" y1="110" x2="800" y2="110" />
                <line x1="0" y1="180" x2="800" y2="180" />
                <line x1="0" y1="250" x2="800" y2="250" />
              </g>
              <g fontFamily="Geist Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.35)">
                <text x="4" y="44">100%</text>
                <text x="4" y="114">75%</text>
                <text x="4" y="184">50%</text>
                <text x="4" y="254">25%</text>
              </g>
              <g fontFamily="Geist Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.35)">
                <text x="60" y="292">M1</text>
                <text x="180" y="292">M3</text>
                <text x="300" y="292">M5</text>
                <text x="420" y="292">M7</text>
                <text x="540" y="292">M9</text>
                <text x="660" y="292">M11</text>
                <text x="760" y="292">NOW</text>
              </g>
              <path d="M40 240 C 120 230, 180 210, 240 180 S 380 140, 460 100 S 620 60, 780 50" stroke="#ffffff" strokeWidth="2.2" fill="none" />
              <path d="M40 240 C 120 230, 180 210, 240 180 S 380 140, 460 100 S 620 60, 780 50 L 780 280 L 40 280 Z" fill="rgba(255,255,255,0.05)" />
              <path d="M40 80 C 140 90, 220 130, 320 180 S 500 240, 620 265 S 720 275, 780 278" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" fill="none" strokeDasharray="4 3" />
              <path d="M40 190 C 140 170, 240 140, 360 115 S 540 80, 780 70" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" fill="none" />
              <circle cx="780" cy="50" r="4" fill="#ffffff" />
              <circle cx="780" cy="278" r="3" fill="rgba(255,255,255,0.55)" />
              <circle cx="780" cy="70" r="3" fill="rgba(255,255,255,0.75)" />
            </svg>
            <div className="flex flex-wrap gap-5 border-t border-dashed border-white/10 pt-2 font-mono text-[11px] tracking-[0.4px] text-white/70">
              <div className="flex items-center gap-2"><span className="block h-0.5 w-3.5 bg-white" />{t("chart.legend.0")}</div>
              <div className="flex items-center gap-2"><span className="block h-0.5 w-3.5 bg-white/75" />{t("chart.legend.1")}</div>
              <div className="flex items-center gap-2"><span className="block h-0 w-3.5 border-t border-dashed border-white/55" />{t("chart.legend.2")}</div>
            </div>
          </div>

          {/* Stats list */}
          <div className="flex flex-col border border-white/10">
            {stats.map((i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 px-6 py-5 last:border-b-0">
                <div>
                  <h5 className="mb-1 font-mono text-xs font-normal tracking-[0.4px] text-white">{t(`stats.${i}.h5`)}</h5>
                  <p className="text-[12.5px] leading-[1.5] text-white/70">{t(`stats.${i}.body`)}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[30px] font-light tracking-[-0.01em]">
                    <span dangerouslySetInnerHTML={{ __html: t.raw(`stats.${i}.val`) as string }} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[1px] text-white/50">{t(`stats.${i}.delta`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
