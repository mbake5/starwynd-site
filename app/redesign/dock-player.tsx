"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { FeaturedTrack } from "../../lib/spotify-playlist";

export type PlayerStatus = "loading" | "ready" | "playing" | "paused" | "buffering" | "unavailable";
export type PlayerCommand = { id: number; type: "play" | "toggle" | "pause" };

type PlaybackEvent = { data: { isPaused: boolean; isBuffering: boolean } };
type Controller = {
  addListener: (event: string, callback: (event: PlaybackEvent) => void) => void;
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  destroy: () => void;
};
type SpotifyAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: Controller) => void,
  ) => void;
};
// Not merged into the global Window type: the home page's player declares
// its own narrower version of this callback.
type SpotifyReadyHook = { onSpotifyIframeApiReady?: (api: SpotifyAPI) => void };

let apiPromise: Promise<SpotifyAPI> | undefined;
function loadAPI() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<SpotifyAPI>((resolve, reject) => {
    const script = document.createElement("script");
    const fail = () => {
      clearTimeout(timeout);
      script.remove();
      apiPromise = undefined;
      reject(new Error("Spotify could not load"));
    };
    const timeout = window.setTimeout(fail, 12000);
    (window as unknown as SpotifyReadyHook).onSpotifyIframeApiReady = (api) => {
      clearTimeout(timeout);
      resolve(api);
    };
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return apiPromise;
}

const uriOf = (track: FeaturedTrack) => `spotify:track:${track.id}`;

// One Spotify embed for the whole page. It is created on the first play
// request (so visitors who never press play never load Spotify), switches
// tracks in place, and stays docked while people keep browsing.
export default function DockPlayer({ track, command, onStatus, onClose }: {
  track: FeaturedTrack;
  command: PlayerCommand | null;
  onStatus: (status: PlayerStatus) => void;
  onClose: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [controller, setController] = useState<Controller | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const latest = useRef({ track, command, onStatus });
  const loadedUri = useRef("");
  const handled = useRef(0);

  useEffect(() => {
    latest.current = { track, command, onStatus };
  });

  useEffect(() => {
    let disposed = false;
    let created: Controller | undefined;
    const container = host.current;
    const report = (status: PlayerStatus) => !disposed && latest.current.onStatus(status);
    report("loading");
    const timeout = window.setTimeout(() => {
      if (!disposed) {
        setFailed(true);
        report("unavailable");
      }
    }, 15000);
    loadAPI()
      .then((api) => {
        if (disposed || !container) return;
        const element = document.createElement("div");
        container.replaceChildren(element);
        const uri = uriOf(latest.current.track);
        api.createController(element, { uri, width: "100%", height: 80 }, (instance) => {
          if (disposed) {
            instance.destroy();
            return;
          }
          created = instance;
          loadedUri.current = uri;
          instance.addListener("ready", () => {
            clearTimeout(timeout);
            report("ready");
          });
          instance.addListener("playback_update", ({ data }) => {
            clearTimeout(timeout);
            report(data.isBuffering ? "buffering" : data.isPaused ? "paused" : "playing");
          });
          setController(instance);
        });
      })
      .catch(() => {
        if (disposed) return;
        clearTimeout(timeout);
        setFailed(true);
        report("unavailable");
      });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      created?.destroy();
      container?.replaceChildren();
      setController(null);
    };
  }, [attempt]);

  // Switch tracks inside the existing embed instead of rebuilding it.
  useEffect(() => {
    if (!controller) return;
    const uri = uriOf(track);
    if (uri !== loadedUri.current) {
      loadedUri.current = uri;
      controller.loadUri(uri);
    }
    host.current?.querySelector("iframe")?.setAttribute("title", `Spotify player: ${track.title}`);
  }, [controller, track]);

  // Runs after the track switch above, so "play" always plays the new track.
  useEffect(() => {
    if (!controller || !command || command.id === handled.current) return;
    handled.current = command.id;
    if (command.type === "play") controller.play();
    else if (command.type === "pause") controller.pause();
    else controller.togglePlay();
  }, [controller, command]);

  return (
    <div className="sw-dock" role="region" aria-label="Music player">
      <div ref={host} className="sw-dock-embed" />
      {failed && (
        <p className="sw-dock-fallback">
          Spotify’s player didn’t load.{" "}
          <button
            onClick={() => {
              setFailed(false);
              setAttempt((value) => value + 1);
            }}
          >
            Try again
          </button>{" "}
          or{" "}
          <a href={track.url} target="_blank" rel="noopener noreferrer">
            open {track.title} in Spotify
          </a>
          .
        </p>
      )}
      <button className="sw-dock-close" onClick={onClose} aria-label="Close player">
        <X size={18} />
      </button>
    </div>
  );
}
