"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "dark" | "light";

const MusicIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
    <path
      d="M10 18a2.5 2.5 0 1 1-1.8-2.4V5.7c0-.8.6-1.5 1.4-1.6l8-1.2c1-.1 1.9.6 1.9 1.6V15a2.5 2.5 0 1 1-1.8-2.4V7.1l-7.7 1.2v7.2A2.5 2.5 0 0 1 10 18Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const CrescentIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M16.8 2.4c-1.1 2.1-1.4 4.7-.7 7.2 1.3 4.7-1.4 9.6-6.2 10.9-2.5.7-5.1.3-7.2-.8 1.7 2.6 4.6 4.3 8 4.3 5.3 0 9.6-4.3 9.6-9.6 0-3.4-1.7-6.4-4.3-8z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M17.7 6.8l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z"
      fill="currentColor"
      opacity="0.8"
    />
  </svg>
);

const SunSparkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M19.8 4.2l-1.6 1.6M5.8 18.2l-1.6 1.6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.9"
    />
  </svg>
);

// Debug mode instrumentation (disabled for production).
// Keeping a no-op here preserves call sites safely without runtime cost.
const debugLog = (..._args: unknown[]) => {};

const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored =
      (typeof window !== "undefined" &&
        (window.localStorage.getItem("eid-theme") as Theme | null)) ||
      null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("eid-theme", next);
      }
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return [theme, toggle];
};

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    const stars: {
      x: number;
      y: number;
      radius: number;
      twinkle: number;
      speed: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createStars = (count: number) => {
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.9,
          radius: Math.random() * 1.2 + 0.2,
          twinkle: Math.random(),
          speed: 0.1 + Math.random() * 0.15
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const grd = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
      grd.addColorStop(0, "#020617");
      grd.addColorStop(1, "#020617");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.twinkle += 0.02;
        star.y += star.speed;
        if (star.y > window.innerHeight * 0.9) star.y = 0;
        const alpha = 0.3 + Math.sin(star.twinkle) * 0.7;
        ctx.beginPath();
        ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      animationFrame = requestAnimationFrame(render);
    };

    resize();
    createStars(140);
    render();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full geo-mask"
      aria-hidden="true"
    />
  );
};

const Fireworks = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="pointer-events-none absolute h-40 w-40 animate-firework-burst rounded-full border border-amber-300/70 bg-gradient-to-tr from-amber-300/70 via-pink-400/60 to-sky-400/70 blur-sm"
          style={{
            top: `${15 + idx * 12}%`,
            left: `${12 + idx * 16}%`,
            animationDelay: `${idx * 0.12}s`
          }}
        />
      ))}
    </div>
  );
};

