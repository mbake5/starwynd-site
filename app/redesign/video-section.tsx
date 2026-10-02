"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { centralDay, dailyVideo, type ChannelVideo } from "../../lib/youtube-rotation";

export default function VideoSection({ videos, day, still, stopToken, onPlay }: {
  videos: ChannelVideo[];
  day: string;
  still: boolean;
  stopToken: number;
  onPlay: () => void;
}) {
  const [video, setVideo] = useState(() => dailyVideo(videos, day));
  const [opened, setOpened] = useState(false);
  const [manual, setManual] = useState(false);
  const [smallPoster, setSmallPoster] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [stoppedAt, setStoppedAt] = useState(stopToken);
  const pinned = useRef(false);
  const reel = useRef<HTMLDivElement>(null);
  const url = `https://www.youtube.com/watch?v=${video.id}`;

  useEffect(() => {
    if (pinned.current) return;
    pinned.current = true;
    // Correct yesterday's cached HTML on a fresh visit, then keep the pick:
    // never swap a video out while someone is watching it across midnight.
    setVideo(dailyVideo(videos, centralDay()));
  }, [videos]);

  // Music started from the Spotify player: close the video so they don't overlap.
  if (stopToken !== stoppedAt) {
    setStoppedAt(stopToken);
    setOpened(false);
  }

  const open = (item: ChannelVideo, chosen: boolean) => {
    setVideo(item);
    setSmallPoster(false);
    if (chosen) setManual(true);
    setOpened(true);
    onPlay();
  };

  const updateEdges = () => {
    const el = reel.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };

  // When every video fits on screen, both arrows start disabled.
  useEffect(() => {
    const el = reel.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const page = (direction: 1 | -1) =>
    reel.current?.scrollBy({ left: direction * reel.current.clientWidth * 0.8, behavior: still ? "instant" : "smooth" });

  return (
    <section id="videos" className="sw-section sw-videos" aria-labelledby="sw-video-title">
      <div className="sw-container">
        <header className="sw-head sw-head-split sw-reveal">
          <div>
            <p className="sw-eyebrow">
              <span className="sw-num">02</span> {manual ? "Selected music video" : "Today’s music video"}
            </p>
            <h2 id="sw-video-title">{video.title}</h2>
          </div>
          <a className="sw-link" href={url} target="_blank" rel="noopener noreferrer">
            Watch on YouTube <ArrowUpRight size={18} />
          </a>
        </header>

        <div className="sw-screen sw-reveal">
          {opened ? (
            <iframe
              key={video.id}
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`}
              title={`${video.title} — Starwynd music video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button className="sw-poster" onClick={() => open(video, false)} aria-label={`Play ${video.title} music video`}>
              <Image
                unoptimized
                src={`https://i.ytimg.com/vi/${video.id}/${smallPoster ? "hqdefault" : "maxresdefault"}.jpg`}
                // YouTube answers a missing HD thumbnail with a 120px grey placeholder
                // rather than an error, so check the size as well.
                onLoad={(event) => event.currentTarget.naturalWidth <= 120 && setSmallPoster(true)}
                onError={() => setSmallPoster(true)}
                alt=""
                fill
                sizes="(max-width: 760px) 92vw, 1200px"
              />
              <span className="sw-poster-play">
                <span className="sw-poster-icon"><Play size={30} fill="currentColor" /></span>
                <span>Play video</span>
              </span>
            </button>
          )}
        </div>
        {opened && <p className="sw-note">If the player doesn’t load, use “Watch on YouTube” above.</p>}

        {videos.length > 1 && (
          <div className="sw-reel-wrap sw-reveal">
            <div className="sw-reel-head">
              <p className="sw-eyebrow">More videos</p>
              <div className="sw-reel-nav">
                <button onClick={() => page(-1)} disabled={edges.start} aria-label="Scroll videos back">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => page(1)} disabled={edges.end} aria-label="Scroll videos forward">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div ref={reel} className="sw-reel" onScroll={updateEdges} role="list" aria-label="Starwynd music videos">
              {videos.map((item) => {
                const current = item.id === video.id;
                return (
                  <div role="listitem" key={item.id}>
                    <button
                      className={`sw-reel-card${current ? " is-active" : ""}`}
                      aria-current={current ? "true" : undefined}
                      aria-label={`Play ${item.title}`}
                      onClick={() => open(item, true)}
                    >
                      <span className="sw-reel-thumb">
                        <Image unoptimized src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 760px) 72vw, 280px" />
                        <span className="sw-reel-badge">{current ? (opened ? "Playing" : "Selected") : <Play size={14} fill="currentColor" />}</span>
                      </span>
                      <strong>{item.title}</strong>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <p className="sr-only" aria-live="polite">Selected video: {video.title}</p>
      </div>
    </section>
  );
}
