import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

export default function Pitch() {
  const t = useTranslations("pitch");

  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <h2 className="font-mono font-light leading-[1.02] tracking-[-0.02em] text-[clamp(44px,8vw,120px)]">
            {t("title1")}
            <br />
            <em className="italic font-light text-white/50">{t("titleEm")}</em>
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mt-10 max-w-[72ch] text-lg leading-[1.65] text-white/70 md:text-xl">
            {t("lead")}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
