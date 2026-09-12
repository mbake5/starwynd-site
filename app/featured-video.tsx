"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play, Check, ChevronUp, ChevronDown } from "lucide-react";

import { centralDay, dailyVideo, type ChannelVideo } from "../lib/youtube-rotation";

export default function FeaturedVideo({ videos, day, still }: { videos: ChannelVideo[]; day: string; still: boolean }) {
  const [video, setVideo] = useState(() => dailyVideo(videos, day));
  const selectedForVisit = useRef(false);
  const [opened, setOpened] = useState(false);
  const [smallThumbnail, setSmallThumbnail] = useState(false);
  const [manuallySelected, setManuallySelected] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const [listPosition, setListPosition] = useState({ start: true, end: videos.length <= 3 });
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
  useEffect(() => {
    if (selectedForVisit.current) return;
    selectedForVisit.current = true;
    // Correct yesterday's cached HTML on a fresh visit, then pin the selection:
    // never swap a video out while someone is watching it across midnight.
    setVideo(dailyVideo(videos, centralDay()));
  }, [videos]);
  return (
    <section id="video" className="featured-video section-pad" aria-labelledby="video-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">STARWYND / {manuallySelected ? "SELECTED MUSIC VIDEO" : "TODAY’S MUSIC VIDEO"}</p>
          <h2 id="video-heading"><em>{video.title}</em></h2>
        </div>
        <a className="video-youtube-link" href={videoUrl} target="_blank" rel="noopener noreferrer">
          Watch on YouTube <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="video-screen">
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
          <button className="video-poster" onClick={() => setOpened(true)} aria-label={`Play ${video.title} music video`}>
            <Image unoptimized src={`https://i.ytimg.com/vi/${video.id}/${smallThumbnail ? "hqdefault" : "maxresdefault"}.jpg`} onError={() => setSmallThumbnail(true)} alt="" fill sizes="(max-width: 760px) 88vw, 1200px" />
            <span className="video-play"><Play size={28} fill="currentColor" /><span>PLAY VIDEO</span></span>
          </button>
        )}
      </div>
      {opened && <p className="video-help">If the player doesn’t load, use “Watch on YouTube” above.</p>}
      <div className="video-library">
        <div className="video-library-heading">
          <p className="eyebrow">STARWYND / VIDEO PLAYLIST</p>
          <span>{videos.length} videos</span>
        </div>
        <div
          ref={list}
          className="video-list"
          role="region"
          aria-label="Browse Starwynd videos"
          tabIndex={0}
          onScroll={(event) => {
            const element = event.currentTarget;
            setListPosition({ start: element.scrollTop < 4, end: element.scrollTop + element.clientHeight >= element.scrollHeight - 4 });
          }}
        >
          {videos.map((item, index) => (
            <button
              key={item.id}
              className={`video-row${video.id === item.id ? " selected" : ""}`}
              aria-pressed={video.id === item.id}
              aria-label={`Play ${item.title}`}
              onClick={() => {
                setVideo(item);
                setSmallThumbnail(false);
                setManuallySelected(true);
                setOpened(true);
              }}
            >
              <span className="video-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="video-thumbnail">
                <Image unoptimized src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 760px) 64px, 96px" />
              </span>
              <span className="video-row-title"><strong>{item.title}</strong><small>{video.id === item.id ? "SELECTED VIDEO" : "MUSIC VIDEO"}</small></span>
              {video.id === item.id ? <Check size={20} /> : <Play size={18} />}
            </button>
          ))}
        </div>
        {videos.length > 3 && (
          <div className="track-browse">
            <span>Scroll to explore all videos</span>
            <div>
              <button aria-label="Previous videos" disabled={listPosition.start} onClick={() => list.current?.scrollBy({ top: -list.current.clientHeight, behavior: still ? "instant" : "smooth" })}><ChevronUp size={20} /></button>
              <button aria-label="Next videos" disabled={listPosition.end} onClick={() => list.current?.scrollBy({ top: list.current.clientHeight, behavior: still ? "instant" : "smooth" })}><ChevronDown size={20} /></button>
            </div>
          </div>
        )}
        <p className="sr-only" aria-live="polite">Selected video: {video.title}</p>
      </div>
    </section>
  );
}
