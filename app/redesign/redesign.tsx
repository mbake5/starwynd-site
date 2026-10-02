"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, Heart, Menu, Pause, Play, X } from "lucide-react";
import AmbientBackdrop from "./ambient-backdrop";
import Sky from "./sky";
import DockPlayer, { type PlayerCommand, type PlayerStatus } from "./dock-player";
import VideoSection from "./video-section";
import EmailCard from "./email-card";
import PlatformIcon from "./platform-icon";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";
import type { FeaturedTrack } from "../../lib/spotify-playlist";
import type { ChannelVideo } from "../../lib/youtube-rotation";
import "./redesign.css";

const links = {
  playlist: "https://open.spotify.com/playlist/78oYJUxVuPHAAt7FJaLrZv",
  kofi: "https://ko-fi.com/starwynd",
};
// `brand` tints each platform tile's glow in that service's own colour.
const platforms = [
  { name: "Spotify", url: "https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL", action: "Listen & follow", brand: "#1ed760" },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/starwynd/1841275156", action: "Listen & follow", brand: "#f54ad6" },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCpCI4H8FllHtTgq3MDB9Y5w", action: "Watch & subscribe", brand: "#ff3d3d" },
  { name: "Amazon Music", url: "https://music.amazon.com/artists/B0FS12VR2X/starwynd", action: "Listen & follow", brand: "#25d1da" },
];
const nav = [
  ["Music", "music"],
  ["Videos", "videos"],
  ["Story", "story"],
  ["Connect", "connect"],
];
const ribbons = [
  ["Synthpop", "After dark", "Neon melodies", "Human-produced", "Cinematic"],
  ["Late nights", "Open roads", "Luminous synths", "Light & shadow", "Starwynd"],
];
const COLLAPSED_TRACKS = 8;

// Spotify serves the same artwork at 64px and 300px; list thumbnails and the
// record label don't need 640px.
const thumbnail = (url: string | null) => url?.replace("ab67616d0000b273", "ab67616d00004851") ?? null;
const labelArt = (url: string | null) => url?.replace("ab67616d0000b273", "ab67616d00001e02") ?? null;

