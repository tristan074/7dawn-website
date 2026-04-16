import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
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
          <p className="mb-16 max-w-[640px] text-base leading-[1.6] text-white/70 md:text-lg">
            {t("lede")}
          </p>
        </ScrollReveal>

        <div className="grid gap-12 md:max-w-[720px] md:grid-cols-2">
          <ScrollReveal>
            <div className="border-t border-white/20 pt-6">
              <div className="mb-3 font-mono text-xs uppercase tracking-[2px] text-white/50">
                {t("email")}
              </div>
              <div className="font-mono text-base">
                <a href="mailto:contact@7dawn.ai" className="text-white transition-colors hover:text-white/50">
                  contact@7dawn.ai
                </a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="border-t border-white/20 pt-6">
              <div className="mb-3 font-mono text-xs uppercase tracking-[2px] text-white/50">
                {t("phone")}
              </div>
              <div className="font-mono text-base">
                <a href="tel:+8618810308915" className="text-white transition-colors hover:text-white/50">
                  +86 188 1030 8915
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
