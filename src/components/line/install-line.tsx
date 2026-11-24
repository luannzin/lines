"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** A line to paste in a terminal, shown whole in Mono with Copy beside it. */
export function InstallLine({
  command,
  copy,
  copied,
}: {
  command: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* One line, as it's pasted: it scrolls rather than wrap where it
          doesn't fit. contain keeps its length out of the layout's sizing,
          or a narrow hero and the files table would grow to fit it. Focusable
          so a keyboard can scroll it. */}
      <code
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling box, scrolled by keyboard
        tabIndex={0}
        className="min-w-0 flex-[1_1_14rem] select-all overflow-x-auto whitespace-pre rounded-lg border border-input bg-input/32 px-3 py-1.5 text-sm [contain:inline-size]"
      >
        {command}
      </code>
      <Button
        variant="outline"
        onClick={async () => {
          await navigator.clipboard.writeText(command).catch(() => {});
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        }}
      >
        <span aria-live="polite">{done ? copied : copy}</span>
      </Button>
    </div>
  );
}
