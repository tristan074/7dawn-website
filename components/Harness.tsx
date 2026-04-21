import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

type Row = { ix: string; content: string; sig: string; rc: "ok" | "hold" | "deny" };

export default function Harness() {
  const t = useTranslations("harness");
  const principles = [0, 1, 2, 3, 4] as const;
  const rows = t.raw("demo.rows") as Row[];
  const numerals = ["i", "ii", "iii", "iv", "v"] as const;

  return (
    <section id="harness" className="section-dark relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Harness"
            kicker="04 / 06"
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

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col">
            {principles.map((i) => (
              <div
                key={i}
                className="grid grid-cols-[40px_150px_1fr] items-baseline gap-5 border-b border-white/10 py-6 first:border-t first:border-white/10"
              >
                <div className="font-mono text-xl italic font-light text-white/50">{numerals[i]}</div>
                <h4 className="font-mono text-[17px] font-normal text-white">{t(`principles.${i}.h4`)}</h4>
                <p className="text-[13.5px] leading-[1.55] text-white/70">{t(`principles.${i}.body`)}</p>
              </div>
            ))}
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-6 font-mono text-xs leading-[1.7] text-white/70">
            <div className="flex justify-between border-b border-dashed border-white/10 pb-3 text-[10px] uppercase tracking-[1.8px] text-white/50">
              <span>{t("demo.head.session")}</span>
              <span>{t("demo.head.anchored")}</span>
            </div>
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[22px_1fr_auto] gap-2.5 border-b border-dashed border-white/10 py-2 last:border-b-0">
                <span className="text-white/30">{row.ix}</span>
                <span>
                  <span dangerouslySetInnerHTML={{ __html: row.content }} />
                  <span className="mt-0.5 block text-[11px] text-white/50">{row.sig}</span>
                </span>
                <span
                  className={`self-start border px-[7px] py-0.5 text-[9px] uppercase tracking-[1.4px] ${
                    row.rc === "ok"
                      ? "border-white/20 text-white"
                      : row.rc === "hold"
                        ? "border-dashed border-white/20 text-white/70"
                        : "border-white bg-white text-[#1f2228]"
                  }`}
                >
                  {row.rc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
