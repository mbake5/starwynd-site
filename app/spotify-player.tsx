"use client";

import { useEffect, useRef, useState } from "react";
import type { FeaturedTrack } from "../lib/spotify-playlist";

type PlaybackEvent = {
  data: { isPaused: boolean; isBuffering: boolean; position: number };
};
type Controller = {
  addListener: (
    event: string,
    callback: (event: PlaybackEvent) => void,
  ) => void;
  destroy: () => void;
};
type SpotifyAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: Controller) => void,
  ) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyAPI) => void;
  }
}

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
    window.onSpotifyIframeApiReady = (api) => {
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

export default function SpotifyPlayer({ track }: { track: FeaturedTrack }) {
  const host = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let disposed = false;
    let controller: Controller | undefined;
    const container = host.current;
    const timeout = window.setTimeout(() => {
      if (!disposed) setStatus("unavailable");
    }, 15000);
    loadAPI()
      .then((api) => {
        if (disposed || !container) return;
        const element = document.createElement("div");
        container.replaceChildren(element);
        api.createController(
          element,
          { uri: `spotify:track:${track.id}`, width: "100%", height: 152 },
          (created) => {
            if (disposed) {
              created.destroy();
              return;
            }
            controller = created;
            container
              .querySelector("iframe")
              ?.setAttribute("title", `Spotify player for ${track.title}`);
            created.addListener("ready", () => {
              if (disposed) return;
              clearTimeout(timeout);
              setStatus("ready");
            });
            created.addListener("playback_update", ({ data }) => {
              if (disposed) return;
              clearTimeout(timeout);
              setStatus(
                data.isBuffering
                  ? "buffering"
                  : data.isPaused
                    ? "paused"
                    : "playing",
              );
            });
          },
        );
      })
      .catch(() => {
        if (!disposed) {
          clearTimeout(timeout);
          setStatus("unavailable");
        }
      });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller?.destroy();
      container?.replaceChildren();
    };
  }, [track.id, track.title, attempt]);

  const message = {
    loading: "Loading Spotify’s player…",
    ready: "Press Play in the Spotify player below to listen.",
    playing: "Spotify reports playback in progress.",
    paused: "Playback paused. Press Play in the Spotify player to continue.",
    buffering: "Spotify is buffering the audio…",
    unavailable:
      "Spotify’s player hasn’t connected. You can retry or open this track directly in Spotify.",
  }[status];

  return (
    <div className="spotify-player">
      <p role="status">{message}</p>
      <div ref={host} className="spotify-host" />
      {status === "unavailable" && (
        <button
          className="text-button"
          onClick={() => {
            setStatus("loading");
            setAttempt(attempt + 1);
          }}
        >
          Retry player
        </button>
      )}
      <p className="player-help">
        {status === "playing"
          ? "If it is silent, check the browser tab’s sound and Windows volume mixer. "
          : ""}
        <a href={track.url} target="_blank" rel="noopener noreferrer">
          Open {track.title} in Spotify ↗
        </a>
      </p>
    </div>
  );
}
