"use client";

import React from 'react';

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

  // 3. The actual visual page
  return (
    <main className="min-h-screen text-white overflow-x-hidden bg-black">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 animate-slowZoom origin-center"
          style={{ backgroundImage: "url('/images/background4k.webp')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl">
          <p className="tracking-[0.35em] text-cyan-300 uppercase text-sm mb-6">
            Cinematic • Atmospheric • Emotional
          </p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-cyan-300 via-white to-indigo-400 bg-clip-text text-transparent">
            STARWYND
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
            Built around human production, emotional storytelling, and atmospheric electronic soundscapes.
          </p>
          <a
            href="https://open.spotify.com/artist/5qyoyaRsxcHKln2TxqoUgL"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition inline-block"
          >
            Listen on Spotify
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold mb-6">About</h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Starwynd creates cinematic music rooted in emotional storytelling and atmospheric soundscapes. This evolution marks a deeper, more personal era of the sound, centered on human-led production and professional studio collaboration.
          </p>

          <p className="text-gray-400 leading-relaxed">
            Through handcrafted arrangements and intentional mixing, every track is built with purpose. Vocals are treated as a vital instrument within the ensemble—refined and woven into the production to become a seamless, living part of the music.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <div className="mb-8">
            <p className="text-cyan-300 text-sm uppercase tracking-widest mb-2">Genre</p>
            <p className="text-xl font-semibold">Atmospheric Pop</p>
          </div>

          <div className="mb-8">
            <p className="text-cyan-300 text-sm uppercase tracking-widest mb-2">Style</p>
            <p className="text-xl font-semibold">Atmospheric • Emotional • Cinematic</p>
          </div>

          <div>
            <p className="text-cyan-300 text-sm uppercase tracking-widest mb-2">Sound</p>
            <p className="text-xl font-semibold">Human-Led Production</p>
          </div>
        </div>
      </section>

      {/* MUSIC */}
      <section className="border-t border-white/10 bg-white/5 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Featured Tracks</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Where The Light Stays", url: "https://open.spotify.com/track/07adQpITJaAuXmmZX2W8zP" },
              { title: "Open to the Wind", url: "https://open.spotify.com/track/7LgTM5EATA2HQ1fBsZTGfX" },
              { title: "Right Where It Opens", url: "https://open.spotify.com/track/4ctw1x9j0Ek5dhGSRxTqm0" }
            ].map((track) => (
              <a
                key={track.title}
                href={track.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-black/50 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] block"
              >
                <div className={`aspect-square bg-gradient-to-br ${getTrackStyle(track.title)} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition text-white text-sm">▶ Play on Spotify</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-cyan-300 text-xs uppercase tracking-widest mb-2">Single</p>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition">{track.title}</h3>
                  <p className="text-gray-400 text-sm mb-5">Atmospheric electronic pop built on emotional progression.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Spotify</span>
                    <span className="px-4 py-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition text-sm">Play</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION (Added here for you) */}
      <section className="py-28 px-6 text-center border-t border-white/10">
        <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          For inquiries, collaborations, or information regarding Starwynd.
        </p>
        <button 
          onClick={handleEmailClick}
          className="px-10 py-4 rounded-2xl border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-semibold"
        >
          Email Starwynd
        </button>
      </section>

      <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5">
        &copy; {new Date().getFullYear()} STARWYND. All rights reserved.
      </footer>

    </main>
  );
}