import type { Metadata } from "next";
import { lines } from "@/lib/lines";

export const metadata: Metadata = {
  title: "Lines",
  robots: { index: false },
};

// Each line lives at its own subdomain; this index is only what the
// deployment's own address shows.
export default function Index() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 py-24">
      <ul className="flex flex-col gap-3">
        {lines.map((line) => (
          <li key={line}>
            <a
              href={`/${line}`}
              className="capitalize underline decoration-foreground/25 underline-offset-[3px] hover:decoration-foreground/60"
            >
              {line}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
