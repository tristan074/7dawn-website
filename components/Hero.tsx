import { useTranslations } from "next-intl";
import FogCanvas from "./FogCanvas";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-12 md:px-12">
      <FogCanvas />
      <div className="relative z-10 w-full max-w-[1200px] text-center">
        <div className="mb-8 inline-block border border-white/20 px-3 py-1 font-mono text-xs uppercase tracking-[2px] text-white/50">
          {t("label")}
        </div>
        <h1 className="hero-title mb-6 font-mono font-light leading-[1.05] tracking-[-0.01em]">
          {t("title1")}<br />
          <span className="text-white/50">{t("title2")}</span>
        </h1>
        <p className="mx-auto mb-14 max-w-[640px] text-base leading-[1.5] text-white/70 md:text-lg lg:text-xl">
          {t("sub")}
        </p>
        <a
          href="#contact"
          className="inline-block bg-white px-7 py-3.5 font-mono text-sm uppercase tracking-[1.4px] text-[#1f2228] transition-colors hover:bg-white/90"
        >
          {t("cta")} →
        </a>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[2px] text-white/30">
        {t("scroll")}
      </div>
    </section>
  );
}
