// The real parts of the demo: a code like Deskline's, the WebRTC link between
// the two windows, and how good that link is, measured the way Deskline
// measures its own (src/look.rs there).

/** Same network, straight across the internet, or passed along by a relay. */
export type Route = "lan" | "direct" | "relay";
export type Stats = { route: Route; rttMs: number | null };

/** How good a link is, 0.15 to 1, from its route and round trip. */
export function linkQuality({ route, rttMs }: Stats) {
  const base = { lan: 1, direct: 0.9, relay: 0.6 }[route];
  return Math.max(0.15, Math.min(1, base - (rttMs ?? 0) / 600));
}

const Z32 = "ybndrfg8ejkmcpqxot1uwisza345h769";

/** Nine random digits, as Deskline's home shows them: "123 456 789". */
export function newCode() {
  const [n] = crypto.getRandomValues(new BigUint64Array(1));
  const digits = String(n % BigInt(1_000_000_000)).padStart(9, "0");
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ");
}

/** Accepts the nine digits with or without spaces or dashes, as Deskline does. */
export function parseCode(text: string) {
  const digits = text.replace(/[^0-9a-z]/gi, "");
  return /^\d{9}$/.test(digits) ? digits : null;
}

/** 32 random bytes in z-base-32: 52 characters, a computer's key, of which the
 * prompt shows the first eight. */
export function newKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let out = "";
  let bits = 0;
  let value = 0;
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += Z32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += Z32[(value << (5 - bits)) & 31];
  return out;
}

/** A computer name like the ones Windows gives out. */
export function computerName() {
  const abc = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pick = crypto.getRandomValues(new Uint8Array(7));
  return `DESKTOP-${Array.from(pick, (b) => abc[b % 36]).join("")}`;
}

/** Waits until a connection has all its candidates, so one message carries them. */
export function gathered(pc: RTCPeerConnection) {
  return new Promise<void>((resolve) => {
    if (pc.iceGatheringState === "complete") return resolve();
    const done = () => {
      if (pc.iceGatheringState !== "complete") return;
      pc.removeEventListener("icegatheringstatechange", done);
      resolve();
    };
    pc.addEventListener("icegatheringstatechange", done);
  });
}

/** The route and round trip of the candidate pair in use. */
export async function readStats(pc: RTCPeerConnection): Promise<Stats | null> {
  const report = await pc.getStats();
  let pair: Record<string, unknown> | undefined;
  for (const s of report.values())
    if (s.type === "transport" && s.selectedCandidatePairId)
      pair = report.get(s.selectedCandidatePairId);
  // Firefox has no transport stats: fall back to the nominated pair
  if (!pair)
    for (const s of report.values())
      if (s.type === "candidate-pair" && s.nominated && s.state === "succeeded")
        pair = s;
  if (!pair) return null;
  const local = report.get(pair.localCandidateId as string);
  const remote = report.get(pair.remoteCandidateId as string);
  const rtt = pair.currentRoundTripTime;
  return {
    route:
      local?.candidateType === "relay" || remote?.candidateType === "relay"
        ? "relay"
        : local?.candidateType === "host" && remote?.candidateType === "host"
          ? "lan"
          : "direct",
    rttMs: rtt == null ? null : Math.round(Number(rtt) * 1000),
  };
}
