'use client'

import { useEffect } from 'react'

const saffron = '#c9793a'
const ink = '#0c0c0d'
const paper = '#f2ece0'
const rust = '#5e2419'
const ash = '#ddd2bf'
const gold = '#cda86a'
const smoke = '#8d8579'

export default function AboutUsPage() {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add('visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    )
    revealEls.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f2ece0] font-[var(--font-inter)] text-[#0c0c0d] antialiased">
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 1s cubic-bezier(.22,.61,.36,1), transform 1.1s cubic-bezier(.22,.61,.36,1);
          will-change: opacity, transform;
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: .06s; }
        .d2 { transition-delay: .14s; }
        .d3 { transition-delay: .22s; }
        .d4 { transition-delay: .30s; }
        .d5 { transition-delay: .38s; }
        .d6 { transition-delay: .46s; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: translateY(0); transition: none; }
        }
        ::selection { background: ${saffron}; color: ${ink}; }
      `}</style>

      {/* ==================== HERO ==================== */}
      <section className="relative flex min-h-screen flex-col justify-center bg-[#0c0c0d] text-[#f2ece0] overflow-hidden">
        <div
          className="absolute inset-0 -z-0"
          style={{
            background: `
              radial-gradient(ellipse at 70% 18%, rgba(201,121,58,.22), transparent 45%),
              radial-gradient(ellipse at 18% 85%, rgba(94,36,25,.35), transparent 50%),
              linear-gradient(180deg, #050505 0%, #0c0c0d 55%, #100d0c 100%)
            `,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[.22]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
            }}
          />
        </div>
        <div className="relative z-[2] mx-auto w-full max-w-[1180px] px-[8vw]">
          <p className="text-[.72rem] font-semibold tracking-[.32em] uppercase opacity-60 text-[#ddd2bf] reveal visible">
            Not a company. Not a travel agency.
          </p>
          <h1 className="font-[var(--font-playfair)] font-semibold leading-[.98] tracking-[-.01em] my-[.5em] mb-[.6em]"
            style={{ fontSize: 'clamp(3.6rem, 11vw, 9.5rem)' }}>
            We Are{' '}
            <em className="italic font-medium not-italic" style={{ color: saffron }}>
              Storytellers.
            </em>
          </h1>
          <div className="font-[var(--font-instrument-serif)] italic" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)', color: ash, maxWidth: '36ch', lineHeight: 1.55 }}>
            <p className="reveal visible d1">Just other human beings, like you.</p>
            <p className="mt-[.6em] not-italic reveal visible d2">
              <span className="inline-block font-[var(--font-inter)] not-italic text-[.78rem] tracking-[.22em] uppercase mr-[1.4em]" style={{ color: saffron }}>Travelers</span>
              <span className="inline-block font-[var(--font-inter)] not-italic text-[.78rem] tracking-[.22em] uppercase mr-[1.4em]" style={{ color: saffron }}>Explorers</span>
              <span className="inline-block font-[var(--font-inter)] not-italic text-[.78rem] tracking-[.22em] uppercase mr-[1.4em]" style={{ color: saffron }}>Seekers</span>
            </p>
            <p className="mt-[.2em] not-italic reveal visible d2">
              <span className="inline-block font-[var(--font-inter)] not-italic text-[.78rem] tracking-[.22em] uppercase" style={{ color: saffron }}>Followers of Shiva</span>
            </p>
            <p className="mt-[1.4em] reveal visible d3">
              We believe every journey has a destination.<br />And every destination has a story waiting to be told.
            </p>
          </div>
        </div>
        <div className="absolute left-[8vw] bottom-[42px] z-[2] flex items-center gap-[.8em] text-[.7rem] tracking-[.3em] uppercase opacity-60" style={{ color: ash }}>
          <div
            className="w-[1px]"
            style={{
              height: '38px',
              background: `linear-gradient(${ash}, transparent)`,
              animation: 'stem 2.4s ease-in-out infinite',
            }}
          />
          <span>Scroll</span>
        </div>
      </section>

      {/* ==================== THE BEGINNING ==================== */}
      <section className="py-[9rem] pb-[8rem] bg-[#f2ece0] text-[#0c0c0d]">
        <div className="mx-auto w-full max-w-[1180px] px-[8vw]">
          <div className="grid grid-cols-[.9fr_1.1fr] gap-[5vw] items-start max-md:grid-cols-1 max-md:gap-[3rem]">
            <div className="relative rounded-[2px] overflow-hidden reveal d1"
              style={{
                aspectRatio: '4/5',
                background: 'linear-gradient(135deg, #2b2520, #15110f 55%, #3a2c22)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[.5]"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
                }}
              />
              <div className="absolute left-[18px] bottom-[16px] right-[18px] flex justify-between items-baseline text-[.66rem] tracking-[.18em] uppercase font-medium text-[rgba(242,236,224,.75)]">
                <span>Archive — 001</span>
                <span className="font-[var(--font-instrument-serif)] italic tracking-[0] uppercase-normal text-[.78rem] opacity-[.85]">The first frame</span>
              </div>
            </div>
            <div>
              <p className="text-[.72rem] font-semibold tracking-[.32em] uppercase opacity-60 reveal">Chapter One</p>
              <h2 className="font-[var(--font-playfair)] font-semibold leading-[1.05] mt-[.4em] mb-[1em]"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>
                How It All Started
              </h2>
              <p className="font-[var(--font-instrument-serif)] italic max-w-[46ch] mb-[1.1em]"
                style={{ fontSize: '1.35rem', color: ink }}>
                What began as a simple Instagram page was never meant to become a business.
              </p>
              <p className="max-w-[46ch] mb-[1.1em] text-[#3a352f] text-[1.02rem] reveal d2">
                The idea was simple. Travel across India. Visit its most sacred places. Document everything. And share information that would make pilgrimage and travel easier for everyone.
              </p>
              <p className="max-w-[46ch] mb-[1.1em] text-[#3a352f] text-[1.02rem] reveal d3">
                We noticed that planning journeys to many of India's most revered spiritual destinations often required hours of scattered research — so we started collecting everything in one place.
              </p>
              <p className="max-w-[46ch] mb-[1.1em] text-[#3a352f] text-[1.02rem] reveal d3">
                What started as a passion project slowly grew into a community. And with that community came a larger vision.
              </p>
              <div className="flex flex-wrap gap-[.6em_1em] mt-[1.6em] pt-[1.6em] border-t border-[rgba(12,12,13,0.12)] reveal d4">
                <span className="font-[var(--font-instrument-serif)] italic text-[1.05rem] px-[.9em] py-[.3em] border border-[rgba(12,12,13,0.12)] rounded-full" style={{ color: '#74301f' }}>Routes</span>
                <span className="font-[var(--font-instrument-serif)] italic text-[1.05rem] px-[.9em] py-[.3em] border border-[rgba(12,12,13,0.12)] rounded-full" style={{ color: '#74301f' }}>Experiences</span>
                <span className="font-[var(--font-instrument-serif)] italic text-[1.05rem] px-[.9em] py-[.3em] border border-[rgba(12,12,13,0.12)] rounded-full" style={{ color: '#74301f' }}>Travel tips</span>
                <span className="font-[var(--font-instrument-serif)] italic text-[1.05rem] px-[.9em] py-[.3em] border border-[rgba(12,12,13,0.12)] rounded-full" style={{ color: '#74301f' }}>Local insights</span>
                <span className="font-[var(--font-instrument-serif)] italic text-[1.05rem] px-[.9em] py-[.3em] border border-[rgba(12,12,13,0.12)] rounded-full" style={{ color: '#74301f' }}>Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="flex items-center justify-center h-[1px] w-full">
        <div className="h-[1px] w-full bg-[rgba(12,12,13,0.12)]" />
        <div
          className="absolute w-[7px] h-[7px] rounded-full rotate-45"
          style={{ background: saffron, boxShadow: `0 0 0 6px ${paper}` }}
        />
      </div>

      {/* ==================== THE MISSION ==================== */}
      <section className="min-h-[92vh] flex flex-col justify-center bg-[#0c0c0d] text-[#f2ece0] py-[7rem]">
        <div className="mx-auto w-full max-w-[1180px] px-[8vw]">
          <p className="text-[.72rem] font-semibold tracking-[.32em] uppercase mb-[1.4em] reveal" style={{ color: saffron }}>
            Chapter Two — The Mission
          </p>
          <h2 className="font-[var(--font-playfair)] font-semibold leading-[1.06] max-w-[16ch] reveal d1"
            style={{ fontSize: 'clamp(2.6rem, 8vw, 6.4rem)' }}>
            To{' '}
            <span className="italic font-medium" style={{ color: saffron }}>
              simplify
            </span>{' '}
            travel for the masses.
          </h2>
          <div className="mt-[2.6rem] max-w-[46ch]">
            <p className="font-[var(--font-instrument-serif)] italic reveal d2" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.55rem)', color: ash }}>
              Travel should not feel complicated.
            </p>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.35em] reveal d3" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.55rem)', color: ash }}>
              Pilgrimages should not feel inaccessible.
            </p>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.35em] reveal d4" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.55rem)', color: ash }}>
              Ancient wisdom should not be hidden behind confusing information.
            </p>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.35em] reveal d5" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.55rem)', color: ash }}>
              <strong className="font-medium not-italic text-[#f2ece0]">
                To make travel easier. To make sacred journeys accessible. And to inspire more people to step out into the world
              </strong>{' '}
              — whether it's a weekend trek, a pilgrimage to a Jyotirlinga, or a life-changing expedition across the country.
            </p>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.35em] reveal d6" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.55rem)', color: ash }}>
              Every journey deserves clarity.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== THE FUTURE ==================== */}
      <section className="py-[8rem] bg-[#f2ece0]">
        <div className="mx-auto w-full max-w-[1180px] px-[8vw]">
          <p className="text-[.72rem] font-semibold tracking-[.32em] uppercase reveal" style={{ color: '#74301f' }}>
            Chapter Three
          </p>
          <h2 className="font-[var(--font-playfair)] font-semibold mt-[.4em] mb-[1.4em] reveal d1"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
            Where We Are Going
          </h2>
          <p className="max-w-[58ch] text-[#3a352f] text-[1.04rem] mb-[3.5rem] reveal d2">
            Today we are building more than content — we are building experiences. Our merchandise and souvenirs are small experiments today, but tomorrow they may help fund the journeys ahead.
          </p>

          <div className="grid grid-cols-3 max-md:grid-cols-1 border-t border-[rgba(12,12,13,0.12)] max-md:border-t-0">
            <div className="py-[2.4rem] pr-[2rem] border-r border-[rgba(12,12,13,0.12)] max-md:py-[2rem] max-md:pr-0 max-md:border-r-0 max-md:border-t max-md:border-[rgba(12,12,13,0.12)] reveal d2">
              <svg className="w-[34px] h-[34px] mb-[1.6rem]" viewBox="0 0 34 34" fill="none" stroke="#5e2419" strokeWidth="1.2">
                <path d="M17 3 L29 17 L17 31 L5 17 Z" />
                <circle cx="17" cy="17" r="3" />
              </svg>
              <h3 className="font-[var(--font-instrument-serif)] italic font-medium text-[1.45rem] mb-[.6em]" style={{ color: '#74301f' }}>
                Group Journeys
              </h3>
              <p className="text-[.97rem] max-w-[30ch] text-[#4a443c]">
                We hope to organize collective expeditions — pilgrimages and treks travelled together, not just documented alone.
              </p>
            </div>
            <div className="py-[2.4rem] pr-[2rem] border-r border-[rgba(12,12,13,0.12)] max-md:py-[2rem] max-md:pr-0 max-md:border-r-0 max-md:border-t max-md:border-[rgba(12,12,13,0.12)] reveal d3">
              <svg className="w-[34px] h-[34px] mb-[1.6rem]" viewBox="0 0 34 34" fill="none" stroke="#5e2419" strokeWidth="1.2">
                <circle cx="17" cy="17" r="13" />
                <path d="M4 17 H30 M17 4 V30" />
              </svg>
              <h3 className="font-[var(--font-instrument-serif)] italic font-medium text-[1.45rem] mb-[.6em]" style={{ color: '#74301f' }}>
                Partners &amp; Sponsors
              </h3>
              <p className="text-[.97rem] max-w-[30ch] text-[#4a443c]">
                We are actively looking for partners who believe in this vision — to help carry it further, together.
              </p>
            </div>
            <div className="py-[2.4rem] pr-[2rem] max-md:py-[2rem] max-md:pr-0 max-md:border-t max-md:border-[rgba(12,12,13,0.12)] reveal d4">
              <svg className="w-[34px] h-[34px] mb-[1.6rem]" viewBox="0 0 34 34" fill="none" stroke="#5e2419" strokeWidth="1.2">
                <rect x="6" y="6" width="22" height="22" rx="1" />
                <path d="M6 13 H28 M13 6 V28" />
              </svg>
              <h3 className="font-[var(--font-instrument-serif)] italic font-medium text-[1.45rem] mb-[.6em]" style={{ color: '#74301f' }}>
                Documentaries &amp; Trips
              </h3>
              <p className="text-[.97rem] max-w-[30ch] text-[#4a443c]">
                Every step forward — merchandise, partnerships, community support — helps fund documentaries and journeys that bring people together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SHIVA'S JOURNAL ==================== */}
      <section className="relative py-[9rem] pb-[10rem] bg-[#5e2419] text-[#f2ece0] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 47px, rgba(205,168,106,.16) 48px)',
            maskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
          }}
        />
        <div className="absolute top-0 bottom-0 left-[calc(8vw+92px)] w-[1px] z-0 bg-[rgba(205,168,106,.28)] max-md:hidden" />
        <div className="mx-auto w-full max-w-[1180px] px-[8vw]">
          <div className="relative z-[1] max-w-[760px]">
            <p className="text-[.72rem] font-semibold tracking-[.32em] uppercase reveal" style={{ color: gold }}>
              A Project Close To Us
            </p>
            <h2 className="font-[var(--font-playfair)] italic font-medium mt-[.35em] mb-[1.1em] text-[#f2ece0] reveal d1"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
              Shiva's Journal
            </h2>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.9em] max-w-[52ch] reveal d2"
              style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.5rem)', color: ash }}>
              Among everything we create, this project holds a special place in our hearts. We hope, one day, it becomes an international bestseller —
            </p>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.9em] max-w-[52ch] reveal d3"
              style={{ fontSize: 'clamp(1.25rem, 2.1vw, 1.7rem)', color: gold }}>
              not because it is our book, but because it is your story.
            </p>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.9em] max-w-[52ch] reveal d4"
              style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.5rem)', color: ash }}>
              Every page inside it is an invitation. To pause. To reflect. To write. To observe your own journey.
            </p>
            <p className="font-[var(--font-instrument-serif)] italic mb-[.9em] max-w-[52ch] reveal d5"
              style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.5rem)', color: ash }}>
              Thousands of people today are searching for peace, purpose and clarity. We genuinely believe that if someone commits to filling every page with honesty and intention, it can become one of the most transformative journeys of their life.
            </p>
            <div className="mt-[1.6em] mb-[.9em] reveal d6">
              <p className="font-[var(--font-instrument-serif)] italic mb-[.35em]" style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.5rem)', color: 'rgba(242,236,224,.45)', textDecoration: 'line-through', textDecorationColor: 'rgba(205,168,106,.35)' }}>
                Not through motivation.
              </p>
              <p className="font-[var(--font-instrument-serif)] italic mb-[.35em]" style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.5rem)', color: 'rgba(242,236,224,.45)', textDecoration: 'line-through', textDecorationColor: 'rgba(205,168,106,.35)' }}>
                Not through productivity.
              </p>
              <p className="font-[var(--font-instrument-serif)] italic font-medium" style={{ fontSize: 'clamp(1.1rem, 1.9vw, 1.5rem)', color: gold }}>
                But through awareness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE TWO JOURNEYS ==================== */}
      <section className="relative min-h-screen flex items-center justify-center text-center bg-[#0c0c0d] text-[#f2ece0] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full z-0 opacity-[.5]" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,300 C300,300 380,300 500,300" stroke="rgba(242,236,224,.18)" strokeWidth="1" fill="none" />
          <path d="M500,300 C620,300 720,90 1000,60" stroke="rgba(242,236,224,.18)" strokeWidth="1" fill="none" />
          <path d="M500,300 C620,300 720,510 1000,540" stroke="#c9793a" strokeWidth="1.2" fill="none" opacity=".55" />
        </svg>
        <div className="relative z-[1] px-[8vw]">
          <p className="font-[var(--font-instrument-serif)] italic reveal"
            style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.9rem)', color: smoke }}>
            Remember...
          </p>
          <h2 className="font-[var(--font-playfair)] font-semibold leading-[1.18] mb-[1.2em] reveal d1"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.6rem)' }}>
            There are two journeys in life —<br />
            <span className="not-italic">the one across the world,</span><br />
            <span className="italic font-medium font-[var(--font-instrument-serif)]" style={{ color: saffron }}>and the one within.</span>
          </h2>
          <p className="reveal d2" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', color: smoke }}>
            Most people spend their lives chasing the first. The fortunate few discover the second.
          </p>
          <p className="font-[var(--font-instrument-serif)] italic mt-[1.4em] reveal d3"
            style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.9rem)', color: ash }}>
            And those who embrace both experience life in its fullest form.
          </p>
        </div>
      </section>

      {/* ==================== FINALE ==================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center bg-[#0c0c0d] text-[#f2ece0] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 110%, rgba(201,121,58,.16), transparent 55%), linear-gradient(180deg, #0c0c0d 0%, #050505 100%)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[.18]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
            }}
          />
        </div>
        <div className="relative z-[1] px-[8vw] max-w-[760px]">
          <p className="text-[.72rem] font-semibold tracking-[.32em] uppercase mb-[1.4em] reveal" style={{ color: saffron }}>
            For Now
          </p>
          <h2 className="font-[var(--font-playfair)] font-semibold mb-[1em] reveal d1"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5.6rem)' }}>
            The Story Continues...
          </h2>
          <p className="font-[var(--font-instrument-serif)] italic mb-[.6em] reveal d2" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', color: ash }}>
            Whether you follow our travels, join our future expeditions, read Shiva's Journal, or simply find inspiration through a single post —
          </p>
          <p className="font-[var(--font-instrument-serif)] italic mb-[.6em] reveal d3" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', color: ash }}>
            thank you for being part of this journey.
          </p>
          <p className="font-[var(--font-instrument-serif)] italic mb-[.6em] reveal d4" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', color: ash }}>
            We are still writing the story. And perhaps, somewhere along the way, our paths will cross.
          </p>
          <div className="mt-[3rem] font-[var(--font-instrument-serif)] italic tracking-[.04em] reveal d5" style={{ fontSize: '1.3rem', color: saffron }}>
            — Team Tripपर
            <small className="block font-[var(--font-inter)] not-italic text-[.66rem] tracking-[.32em] uppercase mt-[.8em]" style={{ color: smoke }}>
              Founded by Essan · India
            </small>
          </div>
        </div>
      </section>
    </main>
  )
}
