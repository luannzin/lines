"use client";

import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { type Locale, translations } from "@/i18n/generated";
import { cn } from "@/lib/utils";
import { createDesktop, type Desktop } from "./desktop";
import { Dots, type LinkState } from "./dots";
import {
  computerName,
  gathered,
  groups,
  linkQuality,
  newCode,
  parseCode,
  readStats,
  type Stats,
} from "./link";

// Two Deskline windows in one page, connected for real: the second offers a
// WebRTC connection to the first, which asks before answering, then sends
// its screen (a canvas) as video and takes the pointer over a data channel.
// The offer and answer are handed across in memory: that hand-off is the one
// thing Deskline does over the internet instead.

type Ask = { offer: RTCSessionDescriptionInit; viewer: RTCPeerConnection };
type Host =
  | { kind: "idle"; note?: string }
  | { kind: "asked"; ask: Ask }
  | { kind: "sharing"; control: boolean };
type Viewer =
  | { kind: "idle"; note?: string }
  | { kind: "waiting" }
  | { kind: "session"; control: boolean };

type Msg =
  | { t: "move"; x: number; y: number }
  | { t: "leave" }
  | { t: "click"; x: number; y: number }
  | { t: "control"; on: boolean };

// The language comes from the server as a prop: the client's `t` is fixed at
// load, and a language switch (a Server Action re-rendering the page) has to
// reach the windows too.
type Words = (typeof translations)[Locale]["app"]["deskline"]["demo"];

