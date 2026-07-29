"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function hydrateIcons() {
  window.lucide?.createIcons?.();
}

export function IconRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    hydrateIcons();
  }, [pathname]);

  return (
    <Script
      src="/vendor/lucide.min.js"
      strategy="afterInteractive"
      onLoad={hydrateIcons}
    />
  );
}