function Bars() {
  return (
    <span className="sw-bars" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function Redesign({ tracks, videos, videoDay }: {
  tracks: FeaturedTrack[];
  videos: ChannelVideo[];
  videoDay: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const trackPanel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const still = paused || reduced;

  const [selected, setSelected] = useState(0);
  const [dockOpen, setDockOpen] = useState(false);
  const [command, setCommand] = useState<PlayerCommand | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [videoStop, setVideoStop] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [header, setHeader] = useState({ solid: false, hidden: false, logo: false });
  const [section, setSection] = useState("top");

  const track = tracks[selected];
  const latest = tracks[0];
  const playing = dockOpen && (status === "playing" || status === "buffering");
  const visibleTracks = showAll ? tracks : tracks.slice(0, COLLAPSED_TRACKS);

  const send = (type: PlayerCommand["type"]) =>
    setCommand((current) => ({ id: (current?.id ?? 0) + 1, type }));

  // One tap plays a track; tapping the track that's playing pauses it.
  const playTrack = (index: number) => {
    if (!tracks[index]) return;
    const pausing = dockOpen && index === selected && playing;
    if (dockOpen && index === selected) {
      // An explicit pause, because a toggle sent while Spotify is still
      // buffering the track would start it instead.
      send(pausing ? "pause" : "toggle");
    } else {
      setSelected(index);
      setDockOpen(true);
      send("play");
    }
    if (!pausing) setVideoStop((value) => value + 1);
  };

  const closeDock = () => {
    setDockOpen(false);
    setStatus("loading");
  };

  // Header: glass once the page scrolls, tucked away while scrolling down,
  // back as soon as the visitor scrolls up. The small logo appears once the
  // big hero wordmark has scrolled away.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const heroHeight = document.getElementById("top")?.offsetHeight ?? 700;
      setHeader((previous) => {
        let hidden = previous.hidden;
        if (Math.abs(y - last) > 6) {
          hidden = y > last && y > 200;
          last = y;
        }
        if (y < 200) hidden = false;
        const next = { solid: y > 24, hidden, logo: y > heroHeight * 0.45 };
        return next.solid === previous.solid && next.hidden === previous.hidden && next.logo === previous.logo
          ? previous
          : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Fade sections up as they arrive. Anything already on screen is left
  // alone, so nothing that has been painted ever blinks out.
  useEffect(() => {
    const container = root.current;
    if (!container || still) return;
    const items = [...container.querySelectorAll<HTMLElement>(".sw-reveal")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const item of items) {
      if (item.getBoundingClientRect().top < window.innerHeight) continue;
      item.classList.add("is-pending");
      observer.observe(item);
    }
    return () => {
      observer.disconnect();
      for (const item of items) item.classList.remove("is-pending", "is-in");
    };
  }, [still]);

  // The nav marks the section in the middle of the screen.
  useEffect(() => {
    const sections = ["top", ...nav.map(([, id]) => id), "contact"]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setSection(entry.target.id);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    for (const element of sections) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Pointer effects for mouse and trackpad: a spotlight that follows the pointer over
  // cards (.sw-spot), a 3D tilt with glare on the cover art (.sw-tilt), buttons that
  // lean towards the pointer (.sw-magnet), and the hero wordmark turning to face it.
  // One listener, applied at most once per frame, writing only CSS variables.
  useEffect(() => {
    const hero = document.getElementById("top");
    if (still || !hero || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let latest: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    let pulled: HTMLElement | null = null;
    const clear = (element: HTMLElement | null, ...names: string[]) => {
      for (const name of names) element?.style.removeProperty(name);
    };
    const apply = () => {
      frame = 0;
      if (!latest) return;
      const { clientX: x, clientY: y } = latest;
      const target = latest.target instanceof Element ? latest.target : null;

      const spot = target?.closest<HTMLElement>(".sw-spot");
      if (spot) {
        const box = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${(x - box.left).toFixed(0)}px`);
        spot.style.setProperty("--my", `${(y - box.top).toFixed(0)}px`);
      }

      const tilt = target?.closest<HTMLElement>(".sw-tilt") ?? null;
      if (tilt !== tilted) clear(tilted, "--rx", "--ry");
      tilted = tilt;
      if (tilt) {
        const box = tilt.getBoundingClientRect();
        tilt.style.setProperty("--rx", (((x - box.left) / box.width) * 2 - 1).toFixed(3));
        tilt.style.setProperty("--ry", (((y - box.top) / box.height) * 2 - 1).toFixed(3));
      }

      const pull = target?.closest<HTMLElement>(".sw-magnet") ?? null;
      if (pull !== pulled) clear(pulled, "--mgx", "--mgy");
      pulled = pull;
      if (pull) {
        const box = pull.getBoundingClientRect();
        pull.style.setProperty("--mgx", `${((x - box.left - box.width / 2) * 0.2).toFixed(1)}px`);
        pull.style.setProperty("--mgy", `${((y - box.top - box.height / 2) * 0.3).toFixed(1)}px`);
      }

      if (window.scrollY < hero.offsetHeight) {
        hero.style.setProperty("--px", ((x / window.innerWidth) * 2 - 1).toFixed(3));
        hero.style.setProperty("--py", ((y / window.innerHeight) * 2 - 1).toFixed(3));
      }
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      latest = null;
      clear(tilted, "--rx", "--ry");
      clear(pulled, "--mgx", "--mgy");
      clear(hero, "--px", "--py");
      tilted = pulled = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [still]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    const html = document.documentElement;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const toggleAll = () => {
    if (showAll) {
      const panel = trackPanel.current;
      if (panel && panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: "start" });
    }
    setShowAll(!showAll);
  };

  const heroPlaying = playing && selected === 0;

  return (
    <div
      ref={root}
      className={`sw2${still ? " is-still" : ""}${dockOpen ? " has-dock" : ""}`}
    >
      <a className="sw-skip" href="#music">Skip to music</a>
      <Sky still={still} />
      <div className="sw-progress" aria-hidden="true" />

      <header
        className={`sw-header${header.solid || menuOpen ? " is-solid" : ""}${header.hidden && !menuOpen ? " is-hidden" : ""}${header.logo || menuOpen ? " show-logo" : ""}`}
      >
        <a href="#top" className="sw-header-logo" aria-label="Starwynd, back to top">
          <Image src="/images/redesign/starwynd-logo-v3.webp" alt="" width={1800} height={174} sizes="220px" loading="eager" />
        </a>
        <nav className="sw-nav" aria-label="Main navigation">
          {nav.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={section === id ? "is-active" : undefined}
              aria-current={section === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          ref={menuButton}
          className="sw-menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="sw-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div id="sw-menu" className={`sw-menu${menuOpen ? " is-open" : ""}`}>
        <nav aria-label="Menu">
          {[...nav, ["Contact", "contact"]].map(([label, id], index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              {label}
            </a>
          ))}
        </nav>
        <p className="sw-menu-listen">
          {platforms.map((platform) => (
            <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer">
              {platform.name}
            </a>
          ))}
        </p>
      </div>

      <main>
        <section id="top" className="sw-hero" aria-labelledby="sw-hero-title">
          <AmbientBackdrop
            className="sw-hero-bg"
            desktop={{ src: "/images/redesign/hero-sunburst.webp", width: 2880, height: 1234 }}
            phone={{ src: "/images/redesign/hero-sunburst-phone.webp", width: 756, height: 1344 }}
            video={{ desktop: "/videos/redesign/hero-loop3.mp4", phone: "/videos/redesign/hero-loop3-phone.mp4" }}
            still={still}
            eager
          />
          <div className="sw-hero-inner">
            <p className="sw-chip sw-enter">
              <span className="sw-pulse" aria-hidden="true" />
              {latest ? "New single out now" : "Atmospheric synthpop"}
            </p>
            <h1 id="sw-hero-title" className="sw-enter">
              <span className="sw-wordmark-wrap">
                <Image
                  className="sw-wordmark"
                  src="/images/redesign/starwynd-logo-v3.webp"
                  alt="Starwynd"
                  width={1800}
                  height={174}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 760px) 92vw, 660px"
                />
                <span className="sw-wordmark-shine" aria-hidden="true" />
              </span>
            </h1>
            <p className="sw-hero-tagline sw-enter">
              Somewhere between <span className="sw-grad">light</span>{" "}&amp; shadow.
            </p>
            <p className="sw-hero-sub sw-enter">
              Human-produced synthpop. Neon melodies. After-dark emotion.
            </p>
            <div className="sw-hero-actions sw-enter">
              {latest && (
                <button className="sw-btn sw-btn-primary sw-btn-lg sw-magnet" onClick={() => playTrack(0)}>
                  {heroPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  <span>
                    {heroPlaying ? "Pause" : "Play"} <span className="sw-btn-title">“{latest.title}”</span>
                  </span>
                </button>
              )}
              <a className="sw-btn sw-btn-ghost sw-btn-lg sw-magnet" href="#videos">Watch the videos</a>
            </div>
            <p className="sw-hero-listen sw-enter">
              <span>Also on</span>
              {platforms.map((platform) => (
                <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer">
                  {platform.name}
                </a>
              ))}
            </p>
          </div>
          <a className="sw-scroll-cue" href="#music" aria-label="Scroll to the music">
            <span />
          </a>
        </section>

        <section id="music" className="sw-section sw-music" aria-labelledby="sw-music-title">
          {track?.artworkUrl && (
            <div className="sw-ambient" aria-hidden="true">
              <Image key={track.id} unoptimized src={track.artworkUrl} alt="" fill sizes="100vw" />
            </div>
          )}
          <div className="sw-container">
            <header className="sw-head sw-head-split sw-reveal">
              <div>
                <p className="sw-eyebrow"><span className="sw-num">01</span> The sound</p>
                <h2 id="sw-music-title">
                  Find your <span className="sw-grad">frequency.</span>
                </h2>
              </div>
              <p className="sw-lede">For late nights, open roads, and everything you can’t put into words.</p>
            </header>

            {track ? (
              <div className="sw-music-grid">
                <article className="sw-now sw-card sw-spot sw-reveal" aria-labelledby="sw-now-title">
                  {/* While a track plays, its record slides out from behind the sleeve and spins. */}
                  <div className={`sw-now-stage${dockOpen ? " is-out" : ""}${playing ? " is-spinning" : ""}`}>
                    <div className="sw-vinyl" aria-hidden="true">
                      <div className="sw-vinyl-disc">
                        <span className="sw-vinyl-label">
                          {labelArt(track.artworkUrl) && (
                            <Image key={track.id} unoptimized src={labelArt(track.artworkUrl)!} alt="" fill sizes="160px" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="sw-now-art sw-tilt">
                      {track.artworkUrl ? (
                        <Image
                          key={track.id}
                          className="sw-now-cover"
                          unoptimized
                          src={track.artworkUrl}
                          alt={`${track.title} cover art`}
                          fill
                          sizes="(max-width: 760px) 30vw, 440px"
                        />
                      ) : (
                        <span className="sw-cover-fallback">SW</span>
                      )}
                      <span className="sw-glare" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="sw-now-meta">
                    <p className="sw-eyebrow sw-now-state">
                      {playing ? (
                        <>
                          <Bars /> Now playing
                        </>
                      ) : selected === 0 ? (
                        "Latest release"
                      ) : (
                        "Selected track"
                      )}
                    </p>
                    <h3 id="sw-now-title">{track.title}</h3>
                    <p className="sw-now-artist">Starwynd</p>
                    <div className="sw-now-actions">
                      <button
                        className={`sw-play sw-magnet${playing ? " is-playing" : ""}`}
                        onClick={() => playTrack(selected)}
                        aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
                      >
                        {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                      </button>
                      <a className="sw-btn sw-btn-ghost sw-btn-sm" href={track.url} target="_blank" rel="noopener noreferrer">
                        Open in Spotify <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>
                </article>

                <div ref={trackPanel} className="sw-tracks sw-reveal">
                  <div className="sw-tracks-head">
                    <span>{tracks.length} tracks</span>
                    <a href={links.playlist} target="_blank" rel="noopener noreferrer">
                      Full playlist <ArrowUpRight size={15} />
                    </a>
                  </div>
                  <ol className="sw-tracklist">
                    {visibleTracks.map((item, index) => {
                      const active = index === selected;
                      const art = thumbnail(item.artworkUrl);
                      return (
                        <li key={item.id}>
                          <button
                            className={`sw-track sw-spot${active ? " is-active" : ""}`}
                            aria-current={active ? "true" : undefined}
                            aria-label={active && playing ? `Pause ${item.title}` : `Play ${item.title}`}
                            onClick={() => playTrack(index)}
                          >
                            <span className="sw-track-index">
                              {active && playing ? <Bars /> : String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="sw-track-thumb">
                              {art && <Image unoptimized src={art} alt="" width={48} height={48} />}
                            </span>
                            <span className="sw-track-text">
                              <strong>{item.title}</strong>
                              <small>{index === 0 ? "Latest release" : "Starwynd"}</small>
                            </span>
                            <span className="sw-track-icon" aria-hidden="true">
                              {active && playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  {tracks.length > COLLAPSED_TRACKS && (
                    <button className="sw-more" aria-expanded={showAll} onClick={toggleAll}>
                      {showAll ? "Show fewer" : `Show all ${tracks.length} tracks`}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="sw-card sw-empty">
                <p>The latest releases are waiting on Spotify.</p>
                <a className="sw-btn sw-btn-primary" href={links.playlist} target="_blank" rel="noopener noreferrer">
                  Explore the playlist <ArrowUpRight size={16} />
                </a>
              </div>
            )}
            <p className="sr-only" aria-live="polite">
              {track ? `${playing ? "Now playing" : "Selected"}: ${track.title}` : ""}
            </p>
          </div>
        </section>

        <VideoSection
          videos={videos}
          day={videoDay}
          still={still}
          stopToken={videoStop}
          onPlay={() => playing && send("pause")}
        />

        {/* Two ribbons crossing in an X, running in opposite directions. */}
        <section className="sw-marquee" aria-label="Synthpop after dark">
          {ribbons.map((phrases, row) => (
            <div key={row} className={`sw-ribbon${row ? " is-bright" : ""}`} aria-hidden="true">
              <div className="sw-marquee-track">
                {[0, 1].map((copy) => (
                  <span key={copy}>
                    {phrases.map((phrase, index) => (
                      <span key={phrase} className={index % 2 ? "is-outline" : undefined}>
                        {phrase}
                        <i>✦</i>
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="story" className="sw-section sw-story" aria-labelledby="sw-story-title">
          <AmbientBackdrop
            className="sw-story-bg"
            desktop={{ src: "/images/redesign/nebula.webp", width: 2560, height: 1440 }}
            phone={{ src: "/images/redesign/nebula-phone.webp", width: 810, height: 1440 }}
            video={{ desktop: "/videos/redesign/nebula-loop.mp4", phone: "/videos/redesign/nebula-loop-phone.mp4" }}
            still={still}
          />
          <div className="sw-container sw-story-grid">
            {/* The words light up one by one as the statement scrolls through the screen. */}
            <p className="sw-statement sw-reveal">
              <span className="sw-word" style={{ "--i": 0 } as CSSProperties}>Less</span>{" "}
              <span className="sw-word" style={{ "--i": 1 } as CSSProperties}>noise.</span>
              <br />
              <span className="sw-word" style={{ "--i": 2 } as CSSProperties}>More</span>{" "}
              <span className="sw-word sw-grad" style={{ "--i": 3 } as CSSProperties}>feeling.</span>
            </p>
            <div className="sw-card sw-story-card sw-spot sw-reveal">
              <p className="sw-eyebrow"><span className="sw-num">03</span> Behind the sound</p>
              <h2 id="sw-story-title">
                A little darker. A little deeper. <span className="sw-grad">Unmistakably synthpop.</span>
              </h2>
              <p>
                Starwynd is a synthpop music group blending cinematic atmosphere, luminous synths, and
                emotional storytelling. Music for the space between light and shadow.
              </p>
              <p>
                Human-produced music with carefully shaped arrangements, expressive vocals, and intentional
                mixing. A sound designed to stay with you after the last note.
              </p>
              <p className="sw-signature">
                <span aria-hidden="true">✳</span>
                <span>
                  Independent spirit. <strong>Limitless atmosphere.</strong>
                </span>
              </p>
            </div>
          </div>
        </section>

        <section id="connect" className="sw-section sw-connect" aria-labelledby="sw-connect-title">
          <div className="sw-container">
            <header className="sw-head sw-head-split sw-reveal">
              <div>
                <p className="sw-eyebrow"><span className="sw-num">04</span> Stay in orbit</p>
                <h2 id="sw-connect-title">
                  Same feeling. <span className="sw-grad">Your platform.</span>
                </h2>
              </div>
              <p className="sw-lede">Take the sound with you. Find Starwynd wherever you listen.</p>
            </header>
            <ul className="sw-platforms sw-reveal">
              {platforms.map((platform) => (
                <li key={platform.name}>
                  <a
                    className="sw-platform sw-spot"
                    style={{ "--brand": platform.brand } as CSSProperties}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlatformIcon name={platform.name} className="sw-platform-icon" />
                    <span className="sw-platform-name">{platform.name}</span>
                    <span className="sw-platform-action">{platform.action}</span>
                    <ArrowUpRight className="sw-platform-arrow" size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="sw-section sw-contact" aria-labelledby="sw-contact-title">
          <div className="sw-container">
            <header className="sw-head sw-reveal">
              <p className="sw-eyebrow"><span className="sw-num">05</span> Make something meaningful</p>
              <h2 id="sw-contact-title" className="sw-contact-title">
                Let’s <span className="sw-grad">connect.</span>
              </h2>
            </header>
            <div className="sw-contact-grid sw-reveal">
              <EmailCard />
              <div className="sw-card sw-contact-card sw-spot">
                <span className="sw-card-icon" aria-hidden="true"><Heart size={22} /></span>
                <h3>Support the next chapter</h3>
                <p>Enjoying the music? You can support Starwynd directly on Ko-fi.</p>
                <a className="sw-btn sw-btn-primary" href={links.kofi} target="_blank" rel="noopener noreferrer">
                  Support on Ko-fi <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="sw-footer">
        <div className="sw-container sw-footer-grid">
          <a href="#top" className="sw-footer-logo" aria-label="Starwynd, back to top">
            <Image src="/images/redesign/starwynd-logo-v3.webp" alt="" width={1800} height={174} sizes="260px" />
          </a>
          <nav className="sw-footer-nav" aria-label="Footer">
            {platforms.map((platform) => (
              <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer">
                {platform.name}
              </a>
            ))}
          </nav>
          <div className="sw-footer-meta">
            <span>© {new Date().getFullYear()} Starwynd</span>
            <button
              className="sw-motion"
              disabled={reduced}
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {still ? <Play size={12} /> : <Pause size={12} />}
              {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
            </button>
            <a href="#top">
              Back to top <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </footer>

      {dockOpen && track && (
        <DockPlayer track={track} command={command} onStatus={setStatus} onClose={closeDock} />
      )}
    </div>
  );
}
