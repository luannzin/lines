import { withInternationalization } from "better-intl/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        // PowerShell's `irm | iex` runs the installer as text; served as a
        // binary it may not (public/hostline/install.ps1, at /install.ps1)
        source: "/:dir*/install.ps1",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        // A shared app runs in a frame of this page and may need the camera,
        // the microphone or the location (the frame's `allow` passes them on).
        source: "/:path*",
        has: [{ type: "host", value: "hostline\\..*" }],
        headers: [
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(self), browsing-topics=()",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Generates src/i18n/generated.ts from the t.ts files (intl.config.ts), and
// watches them in dev.
export default withInternationalization(nextConfig);
