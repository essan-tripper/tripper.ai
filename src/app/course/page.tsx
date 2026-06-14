"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const HERO_IMAGES = [
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384111/Kedarnath_mg8mev.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/badri_cgzxnb.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Jagannath_ths5zz.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/dwarka_tznnnm.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384109/Rameshwaram_zbtrll.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Yamunotri_w0upb1.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384108/gangotri_h5odhj.jpg",
];

const SHOWCASE_IMAGES = [
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391134/A_hyper-realistic_cinematic_map_202605292135_2_w2cyq9.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391129/A_hyper-realistic_cinematic_3D_map_202605292126_usqn1h.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391128/A_hyper-realistic_cinematic_vertical_map_202605292135_1_m5kb5s.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391126/A_hyper-realistic_cinematic_3D_vertical_202605292136_pcgwlx.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391124/A_hyper-realistic_cinematic_vertical_map_202605292128_1_vjxbry.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391124/A_hyper-realistic_cinematic_vertical_3D_202605292136_uxjdtu.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391122/A_hyper-realistic_cinematic_3D_map_202605292134_1_kvx2mu.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391120/A_hyper-realistic_cinematic_vertical_map_202605292134_1_o5p6kc.jpg",
  "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781391120/A_hyper-realistic_cinematic_vertical_map_202605292136_2_vn5alc.jpg",
];

const GOAL = 50;
const WAITLIST_KEY = "tripper_waitlist";

function getCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(WAITLIST_KEY) || "0", 10);
}

function setCount(n: number) {
  localStorage.setItem(WAITLIST_KEY, String(n));
}

