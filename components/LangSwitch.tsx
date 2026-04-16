"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

export default function LangSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // pathname is like /zh/... — replace first segment
    const rest = pathname.replace(/^\/(zh|en)(\/|$)/, "/");
    const target = `/${next}${rest === "/" ? "" : rest}`;
    router.replace(target);
  }

  return (
    <div className="flex gap-2 font-mono text-xs uppercase tracking-[1px]">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-2 py-1 transition-colors ${
            l === locale
              ? "text-white border border-white/20"
              : "text-white/50 hover:text-white"
          }`}
        >
          {l === "zh" ? "中" : "EN"}
        </button>
      ))}
    </div>
  );
}
