import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

export default function Scenarios() {
  const t = useTranslations("scenarios");
  const items = [0, 1, 2, 3] as const;

  return (
    <section className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Scenarios"
            kicker="04b / 06"
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

        <div className="grid grid-cols-1 border border-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((i) => (
            <article
              key={i}
              className="flex min-h-[360px] flex-col gap-3 border-b border-r border-white/10 bg-white/[0.03] px-6 py-7 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(n)]:border-r xl:[&:last-child]:border-r-0"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[1.6px] text-white/50">
                <span>{t(`items.${i}.scn`)}</span>
                <span>{t(`items.${i}.cat`)}</span>
              </div>
              <h4 className="font-mono text-xl font-normal leading-[1.2] tracking-[-0.005em]">
                <em className="italic font-light text-white/50">{t(`items.${i}.h4em`)}</em>
                {" "}
                {t(`items.${i}.h4text`)}
              </h4>
              <div className="flex flex-col gap-2 border-y border-dashed border-white/10 py-3">
                {(["in", "agt", "hum", "out"] as const).map((k) => (
                  <div key={k} className="grid grid-cols-[40px_1fr] items-baseline gap-2.5">
                    <b className="font-mono text-[9px] font-normal uppercase tracking-[1.4px] text-white">{k.toUpperCase()}</b>
                    <span className="text-[12.5px] text-white/70 leading-[1.55]">{t(`items.${i}.flow.${k}`)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-baseline justify-between border-t border-white/10 pt-3.5">
                <div className="font-mono text-[22px] font-light tracking-[-0.005em]">
                  {t(`items.${i}.roi.bigBefore`)}
                  <em className="italic font-light text-white/50 mx-1">{t(`items.${i}.roi.bigEm`)}</em>
                  {t(`items.${i}.roi.bigAfter`)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[1px] text-white/50">{t(`items.${i}.roi.small`)}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
