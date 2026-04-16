"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supportedLocales } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const suffix = pathname.replace(/^\/(en|ur|ar|it)/, "") || "";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
      >
        <span>Language</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`ml-3 h-4 w-4 text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-20 min-w-[180px] rounded-[1.2rem] border border-[var(--border)] bg-white p-2 shadow-[0_20px_45px_rgba(60,35,15,0.12)]">
          {supportedLocales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => {
                window.location.href = `/${locale}${suffix}`;
              }}
              className={locale === currentLocale ? "block w-full rounded-xl bg-[var(--surface)] px-3 py-2 text-left text-sm font-semibold text-[var(--brand-dark)]" : "block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface)]"}
            >
              {locale === "en" ? "English" : locale === "ur" ? "Urdu" : locale === "ar" ? "Arabic" : "Italian"}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
