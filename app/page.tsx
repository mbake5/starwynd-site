import Image from "next/image";
import {
  ExternalLink,
  Disc,
  Mail,
  Coffee,
  Video,
  ArrowUpRight,
  Music2,
  ShoppingBag,
} from "lucide-react";
import { getFeaturedTracks } from "../lib/spotify-playlist";

export const revalidate = 300;

export default async function Home() {
  const featuredTracks = await getFeaturedTracks();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030303] text-white selection:bg-cyan-500/30 font-sans antialiased">

      {/* CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 animate-cinematic-zoom">
          <Image
            src="/images/background4k.webp"
            alt=""
            fill
            priority
            className="object-cover object-center brightness-[0.42] contrast-[1.08]"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#030303]/55 to-[#030303]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,#030303_100%)] opacity-90" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.15)_45%,#030303_100%)]" />
      </div>

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-black/45 px-4 py-3.5 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.45)] sm:px-6 sm:py-4 md:px-12">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <a
            href="#top"
            className="pl-[0.55em] text-[12px] font-black tracking-[0.48em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 sm:text-sm sm:tracking-[0.6em]"
          >
            STARWYND
          </a>

          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-400 sm:gap-5 sm:text-[12px] sm:tracking-[0.2em] md:gap-8">

            <a
              href="#about"
              className="hidden transition-colors duration-300 hover:text-cyan-400 sm:block"
            >
              About
            </a>

            <a
              href="#music"
              className="transition-colors duration-300 hover:text-cyan-400"
            >
              Music
            </a>

            <a
              href="#connect"
              className="hidden transition-colors duration-300 hover:text-cyan-400 md:block"
            >
              Connect
            </a>

            <a
              href="#contact"
              className="hidden transition-colors duration-300 hover:text-cyan-400 sm:block"
            >
              Contact
            </a>

            <a
              href="https://ko-fi.com/starwynd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/[0.04] px-2.5 py-1.5 text-[11px] text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white sm:gap-1.5 sm:px-3.5 sm:text-[12px]"
            >
              Support
              <ExternalLink size={10} className="sm:h-[11px] sm:w-[11px]" />
            </a>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="top"
        className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-5 text-center sm:px-6"
      >

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.035] blur-[110px] sm:h-[550px] sm:w-[550px] sm:blur-[135px] md:h-[650px] md:w-[650px] md:blur-[150px]" />

        <div className="relative mx-auto mt-12 max-w-5xl px-2 sm:mt-16 sm:px-4">

          <div className="mx-auto mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.07] bg-black/20 px-3 py-2 backdrop-blur-md sm:mb-7 sm:gap-3 sm:px-4">

            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

            <span className="font-mono text-[11px] leading-5 uppercase tracking-[0.12em] text-neutral-300 sm:text-[12px] sm:tracking-[0.2em] md:text-[13px] md:tracking-[0.25em]">
              Cinematic • Atmospheric • Emotional
            </span>

          </div>

          <h1 className="mb-6 text-5xl font-black tracking-[-0.055em] bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent drop-shadow-2xl sm:mb-7 sm:text-7xl md:text-9xl">
            STARWYND
          </h1>

          <p className="mx-auto mb-5 max-w-2xl text-lg font-light leading-relaxed tracking-wide text-neutral-200 sm:text-xl md:text-2xl">
            Music that lives between light and shadow.
          </p>

          <p className="mx-auto mb-10 max-w-xl text-[14px] font-light leading-7 tracking-wide text-neutral-400 sm:mb-12 sm:text-[15px] md:text-base">
            Built around human production, emotional storytelling, and atmospheric electronic soundscapes.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">

            <a
              href="https://open.spotify.com/track/53OSXwWaDQdAWFvFR3dfwl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[12px] font-bold uppercase tracking-widest text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] sm:w-60 sm:px-8"
            >
              <Disc size={15} className="animate-spin-slow" />
              Listen on Spotify
            </a>

            <a
              href="#music"
              className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-4 font-mono text-[12px] uppercase tracking-widest text-neutral-300 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-white sm:w-60 sm:px-8"
            >
              Explore the Music
              <ArrowUpRight size={13} />
            </a>

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative z-10 mx-auto my-12 max-w-6xl scroll-mt-20 px-4 sm:my-20 sm:px-6 md:px-12"
      >

        <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-neutral-900/45 p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 md:p-14">

          <div className="grid gap-9 sm:gap-12 md:grid-cols-[170px_1fr] md:gap-16">

            <div>
              <div className="mb-5 h-px w-12 bg-cyan-500/60" />

              <p className="pl-[0.45em] font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400 sm:tracking-[0.45em]">
                The Concept
              </p>
            </div>

            <div className="max-w-3xl">

              <h2 className="mb-6 text-3xl font-black tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent sm:mb-7 sm:text-4xl md:text-5xl">
                About Starwynd
              </h2>

              <p className="mb-5 text-[15px] font-light leading-8 tracking-wide text-neutral-300 sm:mb-6 md:text-base">
                Starwynd creates cinematic music rooted in emotional storytelling and atmospheric soundscapes. The current chapter marks an intentional shift toward human-produced music and professional studio collaboration.
              </p>

              <p className="text-[15px] font-light leading-8 tracking-wide text-neutral-400 md:text-base">
                Every track is built with purpose through handcrafted arrangements and intentional mixing. Vocals are treated as a vital instrument within the production architecture, creating music designed to feel as much as it is heard.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">

        <div className="grid overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/40 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] md:grid-cols-[1fr_1.3fr_1fr]">

          <div className="p-6 sm:p-7 md:p-8">

            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan-400/60">
              Genre
            </p>

            <p className="text-base font-medium tracking-wide text-neutral-200 sm:text-lg">
              Atmospheric Pop
            </p>

          </div>

          <div className="border-t border-white/[0.08] p-6 sm:p-7 md:border-l md:border-t-0 md:p-8">

            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan-400/60">
              Style
            </p>

            <div className="flex flex-wrap gap-x-2 gap-y-1 text-base font-medium tracking-wide text-neutral-200 sm:text-lg">
              <span>Atmospheric</span>
              <span className="text-neutral-600">•</span>
              <span>Emotional</span>
              <span className="text-neutral-600">•</span>
              <span>Cinematic</span>
            </div>

          </div>

          <div className="border-t border-white/[0.08] p-6 sm:p-7 md:border-l md:border-t-0 md:p-8">

            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan-400/60">
              Sound Architecture
            </p>

            <p className="text-base font-medium tracking-wide text-neutral-200 sm:text-lg">
              Human-Led Production
            </p>

          </div>

        </div>
      </section>

      {/* MUSIC */}
      <section
        id="music"
        className="relative z-10 scroll-mt-20 bg-gradient-to-b from-neutral-950/30 to-transparent px-4 py-20 sm:px-6 sm:py-28 md:py-32"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 sm:gap-6 md:flex-row md:items-end">

            <div>

              <p className="mb-2 pl-[0.45em] font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400 sm:tracking-[0.45em]">
                Discography
              </p>

              <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent sm:text-4xl md:text-5xl">
                Featured Tracks
              </h2>

            </div>

            <a
              href="https://open.spotify.com/playlist/78oYJUxVuPHAAt7FJaLrZv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-neutral-400 transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-400"
            >
              Open Playlist
              <ExternalLink size={12} />
            </a>

          </div>

          {/* SPOTIFY PLAYLIST */}
          <div className="mb-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-2.5 shadow-2xl backdrop-blur-xl sm:mb-16 sm:p-3">

            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/playlist/78oYJUxVuPHAAt7FJaLrZv?utm_source=generator&theme=0"
              width="100%"
              height="900"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Starwynd Spotify Playlist"
              className="h-[900px] opacity-90 transition-opacity duration-300 hover:opacity-100 sm:h-[650px] md:h-[380px]"
            />

          </div>

          {/* AUTOMATIC FEATURED TRACK TILES */}
          {featuredTracks.length > 0 ? (
            <div className="grid gap-6 sm:gap-7 md:grid-cols-3">

              {featuredTracks.map((track, index) => (

                <article
                  key={track.id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/30 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/25 hover:bg-neutral-900/50 hover:shadow-[0_0_45px_rgba(34,211,238,0.08)]"
                >

                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    aria-label={`Play ${track.title} on Spotify`}
                  >

                    <div className="relative aspect-square overflow-hidden">

                      {track.artworkUrl ? (
                        <img
                          src={track.artworkUrl}
                          alt={`${track.title} artwork`}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-neutral-950" />
                      )}

                      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30" />

                      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-[11px] tracking-widest text-white/85 backdrop-blur-md sm:left-5 sm:top-5">
                        {String(index + 1).padStart(2, "0")} / 03
                      </div>

                      {index === 0 && (
                        <div className="absolute right-4 top-4 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-cyan-300 backdrop-blur-md sm:right-5 sm:top-5">
                          Latest
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">

                        <div className="translate-y-2 rounded-full border border-white/10 bg-black/75 px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          ▶ Play on Spotify
                        </div>

                      </div>
                    </div>

                  </a>

                  <div className="p-5 sm:p-6">

                    <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan-400">
                      {index === 0 ? "Latest Release" : "Featured Track"}
                    </p>

                    <h3 className="text-lg font-bold leading-snug tracking-wide text-neutral-100 transition-colors duration-300 group-hover:text-cyan-400">
                      {track.title}
                    </h3>

                    <p className="mt-1 text-[14px] font-light tracking-wide text-neutral-400">
                      {track.artist}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4">

                      <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                        Spotify
                      </span>

                      <a
                        href={track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-300 transition-all duration-300 hover:border-transparent hover:bg-cyan-400 hover:text-black"
                      >
                        Stream
                        <ArrowUpRight size={11} />
                      </a>

                    </div>
                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/30 p-10 text-center font-mono text-[12px] text-neutral-500">
              Featured tracks are temporarily unavailable.
            </div>
          )}

          {/* COMPLETE CATALOG */}
          <div className="mt-10 text-center sm:mt-12">

            <a
              href="https://open.spotify.com/track/53OSXwWaDQdAWFvFR3dfwl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-mono text-[18px] font-medium uppercase tracking-[0.12em] text-neutral-300 transition-all duration-300 hover:text-cyan-400"
            >
              Explore the complete Starwynd catalog
              <ArrowUpRight size={19} />
            </a>

          </div>

        </div>
      </section>

      {/* CONNECT */}
      <section
        id="connect"
        className="relative z-10 scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24"
      >

        <div className="mx-auto max-w-5xl">

          <div className="mb-8 text-center sm:mb-10">

            <p className="mb-2 pl-[0.45em] font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400 sm:tracking-[0.45em]">
              Connect
            </p>

            <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent md:text-4xl">
              Find Starwynd
            </h2>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <a
              href="https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-neutral-900/60 sm:p-6"
            >

              <div className="flex items-center gap-4">

                <Disc size={21} className="text-cyan-400" />

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                    Music
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-200">
                    Spotify
                  </p>
                </div>

              </div>

              <ArrowUpRight
                size={15}
                className="text-neutral-600 transition-colors group-hover:text-cyan-400"
              />

            </a>

            <a
              href="https://music.apple.com/us/artist/starwynd/1841275156"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-neutral-900/60 sm:p-6"
            >

              <div className="flex items-center gap-4">

                <Music2 size={21} className="text-cyan-400" />

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                    Music
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-200">
                    Apple Music
                  </p>
                </div>

              </div>

              <ArrowUpRight
                size={15}
                className="text-neutral-600 transition-colors group-hover:text-cyan-400"
              />

            </a>

            <a
              href="https://music.amazon.co.uk/artists/B0FS14KVWX/starwynd"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-neutral-900/60 sm:p-6"
            >

              <div className="flex items-center gap-4">

                <ShoppingBag size={21} className="text-cyan-400" />

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                    Music
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-200">
                    Amazon Music
                  </p>
                </div>

              </div>

              <ArrowUpRight
                size={15}
                className="text-neutral-600 transition-colors group-hover:text-cyan-400"
              />

            </a>

            <a
              href="https://www.youtube.com/channel/UCGNTkRr6hq3KRmKNvrSVxBg"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-neutral-900/60 sm:p-6"
            >

              <div className="flex items-center gap-4">

                <Video size={21} className="text-cyan-400" />

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                    Video
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-200">
                    YouTube
                  </p>
                </div>

              </div>

              <ArrowUpRight
                size={15}
                className="text-neutral-600 transition-colors group-hover:text-cyan-400"
              />

            </a>

          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative z-10 scroll-mt-20 px-4 py-24 text-center sm:px-6 sm:py-32"
      >

        <div className="mx-auto max-w-lg rounded-3xl border border-white/[0.06] bg-neutral-900/45 p-8 shadow-2xl backdrop-blur-xl sm:p-10 md:p-12">

          <p className="mb-2 pl-[0.45em] font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400 sm:tracking-[0.45em]">
            Inquiries
          </p>

          <h2 className="mb-5 text-3xl font-black tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent md:text-4xl">
            Get in Touch
          </h2>

          <p className="mb-8 text-[15px] font-light leading-7 tracking-wide text-neutral-400 sm:mb-9 md:text-base">
            For professional inquiries, production collaborations, or information regarding Starwynd.
          </p>

          <a
            href="mailto:StarwyndMusic@protonmail.com"
            className="mx-auto flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-10 py-3.5 text-[12px] font-semibold tracking-wider text-neutral-200 transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] sm:w-fit"
          >
            <Mail size={15} />
            Email Starwynd
          </a>

        </div>
      </section>

      {/* FLOATING KO-FI */}
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6">

        <a
          href="https://ko-fi.com/starwynd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1da1d8]/80 px-3.5 py-2.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#29abe2] active:scale-95 sm:gap-2 sm:px-5 sm:py-3 sm:text-[10px]"
        >
          <Coffee size={12} fill="currentColor" />
          <span>Support on Ko-fi</span>
        </a>

      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.04] px-6 py-10 text-center text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-600 sm:py-12 sm:text-[11px] sm:tracking-[0.2em]">
        © {new Date().getFullYear()} STARWYND. ALL RIGHTS RESERVED.
      </footer>

    </main>
  );
}