// The computer's end of the demo: it answers the phone's frames the way the hostline CLI does
// (src/peer.rs in luannzin/hostline), from the editor's file instead of a port. Same frames
// (PROTOCOL.md there), same 16 KiB pieces; the kinds are copied, like the CLI's own copy. The
// phone only ever asks for the page, so every request gets it.

const REQ_END = 3;
const RES = 5;
const RES_BODY = 6;
const RES_END = 7;
const BYE = 14;
const CHUNK = 16 * 1024;

const enc = new TextEncoder();
const HEAD = enc.encode(
  JSON.stringify({
    s: 200,
    t: "OK",
    h: [["content-type", "text/html; charset=utf-8"]],
    c: [],
  }),
);

/** Serves `page()` over `dc`, telling `onServed` each answer's size; `bye()` ends the link. */
export function serve(
  dc: RTCDataChannel,
  page: () => string,
  onServed: (bytes: number) => void,
) {
  const send = (kind: number, id: number, payload?: Uint8Array) => {
    const buf = new Uint8Array(5 + (payload?.length ?? 0));
    buf[0] = kind;
    new DataView(buf.buffer).setUint32(1, id);
    if (payload) buf.set(payload, 5);
    if (dc.readyState === "open") dc.send(buf);
  };
  dc.binaryType = "arraybuffer";
  dc.onmessage = (e) => {
    const b = new Uint8Array(e.data as ArrayBuffer);
    if (b[0] !== REQ_END) return;
    const id = new DataView(b.buffer).getUint32(1);
    const body = enc.encode(page());
    send(RES, id, HEAD);
    for (let at = 0; at < body.length; at += CHUNK)
      send(RES_BODY, id, body.subarray(at, at + CHUNK));
    send(RES_END, id);
    onServed(body.length);
  };
  return { bye: () => send(BYE, 0) };
}