export function Demo({ locale }: { locale: Locale }) {
  const labels = translations[locale].app.deskline.try;
  const d = translations[locale].app.deskline.demo;
  const [code, setCode] = useState("");
  // the helper's computer: its name and code, as its request shows them
  const [name, setName] = useState("");
  const [helperCode, setHelperCode] = useState("");
  const [host, setHost] = useState<Host>({ kind: "idle" });
  const [viewer, setViewer] = useState<Viewer>({ kind: "idle" });
  const [stats, setStats] = useState<Stats | null>(null);
  const [link, setLink] = useState<LinkState>({ kind: "none" });
  const desktop = useRef<Desktop | null>(null);
  const hostPc = useRef<RTCPeerConnection | null>(null);
  const viewerPc = useRef<RTCPeerConnection | null>(null);
  const hostChannel = useRef<RTCDataChannel | null>(null);
  const viewerChannel = useRef<RTCDataChannel | null>(null);

  // made in the browser: the code and name differ on every visit
  useEffect(() => {
    setCode(newCode());
    setName(computerName());
    setHelperCode(newCode());
    const mark = new Image();
    mark.src = "/deskline/mark.png";
    mark.onload = () => {
      desktop.current = createDesktop(mark);
    };
    return () => {
      desktop.current?.stop();
      hostPc.current?.close();
      viewerPc.current?.close();
    };
  }, []);

  // the link's route and round trip, once a second, as Deskline reads its own
  useEffect(() => {
    if (viewer.kind !== "session") return;
    const pc = viewerPc.current;
    if (!pc) return;
    const since = performance.now();
    const read = async () => {
      const s = await readStats(pc).catch(() => null);
      if (!s) return;
      setStats(s);
      const quality = linkQuality(s);
      setLink((old) =>
        old.kind === "live" && Math.abs(old.quality - quality) < 0.02
          ? old
          : { kind: "live", quality, since },
      );
    };
    read();
    const timer = setInterval(read, 1000);
    return () => clearInterval(timer);
  }, [viewer.kind]);

  // Ending one side closes its connection quietly; the other side hears the
  // channel close and says why in its own words.
  const endViewer = (note?: string) => {
    if (viewerChannel.current) viewerChannel.current.onclose = null;
    viewerChannel.current = null;
    viewerPc.current?.close();
    viewerPc.current = null;
    setViewer({ kind: "idle", note });
    setStats(null);
    setLink({ kind: "none" });
  };
  const endHost = (note?: string) => {
    desktop.current?.stop();
    if (hostChannel.current) hostChannel.current.onclose = null;
    hostChannel.current = null;
    hostPc.current?.close();
    hostPc.current = null;
    setHost({ kind: "idle", note });
  };

  // the second window: offer a link to the code it was given
  const connect = async (text: string) => {
    const target = parseCode(text);
    if (!target) return setViewer({ kind: "idle", note: d.wrongCode });
    if (target !== code)
      return setViewer({ kind: "idle", note: d.unreachable });
    setViewer({ kind: "waiting" });
    setLink({ kind: "forming" });
    try {
      const pc = new RTCPeerConnection();
      viewerPc.current = pc;
      const channel = pc.createDataChannel("control");
      viewerChannel.current = channel;
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.onconnectionstatechange = () => {
        if (pc !== viewerPc.current) return;
        if (pc.connectionState === "disconnected") setLink({ kind: "lost" });
        if (pc.connectionState === "failed") endViewer(d.lost);
      };
      channel.onmessage = (e) => {
        const msg = JSON.parse(e.data) as Msg;
        if (msg.t === "control")
          setViewer({ kind: "session", control: msg.on });
      };
      channel.onclose = () => endViewer(d.theyStopped);
      await pc.setLocalDescription();
      await gathered(pc);
      if (pc !== viewerPc.current || !pc.localDescription) return;
      setHost({
        kind: "asked",
        ask: { offer: pc.localDescription, viewer: pc },
      });
    } catch {
      endViewer(d.failed);
    }
  };

  // the first window: answer, and send the screen
  const accept = async (ask: Ask, control: boolean) => {
    const screen = desktop.current;
    if (!screen) return;
    try {
      const pc = new RTCPeerConnection();
      hostPc.current = pc;
      pc.ondatachannel = ({ channel }) => {
        hostChannel.current = channel;
        channel.onopen = () =>
          channel.send(JSON.stringify({ t: "control", on: control }));
        channel.onmessage = (e) => {
          const msg = JSON.parse(e.data) as Msg;
          if (msg.t === "move") screen.move("them", msg);
          if (msg.t === "leave") screen.move("them", null);
          if (msg.t === "click") screen.click(msg);
        };
        channel.onclose = () => endHost(d.theyLeft);
      };
      pc.onconnectionstatechange = () => {
        if (pc === hostPc.current && pc.connectionState === "failed")
          endHost(d.lost);
      };
      await pc.setRemoteDescription(ask.offer);
      screen.start();
      const track = screen.canvas.captureStream(30).getVideoTracks()[0];
      const video = pc
        .getTransceivers()
        .find((tr) => tr.receiver.track.kind === "video");
      if (!video) throw new Error("no video");
      video.direction = "sendonly";
      await video.sender.replaceTrack(track);
      await pc.setLocalDescription();
      await gathered(pc);
      if (!pc.localDescription || ask.viewer !== viewerPc.current) return;
      setHost({ kind: "sharing", control });
      setViewer({ kind: "session", control });
      await ask.viewer.setRemoteDescription(pc.localDescription);
    } catch {
      endHost();
      endViewer(d.failed);
    }
  };

  const decline = () => {
    setHost({ kind: "idle" });
    endViewer(d.declined);
  };

  const setControl = (on: boolean) => {
    setHost({ kind: "sharing", control: on });
    if (!on) desktop.current?.move("them", null);
    hostChannel.current?.send(JSON.stringify({ t: "control", on }));
  };

  const stopSharing = () => endHost(d.youStopped);
  const disconnect = () => endViewer();

  const send = (msg: Msg) => {
    const channel = viewerChannel.current;
    if (
      viewer.kind === "session" &&
      viewer.control &&
      channel?.readyState === "open"
    )
      channel.send(JSON.stringify(msg));
  };

  return (
    <div className="grid gap-y-8 lg:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)]">
      <Frame label={labels.you}>
        <HostWindow
          d={d}
          code={code}
          name={name}
          from={helperCode}
          host={host}
          desktop={desktop.current}
          onAccept={accept}
          onDecline={decline}
          onControl={setControl}
          onStop={stopSharing}
        />
      </Frame>
      {/* the link spans the whole gap: on a phone, the space between the
          stacked windows; on a wide screen, the column between them */}
      <div className="relative flex flex-col justify-center lg:pt-9">
        <Dots
          link={link}
          label={
            stats
              ? `${d.link}: ${d[stats.route]}${stats.rttMs === null ? "" : `, ${stats.rttMs} ms`}`
              : undefined
          }
          className="h-8 w-full"
        />
        {/* hangs under the strip without taking room, so the strip stays
            centred between the windows */}
        <p
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-[calc(50%+1.25rem)] text-center font-mono text-muted-foreground text-sm tabular-nums transition-opacity duration-300 lg:top-[calc(50%+1.25rem+1.125rem)]",
            !stats && "opacity-0",
          )}
        >
          {stats && `${d[stats.route]} ${stats.rttMs ?? 0} ms`}
        </p>
      </div>
      <Frame label={labels.helper}>
        <ViewerWindow
          d={d}
          viewer={viewer}
          stats={stats}
          link={link}
          pc={viewerPc.current}
          onConnect={connect}
          onCancel={() => {
            setHost({ kind: "idle" });
            disconnect();
          }}
          onDisconnect={disconnect}
          onPointer={send}
        />
      </Frame>
      <p
        aria-live="polite"
        className="max-w-2xl text-pretty text-muted-foreground lg:col-span-3"
      >
        {stats?.route === "lan" ? labels.same : null}
      </p>
    </div>
  );
}

