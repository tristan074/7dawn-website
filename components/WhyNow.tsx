import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

export default function WhyNow() {
  const t = useTranslations("why");
  const items = [0, 1, 2] as const;

  return (
    <section id="why" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Why Now"
            kicker="01 / 06"
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

        <div className="grid grid-cols-1 border-t border-white/20 md:grid-cols-3">
          {items.map((i) => (
            <ScrollReveal key={i}>
              <div className="flex min-h-[280px] flex-col gap-4 border-b border-white/10 py-8 md:border-b-0 md:border-r md:px-7 md:pr-7 md:[&:last-child]:border-r-0 md:[&:last-child]:pr-0 md:[&:first-child]:pl-0">
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[1.8px] text-white/50">
                  <span>{t(`items.${i}.kicker`)}</span>
                  <span className="text-2xl text-white/30">→</span>
                </div>
                <h3 className="font-mono text-xl leading-[1.3]">{t(`items.${i}.h3`)}</h3>
                <ul className="mt-1 flex flex-col gap-[10px]">
                  {[0, 1, 2].map((b) => (
                    <li
                      key={b}
                      className="relative pl-4 text-[13.5px] leading-[1.55] text-white/70 before:absolute before:left-0 before:top-[10px] before:h-px before:w-2 before:bg-white/30"
                    >
                      {t(`items.${i}.bullets.${b}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
