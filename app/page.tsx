"use client";

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Disc, Mail, Coffee } from 'lucide-react';

export default function Home() {
  
  // 1. Logic for the email (Bot-safe)
  const handleEmailClick = () => {
    const user = "StarwyndMusic";
    const domain = "protonmail.com"; 
    window.location.href = `mailto:${user}@${domain}`;
  };

  // 2. Logic for your track styles
  const getTrackStyle = (title: string): string => {
    const styles = [
      "from-cyan-400/30 via-indigo-500/20 to-black",
      "from-pink-500/20 via-purple-500/20 to-black",
      "from-emerald-400/20 via-teal-500/20 to-black",
      "from-orange-400/20 via-red-500/20 to-black",
      "from-blue-400/20 via-sky-500/20 to-black",
    ];

    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }

    return styles[Math.abs(hash) % styles.length];
  };

  return (
    <main className="min-h-screen text-white overflow-x-hidden bg-[#050505] selection:bg-cyan-500/30">

      {/* STICKY NAVIGATION HEADER */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="text-lg font-black tracking-[0.4em] text-cyan-400">STARWYND</div>
        <div className="flex items-center gap-6 md:gap-8 text-xs font-mono tracking-widest uppercase text-gray-400">
          <a href="#about" className="hover:text-white transition-colors hidden sm:block">About</a>
          <a href="#music" className="hover:text-white transition-colors">Music</a>
          <a href="#contact" className="hover:text-white transition-colors hidden sm:block">Contact</a>
          <a 
            href="https://ko-fi.com/starwynd" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1.5 border border-cyan-400/20 px-3 py-1.5 rounded-xl bg-cyan-400/5"
          >
            Support <ExternalLink size={12} />
          </a>
        </div>
      </nav>

      {/* HERO SECTION WITH FULL CONTRAST PARALLAX BANNER */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden bg-attachment-fixed">
        
        {/* INFINITE SMOOTH ZOOM BACKDROP */}
                <div 
                  className="absolute inset-0 z-0 pointer-events-none transform"
                  style={{
                    animation: 'cinematicZoom 12s ease-in-out infinite alternate'
                  }}
                >
                  {/* Injecting the necessary CSS keyframe block directly */}
                  <style>{`
                    @keyframes cinematicZoom {
                      0% { transform: scale(1.02); }
                      100% { transform: scale(1.15); }
                    }
                  `}</style>
          <Image
            src="/images/background4k.webp"
            alt="Starwynd Hero Backdrop"
            fill
            priority
            className="object-cover object-center filter brightness-100 contrast-100"
            sizes="100vw"
          />
        </div>

        {/* Ambient blending layers to preserve text readability without crushing image details */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#050505] z-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#050505_100%)] opacity-80 z-1" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-1" />

        <div className="relative z-10 max-w-4xl mt-16">
          <p className="tracking-[0.45em] text-cyan-400 uppercase text-xs md:text-sm mb-6 font-mono">
            Cinematic • Atmospheric • Emotional
          </p>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            STARWYND
          </h1>
          <p className="text-gray-400 text-base md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Built around human production, emotional storytelling, and atmospheric electronic soundscapes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-56 px-8 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              <Disc size={16} className="animate-spin-slow" /> Spotify Profile
            </a>
            <a
              href="https://ko-fi.com/starwynd"
              target="_blank"
              rel="noopener noreferrer"
              className="w-56 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-gray-300 font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              Support Project <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 scroll-mt-24 items-center">
        
        {/* LEFT COLUMN: OFFICIAL BANNER ARTWORK IMMERSED IN FRAME WITH CUSTOM HORIZONTAL POSITIONING */}
        <div className="relative flex items-center justify-center min-h-[240px] md:min-h-[320px] group order-2 md:order-1 w-full">
          {/* Subtle atmospheric back-glow behind the canvas border */}
          <div className="absolute w-full h-full max-w-[480px] bg-gradient-to-r from-cyan-500/10 to-indigo-500/5 rounded-3xl blur-[60px] group-hover:opacity-150 transition-all duration-1000 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-[480px] aspect-[16/9] md:aspect-[3/2] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:border-cyan-500/20">
            <Image 
              src="/images/banner.webp" 
              alt="Starwynd Official Banner Artwork" 
              fill
              priority
              className="object-cover object-[25%_center] opacity-90 group-hover:opacity-100 transition-opacity duration-700"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: TEXT CONTENT */}
        <div className="flex flex-col justify-center order-1 md:order-2">
          <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-[0.4em] uppercase">The Concept</h2>
          <h3 className="text-4xl font-black mb-6 tracking-tight">About</h3>

          <p className="text-gray-400 font-light leading-relaxed mb-6 text-base md:text-lg">
            Starwynd creates cinematic music rooted in emotional storytelling and atmospheric soundscapes. The current chapter marks an intentional shift to human produced music and professional studio collaboration.
          </p>

          <p className="text-gray-400 font-light leading-relaxed text-base md:text-lg">
            Every track is built with purpose through handcrafted arrangements and intentional mixing. Vocals are treated as a vital instrument within the production architecture. They are refined and woven into the mix to become a seamless, living part of the music.
          </p>
        </div>
      </section>

      {/* DETAILED STATS ROW WITH PROPORTIONAL COLUMN BALANCING */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr_1fr] gap-8 bg-white/[0.01] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
          <div>
            <p className="text-cyan-400/60 text-xs font-mono uppercase tracking-widest mb-1">Genre</p>
            <p className="text-xl font-medium tracking-wide">Atmospheric Pop</p>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
            <p className="text-cyan-400/60 text-xs font-mono uppercase tracking-widest mb-1">Style</p>
            <p className="text-xl font-medium tracking-wide whitespace-nowrap">Atmospheric • Emotional • Cinematic</p>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
            <p className="text-cyan-400/60 text-xs font-mono uppercase tracking-widest mb-1">Sound Architecture</p>
            <p className="text-xl font-medium tracking-wide">Human-Led Production</p>
          </div>
        </div>
      </section>

      {/* MUSIC & FEATURED TRACKS */}
      <section id="music" className="border-t border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent py-32 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-[0.4em] uppercase">Discography</h2>
          <h3 className="text-4xl font-black mb-12 tracking-tight">Featured Tracks</h3>
          
          {/* Main Integrated Player Row */}
          <div className="mb-12 border border-white/5 bg-black/40 p-4 rounded-3xl backdrop-blur-sm">
            <iframe 
              style={{ borderRadius: "18px" }} 
              src="https://open.spotify.com/embed/artist/5qyoyaRsxcHKln2TxqoUgL?utm_source=generator&theme=0" 
              width="100%" 
              height="380" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            />
          </div>

          {/* Individual Track Dynamic Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Where The Light Stays", url: "https://open.spotify.com/track/07adQpITJaAuXmmZX2W8zP", desc: "Atmospheric electronic pop built on emotional progression." },
              { title: "Open to the Wind", url: "https://open.spotify.com/track/7LgTM5EATA2HQ1fBsZTGfX", desc: "Handcrafted instrumental layers woven with spacious, drifting themes." },
              { title: "Right Where It Opens", url: "https://open.spotify.com/track/4ctw1x9j0Ek5dhGSRxTqm0", desc: "An exploration of retro-futurism combined with detailed studio mixing." }
            ].map((track) => (
              <a
                key={track.title}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-black/30 border border-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/20 block"
              >
                <div className={`aspect-square bg-gradient-to-br ${getTrackStyle(track.title)} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-white text-xs font-mono tracking-widest uppercase bg-black/60 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                      ▶ Play on Spotify
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-2">Single</p>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors duration-300">{track.title}</h3>
                  <p className="text-gray-400 text-sm font-light mb-5 leading-relaxed h-10 overflow-hidden text-ellipsis">{track.desc}</p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs font-mono text-gray-500">Platform // Spotify</span>
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 group-hover:bg-cyan-400 group-hover:text-black font-mono text-xs uppercase tracking-wider transition-all duration-300">Stream</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 px-6 text-center border-t border-white/5 scroll-mt-24">
        <div className="max-w-md mx-auto">
          <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-[0.4em] uppercase">Inquiries</h2>
          <h3 className="text-4xl font-black mb-6 tracking-tight">Get in Touch</h3>
          <p className="text-gray-400 mb-10 font-light leading-relaxed">
            For professional inquiries, production collaborations, or information regarding Starwynd.
          </p>
          <button 
            onClick={handleEmailClick}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 font-semibold tracking-wider text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <Mail size={16} /> Email
          </button>
        </div>
      </section>

      {/* FLOATING KO-FI WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://ko-fi.com/starwynd" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#29abe2] hover:bg-[#228cb9] text-white font-bold px-5 py-3 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 text-xs font-mono tracking-wider uppercase"
        >
          <Coffee size={14} fill="currentColor" /> Support on Ko-fi
        </a>
      </div>

      {/* FOOTER */}
      <footer className="py-12 text-center text-gray-600 text-xs border-t border-white/5 font-mono tracking-widest">
        &copy; {new Date().getFullYear()} STARWYND. ALL RIGHTS RESERVED.
      </footer>

    </main>
  );
}