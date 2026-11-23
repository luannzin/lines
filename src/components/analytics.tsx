"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

// Page views, with the address cut at the `#`. A Hostline link's page isn't
// counted at all: its path is the shared app's, someone else's.
export function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(e) =>
        "link" in document.documentElement.dataset
          ? null
          : { ...e, url: e.url.split("#")[0] }
      }
    />
  );
}
