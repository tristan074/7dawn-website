import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

type Cell = { name: string; note: string };

export default function Architecture() {
  const t = useTranslations("architecture");
  const tiers = [0, 1, 2].map((i) => ({
    label: t(`tiers.${i}.label`),
    name: t(`tiers.${i}.name`),
    note: t(`tiers.${i}.note`),
    cells: t.raw(`tiers.${i}.cells`) as Cell[],
  }));

  return (
    <section className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Architecture"
            kicker="03b / 06"
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

        <div className="border border-white/10">
          {tiers.map((tier, i) => {
            const isCore = i === 1;
            return (
              <div
                key={i}
                className={`grid grid-cols-1 items-center gap-3 border-b border-white/10 px-7 py-6 last:border-b-0 md:grid-cols-[160px_1fr] md:gap-7 ${
                  isCore ? "bg-white text-[#1f2228]" : ""
                }`}
              >
                <div className={`flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[1.8px] ${isCore ? "text-[rgba(31,34,40,0.5)]" : "text-white/50"}`}>
                  <span>{tier.label}</span>
                  <b className={`font-normal tracking-[1px] ${isCore ? "text-[#1f2228]" : "text-white"} text-[13px]`}>{tier.name}</b>
                  <span>{tier.note}</span>
                </div>
                <div
                  className={`grid gap-2 ${tier.cells.length === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-5"}`}
                >
                  {tier.cells.map((cell) => (
                    <div
                      key={cell.name}
                      className={`flex min-h-[72px] flex-col gap-1 border px-4 py-3.5 text-[13px] ${
                        isCore
                          ? "border-[rgba(31,34,40,0.12)] bg-[rgba(31,34,40,0.06)] text-[#1f2228]"
                          : "border-white/10 bg-white/[0.03] text-white"
                      }`}
                    >
                      <b className="font-mono text-sm font-normal tracking-[-0.002em]">{cell.name}</b>
                      <small className={`font-mono text-[10px] tracking-[0.4px] ${isCore ? "text-[rgba(31,34,40,0.55)]" : "text-white/50"}`}>{cell.note}</small>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
