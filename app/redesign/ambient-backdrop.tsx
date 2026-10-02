"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getImageProps } from "next/image";

type Still = { src: string; width: number; height: number };

const phoneQuery = "(max-width: 760px)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(phoneQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const usePhoneLayout = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(phoneQuery).matches, () => false);

// Each video file ends with a repeat of its own first 0.4 s (tools/video/finalencode.py,
// OVERLAP). At the loop point the waiting copy starts from frame 0 while the playing
// copy runs on through that repeat, so both show the same moving picture and a
// crossfade between them hides the restart; nothing ever freezes. LEAD covers the
// moment play() takes to get going.
const OVERLAP_SECONDS = 0.4;
const LEAD_SECONDS = 1 / 30;

// A still picture with a muted loop of the same scene laid over it. Phones get
// pre-cropped portrait versions of both. The loop only downloads once its section
// is near the screen (the hero waits for the page to finish loading first), plays
// only while visible, and is skipped for visitors who asked for reduced motion or
// are saving data.
//
// Looping is gapless: browsers stall when a looping video rewinds, and a video's
// first frame is always compressed differently from its last, so a plain `loop`
// stutters at every restart. Two copies take turns instead: while one plays, the
// other waits already rewound to its first frame; at the loop point it starts, the
// playing copy crossfades off it over the shared overlap, and is then rewound out
// of sight for its next turn.
export default function AmbientBackdrop({ desktop, phone, video, still, eager = false, className }: {
  desktop: Still;
  phone: Still;
  video?: { desktop: string; phone: string };
  still: boolean;
  eager?: boolean;
  className: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLVideoElement>(null);
  const second = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const phoneLayout = usePhoneLayout();
  const source = phoneLayout ? video?.phone : video?.desktop;

  const shared = { alt: "", sizes: "100vw", ...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {}) };
  const { props: { srcSet: desktopSrcSet } } = getImageProps({ ...shared, ...desktop });
  const { props: phoneImage } = getImageProps({ ...shared, ...phone });

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const markLoaded = () => setPageLoaded(true);
    if (document.readyState === "complete") {
      const tick = requestAnimationFrame(markLoaded);
      return () => cancelAnimationFrame(tick);
    }
    window.addEventListener("load", markLoaded, { once: true });
    return () => window.removeEventListener("load", markLoaded);
  }, []);

  useEffect(() => {
    const a = first.current;
    const b = second.current;
    if (!a || !b) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!source || still || saveData || !near || !pageLoaded) {
      a.pause();
      b.pause();
      return;
    }
    // Without frame callbacks (older browsers) fall back to a single plain loop.
    const gapless = "requestVideoFrameCallback" in a;
    for (const element of gapless ? [a, b] : [a]) {
      if (element.dataset.source !== source) {
        element.dataset.source = source;
        element.preload = "auto";
        element.src = source;
        element.classList.remove("is-waiting", "is-entering");
      }
    }
    a.loop = !gapless;

    // The waiting copy sits on top, transparent, and fades in over the playing one. (The
    // other way round, browsers stop drawing a video that is fully covered, so fading the
    // top copy out revealed the still picture instead and the screen briefly dimmed.)
    let waiting = a.classList.contains("is-waiting") ? a : b;
    let current = waiting === a ? b : a;
    current.classList.remove("is-waiting", "is-entering");
    if (gapless) waiting.classList.add("is-waiting");
    let handle = 0;
    let fading = false;
    let timer = 0;
    let stopped = false;

    // Autoplay can still be refused (iOS low-power mode); the still picture stays put.
    const start = (element: HTMLVideoElement) => element.play().catch(() => {});
    const rewind = (element: HTMLVideoElement) => {
      element.pause();
      element.currentTime = 0;
    };
    // Once the new copy fully covers the old one: rewind the old one and make it the
    // next waiting copy (on top, transparent), while the new one becomes the base.
    const swap = () => {
      rewind(current);
      current.classList.add("is-waiting");
      waiting.classList.remove("is-waiting", "is-entering");
      [current, waiting] = [waiting, current];
      fading = false;
      if (!stopped) handle = current.requestVideoFrameCallback(onFrame);
    };
    const handOver = () => {
      if (fading) return;
      fading = true;
      start(waiting);
      waiting.classList.add("is-entering");
      timer = window.setTimeout(swap, OVERLAP_SECONDS * 1000 + 100);
    };
    function onFrame(_now: number, shown: VideoFrameCallbackMetadata) {
      if (stopped) return;
      const loopPoint = current.duration - OVERLAP_SECONDS;
      if (loopPoint > 0 && shown.mediaTime >= loopPoint - LEAD_SECONDS) {
        handOver();
        return;
      }
      handle = current.requestVideoFrameCallback(onFrame);
    }
    // In case frame callbacks were throttled (a background tab) and the copy ran out.
    const onEnded = (event: Event) => {
      if (event.target === current) handOver();
    };

    if (gapless) {
      a.addEventListener("ended", onEnded);
      b.addEventListener("ended", onEnded);
      handle = current.requestVideoFrameCallback(onFrame);
    }
    start(current);

    return () => {
      stopped = true;
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
      if (gapless) current.cancelVideoFrameCallback(handle);
      clearTimeout(timer);
      if (fading) {
        // Interrupted mid-fade: complete the hand-over so the next start is clean.
        rewind(current);
        current.classList.add("is-waiting");
        waiting.classList.remove("is-waiting", "is-entering");
        waiting.pause();
      } else {
        current.pause();
      }
    };
  }, [source, still, near, pageLoaded]);

  const copyProps = {
    className: "sw-backdrop-video",
    muted: true,
    playsInline: true,
    preload: "none",
    disablePictureInPicture: true,
    disableRemotePlayback: true,
    onPlaying: () => setPlaying(true),
    onEmptied: () => setPlaying(false),
  };

  return (
    <div ref={frame} className={className} aria-hidden="true">
      <picture>
        <source media="(min-width: 761px)" srcSet={desktopSrcSet} />
        {/* Art direction needs a plain <img> inside <picture>; getImageProps keeps it optimised
            and supplies alt="" (decorative), which the linter can't see through the spread. */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...phoneImage} className="sw-backdrop-still" />
      </picture>
      {video && (
        <div className={`sw-backdrop-videos${playing ? " is-playing" : ""}`}>
          <video ref={first} {...copyProps} />
          <video ref={second} {...copyProps} />
        </div>
      )}
    </div>
  );
}
