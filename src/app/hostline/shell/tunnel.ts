// The visitor's end of the line: one RTCPeerConnection to the host's machine and one data
// channel carrying every request and WebSocket of the shared app, as frames: one byte saying
// what it is, four naming the request or socket, then the payload. The hostline CLI's
// src/peer.rs is the other end and PROTOCOL.md there lists the frames.

import { type Link, who } from "./link";
import { type Answer, meet } from "./signal";

const REQ = 1;
const REQ_BODY = 2;
const REQ_END = 3;
const CANCEL = 4;
const RES = 5;
const RES_BODY = 6;
const RES_END = 7;
const WS_OPEN = 8;
const WS_OPENED = 9;
const WS_TEXT = 10;
const WS_BIN = 11;
const WS_CLOSE = 12;
const FAIL = 13;
const BYE = 14;

/** Under every browser's data channel message limit. */
const CHUNK = 16 * 1024;
const STUN = ["stun:stun.l.google.com:19302", "stun:stun.cloudflare.com:3478"];

const enc = new TextEncoder();
const dec = new TextDecoder();

export type Head = { s: number; t: string; h: [string, string][] };

export type Sink = {
  head(head: Head): void;
  body(chunk: Uint8Array): void;
  end(): void;
  fail(reason: string): void;
};

export type SocketSink = {
  open(protocol: string): void;
  message(data: string | ArrayBuffer): void;
  close(code: number, reason: string): void;
};

export type Socket = {
  send(data: string | ArrayBuffer | ArrayBufferView): void;
  close(code: number, reason: string): void;
};

export class Tunnel {
  #pc: RTCPeerConnection;
  readonly answer: Answer;
  #dc: RTCDataChannel;
  #next = 1;
  #requests = new Map<number, Sink>();
  #sockets = new Map<number, SocketSink>();
  /** The host stopped (Ctrl+C or `--for`): the link is over. */
  onBye = () => {};
  /** The connection dropped without a goodbye. */
  onLost = () => {};

  constructor(pc: RTCPeerConnection, dc: RTCDataChannel, answer: Answer) {
    this.#pc = pc;
    this.answer = answer;
    this.#dc = dc;
    dc.binaryType = "arraybuffer";
    dc.onmessage = (e) => this.#receive(new Uint8Array(e.data as ArrayBuffer));
    dc.onclose = () => this.onLost();
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") this.onLost();
    };
  }

  #frame(kind: number, id: number, payload?: Uint8Array | string) {
    const p = typeof payload === "string" ? enc.encode(payload) : payload;
    const buf = new Uint8Array(5 + (p?.length ?? 0));
    buf[0] = kind;
    new DataView(buf.buffer).setUint32(1, id);
    if (p) buf.set(p, 5);
    if (this.#dc.readyState === "open") this.#dc.send(buf);
  }

  async #drain() {
    if (this.#dc.bufferedAmount < 1 << 20) return;
    this.#dc.bufferedAmountLowThreshold = 1 << 18;
    await new Promise((r) =>
      this.#dc.addEventListener("bufferedamountlow", r, { once: true }),
    );
  }

  request(
    head: { m: string; u: string; h: [string, string][] },
    body: ArrayBuffer | null,
    sink: Sink,
  ): number {
    const id = this.#next++;
    this.#requests.set(id, sink);
    this.#frame(REQ, id, JSON.stringify(head));
    void (async () => {
      const bytes = body ? new Uint8Array(body) : new Uint8Array();
      for (let at = 0; at < bytes.length; at += CHUNK) {
        await this.#drain();
        this.#frame(REQ_BODY, id, bytes.subarray(at, at + CHUNK));
      }
      this.#frame(REQ_END, id);
    })();
    return id;
  }

  cancel(id: number) {
    if (this.#requests.delete(id)) this.#frame(CANCEL, id);
  }

  socket(url: string, protocols: string[], sink: SocketSink): Socket {
    const id = this.#next++;
    this.#sockets.set(id, sink);
    this.#frame(WS_OPEN, id, JSON.stringify({ u: url, p: protocols }));
    return {
      send: (data) => {
        if (typeof data === "string") return this.#frame(WS_TEXT, id, data);
        this.#frame(
          WS_BIN,
          id,
          ArrayBuffer.isView(data)
            ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
            : new Uint8Array(data),
        );
      },
      close: (code, reason) => {
        this.#frame(WS_CLOSE, id, JSON.stringify({ c: code, r: reason }));
      },
    };
  }

  #receive(b: Uint8Array) {
    const kind = b[0];
    const id = new DataView(b.buffer, b.byteOffset).getUint32(1);
    const payload = b.subarray(5);
    const json = () => JSON.parse(dec.decode(payload));
    const req = this.#requests.get(id);
    const ws = this.#sockets.get(id);
    switch (kind) {
      case RES:
        req?.head(json());
        break;
      case RES_BODY:
        req?.body(payload.slice());
        break;
      case RES_END:
        req?.end();
        this.#requests.delete(id);
        break;
      case FAIL:
        req?.fail(dec.decode(payload));
        this.#requests.delete(id);
        break;
      case WS_OPENED:
        ws?.open(json().p);
        break;
      case WS_TEXT:
        ws?.message(dec.decode(payload));
        break;
      case WS_BIN:
        ws?.message(payload.slice().buffer);
        break;
      case WS_CLOSE: {
        const c = json();
        ws?.close(c.c, c.r);
        this.#sockets.delete(id);
        break;
      }
      case BYE:
        this.onBye();
        break;
    }
  }

  close() {
    this.#pc.close();
  }
}

function gathered(pc: RTCPeerConnection, ms: number) {
  if (pc.iceGatheringState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => {
      if (pc.iceGatheringState === "complete") resolve();
    };
    pc.addEventListener("icegatheringstatechange", done);
    setTimeout(resolve, ms);
  });
}

/**
 * Opens the line to the host named in `link`. `onWaiting` fires when the host hasn't answered
 * for a while: it's offline, or the link ended. Keeps asking until it answers.
 */
export async function connect(
  link: Link,
  onWaiting: () => void,
): Promise<Tunnel> {
  const pc = new RTCPeerConnection({ iceServers: [{ urls: STUN }] });
  const dc = pc.createDataChannel("hostline", { ordered: true });
  await pc.setLocalDescription(await pc.createOffer());
  await gathered(pc, 3000);
  const sdp = pc.localDescription?.sdp ?? "";

  let leave = () => {};
  const waiting = setTimeout(onWaiting, 8000);
  const answer = await new Promise<Answer>((resolve) => {
    let answered = false;
    void meet(link, { sdp, who: who(navigator.userAgent) }, (a) => {
      if (answered) return;
      answered = true;
      resolve(a);
    }).then((stop) => {
      leave = stop;
    });
  });
  clearTimeout(waiting);
  await pc.setRemoteDescription({ type: "answer", sdp: answer.sdp });
  if (dc.readyState !== "open")
    await new Promise((r) => dc.addEventListener("open", r, { once: true }));
  leave();
  return new Tunnel(pc, dc, answer);
}
