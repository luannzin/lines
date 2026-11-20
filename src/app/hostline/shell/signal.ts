// Finding the host: the same room on the same public Nostr relays as the hostline CLI
// (luannzin/hostline, src/signal.rs). The room is a hash of the secret and every message is
// sealed with a key derived from it, so the relays carry only ciphertext. The events are
// ephemeral (kind 20000 to 29999): relays pass them on and keep nothing.

import { SimplePool } from "nostr-tools/pool";
import {
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
} from "nostr-tools/pure";
import type { Link } from "./link";

export const KIND = 21983;
export const RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.primal.net",
  "wss://relay.nostr.net",
  "wss://relay.snort.social",
];

export type Answer = {
  t: "answer";
  to: string;
  sdp: string;
  /** The folder the host shares from. */
  name: string;
  /** When the link ends, Unix ms, if the host set `--for`. */
  ends?: number;
};

const enc = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);

export async function roomTag(secret: string): Promise<string> {
  const hash = new Uint8Array(
    await crypto.subtle.digest("SHA-256", enc.encode(`hostline:${secret}`)),
  );
  return Array.from(hash.subarray(0, 16), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function roomKey(secret: string): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    "HKDF",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: enc.encode("hostline"),
      info: enc.encode("signal"),
    },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function seal(key: CryptoKey, message: object): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sealed = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(JSON.stringify(message)),
    ),
  );
  const all = new Uint8Array(12 + sealed.length);
  all.set(iv);
  all.set(sealed, 12);
  return btoa(String.fromCharCode(...all));
}

export async function open(key: CryptoKey, content: string): Promise<unknown> {
  try {
    const all = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: all.subarray(0, 12) },
      key,
      all.subarray(12),
    );
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    return null;
  }
}

/**
 * Sends the offer, again every 4 seconds until the host answers (it may not be running yet),
 * and calls `onAnswer` with the host's answer. Only the host named in the link can answer.
 * Returns a function that stops sending and leaves the room.
 */
export async function meet(
  link: Link,
  offer: { sdp: string; who: string },
  onAnswer: (answer: Answer) => void,
): Promise<() => void> {
  const [tag, key] = await Promise.all([
    roomTag(link.secret),
    roomKey(link.secret),
  ]);
  const sk = generateSecretKey();
  const pk = getPublicKey(sk);
  const pool = new SimplePool();
  const sub = pool.subscribe(
    RELAYS,
    { kinds: [KIND], "#x": [tag], since: now() - 10 },
    {
      onevent: async (event) => {
        if (!event.pubkey.startsWith(link.host)) return;
        const m = (await open(key, event.content)) as Answer | null;
        if (m?.t === "answer" && m.to === pk) onAnswer(m);
      },
    },
  );
  const send = async () => {
    const event = finalizeEvent(
      {
        kind: KIND,
        created_at: now(),
        tags: [["x", tag]],
        content: await seal(key, { t: "offer", ...offer }),
      },
      sk,
    );
    await Promise.any(pool.publish(RELAYS, event)).catch(() => {});
  };
  await send();
  const timer = setInterval(send, 4000);
  return () => {
    clearInterval(timer);
    sub.close();
    pool.close(RELAYS);
  };
}
