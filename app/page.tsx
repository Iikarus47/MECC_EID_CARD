"use client";

import { useEffect, useRef, useState } from "react";
import { MoonIcon, SunIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

type Theme = "dark" | "light";

const debugLog = (payload: {
  hypothesisId: "H1" | "H2" | "H3" | "H4";
  message: string;
  data?: Record<string, unknown>;
  runId?: string;
  location: string;
}) => {
  // #region agent log
  fetch("http://127.0.0.1:7426/ingest/482b0f96-cfda-42da-81c8-88fe95de79fb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "de25a5"
    },
    body: JSON.stringify({
      sessionId: "de25a5",
      timestamp: Date.now(),
      runId: payload.runId ?? "pre-fix",
      hypothesisId: payload.hypothesisId,
      location: payload.location,
      message: payload.message,
      data: payload.data ?? {}
    })
  }).catch(() => {});
  // #endregion
};

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

    // #region agent log
    debugLog({
      hypothesisId: "H2",
      location: "app/page.tsx:useTheme:init",
      message: "Theme initialized",
      data: {
        stored,
        htmlHasDarkClass: document.documentElement.classList.contains("dark")
      }
    });
    // #endregion
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

const useParallax = () => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handler = () => setOffset(window.scrollY || 0);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return offset;
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

