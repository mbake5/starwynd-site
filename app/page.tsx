"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ExternalLink, Disc, Mail, Coffee } from 'lucide-react';

const TRACK_STYLES = [
  "from-cyan-500/20 via-indigo-500/10 to-transparent",
  "from-pink-500/15 via-purple-500/10 to-transparent",
  "from-emerald-500/15 via-teal-500/10 to-transparent",
  "from-orange-500/15 via-red-500/10 to-transparent",
  "from-blue-500/15 via-sky-500/10 to-transparent",
];

// Removed the 'desc' strings from the track objects for a minimalist layout
const TRACKS_DATA = [
  { title: "Where The Light Stays", url: "https://open.spotify.com/track/07adQpITJaAuXmmZX2W8zP" },
  { title: "Open to the Wind", url: "https://open.spotify.com/track/7LgTM5EATA2HQ1fBsZTGfX" },
  { title: "Right Where It Opens", url: "https://open.spotify.com/track/4ctw1x9j0Ek5dhGSRxTqm0" }
];

const getTrackStyle = (title: string): string => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TRACK_STYLES[Math.abs(hash) % TRACK_STYLES.length];
};

export default function Home() {
  const handleEmailClick = () => {
    const user = "StarwyndMusic";
    const domain = "protonmail.com"; 
    window.location.href = `mailto:${user}@${domain}`;
  };

  const tracksWithStyles = useMemo(() => {
    return TRACKS_DATA.map(track => ({
      ...track,
      styleClass: getTrackStyle(track.title)
    }));
  }, []);

  return (
    <main className="min-h-screen text-white overflow-x-hidden bg-[#030303] selection:bg-cyan-500/30 font-sans antialiased">
      
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes cinematicZoom {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.12); }
        }
        .animate-cinematic-zoom {
          animation: cinematicZoom 20s ease-in-out infinite alternate;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
      `}</style>

      {/* FULL-PAGE FIXED BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none transform animate-cinematic-zoom">
        <Image
          src="/images/background4k.webp"
          alt="Starwynd Space Backdrop"
          fill
          priority
          className="object-cover object-center brightness-[0.45] contrast-[1.1]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/40 to-[#030303]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030303_100%)] opacity-80" />
      </div>

      {/* STICKY NAVIGATION HEADER */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-neutral-950/50 backdrop-blur-xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="text-sm font-black tracking-[0.6em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 pl-[0.6em]">STARWYND</div>
        <div className="flex items-center gap-6 md:gap-8 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400">
          <a href="#about" className="hover:text-cyan-400 transition-colors duration-300 hidden sm:block">About</a>
          <a href="#music" className="hover:text-cyan-400 transition-colors duration-300">Music</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors duration-300 hidden sm:block">Contact</a>
          <a 
            href="https://ko-fi.com/starwynd" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cyan-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 border border-cyan-500/30 px-3.5 py-1.5 rounded-full bg-cyan-550/5 hover:bg-cyan-500/10 hover:border-cyan-400"
          >
            Support <ExternalLink size={10} />
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mt-16 px-4">
          <p className="tracking-[0.6em] text-cyan-400 uppercase text-[10px] md:text-xs mb-6 font-mono pl-[0.6em]">
            Cinematic • Atmospheric • Emotional
          </p>
          <h1 className="text-5xl md:text-8xl font-black tracking-[-0.04em] mb-6 bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent drop-shadow-2xl">
            STARWYND
          </h1>
          <p className="text-neutral-300 text-sm md:text-lg mb-12 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
            Built around human production, emotional storytelling, and atmospheric electronic soundscapes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-56 px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[11px] hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Disc size={14} className="animate-spin-slow" /> Spotify Profile
            </a>
            <a
              href="https://ko-fi.com/starwynd"
              target="_blank"
              rel="noopener noreferrer"
              className="w-56 px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-neutral-300 font-mono text-[10px] tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              Support Project <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 my-20 grid md:grid-cols-2 gap-16 scroll-mt-24 items-center bg-neutral-900/40 backdrop-blur-xl border border-white/[0.06] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="relative flex items-center justify-center min-h-[240px] md:min-h-[320px] group w-full">
          <div className="absolute w-full h-full max-w-[480px] bg-gradient-to-r from-cyan-500/10 to-indigo-500/5 rounded-3xl blur-[80px] opacity-60 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-[480px] aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-950 shadow-2xl transition-all duration-700 group-hover:scale-[1.03] group-hover:border-cyan-500/30">
            <Image 
              src="/images/banner.webp" 
              alt="Starwynd Official Banner Artwork" 
              fill
              className="object-cover object-[25%_center] opacity-85 group-hover:opacity-100 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="w-12 h-[1px] bg-cyan-500/50 mb-6" />
          <h2 className="text-[10px] font-mono text-cyan-400 mb-2 tracking-[0.5em] uppercase pl-[0.5em]">The Concept</h2>
          <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">About</h3>
          <p className="text-neutral-300 font-light leading-relaxed mb-6 text-sm md:text-base tracking-wide">
            Starwynd creates cinematic music rooted in emotional storytelling and atmospheric soundscapes. The current chapter marks an intentional shift to human produced music and professional studio collaboration.
          </p>
          <p className="text-neutral-300 font-light leading-relaxed text-sm md:text-base tracking-wide">
            Every track is built with purpose through handcrafted arrangements and intentional mixing. Vocals are treated as a vital instrument within the production architecture.
          </p>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr_1fr] gap-8 bg-neutral-900/40 border border-white/[0.06] rounded-2xl p-8 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
          <div>
            <p className="text-cyan-400/50 text-[10px] font-mono uppercase tracking-widest mb-1">Genre</p>
            <p className="text-lg font-medium tracking-wide text-neutral-200">Atmospheric Pop</p>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-white/[0.08] pt-6 md:pt-0 md:pl-8">
            <p className="text-cyan-400/50 text-[10px] font-mono uppercase tracking-widest mb-1">Style</p>
            <div className="flex flex-wrap md:flex-nowrap md:whitespace-nowrap gap-x-2 gap-y-1 text-lg font-medium tracking-wide text-neutral-200">
              <span>Atmospheric</span>
              <span className="text-neutral-600">•</span>
              <span>Emotional</span>
              <span className="text-neutral-600">•</span>
              <span>Cinematic</span>
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-white/[0.08] pt-6 md:pt-0 md:pl-8">
            <p className="text-cyan-400/50 text-[10px] font-mono uppercase tracking-widest mb-1">Sound Architecture</p>
            <p className="text-lg font-medium tracking-wide text-neutral-200">Human-Led Production</p>
          </div>
        </div>
      </section>

      {/* MUSIC & FEATURED TRACKS */}
      <section id="music" className="relative z-10 bg-gradient-to-b from-neutral-950/20 to-transparent py-32 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[10px] font-mono text-cyan-400 mb-2 tracking-[0.5em] uppercase pl-[0.5em]">Discography</h2>
          <h3 className="text-3xl md:text-4xl font-black mb-12 tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Featured Tracks</h3>
          
          {/* Main Embedded Player Row */}
          <div className="mb-16 border border-white/[0.06] bg-neutral-900/40 p-3 rounded-2xl backdrop-blur-xl shadow-2xl">
            <iframe 
              style={{ borderRadius: "12px" }} 
              src="https://open.spotify.com/embed/artist/5qyoyaRsxcHKln2TxqoUgL?utm_source=generator&theme=0" 
              width="100%" 
              height="380" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="Starwynd Spotify Discography Player"
              className="opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Track Grid with removed descriptions */}
          <div className="grid md:grid-cols-3 gap-8">
            {tracksWithStyles.map((track) => (
              <div
                key={track.title}
                className="group bg-neutral-900/30 border border-white/[0.05] rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/30 hover:bg-neutral-900/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className={`aspect-square bg-gradient-to-br ${track.styleClass} relative overflow-hidden border-b border-white/[0.04]`}>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
                    <a 
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/0 group-hover:bg-neutral-950/60 transition-all duration-300 flex items-center justify-center z-10"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-white text-[10px] font-mono tracking-widest uppercase bg-neutral-950/80 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm shadow-xl">
                        ▶ Play on Spotify
                      </div>
                    </a>
                  </div>
                  {/* Cleaned up text spacing - removed description element entirely */}
                  <div className="p-6 pb-4">
                    <p className="text-cyan-400 text-[9px] font-mono uppercase tracking-widest mb-2">Single</p>
                    <h3 className="text-md font-bold group-hover:text-cyan-400 transition-colors duration-300 tracking-wide text-neutral-100">{track.title}</h3>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                    <span className="text-[10px] font-mono text-neutral-500">Platform // Spotify</span>
                    <a 
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 group-hover:bg-cyan-400 group-hover:text-black group-hover:border-transparent font-mono text-[10px] uppercase tracking-wider transition-all duration-300"
                    >
                      Stream
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-40 px-6 text-center scroll-mt-24">
        <div className="max-w-md mx-auto bg-neutral-900/40 border border-white/[0.06] p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
          <h2 className="text-[10px] font-mono text-cyan-400 mb-2 tracking-[0.5em] uppercase pl-[0.5em]">Inquiries</h2>
          <h3 className="text-3xl font-black mb-4 tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Get in Touch</h3>
          <p className="text-neutral-400 mb-10 text-sm font-light leading-relaxed tracking-wide">
            For professional inquiries, production collaborations, or information regarding Starwynd.
          </p>
          <button 
            onClick={handleEmailClick}
            className="w-full sm:w-auto px-10 py-3.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 transition-all duration-300 font-semibold tracking-wider text-xs flex items-center justify-center gap-2 mx-auto"
          >
            <Mail size={14} /> Email
          </button>
        </div>
      </section>

      {/* FLOATING KO-FI WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://ko-fi.com/starwynd" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#1da1d8]/80 backdrop-blur-md hover:bg-[#29abe2] text-white font-bold px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10 transition-all transform hover:-translate-y-1 active:scale-95 text-[10px] font-mono tracking-wider uppercase"
        >
          <Coffee size={12} fill="currentColor" /> Support on Ko-fi
        </a>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 text-center text-neutral-600 text-[10px] font-mono tracking-[0.2em]">
        &copy; {new Date().getFullYear()} STARWYND. ALL RIGHTS RESERVED.
      </footer>

    </main>
  );
}