import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Team() {
  const t = useTranslations("team");

  return (
    <section id="team" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[2px] text-white/50">
            {t("label")}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <h2 className="mb-6 font-mono text-4xl font-light leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-6xl">
            {t("title1")}<br />
            <span className="text-white/50">{t("title2")}</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mb-16 max-w-[640px] text-base leading-[1.6] text-white/70 md:text-lg">
            {t("lede")}
          </p>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-3 md:gap-16">
          <ScrollReveal>
            <div className="stat-value-text">{t("stat1Value")}</div>
            <div className="stat-label">{t("stat1Label")}</div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="stat-value">
              {t("stat2ValuePrefix")}
              <span className="ml-[6px] text-[0.55em] tracking-[0.5px] text-white/50">
                {t("stat2ValueUnit")}
              </span>
            </div>
            <div className="stat-label">{t("stat2Label")}</div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="stat-value">{t("stat3Value")}</div>
            <div className="stat-label">{t("stat3Label")}</div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