const TailwindProbe = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cs = window.getComputedStyle(el);

    // H1/H3: Tailwind not running / globals not processed => classes won't apply
    debugLog({
      hypothesisId: "H1",
      location: "app/page.tsx:TailwindProbe",
      message: "Computed styles for Tailwind probe element",
      data: {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        opacity: cs.opacity,
        className: el.className
      }
    });
  }, []);

  return (
    <div
      ref={ref}
      className="fixed left-2 top-2 z-[9999] rounded-full bg-emerald-400/70 px-3 py-1 text-xs font-semibold text-slate-950 opacity-90"
    >
      TailwindProbe
    </div>
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

const HeroIllustration = ({ theme }: { theme: Theme }) => {
  const scrollOffset = useParallax();
  const baseParallax = scrollOffset * 0.08;

  return (
    <div className="relative mx-auto flex h-[430px] w-full max-w-5xl items-center justify-center overflow-visible">
      <div
        className="absolute inset-[-2px] -z-10 rounded-[32px] opacity-80 blur-3xl transition-opacity duration-700"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle at 10% 0%, rgba(30,64,175,0.8), transparent 60%), radial-gradient(circle at 90% 0%, rgba(16,185,129,0.9), transparent 60%)"
              : "radial-gradient(circle at 10% 0%, rgba(251,191,36,0.75), transparent 60%), radial-gradient(circle at 90% 0%, rgba(59,130,246,0.8), transparent 60%)"
        }}
      />

      <div
        className={`relative h-[340px] w-full overflow-hidden rounded-[30px] border transition-colors duration-700 ${
          theme === "dark"
            ? "border-slate-700/70 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950"
            : "border-slate-200/80 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200"
        }`}
      >
        {theme === "dark" && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-pattern-geo bg-geo opacity-[0.14]" />
            <div
              className="absolute -left-10 -top-32 h-72 w-72 rounded-full bg-white/5 blur-3xl"
              style={{ transform: `translateY(${baseParallax * 0.6}px)` }}
            />
            <div
              className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"
              style={{ transform: `translateY(${baseParallax * 0.9}px)` }}
            />
          </div>
        )}

        {theme === "dark" ? (
          <>
            <div
              className="absolute -top-20 right-10 h-64 w-64 rounded-full shadow-glow-gold"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, #fefce8, #facc15 45%, transparent 65%)",
                transform: `translateY(${baseParallax * 0.4}px)`
              }}
            />

            <div
              className="absolute -bottom-8 left-6 h-40 w-40 rounded-full border border-white/10 bg-gradient-to-tr from-amber-200/70 via-amber-400/80 to-amber-200/60 shadow-glow-gold backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 0 40px rgba(251,191,36,0.6), 0 0 90px rgba(251,191,36,0.35)",
                transform: `translateY(${baseParallax * 0.5}px)`
              }}
            >
              <div className="absolute inset-[18%] rounded-full border border-white/40 bg-gradient-to-b from-white/40 to-amber-200/10" />
              <div className="absolute inset-[32%] rounded-full border border-amber-200/30" />
              <div className="absolute -bottom-10 left-1/2 h-14 w-20 -translate-x-1/2 rounded-full bg-black/40 blur-xl" />
            </div>

            <div
              className="absolute -bottom-2 right-16 h-52 w-40 origin-top animate-lantern-sway rounded-full border border-amber-200/40 bg-gradient-to-b from-amber-100/60 via-amber-300/50 to-amber-500/80 shadow-glow-gold backdrop-blur-xl"
              style={{ transform: `translateY(${baseParallax * 0.7}px)` }}
            >
              <div className="absolute inset-[18%] rounded-[28px] border border-amber-50/75 bg-gradient-to-b from-amber-50/85 to-amber-100/40" />
              <div className="absolute inset-x-4 top-3 h-2 rounded-full bg-amber-200/80" />
              <div className="absolute -top-6 left-1/2 h-6 w-[1px] -translate-x-1/2 bg-amber-50/80" />
              <div className="absolute -bottom-4 left-1/2 h-6 w-10 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-rose-50/90 to-sky-50" />
              <div className="absolute inset-0 bg-pattern-geo bg-geo opacity-[0.18]" />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-emerald-700 via-emerald-600/95 to-transparent" />
            </div>
            <div className="absolute inset-x-10 bottom-[22%] flex items-end justify-between gap-4 text-emerald-50">
              <div className="flex items-end gap-6">
                <div className="h-28 w-36 rounded-t-full border border-emerald-200/40 bg-emerald-800/95 shadow-xl shadow-emerald-950/80">
                  <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-amber-200/70 bg-emerald-900/70 shadow-inner shadow-black/60" />
                </div>
                <div className="h-44 w-40 rounded-t-full border border-emerald-100/50 bg-emerald-900 shadow-2xl shadow-emerald-950/90">
                  <div className="mx-auto -mt-6 h-10 w-10 rounded-full border border-emerald-100 bg-emerald-900 shadow shadow-emerald-950" />
                </div>
              </div>

              <div className="relative flex w-52 flex-col items-center">
                <div className="h-40 w-36 rounded-t-[60px] bg-gradient-to-t from-emerald-900 via-emerald-800 to-emerald-700 shadow-xl shadow-emerald-950/90">
                  <div className="mx-auto mt-5 h-14 w-14 rounded-full border border-amber-300/75 bg-emerald-950/70 shadow-inner shadow-black/70" />
                  <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-emerald-400/70" />
                </div>
                <div className="absolute -top-20 h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-300 to-emerald-200 shadow-xl shadow-emerald-700/90" />
              </div>

              <div className="flex items-end gap-5">
                <div className="h-32 w-28 rounded-t-full border border-emerald-200/60 bg-emerald-800 shadow-xl shadow-emerald-950/80" />
                <div className="h-48 w-40 rounded-t-full border border-emerald-100/60 bg-emerald-900 shadow-2xl shadow-emerald-950/95">
                  <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-amber-200/80 bg-emerald-950/70 shadow-inner shadow-black/70" />
                </div>
              </div>
            </div>

            <div className="absolute inset-x-16 bottom-8 flex items-center justify-center">
              <div className="glass-panel-light card-tilt relative flex h-40 w-full max-w-lg items-center gap-6 px-8 py-6">
                <div className="card-tilt-inner relative h-24 w-24 rounded-full bg-gradient-orbit p-[3px] shadow-lg shadow-emerald-500/40">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900">
                    <span className="text-3xl font-semibold text-emerald-300">
                      :)
                    </span>
                  </div>
                </div>
                <div className="card-tilt-inner space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700/80">
                    Light of Celebration
                  </p>
                  <p className="font-display text-2xl text-emerald-900">
                    A joyful Eid under soft daylight.
                  </p>
                  <p className="text-xs text-emerald-800/80">
                    Families gather, children laugh, and gratitude fills the
                    courtyards.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {theme === "dark" && (
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
            <div className="absolute inset-x-10 bottom-6 flex items-end justify-between gap-4 text-slate-200/90">
              <div className="flex items-end gap-6">
                <div className="h-28 w-40 rounded-t-full bg-slate-900 shadow-2xl shadow-black">
                  <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-slate-700 bg-slate-950 shadow-inner shadow-black" />
                </div>
                <div className="h-44 w-40 rounded-t-full bg-slate-950 shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
                  <div className="mx-auto -mt-6 h-10 w-10 rounded-full border border-slate-700 bg-slate-950 shadow" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-40 w-36 rounded-t-[60px] bg-slate-950 shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
                  <div className="mx-auto mt-5 h-14 w-14 rounded-full border border-slate-600 bg-slate-950 shadow-inner shadow-black" />
                  <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mt-3 h-1 w-32 rounded-full bg-black/70 blur-sm" />
              </div>
              <div className="flex items-end gap-5">
                <div className="h-32 w-32 rounded-t-full bg-slate-900 shadow-2xl shadow-black" />
                <div className="h-48 w-40 rounded-t-full bg-slate-950 shadow-[0_25px_70px_rgba(0,0,0,0.9)]">
                  <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-slate-600 bg-slate-950 shadow-inner shadow-black" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EidPage = () => {
  const [theme, toggleTheme] = useTheme();
  const [name, setName] = useState("");
  const [displayedName, setDisplayedName] = useState<string | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playMusic) {
      audioRef.current
        .play()
        .catch(() => setPlayMusic(false));
    } else {
      audioRef.current.pause();
    }
  }, [playMusic]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const cs = window.getComputedStyle(el);
    debugLog({
      hypothesisId: "H4",
      location: "app/page.tsx:EidPage:themeProbe",
      message: "Computed main text color after theme change",
      data: {
        theme,
        htmlHasDarkClass: document.documentElement.classList.contains("dark"),
        mainColor: cs.color,
        mainBackground: cs.backgroundColor
      }
    });
  }, [theme]);

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
      <TailwindProbe />
      <StarField />
      <div className="noise-overlay" />

      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-transparent dark:opacity-100 opacity-0 transition-opacity duration-700" />

      <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/75 px-5 py-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-300 shadow-lg shadow-emerald-500/40">
              <span className="text-xs font-semibold text-slate-950">
                EID
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700/80 dark:text-emerald-300/80">
                Celestial Celebration
              </p>
              <p className="font-display text-sm text-slate-900 dark:text-slate-50">
                Night of Light & Gratitude
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlayMusic((p) => !p)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-all ${
                playMusic
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-900 shadow-emerald-500/20 dark:border-emerald-400/70 dark:bg-emerald-500/20 dark:text-emerald-100"
                  : "border-slate-300 bg-white/70 text-slate-800 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200"
              }`}
            >
              <MusicalNoteIcon className="h-4 w-4" />
              <span>{playMusic ? "Pause ambience" : "Play ambience"}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle day and night mode"
              className="group relative flex h-9 w-16 items-center rounded-full border border-slate-300 bg-white/70 px-1.5 shadow-inner shadow-slate-900/10 transition-colors dark:border-slate-600/80 dark:bg-slate-900/80 dark:shadow-black/60"
            >
              <div
                className={`absolute inset-y-1 w-1/2 rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-300 to-amber-200 shadow-md shadow-emerald-400/50 transition-transform duration-500 ${
                  theme === "dark"
                    ? "translate-x-0"
                    : "translate-x-full bg-gradient-to-tr from-amber-300 via-amber-200 to-sky-200 shadow-amber-400/40"
                }`}
              />
              <div className="relative z-10 flex w-full items-center justify-between px-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                <MoonIcon className="h-3.5 w-3.5" />
                <SunIcon className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </div>
        <audio
          ref={audioRef}
          loop
          src="https://cdn.pixabay.com/download/audio/2022/10/25/audio_1fd7fb9f0e.mp3?filename=night-ambience-124900.mp3"
        />
      </header>

      <section
        id="hero"
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 pt-12 pb-16 md:pt-16 md:pb-20"
      >
        <HeroIllustration theme={theme} />

        <div className="relative grid w-full gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-5 md:space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-950 shadow shadow-emerald-500/10 dark:border-emerald-400/40 dark:text-emerald-200 dark:shadow-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(74,222,128,1)]" />
              Eid under a sky of mercy
            </div>
            <div className="space-y-3">
              <h1 className="calligraphy font-display text-4xl leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl md:text-[3.25rem]">
                Eid Mubarak
                <span className="block bg-gradient-to-r from-emerald-300 via-amber-300 to-sky-300 bg-clip-text text-transparent">
                  ليلة من نور وامتنان
                </span>
              </h1>
              <p className="max-w-xl text-sm text-slate-700 md:text-[0.95rem] dark:text-slate-300/90">
                Bask under a celestial Eid night where lanterns float, stars
                whisper duas, and every heartbeat echoes gratitude. Enter your
                name and watch the sky celebrate you.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#greeting"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition-transform hover:scale-[1.02]"
              >
                Personalize my Eid dua
              </a>
              <a
                href="#card"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-xs font-medium text-slate-800 dark:border-slate-600/70 dark:bg-slate-900/60 dark:text-slate-200"
              >
                Create a digital Eid card
              </a>
            </div>
          </div>

          <div
            id="greeting"
            className={`relative w-full max-w-md justify-self-end p-5 shadow-glass-soft backdrop-blur-2xl ${
              theme === "dark"
                ? "glass-panel border-white/10 bg-white/5"
                : "glass-panel-light border-slate-200/70 bg-white/75"
            }`}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-liquid-gold opacity-60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 left-10 h-28 w-40 rounded-full bg-emerald-500/30 blur-3xl" />

            <div className="relative space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700/90 dark:text-emerald-300/80">
                Your luminous greeting
              </p>
              <p className="font-display text-xl text-slate-950 dark:text-slate-50">
                Let the sky whisper your name in duas.
              </p>
              <form onSubmit={onSubmit} className="mt-4 space-y-3">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300/80">
                  Type your name to receive a personalized Eid blessing
                </label>
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your beautiful name"
                    className="flex-1 rounded-2xl border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 dark:border-slate-500/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/40"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-300 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40"
                  >
                    Bless me
                  </button>
                </div>
              </form>

              <div
                aria-live="polite"
                className="relative mt-4 min-h-[76px] overflow-hidden rounded-2xl border border-emerald-200/40 bg-white/70 p-4 text-sm text-emerald-950 dark:border-emerald-200/20 dark:bg-slate-950/60 dark:text-emerald-100"
              >
                <Fireworks active={showGreeting && !!displayedName} />
                {displayedName ? (
                  <div
                    className={`space-y-1 transition-all duration-500 ${
                      showGreeting
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                  >
                    <p className="font-display text-lg text-emerald-900 dark:text-emerald-200">
                      Eid Mubarak, {displayedName}!
                    </p>
                    <p className="text-xs text-emerald-900/90 dark:text-emerald-100/90">
                      May your days glow with iman, your nights with serenity,
                      and your heart with endless gratitude. May every dua you
                      whispered in the quiet of the night find its way to mercy.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 dark:text-slate-300/90">
                    Your greeting will shimmer here with fireworks the moment
                    you share your name.
                  </p>
                )}
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
          <h2 className="font-display text-xl text-emerald-200 md:text-2xl">
            Wishes drifting on lantern light
          </h2>
          <p className="text-xs text-slate-400 md:text-[0.7rem]">
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
              className="glass-panel relative h-full border-white/10 bg-slate-900/40 p-5 text-sm text-slate-100"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-300/10" />
              <div className="relative space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-300">
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
        <div className="glass-panel relative overflow-hidden border-white/10 bg-slate-900/40 px-6 py-7 md:px-8 md:py-9">
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Reflections under the crescent
              </p>
              <blockquote className="font-display text-xl leading-relaxed text-slate-50 md:text-2xl">
                “Eid is not the clothes we wear or the feast we share. It is
                the quiet moment of gratitude, when the heart whispers,{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-amber-200 to-sky-300 bg-clip-text text-transparent">
                  Alhamdulillah for everything.
                </span>
                ”
              </blockquote>
              <p className="text-xs text-slate-400">— A dua carried by the wind</p>
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
        id="card"
        className="relative mx-auto max-w-6xl px-5 pb-20 md:pb-24"
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-emerald-200 md:text-2xl">
              Send a shimmering Eid card
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Capture your personalized greeting as a shareable digital card.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div className="glass-panel relative overflow-hidden border-white/10 bg-slate-900/60 p-6 text-sm text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-liquid-gold opacity-60 blur-3xl" />
            <div className="relative space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Live preview
              </p>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-1">
                <div className="relative h-full w-full rounded-2xl bg-slate-950/80 p-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-300/12" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="rounded-full bg-emerald-500/20 px-2 py-1 font-semibold text-emerald-200">
                        Eid Mubarak
                      </span>
                      <span>Digital Card</span>
                    </div>
                    <div className="space-y-3 text-center">
                      <p className="font-display text-2xl text-emerald-100">
                        {displayedName
                          ? `Eid Mubarak, ${displayedName}!`
                          : "Eid Mubarak, dear soul!"}
                      </p>
                      <p className="mx-auto max-w-md text-xs text-slate-300">
                        May your heart be as light as lanterns in the night,
                        your home as warm as shared sweets, and your path as
                        bright as the crescent moon.
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Share this blessing with someone whose presence lights up
                      your Eid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-200">
            <p>
              You can quickly share this greeting by taking a screenshot of the
              live preview, or by sharing this page with your loved ones and
              letting them write their own names into the sky.
            </p>
            <ol className="space-y-1 text-xs text-slate-300">
              <li>1. Enter a name in the greeting panel above.</li>
              <li>2. Capture a screenshot of the card preview.</li>
              <li>
                3. Share it via your favourite app — the dua travels with it.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 bg-slate-950/80 px-5 py-6 text-center text-[11px] text-slate-500">
        <p>
          May your Eid be filled with light, mercy, and gentle surprises. Eid
          Mubarak.
        </p>
      </footer>
    </main>
  );
};

export default EidPage;