export default function CoursePage() {
  const [count, setCountState] = useState(0);
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [alreadySigned, setAlreadySigned] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCountState(getCount());
    const timer = setTimeout(() => {
      document.querySelectorAll("#hero .reveal").forEach((el) => {
        el.classList.add("visible");
      });
    }, 150);

    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => observer.observe(el));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const progressPct = Math.min((count / GOAL) * 100, 100);
  const remaining = Math.max(GOAL - count, 0);
  const unlocked = count >= GOAL;

  function handleSignup() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      emailRef.current?.focus();
      return;
    }
    const signedKey = "tripper_signed_" + trimmed;
    if (localStorage.getItem(signedKey)) {
      setAlreadySigned(true);
      setSignedUp(true);
      return;
    }
    localStorage.setItem(signedKey, "1");
    const newCount = getCount() + 1;
    setCount(newCount);
    setCountState(newCount);
    setSignedUp(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSignup();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden font-[var(--font-inter)]">
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1),
                      transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes hero-wallpaper-cycle {
          0%   { opacity: 0;    transform: scale(1.22) translate3d(-1.5%, -1%, 0); }
          3%   { opacity: 0.55; transform: scale(1.12) translate3d(-0.8%, -0.5%, 0); }
          11%  { opacity: 0.55; transform: scale(1.02) translate3d(0.8%, 0.5%, 0); }
          14%  { opacity: 0;    transform: scale(0.97) translate3d(1.5%, 1%, 0); }
          100% { opacity: 0;    transform: scale(0.97) translate3d(1.5%, 1%, 0); }
        }

        @keyframes scroll-left {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }

        @keyframes chip-pulse {
          0%, 100% { box-shadow: 0 0 0 rgba(244,139,41,0); }
          50% { box-shadow: 0 0 14px rgba(244,139,41,0.18); }
        }

        .hero-wallpaper-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          filter: brightness(0.42) saturate(1.05);
          animation: hero-wallpaper-cycle 35s ease-in-out infinite;
          will-change: opacity, transform;
        }
        .hero-wallpaper-slide:nth-child(1) { animation-delay: 0s; }
        .hero-wallpaper-slide:nth-child(2) { animation-delay: -5s; }
        .hero-wallpaper-slide:nth-child(3) { animation-delay: -10s; }
        .hero-wallpaper-slide:nth-child(4) { animation-delay: -15s; }
        .hero-wallpaper-slide:nth-child(5) { animation-delay: -20s; }
        .hero-wallpaper-slide:nth-child(6) { animation-delay: -25s; }
        .hero-wallpaper-slide:nth-child(7) { animation-delay: -30s; }

        @media (prefers-reduced-motion: reduce) {
          .hero-wallpaper-slide { animation: none; opacity: 0; }
          .hero-wallpaper-slide:first-child { opacity: 0.4; }
        }

        .gallery-track {
          display: flex;
          gap: 20px;
          width: max-content;
          will-change: transform;
          animation: scroll-left var(--gallery-speed, 35s) linear infinite;
        }
        .gallery-row:hover .gallery-track {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .gallery-track { gap: 14px; --gallery-speed: 22s; }
        }

        .benefit-chip:nth-child(2) { animation-delay: -0.7s; }
        .benefit-chip:nth-child(3) { animation-delay: -1.4s; }
        .benefit-chip:nth-child(4) { animation-delay: -2.1s; }
        .benefit-chip:nth-child(5) { animation-delay: -2.8s; }
        .benefit-chip:nth-child(6) { animation-delay: -3.5s; }
      `}</style>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]"
      >
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {HERO_IMAGES.map((url, i) => (
            <div
              key={i}
              className="hero-wallpaper-slide"
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 65%, rgba(244,139,41,0.14) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 20%, rgba(34,34,34,0.6) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(17,17,17,0.5) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(rgba(232,228,240,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 max-w-[760px]">
          <h1
            className="reveal reveal-delay-1 text-white leading-[1.0] mb-3"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(48px, 8vw, 75px)",
              fontWeight: 300,
              lineHeight: 1.0,
            }}
          >
            Your travel page.<br />
            <em style={{ color: "#f48b29", fontStyle: "italic" }}>Built by you.</em>
            <br />
            Powered by AI.
          </h1>
          <p
            className="reveal reveal-delay-2 mb-12 leading-relaxed"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontSize: "clamp(17px, 2.2vw, 22px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(232,228,240,0.5)",
            }}
          >
            No photographer. No followers. No showing your face.
            <br />
            Just the right prompts and your page is ready before you know.
          </p>
          <div className="reveal reveal-delay-3 flex items-center justify-center gap-4 flex-wrap">
            <a
              href="#product"
              className="inline-flex items-center gap-2 bg-[#f48b29] text-white text-xs font-semibold tracking-[0.12em] uppercase px-9 py-4 rounded border-none cursor-pointer transition-all duration-250 no-underline hover:bg-[#d97706] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,139,41,0.3)]"
            >
              See the bundle ↓
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 bg-transparent text-[#e8e4f0] text-xs font-medium tracking-[0.12em] uppercase px-9 py-[15px] rounded border border-[rgba(232,228,240,0.2)] cursor-pointer transition-all duration-250 no-underline hover:border-[rgba(232,228,240,0.5)] hover:text-white"
            >
              Join waitlist
            </a>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section
        id="problem"
        className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 py-24 bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]"
      >
        <div className="max-w-[960px] w-full">
          <span className="reveal block text-[10px] font-semibold tracking-[0.3em] uppercase text-[#f48b29] mb-6">
            Why we are here?
          </span>
          <h2
            className="reveal reveal-delay-1 text-white mb-14 leading-[1.15]"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 300,
            }}
          >
            Most travel enthusiasts &amp; agencies<br />
            never build the page they imagined.
          </h2>
          <div
            className="reveal reveal-delay-2 grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-px rounded-lg overflow-hidden"
            style={{
              background: "rgba(34,34,34,0.5)",
              border: "1px solid rgba(232,228,240,0.12)",
            }}
          >
            {[
              { icon: "✍️", text: "Captions feel forced. You stare at a blank screen and give up." },
              { icon: "📸", text: "You don't have a professional camera or a photographer following you." },
              { icon: "🤷", text: "Showing your face feels uncomfortable. You'd rather let the places speak." },
              { icon: "🗓️", text: "You don't know what to post, when to post, or how to stay consistent." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] p-[30px_26px] transition-colors duration-300 hover:bg-[#222]"
              >
                <span className="block text-2xl mb-3.5">{item.icon}</span>
                <p className="text-sm text-[rgba(232,228,240,0.5)] leading-[1.65]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p
            className="reveal reveal-delay-3 mt-12 pt-8 border-t border-[rgba(232,228,240,0.12)]"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontSize: "clamp(22px, 3vw, 34px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#e8e4f0",
            }}
          >
            AI doesn't fix motivation.
            <br />
            But it removes <em style={{ color: "#f48b29", fontStyle: "normal" }}>every other excuse.</em>
          </p>
        </div>
      </section>

      {/* ── PRODUCT ── */}
      <section
        id="product"
        className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 py-24 bg-gradient-to-br from-[#0d0d0d] to-[#111]"
      >
        <div className="max-w-[960px] w-full">
          <div className="reveal mb-14">
            <span className="block text-[10px] font-semibold tracking-[0.3em] uppercase text-[#f48b29] mb-6">
              How we can help you?
            </span>
            <h2
              className="text-white leading-[1.05]"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(40px, 6vw, 70px)",
                fontWeight: 300,
              }}
            >
              Master<br />
              <span style={{ color: "#f48b29", fontStyle: "italic", display: "block" }}>Prompt Bundle</span>
            </h2>
            <span className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[rgba(232,228,240,0.5)] mt-3.5">
              From Kashmir to Kanyakumari · All tourist destinations covered
            </span>
          </div>

          {/* REEL SHOWCASE HEADER */}
          <div className="reveal reveal-delay-1 mb-[36px] max-w-[640px]" style={{ marginTop: "8px" }}>
            <div className="inline-flex items-center gap-2 bg-[rgba(244,139,41,0.15)] border border-[rgba(244,139,41,0.3)] px-4 py-1.5 rounded-full mb-5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#f48b29]"
                style={{ animation: "pulse 2s infinite" }}
              />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#f48b29]">
                9 Viral Travel Reels Included
              </span>
            </div>
            <h3
              className="text-white leading-[1.1] mb-3.5"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "clamp(30px, 4.2vw, 50px)",
                fontWeight: 300,
              }}
            >
              Reel <em style={{ color: "#f48b29", fontStyle: "italic" }}>Showcase</em>
            </h3>
            <p className="text-sm text-[rgba(232,228,240,0.5)] leading-[1.8] max-w-[540px]">
              Every reel, carousel and destination visual on Tripper.ai was generated using prompts from this bundle.
            </p>
          </div>

          {/* CINEMATIC GALLERY */}
          <div
            className="reveal reveal-delay-2 mb-16"
            style={{
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
              maskImage: "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
            }}
          >
            <div className="gallery-row overflow-hidden w-full">
              <div className="gallery-track">
                {SHOWCASE_IMAGES.concat(SHOWCASE_IMAGES).map((url, i) => (
                  <div
                    key={i}
                    className="relative flex-shrink-0 w-[300px] h-[400px] rounded-[20px] overflow-hidden border border-[rgba(232,228,240,0.12)]"
                    style={{
                      background: "rgba(17,17,17,0.45)",
                      backdropFilter: "blur(6px)",
                      boxShadow:
                        "0 10px 40px rgba(0,0,0,.35), 0 0 30px rgba(244,139,41,.15)",
                      transition:
                        "transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget;
                      card.style.transform = "translateY(-10px) scale(1.035)";
                      card.style.boxShadow =
                        "0 22px 60px rgba(0,0,0,.45), 0 0 50px rgba(244,139,41,.3)";
                      const img = card.querySelector("img");
                      if (img) {
                        img.style.filter = "brightness(1.05)";
                        img.style.transform = "scale(1.06)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;
                      card.style.transform = "";
                      card.style.boxShadow = "";
                      const img = card.querySelector("img");
                      if (img) {
                        img.style.filter = "";
                        img.style.transform = "";
                      }
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(160deg, rgba(13,27,62,0.35) 0%, transparent 45%, rgba(244,139,41,0.16) 100%)",
                      }}
                    />
                    <Image
                      src={url}
                      alt={`Tripper.ai cinematic travel showcase visual ${(i % SHOWCASE_IMAGES.length) + 1}`}
                      width={300}
                      height={400}
                      unoptimized
                      draggable={false}
                      className="w-full h-full object-cover block brightness-[0.82] select-none"
                      style={{
                        transition:
                          "filter 0.45s ease, transform 0.45s cubic-bezier(0.4,0,0.2,1)",
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT BENEFITS */}
          <div className="reveal reveal-delay-3 mb-16">
            <h3
              className="text-white mb-[22px]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(22px, 3vw, 32px)",
              }}
            >
              What you'll create with this bundle
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {["Viral Reels", "Destination Carousels", "Story Packs", "Travel Maps", "AI Cinematic Posters", "Faceless Travel Content"].map(
                (label, i) => (
                  <span
                    key={i}
                    className={`benefit-chip chip text-[11px] text-[rgba(232,228,240,0.5)] border border-[rgba(232,228,240,0.12)] px-[18px] py-[7px] rounded-full tracking-[0.05em] bg-[rgba(17,17,17,0.5)] transition-all duration-200 hover:border-[#f48b29] hover:text-[#f48b29] hover:shadow-[0_8px_24px_rgba(244,139,41,0.2)] hover:-translate-y-[3px]`}
                    style={{
                      animation: "chip-pulse 4s ease-in-out infinite",
                      animationDelay: `${-i * 0.7}s`,
                    }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* FEATURES LIST */}
          <div className="flex flex-col gap-0">
            {[
              { num: "01", name: "Carousel + Caption prompts for any destination", desc: "Cinematic, travel-coded, ready to post" },
              { num: "02", name: "Viral Reel Starter", desc: "Hook → story → CTA, edit in 10 minutes" },
              { num: "03", name: "Story + Highlights prompt", desc: "Keep your audience coming back every day" },
              { num: "04", name: "Bio + Profile cover prompt", desc: "Build your page identity from day one" },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal ${[null, "reveal-delay-1", "reveal-delay-2", "reveal-delay-3"][i]} feature-row group flex items-start gap-6 py-[26px] border-b border-[rgba(232,228,240,0.12)] first:border-t transition-all duration-200 hover:pl-2`}
              >
                <span className="text-[10px] font-semibold tracking-[0.1em] text-[#f48b29] min-w-[24px] pt-1">
                  {item.num}
                </span>
                <span
                  className="flex-1 text-[22px] font-normal text-[#e8e4f0] transition-colors duration-200 group-hover:text-white"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {item.name}
                </span>
                <span className="text-[13px] text-[rgba(232,228,240,0.5)] max-w-[260px] text-right max-sm:text-left max-sm:max-w-full">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          {/* BUY ROW */}
          <div className="reveal mt-[52px] flex items-center gap-7 flex-wrap max-sm:flex-col max-sm:items-start">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[#f48b29] text-white text-xs font-semibold tracking-[0.12em] uppercase px-9 py-4 rounded border-none cursor-pointer transition-all duration-250 no-underline hover:bg-[#d97706] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,139,41,0.3)]"
            >
              Buy now →
            </a>
            <span className="text-xs text-[rgba(232,228,240,0.5)] italic">
              One purchase · Lifetime access · Works for any niche
            </span>
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section
        id="waitlist"
        className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 py-24 overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d]"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(244,139,41,0.09) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-[640px] w-full relative z-10 text-center">
          <span className="reveal block text-[10px] font-semibold tracking-[0.3em] uppercase text-[#f48b29] mb-6">
            Join the waitlist
          </span>
          <h2
            className="reveal reveal-delay-1 text-white leading-[1.1] mb-4"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 300,
            }}
          >
            Be here when<br />
            it opens.
          </h2>
          <p className="reveal reveal-delay-2 text-sm text-[rgba(232,228,240,0.5)] mb-12 leading-[1.8]">
            The bundle is almost ready. Join the waitlist and get early access —
            <br />
            and when we hit <strong className="text-[#f48b29] font-medium">50 signups</strong>, we're hosting a free live masterclass
            <br />
            exclusively for early members.
          </p>

          {/* PROGRESS */}
          <div className="reveal reveal-delay-2 mb-12">
            <div className="flex justify-between text-[11px] tracking-[0.1em] uppercase text-[rgba(232,228,240,0.5)] mb-2.5">
              <span>
                <span className="text-[#e8e4f0] font-medium">{count}</span> joined
              </span>
              <span>50 to unlock masterclass</span>
            </div>
            <div className="h-1 bg-[rgba(232,228,240,0.12)] rounded overflow-hidden">
              <div
                className="h-full rounded relative transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #f48b29, #f97316)",
                }}
              >
                <div
                  className="absolute right-0 -top-[2px] w-2 h-2 rounded-full"
                  style={{
                    background: "#f97316",
                    boxShadow: "0 0 8px rgba(249,115,22,0.8)",
                  }}
                />
              </div>
            </div>
            <p
              className={`mt-2.5 text-[11px] text-[#f48b29] italic transition-opacity duration-300 ${
                unlocked ? "opacity-100" : "opacity-0"
              }`}
            >
              🎉 Masterclass unlocked! Sunday session confirmed.
            </p>
          </div>

          {/* SUCCESS */}
          {signedUp && (
            <div className="reveal visible mb-5 px-6 py-[18px] bg-[rgba(244,139,41,0.12)] border border-[rgba(244,139,41,0.3)] rounded-md text-sm text-[#e8e4f0]">
              {alreadySigned
                ? "You're already on the list. We'll be in touch. ✦"
                : "You're on the list. We'll reach out the moment it opens. ✦"}
            </div>
          )}

          {/* EMAIL FORM */}
          {!signedUp && (
            <>
              <div className="reveal reveal-delay-3 flex max-sm:flex-col max-w-[480px] mx-auto mb-4">
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="your@email.com"
                  className="flex-1 bg-[rgba(17,17,17,0.8)] border border-[rgba(232,228,240,0.15)] border-r-0 max-sm:border-r max-sm:border-b-0 px-5 py-[15px] text-sm text-[#e8e4f0] font-[var(--font-inter)] font-light outline-none rounded-l max-sm:rounded-tl max-sm:rounded-tr max-sm:rounded-bl-none focus:border-[rgba(244,139,41,0.5)] transition-colors duration-200 placeholder:text-[rgba(232,228,240,0.25)]"
                />
                <button
                  onClick={handleSignup}
                  className="bg-[#f48b29] text-white border border-[#f48b29] px-[26px] py-[15px] text-[11px] font-semibold tracking-[0.15em] uppercase cursor-pointer font-[var(--font-inter)] whitespace-nowrap rounded-r max-sm:rounded-br max-sm:rounded-bl max-sm:rounded-tr-none transition-colors duration-200 hover:bg-[#d97706]"
                >
                  Join waitlist
                </button>
              </div>
              <p className="reveal reveal-delay-4 text-[11px] text-[rgba(232,228,240,0.5)]">
                No spam. Just one email when the bundle drops.
              </p>
            </>
          )}

          {/* MASTERCLASS CARD */}
          <div className="reveal mt-[60px] p-[32px_36px] bg-[#1a1a1a] border border-[rgba(232,228,240,0.12)] rounded-lg text-left border-l-[3px] border-l-[#f48b29]">
            <p className="text-[9px] font-semibold tracking-[0.28em] uppercase text-[#f48b29] mb-3">
              Bonus · Sunday Masterclass
            </p>
            <h3
              className="text-[26px] font-light text-white mb-2"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Build your travel page live — with us.
            </h3>
            <p className="text-[13px] text-[rgba(232,228,240,0.5)] leading-[1.75]">
              When 50 people join, we host a free live session on how to build a complete, faceless
              travel Instagram page from scratch using AI. Prompts, tools, workflow — everything
              we used to build Tripper.ai.
            </p>
            <p
              className="mt-4 text-xs"
              style={{
                color: unlocked ? "#f48b29" : "#f48b29",
                fontStyle: "italic",
              }}
            >
              {unlocked
                ? "🎉 Masterclass unlocked — Sunday session confirmed!"
                : `Unlocks at 50 signups · ${remaining} spots to go`}
            </p>
          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section
        id="proof"
        className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 py-24 bg-gradient-to-br from-[#0d0d0d] to-[#111]"
      >
        <div className="max-w-[960px] w-full">
          <span className="reveal block text-[10px] font-semibold tracking-[0.3em] uppercase text-[#f48b29] mb-6">
            We are spilling our secret sauce
          </span>
          <p
            className="reveal reveal-delay-1 leading-[1.35] mb-6"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontSize: "clamp(26px, 4vw, 46px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#e8e4f0",
            }}
          >
            &ldquo;The entire page of Tripper.ai — every image, every reel,
            everything — was built using the prompts from
            <em style={{ color: "#f48b29", fontStyle: "normal" }}> the bundle you're about to get.</em>&rdquo;
          </p>
          <p className="reveal reveal-delay-2 text-xs text-[rgba(232,228,240,0.5)] tracking-[0.1em]">
            — Essan, founder ·
            <a
              href="https://www.instagram.com/tripper.ai/"
              target="_blank"
              className="text-[#f48b29] no-underline ml-1"
            >
              @tripper.ai
            </a>
          </p>
          <div className="reveal reveal-delay-3 flex flex-wrap gap-2 mt-11">
            {["No face shown", "No photography budget", "No agency", "No prior followers", "Just prompts + patience"].map(
              (label, i) => (
                <span
                  key={i}
                  className="text-[11px] text-[rgba(232,228,240,0.5)] border border-[rgba(232,228,240,0.12)] px-[18px] py-[7px] rounded-full tracking-[0.05em] bg-[rgba(17,17,17,0.5)] transition-all duration-200 hover:border-[#f48b29] hover:text-[#f48b29]"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
