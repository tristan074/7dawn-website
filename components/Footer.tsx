import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 px-6 py-12 md:px-12">
      <div className="font-mono text-xs tracking-[1px] text-white/30">
        {t("copy")}
      </div>
      <div className="font-mono text-xs tracking-[1px] text-white/30">
        {t("city")}
      </div>
    </footer>
  );
}
