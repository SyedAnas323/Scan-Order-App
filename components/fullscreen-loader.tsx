"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SHOW_EVENT = "sofra:loader:show";
const HIDE_EVENT = "sofra:loader:hide";

function showLoader() {
  window.dispatchEvent(new Event(SHOW_EVENT));
}

function hideLoader() {
  window.dispatchEvent(new Event(HIDE_EVENT));
}

// ─── Inner component: safely uses useSearchParams inside Suspense ───
function FullscreenLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // ✅ safe here
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onShow = () => setVisible(true);
    const onHide = () => setVisible(false);

    const onLoad = () => setVisible(false);
    const onBeforeUnload = () => setVisible(true);
    const onPageShow = () => setVisible(false);

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest("a[href]");
      if (link && !link.hasAttribute("download")) {
        const href = link.getAttribute("href") || "";
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          showLoader();
          return;
        }
      }

      const button = target.closest("button");
      if (button && button.getAttribute("type") === "submit") {
        showLoader();
      }
    };

    window.addEventListener(SHOW_EVENT, onShow);
    window.addEventListener(HIDE_EVENT, onHide);
    window.addEventListener("load", onLoad);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("click", onDocumentClick);

    return () => {
      window.removeEventListener(SHOW_EVENT, onShow);
      window.removeEventListener(HIDE_EVENT, onHide);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  useEffect(() => {
    hideLoader();
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="app-loader-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div className="app-loader-panel">
        <div className="app-loader-mark">
          <span className="app-loader-ring app-loader-ring--one" />
          <span className="app-loader-ring app-loader-ring--two" />
          <span className="app-loader-dot" />
        </div>
        <div className="app-loader-text">Loading</div>
      </div>
    </div>
  );
}

// ─── Outer export: wraps inner in Suspense ───
export function FullscreenLoader() {
  return (
    <Suspense fallback={null}>
      <FullscreenLoaderInner />
    </Suspense>
  );
}