import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Product() {
  const t = useTranslations("product");

  return (
    <section id="product" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="mb-6 font-mono text-xs uppercase tracking-[2px] text-white/50">
            {t("label")}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <h2 className="mb-6 font-mono text-4xl font-light leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mb-12 max-w-[640px] text-base leading-[1.6] text-white/70 md:text-lg">
            {t("lede")}
          </p>
        </ScrollReveal>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <ScrollReveal>
            <p className="mb-6 text-base leading-[1.6] text-white/70 md:text-lg">
              {t("body")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="tag">{t("tag1")}</span>
              <span className="tag">{t("tag2")}</span>
              <span className="tag">{t("tag3")}</span>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="product-mock" data-label={t("mockLabel")} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
