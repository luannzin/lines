// Each link gets its own storage. A shared app runs on this one address whatever link opened it,
// so its localStorage, sessionStorage and IndexedDB would be one for every link. The frame's
// helper (public/__hostline/inject.js) puts the link's space, `hostline:<host>:`, in front of
// the app's keys and database names, and the space is wiped when the link ends. The visitor id
// and the heartbeat sit outside every space, so the app never sees them.

/** Any key or database that belongs to a link: its space, its heartbeat, its visitor id. */
const HOST = /^hostline(?:|-beat|-visitor):([0-9a-f]{22})/;
const BEAT = "hostline-beat:"; // + host: when a tab last had that link open, Unix ms
const VISITOR = "hostline-visitor:"; // + host
/** A link nobody has had open for this long ended, or will be opened fresh. */
const STALE = 5 * 60_000;

export const space = (host: string) => `hostline:${host}:`;

/** The id this browser keeps for a link, so the host keeps its cookies across reloads and tabs. */
export function visitor(host: string): string {
  const key = VISITOR + host;
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

/** Marks the link as open in this tab, now and every 30 s, until the returned stop. */
export function beat(host: string): () => void {
  const mark = () => localStorage.setItem(BEAT + host, String(Date.now()));
  mark();
  const timer = setInterval(mark, 30_000);
  return () => clearInterval(timer);
}

// ponytail: a link only counts as gone when no tab has marked it for five minutes, which a
// background tab's slowed timers still manage; a link that ended unseen waits that long.
/** Wipes the space of every link but `current` that no tab has had open lately. */
export async function sweep(current: string) {
  const hosts = new Set<string>();
  const dbs = (await indexedDB.databases?.().catch(() => [])) ?? [];
  const names = [
    ...keys(localStorage),
    ...keys(sessionStorage),
    ...dbs.map((db) => db.name ?? ""),
  ];
  for (const name of names) {
    const host = HOST.exec(name)?.[1];
    if (host) hosts.add(host);
  }
  const now = Date.now();
  for (const host of hosts) {
    const seen = Number(localStorage.getItem(BEAT + host) ?? 0);
    if (host !== current && now - seen > STALE) await wipe(host);
  }
}

/** Wipes everything the app stored under a link, and the link's own keys. */
export async function wipe(host: string) {
  const prefix = space(host);
  for (const store of [localStorage, sessionStorage])
    for (const key of keys(store))
      if (key.startsWith(prefix)) store.removeItem(key);
  localStorage.removeItem(BEAT + host);
  localStorage.removeItem(VISITOR + host);
  const dbs = (await indexedDB.databases?.().catch(() => [])) ?? [];
  for (const db of dbs)
    if (db.name?.startsWith(prefix)) indexedDB.deleteDatabase(db.name);
}

function keys(store: Storage): string[] {
  return Array.from({ length: store.length }, (_, i) => store.key(i) ?? "");
}
