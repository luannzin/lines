import type { Metadata } from "next";
import { origin } from "@/lib/lines";

// Set here, not in the page: the share image and icon files resolve their
// addresses against the layout's base.
export const metadata: Metadata = { metadataBase: new URL(origin("hostline")) };

export default function Layout({ children }: LayoutProps<"/hostline">) {
  return children;
}
