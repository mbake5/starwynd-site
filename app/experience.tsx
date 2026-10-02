"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  Play,
  Plus,
  Minus,
  Menu,
  X,
  Pause,
  Check,
} from "lucide-react";
import SpotifyPlayer from "./spotify-player";
import ContactEmail from "./contact-email";
import FeaturedVideo from "./featured-video";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";
import type { FeaturedTrack } from "../lib/spotify-playlist";
import type { ChannelVideo } from "../lib/youtube-rotation";

const playlistUrl = "https://open.spotify.com/playlist/78oYJUxVuPHAAt7FJaLrZv";
const platforms = [
  ["Spotify", "https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL", "01"],
  [
    "Apple Music",
    "https://music.apple.com/us/artist/starwynd/1841275156",
    "02",
  ],
  [
    "Amazon Music",
    "https://music.amazon.com/artists/B0FS12VR2X/starwynd",
    "03",
  ],
  ["YouTube", "https://www.youtube.com/channel/UCpCI4H8FllHtTgq3MDB9Y5w", "04"],
];
const navItems = [
  ["Music", "music"],
  ["Video", "video"],
  ["The Story", "about"],
  ["Connect", "connect"],
];

export default function Experience({ tracks, videos, videoDay }: {
  tracks: FeaturedTrack[];
  videos: ChannelVideo[];
  videoDay: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const trackList = useRef<HTMLDivElement>(null);
  const [listPosition, setListPosition] = useState({ start: true, end: false });
  const menuButton = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const still = paused || !!reduced;
  const track = tracks[selected];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (still || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The hero entrance is a CSS animation (synthpop.css): running it here
    // hid the already-painted headline once scripts loaded, so it blinked.
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 45,
          opacity: 0,
          duration: 0.95,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          clearProps: "all",
        });
      });
      gsap.to(".hero-cover", {
        y: -10,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.fromTo(".about-art > img", { scale: 1 }, {
        scale: 1.15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: ".about-art",
          start: "top bottom",
          end: "bottom top",
          toggleActions: "resume pause resume pause",
        },
      });
      gsap.from(".platform-list > a", {
        x: 36,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".platform-list", start: "top 88%", once: true },
        clearProps: "all",
      });
    }, root);
    return () => ctx.revert();
  }, [still]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion={still ? "always" : "user"}>
      <div
        id="top"
        ref={root}
        className={`experience${still ? " motion-paused" : ""}`}
      >
        <a className="skip-link" href="#music">
          Skip to music
        </a>
        <header className="site-header">
          <a href="#top" className="brand" aria-label="Starwynd home">
            <Image
              className="brand-logo"
              src="/images/Logo_4K_98.jpg"
              alt="Starwynd"
              fill
              priority
              sizes="(max-width: 760px) 240px, 340px"
            />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <button
            ref={menuButton}
            className="menu-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="mobile-nav"
                className="mobile-nav"
                aria-label="Mobile navigation"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: still ? 0 : 0.2 }}
              >
                {[...navItems, ["Contact", "contact"]].map(([label, id], i) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <small>0{i + 1}</small>
                    {label}
                    <ArrowUpRight />
                  </a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main>
          <section className="hero">
            {/* Ambient equalizer: decorative, not a representation of Spotify audio. */}
            <div className="hero-equalizer" aria-hidden="true">
              {Array.from({ length: 48 }, (_, index) => (
                <span
                  key={index}
                  style={{
                    height: `${24 + ((index * 17 + index * index * 3) % 77)}%`,
                    animationDuration: `${4 + (index % 7) * 0.55}s`,
                    animationDelay: `${-index * 0.37}s`,
                  }}
                />
              ))}
            </div>
            <div className="hero-release hero-enter">
              <a
                className="hero-cover"
                href={tracks[0]?.url || playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  tracks[0]
                    ? `Listen to ${tracks[0].title} on Spotify`
                    : "Listen to Starwynd on Spotify"
                }
              >
                <Image
                  unoptimized
                  src={tracks[0]?.artworkUrl || "/images/banner.webp"}
                  alt={tracks[0] ? `${tracks[0].title} artwork` : "Starwynd"}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 760px) 88vw, 420px"
                />
              </a>
              <div className="hero-release-caption">
                <div>
                  <span className="eyebrow">FEATURED RELEASE</span>
                  <strong>{tracks[0]?.title || "Discover Starwynd"}</strong>
                </div>
                <a
                  href={tracks[0]?.url || playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open featured release on Spotify"
                >
                  <ArrowUpRight />
                </a>
              </div>
            </div>
            <div className="hero-eyebrow hero-enter">
              <span className="status-dot" /> INDEPENDENT SOUND. INFINITE
              FEELING.
            </div>
            <h1 className="hero-enter">
              Somewhere
              <br />
              between <em>light</em>
              <br />
              &amp; shadow<span className="orange">.</span>
            </h1>
            <div className="hero-bottom hero-enter">
              <p>
                Human-produced synthpop.
                <br />
                Neon melodies. After-dark emotion.
              </p>
              <a className="round-link" href="#music">
                <span className="round-icon">
                  <ArrowDown size={22} />
                </span>
                <span>
                  Step into the sound<small>EXPLORE STARWYND</small>
                </span>
              </a>
            </div>
            <div className="hero-foot">
              <span>SYNTHPOP / ATMOSPHERIC / CINEMATIC</span>
              <button
                className="motion-control"
                disabled={!!reduced}
                onClick={() => setPaused(!paused)}
                aria-pressed={paused}
              >
                {still ? <Play size={11} /> : <Pause size={11} />}
                {reduced
                  ? "REDUCED MOTION"
                  : paused
                    ? "RESUME MOTION"
                    : "PAUSE MOTION"}
              </button>
            </div>
          </section>

          <section id="music" className="music section-pad">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">
                  <span>01 /</span> THE SOUND
                </p>
                <h2>
                  Find your
                  <br />
                  <em>frequency.</em>
                </h2>
              </div>
              <p className="section-intro">
                For late nights, open roads,
                <br />
                and everything you can’t put into words.
              </p>
            </div>
            {track ? (
              <div className="release-grid reveal">
                <div className="artwork-stage">
                  <AnimatePresence>
                    {track.artworkUrl && (
                      <motion.div
                        className="artwork-aura"
                        key={track.id}
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: still ? 0 : 0.6 }}
                      >
                        <Image unoptimized src={track.artworkUrl} alt="" fill loading={track.artworkUrl === tracks[0]?.artworkUrl ? "eager" : "lazy"} sizes="(max-width: 760px) 88vw, 45vw" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                <div className="artwork-shell">
                  <AnimatePresence mode="wait">
                    <motion.div
                      className="artwork-inner"
                      key={track.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.03 }}
                      transition={{ duration: still ? 0 : 0.3 }}
                    >
                      {track.artworkUrl ? (
                        <Image
                          unoptimized
                          src={track.artworkUrl}
                          alt={`${track.title} cover artwork`}
                          fill
                          loading={track.artworkUrl === tracks[0]?.artworkUrl ? "eager" : "lazy"}
                          sizes="(max-width: 760px) 90vw, 45vw"
                        />
                      ) : (
                        <div className="artwork-fallback">
                          SW<span>{track.title}</span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <span className="artwork-tag">
                    SELECTED RELEASE / {String(selected + 1).padStart(2, "0")}
                  </span>
                  <a
                    className="artwork-play"
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Listen to ${track.title} on Spotify`}
                  >
                    <ArrowUpRight size={30} />
                  </a>
                </div>
                </div>
                <div className="release-info">
                  <p className="eyebrow">STARWYND / SELECTED WORKS</p>
                  <div
                    className="track-list"
                    ref={trackList}
                    role="region"
                    tabIndex={0}
                    aria-label="Browse releases"
                    onScroll={(event) => {
                      const list = event.currentTarget;
                      setListPosition({
                        start: list.scrollTop < 4,
                        end:
                          list.scrollTop + list.clientHeight >=
                          list.scrollHeight - 4,
                      });
                    }}
                  >
                    {tracks.map((item, i) => (
                      <button
                        key={item.id}
                        className={`track-row ${selected === i ? "selected" : ""}`}
                        aria-pressed={selected === i}
                        onClick={() => {
                          setSelected(i);
                        }}
                      >
                        <span className="track-number">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <strong>{item.title}</strong>
                          <small>
                            {i === 0 ? "LATEST RELEASE" : "FEATURED TRACK"}
                          </small>
                        </span>
                        {selected === i ? (
                          <Check size={20} aria-label="Selected release" />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </button>
                    ))}
                  </div>
                  {tracks.length > 4 && (
                    <div className="track-browse">
                      <span>{tracks.length} releases</span>
                      <div>
                        <button
                          aria-label="Previous four releases"
                          disabled={listPosition.start}
                          onClick={() =>
                            trackList.current?.scrollBy({
                              top: -trackList.current.clientHeight,
                              behavior: still ? "instant" : "smooth",
                            })
                          }
                        >
                          <ChevronUp size={20} />
                        </button>
                        <button
                          aria-label="Next four releases"
                          disabled={listPosition.end}
                          onClick={() =>
                            trackList.current?.scrollBy({
                              top: trackList.current.clientHeight,
                              behavior: still ? "instant" : "smooth",
                            })
                          }
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="release-action">
                    <a
                      className="button button-orange"
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play size={14} fill="currentColor" /> Listen on Spotify{" "}
                      <ArrowUpRight size={16} />
                    </a>
                    <button
                      className="text-button"
                      aria-expanded={playerOpen}
                      aria-controls="inline-player"
                      onClick={() => setPlayerOpen(!playerOpen)}
                    >
                      {playerOpen
                        ? "Hide Spotify player"
                        : "Show Spotify player"}
                      {playerOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </button>
                  </div>
                  <div aria-live="polite" className="sr-only">
                    Selected release: {track.title}
                  </div>
                  <AnimatePresence>
                    {playerOpen && (
                      <motion.div
                        id="inline-player"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: still ? 0 : 0.25 }}
                        className="inline-player"
                      >
                        <SpotifyPlayer key={track.id} track={track} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <a
                    className="catalog-link"
                    href={playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore the full playlist <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>The latest releases are waiting on Spotify.</p>
                <a
                  className="button button-orange"
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore the playlist <ArrowUpRight size={16} />
                </a>
              </div>
            )}
          </section>

          <FeaturedVideo videos={videos} day={videoDay} still={still} />

          <section className="statement" aria-label="Music philosophy">
            <div className="statement-line">
              <span className="statement-copy">SYNTHPOP. <em>AFTER DARK.</em></span>
              <span className="statement-copy" aria-hidden="true">SYNTHPOP. <em>AFTER DARK.</em></span>
            </div>
          </section>

          <section id="about" className="about section-pad">
            <div className="about-art" aria-hidden="true">
              <Image
                src="/images/background4k.webp"
                alt=""
                fill
                sizes="100vw"
              />
              <div className="about-art-overlay" />
            </div>
              <p className="about-statement reveal">
                LESS NOISE.
                <br />
                MORE <em>feeling.</em>
              </p>
            <div className="about-copy reveal">
              <p className="eyebrow">
                <span>02 /</span> BEHIND THE SOUND
              </p>
              <h2>
                A little darker.
                <br />A little deeper.
                <br />
                <em>Unmistakably synthpop.</em>
              </h2>
              <p>
                Starwynd is a synthpop music group blending cinematic
                atmosphere, luminous synths, and emotional storytelling. Music
                for the space between light and shadow.
              </p>
              <p>
                Human-produced music with carefully shaped arrangements,
                expressive vocals, and intentional mixing. A sound designed to
                stay with you after the last note.
              </p>
              <div className="about-signature">
                <span className="brand-symbol">✳</span>
                <span>
                  Independent spirit.
                  <br />
                  <strong>Limitless atmosphere.</strong>
                </span>
              </div>
            </div>
          </section>

          <section id="connect" className="connect section-pad">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">
                  <span>03 /</span> STAY IN ORBIT
                </p>
                <h2>
                  Same feeling.
                  <br />
                  <em>Your platform.</em>
                </h2>
              </div>
              <p className="section-intro">
                Take the sound with you.
                <br />
                Find Starwynd wherever you listen.
              </p>
            </div>
            <div className="platform-list reveal">
              {platforms.map(([name, url, number]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="platform-number">{number}</span>
                  <span>{name}</span>
                  <small>
                    {name === "YouTube"
                      ? "WATCH & SUBSCRIBE"
                      : "LISTEN & FOLLOW"}
                  </small>
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          </section>

          <section id="contact" className="contact section-pad">
            <div className="contact-top reveal">
              <p className="eyebrow">
                <span>04 /</span> MAKE SOMETHING MEANINGFUL
              </p>
              <p>
                Collaborations, creative ideas,
                <br />
                or just a connection.
              </p>
            </div>
            <h2 className="contact-title reveal">
              Let’s connect<span className="orange">.</span>
            </h2>
            <div className="contact-bottom">
              <ContactEmail />
              <a
                href="https://ko-fi.com/starwynd"
                target="_blank"
                rel="noopener noreferrer"
              >
                Support the next chapter <ArrowRight size={16} />
              </a>
            </div>
          </section>
        </main>
        <footer>
          <a className="brand" href="#top" aria-label="Starwynd home">
            <Image
              className="brand-logo"
              src="/images/Logo_4K_98.jpg"
              alt="Starwynd"
              fill
              sizes="(max-width: 760px) 240px, 340px"
            />
          </a>
          <span>© {new Date().getFullYear()} STARWYND</span>
          <a href="#top">
            BACK TO TOP <ArrowUpRight size={14} />
          </a>
        </footer>
      </div>
    </MotionConfig>
  );
}