const EidPage = () => {
  const [theme, toggleTheme] = useTheme();
  const [name, setName] = useState("");
  const [displayedName, setDisplayedName] = useState<string | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Lock scroll while intro cinematic is visible.
    const root = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = root.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    if (showIntro) {
      root.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      root.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    }
    return () => {
      root.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [showIntro]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playMusic) {
      const a = audioRef.current;
      a.muted = false;
      a.volume = 0.6;
      setAudioNotice(null);
      a.load();
      a.play()
        .catch((err) => {
          setPlayMusic(false);
          setAudioNotice(
            "Audio blocked or unavailable. Try toggling again, or check your browser sound settings."
          );
        });
    } else {
      const a = audioRef.current;
      a.pause();
    }
  }, [playMusic]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setDisplayedName(name.trim());
    setShowGreeting(false);
    requestAnimationFrame(() => setShowGreeting(true));
  };

  return (
    <main
      ref={mainRef}
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${
        theme === "dark"
          ? "bg-night-900 text-slate-100"
          : "bg-gradient-to-b from-amber-50 via-slate-50 to-emerald-50 text-slate-900"
      }`}
    >
      {theme === "dark" ? <StarField /> : null}
      <div className={`noise-overlay ${theme === "light" ? "opacity-[0.02]" : ""}`} />

      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-transparent dark:opacity-100 opacity-0 transition-opacity duration-700" />

      {showIntro ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Eid Mubarak welcome"
        >
          <div
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-2xl dark:bg-slate-950/75"
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl dark:bg-white/5">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-liquid-gold opacity-80 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-500/25 blur-3xl" />
            <div className="relative space-y-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200/90">
                A little moment of light
              </p>
              <h1 className="calligraphy font-display text-4xl text-slate-50 md:text-5xl">
                Eid Mubarak
              </h1>
              <p className="mx-auto max-w-md text-sm text-slate-200/90">
                May your heart feel lighter than lanterns, and your home glow with
                mercy, laughter, and gratitude.
              </p>
              <div className="mx-auto max-w-md pt-2">
                <button
                  type="button"
                  onClick={() => setShowIntro(false)}
                  className="w-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition-transform hover:scale-[1.01]"
                >
                  Click to continue
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/75 px-5 py-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo/logo.png"
              alt="MECC Eid"
              className="h-9 w-9 rounded-2xl object-contain"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700/80 dark:text-emerald-300/80">
                Festive Eid Card
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setPlayMusic((p) => !p)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-all ${
                playMusic
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-900 shadow-emerald-500/20 dark:border-emerald-400/70 dark:bg-emerald-500/20 dark:text-emerald-100"
                  : "border-slate-300 bg-white/70 text-slate-800 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200"
              }`}
            >
              <MusicIcon className="h-4 w-4" />
              <span>{playMusic ? "Pause ambience" : "Play ambience"}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle day and night mode"
              className="group relative flex h-9 w-[72px] items-center rounded-full border border-slate-300 bg-white/70 px-1.5 shadow-inner shadow-slate-900/10 transition-colors dark:border-slate-600/80 dark:bg-slate-900/80 dark:shadow-black/60"
            >
              <div
                className={`absolute inset-y-1 left-1 w-[32px] rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-300 to-amber-200 shadow-md shadow-emerald-400/50 transition-transform duration-500 ${
                  theme === "dark"
                    ? "translate-x-0"
                    : "translate-x-full bg-gradient-to-tr from-amber-300 via-amber-200 to-sky-200 shadow-amber-400/40"
                }`}
              />
              <div className="relative z-10 flex w-full items-center justify-between px-1.5 text-slate-700 dark:text-slate-300">
                <CrescentIcon className="h-4 w-4" />
                <SunSparkIcon className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
        <audio
          ref={audioRef}
          loop
          preload="auto"
          crossOrigin="anonymous"
          src="/assets/music/ambient.mp3"
          onError={() => {
            setAudioNotice(
              "Audio failed to load. Check your connection or try again."
            );
            debugLog({
              hypothesisId: "H3",
              location: "app/page.tsx:audio:onError",
              message: "Audio element error event",
              data: {
                src: audioRef.current?.currentSrc || audioRef.current?.src,
                networkState: audioRef.current?.networkState,
                readyState: audioRef.current?.readyState
              }
            });
          }}
          onCanPlay={() => {
            debugLog({
              hypothesisId: "H3",
              location: "app/page.tsx:audio:onCanPlay",
              message: "Audio can play",
              data: {
                readyState: audioRef.current?.readyState,
                duration: audioRef.current?.duration
              }
            });
          }}
        />
      </header>

      {audioNotice ? (
        <div className="mx-auto w-full max-w-6xl px-5 pt-4">
          <div className="rounded-2xl border border-amber-300/40 bg-amber-200/40 px-4 py-3 text-xs text-amber-950 shadow-sm backdrop-blur-xl dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-100">
            {audioNotice}
          </div>
        </div>
      ) : null}

      <section className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center px-5 py-10 md:py-16">
        <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-liquid-gold opacity-60 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-pattern-geo bg-geo opacity-[0.14]" />
          <div className="relative grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center">
            <div className="space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700/90 dark:text-emerald-300/80">
                A personal Eid wish
              </p>
              <h1 className="calligraphy font-display text-5xl leading-[1.05] text-slate-950 dark:text-slate-50 sm:text-6xl">
                Eid Mubarak
                <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-amber-300 to-sky-300 bg-clip-text text-transparent">
                  رَمَضَانُ مَغْفِرَةٍ وَرَحْمَةٍ
                </span>
              </h1>
              <p className="max-w-2xl text-base text-slate-700 dark:text-slate-300/90">
                May Allah accept your fasting, forgive your sins, and fill your home with peace.
                May your Eid be a new beginning of barakah, love, and answered duas.
              </p>

              <form onSubmit={onSubmit} className="space-y-3">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Enter your name
                </label>
                <div className="flex flex-wrap gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your beautiful name"
                    className="min-w-[240px] flex-1 rounded-2xl border border-slate-300 bg-white/85 px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 dark:border-slate-500/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/40"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40"
                  >
                    Reveal my wish
                  </button>
                </div>
              </form>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-emerald-200/40 bg-white/70 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
              <Fireworks active={showGreeting && !!displayedName} />
              <div aria-live="polite" className="relative space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">
                  <span aria-hidden="true">🌙</span>
                  Blessing
                </div>
                <p
                  className={`font-display text-3xl leading-tight text-emerald-950 dark:text-emerald-100 transition-all duration-500 ${
                    displayedName && showGreeting
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-75"
                  }`}
                >
                  {displayedName ? `Eid Mubarak, ${displayedName}!` : "Eid Mubarak!"}
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200/90">
                  {displayedName
                    ? "May Allah shower you with mercy, grant you lasting happiness, and make every prayer you whispered in Ramadan bloom into beautiful answers."
                    : "Enter your name to receive a personal dua written with warmth and gratitude."}
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  May your Eid be gentle, bright, and deeply meaningful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="wishes"
        className="relative mx-auto max-w-6xl px-5 pb-16 md:pb-20"
      >
        <div className="mb-7 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-emerald-950 dark:text-emerald-200 md:text-2xl">
            Wishes drifting on lantern light
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 md:text-[0.7rem]">
            Scroll slowly — let each dua settle in your heart.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Gratitude",
              body: "May every blessing Allah has wrapped around your life reveal itself to you with clarity, humility, and joy this Eid."
            },
            {
              title: "Connection",
              body: "May your home echo with laughter, your table overflow with warmth, and your heart remain soft to those who knock."
            },
            {
              title: "Light",
              body: "May your path be lit with guidance brighter than the crescent moon, and may your worries fade like stars at dawn."
            }
          ].map((wish) => (
            <article
              key={wish.title}
              className="relative h-full rounded-3xl border border-slate-200/70 bg-white/75 p-5 text-sm text-slate-900 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-100"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-300/10" />
              <div className="relative space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-700 dark:text-emerald-300">
                  {wish.title}
                </p>
                <p>{wish.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="quotes"
        className="relative mx-auto max-w-6xl px-5 pb-16 md:pb-20"
      >
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 px-6 py-7 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40 md:px-8 md:py-9">
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
                Reflections under the crescent
              </p>
              <blockquote className="font-display text-xl leading-relaxed text-slate-950 dark:text-slate-50 md:text-2xl">
                “Eid is not the clothes we wear or the feast we share. It is
                the quiet moment of gratitude, when the heart whispers,{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-amber-200 to-sky-300 bg-clip-text text-transparent">
                  Alhamdulillah for everything.
                </span>
                ”
              </blockquote>
              <div className="rounded-2xl border border-emerald-200/60 bg-white/70 p-4 text-sm text-slate-900 shadow-sm backdrop-blur-xl dark:border-emerald-200/20 dark:bg-slate-950/50 dark:text-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-700/90 dark:text-emerald-300/80">
                  Qur’an • Ramadan
                </p>
                <p className="mt-2 font-arabic text-base leading-relaxed text-slate-950 dark:text-slate-50">
                  شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300/90">
                  “The month of Ramadan is the one in which the Qur’an was revealed as guidance for people, and clear proofs of guidance and the criterion.”
                  <span className="ml-2 font-semibold text-slate-600 dark:text-slate-400">
                    (Al-Baqarah 2:185)
                  </span>
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                — A dua carried by the wind
              </p>
            </div>
            <div className="glass-panel-light relative overflow-hidden border-emerald-100/70 bg-white/75 p-5 text-sm text-emerald-950">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-amber-300/20" />
              <div className="relative space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-700">
                  A gentle reminder
                </p>
                <p>
                  Someone is whispering your name in their Eid duas. Someone is
                  grateful you exist. Someone is waiting to hear from you
                  today. Reach out, reconnect, and let forgiveness be your Eid
                  gift.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative mx-auto max-w-6xl px-5 pb-14 md:pb-16"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/70 p-5 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-16 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="relative grid gap-5 md:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] md:items-center">
            <div className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/20 p-2">
              <img
                src="/assets/about/sami.png"
                alt="Sayeem Shahriar Sami"
                className="aspect-square w-full rounded-[18px] object-cover"
              />
            </div>
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
                About
              </p>
              <h2 className="font-display text-2xl text-slate-950 dark:text-slate-50 md:text-3xl">
                SAYEEM SHAHRIAR SAMI
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300/90">
                CSE 7th, Mymensingh Engineering College.
              </p>
              <div className="rounded-2xl border border-emerald-200/60 bg-white/70 p-4 text-sm text-slate-900 backdrop-blur-xl dark:border-emerald-200/20 dark:bg-slate-950/40 dark:text-slate-100">
                <p className="font-display text-lg">Eid wish from me</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200/90">
                  May Allah accept all your good deeds, heal what your heart hides,
                  and grant you a life filled with peace, halal success, and people who love you for the sake of Allah.
                  Eid Mubarak.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1 text-sm">
                <a
                  href="https://github.com/Iikarus47/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 font-semibold text-slate-800 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                >
                  GitHub
                </a>
                <a
                  href="https://www.facebook.com/sami.ikarus1814"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 font-semibold text-slate-800 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-white/70 px-5 py-6 text-center text-[11px] text-slate-600 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80 dark:text-slate-500">
        <p>
          May your Eid be filled with light, mercy, and gentle surprises. Eid
          Mubarak.
        </p>
      </footer>
    </main>
  );
};

export default EidPage;

