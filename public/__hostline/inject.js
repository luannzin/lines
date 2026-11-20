// Runs first in every page of an app shared through Hostline, inside the frame the link's page
// opens. Two jobs: carry the app's WebSockets (hot reload, live data) over the line to the host's
// machine, and keep the address bar on the app's path. The service worker adds this script.
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
})();
