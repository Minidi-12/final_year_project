import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Heart, Compass } from "lucide-react";
import { Link } from "react-router";
import { useEffect } from "react";

const PARTICLES = [
  { id: 0, x: 12, y: 18, size: 5, dur: 4.2, delay: 0 },
  { id: 1, x: 22, y: 68, size: 3, dur: 5.5, delay: 0.8 },
  { id: 2, x: 78, y: 22, size: 4, dur: 3.8, delay: 1.4 },
  { id: 3, x: 88, y: 72, size: 6, dur: 4.8, delay: 0.3 },
  { id: 4, x: 55, y: 85, size: 3, dur: 5.0, delay: 1.1 },
  { id: 5, x: 68, y: 12, size: 4, dur: 4.5, delay: 0.6 },
];

const CARDINALS = [
  { angle: 0,   label: "N", top: "3%",  left: "50%",  dx: "-50%", dy: "0%" },
  { angle: 180, label: "S", top: "94%", left: "50%",  dx: "-50%", dy: "0%" },
  { angle: 90,  label: "E", top: "50%", left: "96%",  dx: "-100%", dy: "-50%" },
  { angle: 270, label: "W", top: "50%", left: "4%",   dx: "0%",   dy: "-50%" },
];

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,400&family=DM+Sans:wght@400;450;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-[#F5F4EE] relative overflow-hidden flex flex-col"
    >
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-50 opacity-[0.04]"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden="true"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          style={{ fontFamily: "'Fraunces', serif" }}
          className="text-[38vw] font-black leading-none tracking-tighter text-emerald-900/[0.03]"
        >
          404
        </span>
      </div>

      <div
        className="absolute top-[-12%] right-[-6%] w-[52vw] h-[52vw] max-w-[680px] max-h-[680px] pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 600 600" className="w-full h-full opacity-[0.06]">
          <path
            fill="#064E3B"
            d="M300,70 C440,50 560,130 570,270 C580,410 490,510 350,530
               C210,550 80,460 70,320 C60,180 140,95 300,70 Z"
          />
        </svg>
      </div>

      <div
        className="absolute bottom-[-18%] left-[-10%] w-[42vw] h-[42vw] max-w-[520px] max-h-[520px] pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full opacity-[0.05]">
          <path
            fill="#065F46"
            d="M250,40 C390,20 470,120 465,265 C460,410 365,475 220,470
               C75,465 20,360 30,210 C40,60 110,60 250,40 Z"
          />
        </svg>
      </div>

      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          className="absolute rounded-full bg-emerald-600/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -14, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      <header className="relative z-10 px-8 pt-8 md:px-14 md:pt-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-9 h-9 bg-emerald-700 rounded-[10px] flex items-center justify-center shadow-lg shadow-emerald-900/25"
          >
            <Heart className="w-4 h-4 text-white fill-white" />
          </motion.div>
          <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-emerald-950">
            Hope<span className="text-emerald-600">Connect</span>
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center px-8 md:px-14 lg:px-24 pb-10 mt-2">

        <div className="max-w-[520px] w-full">

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex items-center gap-3 mb-7"
          >
            <div className="h-px w-7 bg-emerald-500/50" />
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-emerald-600/80">
              Error 404
            </span>
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Fraunces', serif" }}
              className="text-[clamp(2.6rem,6vw,4.4rem)] font-black text-emerald-950 leading-[1.0] tracking-tight"
            >
              You've wandered
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-7">
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.27, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Fraunces', serif" }}
              className="text-[clamp(2.6rem,6vw,4.4rem)] font-light italic text-emerald-600 leading-[1.0] tracking-tight"
            >
              off the path.
            </motion.h1>
          </div>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="text-[15px] text-stone-500 leading-[1.8] mb-10 max-w-[360px] font-[450]"
          >
            This page has moved, been removed, or simply never existed.
            Let's get you back somewhere meaningful.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.56 }}
            className="flex flex-wrap gap-3"
          >
            <motion.button
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white
                         px-7 py-[14px] rounded-[14px] text-[13px] font-semibold tracking-wide
                         transition-colors shadow-xl shadow-emerald-900/20"
            >
              <Home className="w-[15px] h-[15px]" strokeWidth={2.2} />
              Back to Home
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2.5 bg-white/80 hover:bg-white text-stone-600
                         px-7 py-[14px] rounded-[14px] text-[13px] font-semibold tracking-wide
                         transition-all border border-stone-200/80 shadow-sm backdrop-blur-sm"
            >
              <ArrowLeft className="w-[15px] h-[15px]" strokeWidth={2.2} />
              Go Back
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-1 items-center justify-center"
          aria-hidden="true"
        >
          <div className="relative w-[280px] h-[280px]">

            <div className="absolute inset-0 rounded-full border border-dashed border-emerald-400/25" />
            <div className="absolute inset-[22px] rounded-full border border-emerald-300/20" />
            <div
              className="absolute inset-[52px] rounded-full flex items-center justify-center
                         bg-white/60 border border-white/80 backdrop-blur-md
                         shadow-[0_24px_48px_-8px_rgba(6,78,59,0.14)]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              >
                <Compass
                  className="w-[52px] h-[52px] text-emerald-600/60"
                  strokeWidth={1}
                />
              </motion.div>
            </div>

            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                className="absolute w-2 h-2 bg-emerald-500/35 rounded-full"
                style={{
                  top: `${50 - 48 * Math.cos((angle * Math.PI) / 180)}%`,
                  left: `${50 + 48 * Math.sin((angle * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {CARDINALS.map(({ label, top, left, dx, dy }) => (
              <span
                key={label}
                className="absolute text-[9px] font-bold tracking-[0.2em] text-emerald-800/40"
                style={{ top, left, transform: `translate(${dx}, ${dy})` }}
              >
                {label}
              </span>
            ))}

            {Array.from({ length: 12 }, (_, i) => {
              const rad = (i * 30 * Math.PI) / 180;
              const r = 130;
              const x = 140 + r * Math.sin(rad);
              const y = 140 - r * Math.cos(rad);
              return (
                <div
                  key={i}
                  className="absolute w-px bg-emerald-500/20"
                  style={{
                    height: i % 3 === 0 ? 10 : 5,
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="relative z-10 px-8 pb-8 md:px-14 lg:px-24"
      >
        <p className="text-[11px] text-stone-400 tracking-wide font-[450]">
          Think something's wrong?{" "}
          <Link
            to="/contact"
            className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition-colors"
          >
            Contact support
          </Link>
        </p>
      </motion.footer>
    </div>
  );
}