import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Directions() {
  const t = useTranslations("directions");

  const items = [
    { n: "01", title: t("d1Title"), desc: t("d1Desc") },
    { n: "02", title: t("d2Title"), desc: t("d2Desc") },
    { n: "03", title: t("d3Title"), desc: t("d3Desc") },
  ];

  return (
    <section id="directions" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
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

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          {items.map(({ n, title, desc }) => (
            <ScrollReveal key={n}>
              <div className="border-t border-white/20 pt-6">
                <span className="mb-6 block font-mono text-6xl font-light leading-none text-white/30 md:text-7xl lg:text-[96px]">
                  {n}
                </span>
                <div className="mb-4 font-mono text-xl">{title}</div>
                <p className="text-[15px] leading-[1.6] text-white/70">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