/** A window with what it stands for written over it. */
function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    // each window as tall as what it shows: a stretched one would letterbox
    // its screen; the link's column between them stretches instead
    <section
      aria-label={label}
      className="flex min-w-0 flex-col gap-3 self-start"
    >
      <h3 className="text-muted-foreground">{label}</h3>
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[14px] bg-background shadow-[inset_0_0_0_1px_var(--border),0_24px_48px_-24px_rgb(0_0_0/0.6)]">
        {children}
      </div>
    </section>
  );
}

/** Deskline's top bar: the mark and the one tab. */
function TopBar() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      {/* biome-ignore lint/performance/noImgElement: 32px pixel art, drawn as is */}
      <img
        src="/deskline/mark.png"
        alt=""
        width={32}
        height={32}
        className="size-8 [image-rendering:pixelated]"
      />
      <span className="relative font-medium after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-foreground">
        Deskline
      </span>
    </div>
  );
}

function HostWindow({
  d,
  code,
  name,
  from,
  host,
  desktop,
  onAccept,
  onDecline,
  onControl,
  onStop,
}: {
  d: Words;
  code: string;
  name: string;
  from: string;
  host: Host;
  desktop: Desktop | null;
  onAccept: (ask: Ask, control: boolean) => void;
  onDecline: () => void;
  onControl: (on: boolean) => void;
  onStop: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [control, setControl] = useState(true);
  const screenBox = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const stopRef = useRef<HTMLButtonElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const was = useRef(host.kind);

  // the keyboard follows the question: to Accept when it's asked, to Stop
  // sharing once it's answered yes, and back to Copy code when the button it
  // was on goes away
  useEffect(() => {
    if (host.kind === "asked") {
      setControl(true);
      acceptRef.current?.focus();
    } else if (host.kind === "sharing") stopRef.current?.focus();
    else if (was.current !== "idle" && document.activeElement === document.body)
      copyRef.current?.focus();
    was.current = host.kind;
  }, [host.kind]);

  // while sharing, the window becomes the screen it shares
  useEffect(() => {
    const box = screenBox.current;
    if (host.kind !== "sharing" || !box || !desktop) return;
    box.append(desktop.canvas);
    return () => desktop.canvas.remove();
  }, [host.kind, desktop]);

  const lines = groups(code);
  const point = (e: PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  };

  if (host.kind === "sharing")
    return (
      <>
        <div className="flex flex-wrap items-center justify-end gap-2 bg-sharing px-4 py-2 text-white">
          <p className="mr-auto min-w-0 font-medium">
            {(host.control ? d.controls : d.sees)({ name })}
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 focus-visible:ring-white"
            onClick={() => onControl(!host.control)}
          >
            {host.control ? d.takeBack : d.give}
          </Button>
          <Button
            ref={stopRef}
            size="sm"
            className="border-white bg-white text-sharing hover:bg-white/90 focus-visible:ring-white"
            onClick={onStop}
          >
            {d.stop}
          </Button>
        </div>
        <div
          ref={screenBox}
          role="img"
          aria-label={d.yourScreen}
          className="relative aspect-[16/10] flex-1 cursor-none bg-black [&>canvas]:block [&>canvas]:size-full [&>canvas]:object-contain"
          onPointerMove={(e) => desktop?.move("you", point(e))}
          onPointerLeave={() => desktop?.move("you", null)}
          onPointerDown={(e) => desktop?.click(point(e))}
        />
      </>
    );

  return (
    <>
      <TopBar />
      <div className="@container flex flex-1 flex-col gap-1 px-4 pt-6 pb-5">
        <h4 className="font-medium">{d.yourCode}</h4>
        <p className="text-foreground/70">{d.sendIt}</p>
        {/* as large as three lines of it fit in the window, up to
            Deskline's own 24px: read aloud over the phone */}
        <p className="mt-4 select-all font-mono text-[clamp(0.875rem,5.6cqi,1.5rem)] leading-snug tracking-tight">
          {[lines.slice(0, 5), lines.slice(5, 10), lines.slice(10)].map(
            (row, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: three fixed lines
              <span key={i} className="block whitespace-pre">
                {row.join("  ") || " "}
              </span>
            ),
          )}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            ref={copyRef}
            disabled={!code}
            onClick={async () => {
              await navigator.clipboard
                .writeText(lines.join(" "))
                .catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? d.copied : d.copy}
          </Button>
          <p aria-live="polite" className="text-muted-foreground">
            {host.kind === "idle" ? host.note : null}
          </p>
        </div>
      </div>
      {host.kind === "asked" && (
        <div className="absolute inset-0 grid place-items-center bg-black/55 p-4">
          <div
            role="alertdialog"
            aria-labelledby="ask-title"
            aria-describedby="ask-advice"
            className="appear flex w-full max-w-sm flex-col rounded-[14px] bg-tile p-6 shadow-[inset_0_0_0_1px_var(--border)]"
          >
            <h4 id="ask-title" className="font-medium">
              {d.wants}
            </h4>
            <p className="mt-3">
              {name}{" "}
              <span className="font-mono text-foreground/70 text-sm">
                {from.slice(0, 8)}
              </span>
            </p>
            <p id="ask-advice" className="text-foreground/70">
              {d.onlyIf}
            </p>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: the checkbox is inside */}
            <label className="mt-4 flex items-start gap-2.5 text-foreground/70">
              <Checkbox
                checked={control}
                onCheckedChange={setControl}
                className="mt-0.5"
              />
              {d.letControl}
            </label>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                ref={acceptRef}
                onClick={() => onAccept(host.ask, control)}
              >
                {d.accept}
              </Button>
              <Button variant="outline" onClick={onDecline}>
                {d.decline}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ViewerWindow({
  d,
  viewer,
  stats,
  link,
  pc,
  onConnect,
  onCancel,
  onDisconnect,
  onPointer,
}: {
  d: Words;
  viewer: Viewer;
  stats: Stats | null;
  link: LinkState;
  pc: RTCPeerConnection | null;
  onConnect: (code: string) => void;
  onCancel: () => void;
  onDisconnect: () => void;
  onPointer: (msg: Msg) => void;
}) {
  const [text, setText] = useState("");
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const field = useRef<HTMLInputElement>(null);

  const was = useRef(viewer.kind);

  // when a session ends under the keyboard, it lands back on the code field
  useEffect(() => {
    if (
      viewer.kind === "idle" &&
      was.current !== "idle" &&
      document.activeElement === document.body
    )
      field.current?.focus();
    was.current = viewer.kind;
  }, [viewer.kind]);

  // the first picture: the other window's screen, as it arrives
  useEffect(() => {
    const el = video.current;
    if (viewer.kind !== "session" || !pc || !el) return;
    setPlaying(false);
    const show = () => {
      const track = pc
        .getReceivers()
        .find((r) => r.track.kind === "video")?.track;
      if (track) el.srcObject = new MediaStream([track]);
    };
    show();
    pc.addEventListener("track", show);
    return () => pc.removeEventListener("track", show);
  }, [viewer.kind, pc]);

  const point = (e: PointerEvent<HTMLVideoElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    };
  };

  if (viewer.kind === "session")
    return (
      <>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2">
          <span className="font-medium">{d.their}</span>
          <Dots link={link} className="h-[15px] w-12" />
          {stats && (
            <span className="text-muted-foreground">
              {d[stats.route]}{" "}
              <span className="font-mono text-sm tabular-nums">
                {stats.rttMs ?? 0} ms
              </span>
            </span>
          )}
          {viewer.control && (
            <span className="text-control">{d.haveControl}</span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto text-foreground/70"
            onClick={onDisconnect}
          >
            {d.disconnect}
          </Button>
        </div>
        <div className="relative aspect-[16/10] flex-1 bg-black">
          <video
            ref={video}
            autoPlay
            muted
            playsInline
            aria-label={d.theirScreen}
            onPlaying={() => setPlaying(true)}
            onPointerMove={(e) => onPointer({ t: "move", ...point(e) })}
            onPointerLeave={() => onPointer({ t: "leave" })}
            onPointerDown={(e) => onPointer({ t: "click", ...point(e) })}
            className={cn(
              "absolute inset-0 size-full object-contain",
              viewer.control && "cursor-none",
            )}
          />
          {!playing && (
            <p className="absolute inset-0 grid place-items-center text-muted-foreground">
              {d.firstPicture}
            </p>
          )}
        </div>
      </>
    );

  const busy = viewer.kind === "waiting";
  return (
    <>
      <TopBar />
      <div className="flex flex-1 flex-col gap-1 px-4 pt-6 pb-5">
        <h4 className="font-medium" id="connect-title">
          {d.connectTo}
        </h4>
        <form
          className="mt-1 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onConnect(text);
          }}
        >
          <Input
            ref={field}
            aria-labelledby="connect-title"
            placeholder={d.paste}
            value={text}
            disabled={busy}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setText(e.target.value)}
            // the code in mono, the hint in the page's face: it fits whole
            // in either language; the button drops below when it can't
            className="min-w-56 flex-1 font-mono [&_input]:placeholder:font-sans"
          />
          <Button type="submit" disabled={busy}>
            {d.connect}
          </Button>
        </form>
        <div aria-live="polite" className="mt-6 flex flex-col gap-3">
          {busy ? (
            <>
              <p className="text-muted-foreground">{d.waiting}</p>
              <Dots
                link={{ kind: "forming" }}
                className="h-6 w-full max-w-70"
              />
              <Button
                variant="ghost"
                className="self-start text-foreground/70"
                onClick={onCancel}
              >
                {d.cancel}
              </Button>
            </>
          ) : (
            viewer.kind === "idle" &&
            viewer.note && (
              <p className="text-muted-foreground">{viewer.note}</p>
            )
          )}
        </div>
      </div>
    </>
  );
}
