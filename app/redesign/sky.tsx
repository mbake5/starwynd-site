"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; size: number; phase: number; speed: number; color: string };
type Meteor = { x: number; y: number; vx: number; vy: number; age: number; life: number };

const COLORS = ["255 255 255", "214 196 255", "176 226 255", "196 162 252"];
const MAX_DPR = 1.5;

// A night sky behind the whole page: layered stars that twinkle, drift at different
// depths as the page scrolls, plus the odd shooting star. It ignores the mouse. The opaque sections (hero, story) cover it; the others let it show through.
// It draws one still frame when motion is paused or reduced, and nothing while the tab is hidden.
export default function Sky({ still }: { still: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let nextMeteor = performance.now() + 2500;
    let frame = 0;
    let last = performance.now();

    // A soft round sprite for the brightest stars, drawn once (cheaper than shadowBlur).
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const spriteContext = sprite.getContext("2d")!;
    const gradient = spriteContext.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgb(255 255 255 / 1)");
    gradient.addColorStop(0.18, "rgb(225 215 255 / 0.85)");
    gradient.addColorStop(0.45, "rgb(170 150 255 / 0.18)");
    gradient.addColorStop(1, "rgb(150 130 255 / 0)");
    spriteContext.fillStyle = gradient;
    spriteContext.fillRect(0, 0, 32, 32);

    const seed = () => {
      const count = Math.round(Math.min((width * height) / 4200, 420));
      stars = Array.from({ length: count }, () => {
        const z = Math.random() ** 1.8 * 0.85 + 0.15;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size: 0.4 + z * 1.15,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      });
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      context.clearRect(0, 0, width, height);
      const scroll = window.scrollY;
      const t = now / 1000;

      for (const star of stars) {
        const x = star.x;
        const y = (((star.y - scroll * star.z * 0.22) % height) + height) % height;
        const twinkle = still ? 0.75 : 0.5 + 0.5 * Math.sin(t * star.speed + star.phase);
        const alpha = (0.25 + 0.75 * twinkle) * (0.35 + 0.65 * star.z);
        if (star.z > 0.78) {
          const s = star.size * 7;
          context.globalAlpha = alpha;
          context.drawImage(sprite, x - s / 2, y - s / 2, s, s);
        } else {
          context.globalAlpha = 1;
          context.fillStyle = `rgb(${star.color} / ${alpha.toFixed(3)})`;
          context.fillRect(x, y, star.size, star.size);
        }
      }
      context.globalAlpha = 1;

      if (!still) {
        if (now > nextMeteor) {
          const leftToRight = Math.random() < 0.5;
          const speed = 700 + Math.random() * 500;
          const angle = (18 + Math.random() * 22) * (Math.PI / 180);
          meteors.push({
            x: leftToRight ? Math.random() * width * 0.6 : width * 0.4 + Math.random() * width * 0.6,
            y: Math.random() * height * 0.45,
            vx: Math.cos(angle) * speed * (leftToRight ? 1 : -1),
            vy: Math.sin(angle) * speed,
            age: 0,
            life: 0.7 + Math.random() * 0.5,
          });
          nextMeteor = now + 3500 + Math.random() * 6000;
        }
        for (let index = meteors.length - 1; index >= 0; index--) {
          const meteor = meteors[index];
          meteor.age += dt;
          if (meteor.age > meteor.life) {
            meteors.splice(index, 1);
            continue;
          }
          meteor.x += meteor.vx * dt;
          meteor.y += meteor.vy * dt;
          const fade = Math.sin((meteor.age / meteor.life) * Math.PI);
          const tailX = meteor.x - meteor.vx * 0.16;
          const tailY = meteor.y - meteor.vy * 0.16;
          const trail = context.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          trail.addColorStop(0, `rgb(255 255 255 / ${(0.95 * fade).toFixed(3)})`);
          trail.addColorStop(0.3, `rgb(190 220 255 / ${(0.45 * fade).toFixed(3)})`);
          trail.addColorStop(1, "rgb(170 140 255 / 0)");
          context.strokeStyle = trail;
          context.lineWidth = 1.6;
          context.lineCap = "round";
          context.beginPath();
          context.moveTo(meteor.x, meteor.y);
          context.lineTo(tailX, tailY);
          context.stroke();
        }
      }
    };

    const tick = (now: number) => {
      frame = 0;
      if (document.hidden) return;
      draw(now);
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seed();
      last = performance.now();
      draw(last);
    };

    const onScrollStill = () => {
      if (!frame) frame = requestAnimationFrame((now) => {
        frame = 0;
        draw(now);
      });
    };
    const onVisible = () => {
      if (!document.hidden && !still && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    if (still) {
      // Stars still sit at their depths as the page scrolls, without any animation.
      window.addEventListener("scroll", onScrollStill, { passive: true });
    } else {
      document.addEventListener("visibilitychange", onVisible);
      frame = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScrollStill);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [still]);

  return (
    <div className="sw-sky" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
