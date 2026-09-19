"use client";

import React, { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/seo/metadata";

interface AdSlotProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  className?: string;
  label?: string;
}

// Reserved heights per format keep the slot from causing layout shift (CLS)
// while the ad loads — good for UX and AdSense quality scoring.
const RESERVED_HEIGHT: Record<NonNullable<AdSlotProps["format"]>, string> = {
  horizontal: "min-h-[90px] sm:min-h-[100px]",
  rectangle: "min-h-[250px]",
  vertical: "min-h-[300px]",
  auto: "min-h-[100px]",
};

export function AdSlot({
  slotId = "default-slot",
  format = "horizontal",
  className = "",
  label = "Advertisement",
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const client = ADSENSE_CLIENT;

  useEffect(() => {
    if (client && typeof window !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // Safe swallow of adsbygoogle push error
      }
    }
  }, [client]);

  return (
    <div
      className={`my-8 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 text-center dark:border-slate-800/80 dark:bg-slate-900/30 ${className}`}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Clear, honest label — required so ads are never mistaken for content */}
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {label}
      </div>

      <div className={`flex items-center justify-center ${RESERVED_HEIGHT[format]}`}>
        {client ? (
          <ins
            ref={adRef}
            className="adsbygoogle block w-full"
            style={{ display: "block" }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          /* Development / Unset AdSense placeholder */
          <div className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-slate-100/50 py-6 text-slate-400 dark:bg-slate-800/30 dark:text-slate-500">
            <span className="text-xs font-semibold tracking-wide">Ad Placement Area</span>
            <span className="text-[11px]">
              Set <code className="rounded bg-slate-200/80 px-1 py-0.5 text-red-600 dark:bg-slate-700 dark:text-red-400">NEXT_PUBLIC_ADSENSE_CLIENT</code> to activate live ads
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
