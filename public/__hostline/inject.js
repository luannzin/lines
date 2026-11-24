// Runs first in every page of an app shared through Hostline, inside the frame the link's page
// opens. Its jobs: carry the app's WebSockets (hot reload, live data) over the line to the host's
// machine, give the app the cookies of the jar on that machine and storage of its own for this
// link, keep the address bar on the app's path, and say when the page is in, so the link's page
// shows it. The service worker adds this script.
(() => {
  const line = window.parent !== window && window.parent.__hostline;
  if (!line) return;

  const Native = window.WebSocket;
  const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/;
  // The app's own address, or localhost on any port: both mean "the shared port".
  const carried = (u) => u.host === location.host || LOCAL.test(u.hostname);

  class HostlineSocket extends EventTarget {
    CONNECTING = 0;
    OPEN = 1;
    CLOSING = 2;
    CLOSED = 3;

    constructor(u, protocols) {
      super();
      this.url = u.href;
      this.readyState = 0;
      this.protocol = "";
      this.extensions = "";
      this.bufferedAmount = 0;
      this.binaryType = "blob";
      this.onopen = this.onmessage = this.onerror = this.onclose = null;
      this._socket = line.socket(
        u.pathname + u.search,
        [].concat(protocols ?? []),
        {
          open: (protocol) => {
            this.readyState = 1;
            this.protocol = protocol;
            this._emit(new Event("open"));
          },
          message: (data) => {
            // copied into this frame's own ArrayBuffer, so `instanceof ArrayBuffer` holds
            let d = data;
            if (typeof d !== "string") {
              const copy = new Uint8Array(d).slice();
              d =
                this.binaryType === "arraybuffer"
                  ? copy.buffer
                  : new Blob([copy]);
            }
            this._emit(new MessageEvent("message", { data: d }));
          },
          close: (code, reason) => {
            if (this.readyState === 3) return;
            this.readyState = 3;
            if (code === 1006) this._emit(new Event("error"));
            this._emit(
              new CloseEvent("close", {
                code,
                reason,
                wasClean: code !== 1006,
              }),
            );
          },
        },
      );
    }

    send(data) {
      if (this.readyState === 0)
        throw new DOMException("Still connecting", "InvalidStateError");
      if (this.readyState !== 1) return;
      if (data instanceof Blob)
        data.arrayBuffer().then((b) => this._socket.send(b));
      else this._socket.send(data);
    }

    close(code = 1000, reason = "") {
      if (this.readyState >= 2) return;
      this.readyState = 2;
      this._socket.close(code, reason);
    }

    _emit(event) {
      this.dispatchEvent(event);
      this[`on${event.type}`]?.call(this, event);
    }
  }
  // Sockets to the shared port go over the line; any other stays a real WebSocket. The proxy
  // keeps WebSocket.OPEN and the rest of the native statics.
  window.WebSocket = new Proxy(Native, {
    construct(target, [url, protocols]) {
      const u = new URL(url, location.href);
      return carried(u)
        ? new HostlineSocket(u, protocols)
        : new target(url, protocols);
    },
  });

  // document.cookie reads and writes the jar on the host's machine; the link's page keeps a copy
  // (src/app/hostline/shell/jar.ts).
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => line.cookie(location.pathname),
    set: (text) => line.setCookie(String(text), location.pathname),
  });

  // Storage of its own for this link: every key and database name gets the link's space in front
  // (shell/storage.ts), which the link's page wipes when the link ends. The app sees its own
  // names. ponytail: IDBDatabase.name and Cache Storage (caches) still show or share the rest.
  const space = line.space;
  const scoped = (store) => {
    const keys = () => {
      const out = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k?.startsWith(space)) out.push(k.slice(space.length));
      }
      return out;
    };
    const api = {
      getItem: (k) => store.getItem(space + k),
      setItem: (k, v) => store.setItem(space + k, String(v)),
      removeItem: (k) => store.removeItem(space + k),
      clear: () => {
        for (const k of keys()) store.removeItem(space + k);
      },
      key: (i) => keys()[i] ?? null,
      get length() {
        return keys().length;
      },
    };
    const named = (p) => typeof p === "string" && !(p in api);
    // localStorage.x and Object.keys(localStorage) work as on a real Storage
    return new Proxy(api, {
      get: (t, p) =>
        named(p) ? (store.getItem(space + p) ?? undefined) : t[p],
      set: (_, p, v) => {
        if (named(p)) api.setItem(p, v);
        return true;
      },
      deleteProperty: (_, p) => {
        if (named(p)) api.removeItem(p);
        return true;
      },
      has: (t, p) => (named(p) ? store.getItem(space + p) !== null : p in t),
      ownKeys: () => keys(),
      getOwnPropertyDescriptor: (_, p) => {
        const value = named(p) ? store.getItem(space + p) : null;
        if (value === null) return undefined;
        return { value, writable: true, enumerable: true, configurable: true };
      },
    });
  };
  for (const name of ["localStorage", "sessionStorage"]) {
    try {
      const store = window[name];
      Object.defineProperty(window, name, {
        value: scoped(store),
        configurable: true,
      });
    } catch {
      // storage this browser refuses (some private windows): left as it is
    }
  }
  const idb = window.indexedDB;
  if (idb) {
    const { open, deleteDatabase, databases } = IDBFactory.prototype;
    idb.open = (name, ...version) => open.call(idb, space + name, ...version);
    idb.deleteDatabase = (name) => deleteDatabase.call(idb, space + name);
    if (databases)
      idb.databases = () =>
        databases
          .call(idb)
          .then((list) =>
            list
              .filter((db) => db.name?.startsWith(space))
              .map((db) => ({ ...db, name: db.name.slice(space.length) })),
          );
  }

  const report = () => line.at(location.pathname + location.search);
  for (const name of ["pushState", "replaceState"]) {
    const original = history[name];
    history[name] = function (...args) {
      const result = original.apply(this, args);
      report();
      return result;
    };
  }
  addEventListener("popstate", report);
  report();
  addEventListener("DOMContentLoaded", () => line.ready());
})();
