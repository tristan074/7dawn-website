import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const GLYPHS: ReactNode[] = [
  <svg key="d" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 38 L22 6 L38 38" /><path d="M14 28 L30 28" /><circle cx="22" cy="22" r="2" fill="currentColor" /></svg>,
  <svg key="v" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="6" y="6" width="32" height="32" /><path d="M14 22 L20 28 L32 16" /></svg>,
  <svg key="f" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="22" cy="22" r="14" /><path d="M22 8 L28 14 L22 20 M22 36 L16 30 L22 24" /></svg>,
  <svg key="o" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 32 L16 16 L24 24 L40 8" /><circle cx="40" cy="8" r="2.4" fill="currentColor" /><path d="M4 40 L40 40" strokeDasharray="2 3" /></svg>,
  <svg key="c" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 38 L6 22 L14 22 L14 38" /><path d="M18 38 L18 10 L26 10 L26 38" /><path d="M30 38 L30 26 L38 26 L38 38" /><path d="M4 40 L40 40" /></svg>,
];

export default function Spaces() {
  const t = useTranslations("spaces");
  const items = [0, 1, 2, 3, 4] as const;

  return (
    <section id="spaces" className="relative border-t border-white/10 px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal>
          <SectionHeader
            idx="Product"
            kicker="03 / 06"
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

        <div className="grid grid-cols-1 border border-white/10 sm:grid-cols-2 xl:grid-cols-5">
          {items.map((i) => {
            const tags = t.raw(`items.${i}.tags`) as string[];
            return (
              <article
                key={i}
                className="flex min-h-[420px] flex-col gap-4 border-b border-r border-white/10 bg-white/[0.03] px-6 py-8 transition-colors last:border-r-0 hover:bg-white/[0.05] sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(n)]:border-r xl:[&:last-child]:border-r-0"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[2px] text-white/50">{t(`items.${i}.code`)}</span>
                  <span className="font-mono text-xl italic font-light text-white/30">{t(`items.${i}.numeral`)}</span>
                </div>
                <div className="mt-2 h-10 w-10 text-white [&_svg]:h-full [&_svg]:w-full">{GLYPHS[i]}</div>
                <h3 className="font-mono text-[22px] font-normal leading-none tracking-[-0.01em]">
                  <em className="mr-1.5 font-light italic text-white/50">{t(`items.${i}.nameEm`)}</em>
                  {t(`items.${i}.nameText`)}
                </h3>
                <p className="flex-1 text-[13px] leading-[1.55] text-white/70">{t(`items.${i}.desc`)}</p>
                <div className="flex flex-wrap gap-1.5 border-t border-dashed border-white/10 pt-3.5">
                  {tags.map((tag) => (
                    <span key={tag} className="border border-white/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[1.4px] text-white/50">{tag}</span>
                  ))}
                </div>
                <div className="pt-1 font-mono text-[10px] tracking-[0.8px] text-white/50">
                  {t(`items.${i}.outlinePrefix`)}
                  <b className="font-normal text-white">{t(`items.${i}.outlineBold`)}</b>
                  {t(`items.${i}.outlineSuffix`)}
                </div>
              </article>
            );
          })}
        </div>

        {/* Pack strip */}
        <ScrollReveal>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border border-dashed border-white/20 px-6 py-5">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-white/70">{t("pack.kicker")}</span>
              <strong className="font-mono text-[18px] font-normal tracking-[-0.005em] text-white">{t("pack.title")}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="chip is-active"><span className="dot" />{t("pack.chip0")}</span>
              <span className="chip">{t("pack.chip1")}</span>
              <span className="chip">{t("pack.chip2")}</span>
              <span className="chip">{t("pack.chip3")}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* OrbitOps strip */}
        <ScrollReveal>
          <div className="mt-5 flex flex-wrap items-center gap-5 border border-white bg-white px-6 py-5 text-[#1f2228]">
            <span className="chip border-[rgba(31,34,40,0.3)] text-[#1f2228]">
              <span className="dot" style={{ background: "#1f2228" }} />
              OrbitOps
            </span>
            <span className="ml-1 font-mono text-sm">{t("orbitOps.body")}</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
