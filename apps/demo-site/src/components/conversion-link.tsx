"use client";

import { trackConversion } from "@behavior-analytics/tracker";
import Link from "next/link";
import type { ComponentProps } from "react";
import { TRACKER_DEBUG } from "../lib/tracker-config";

type ConversionLinkProps = ComponentProps<typeof Link> & {
  conversionName: string;
};

export function ConversionLink({
  conversionName,
  onClick,
  ...props
}: ConversionLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        void trackConversion(conversionName).then(() => {
          if (TRACKER_DEBUG) {
            console.debug("[behavior-analytics] conversion sent", {
              conversionName,
            });
          }
        });
        onClick?.(event);
      }}
    />
  );
}
