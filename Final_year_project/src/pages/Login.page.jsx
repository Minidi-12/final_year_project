import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Heart, Lock, User, ChevronRight,
  AlertCircle, Eye, EyeOff, ArrowLeft,
  Building2, Landmark, ShieldCheck, KeyRound, BadgeCheck
} from "lucide-react";
import { useNavigate, Link } from "react-router";


const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-body    { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

  .input-field:focus { outline: none; }

  /* Gentle float for stats card */
  @keyframes floatUp {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  .float-card { animation: floatUp 4s ease-in-out infinite; }

  /* Grain overlay — z-index BELOW content (z-4) */
  .grain::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 4;
  }

  /* Strong text shadows for hero panel readability */
  .hero-logo-text {
    text-shadow: 0 1px 8px rgba(0,0,0,0.5);
  }
  .hero-eyebrow {
    text-shadow: 0 1px 6px rgba(0,0,0,0.7);
  }
  .hero-headline {
    text-shadow:
      0 2px 4px rgba(0,0,0,0.6),
      0 8px 24px rgba(0,0,0,0.4),
      0 16px 40px rgba(0,0,0,0.25);
  }
  .hero-quote {
    text-shadow: 0 1px 10px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4);
  }

  /* Input focus glow */
  .input-wrap:focus-within .input-icon { color: #059669; }
  .input-wrap:focus-within .input-field {
    background: #fff;
    border-color: #059669;
    box-shadow: 0 0 0 4px rgba(5,150,105,0.08);
  }

  /* Role tab slide indicator */
  .role-tab-active {
    background: #fff;
    box-shadow: 0 2px 12px rgba(6,78,59,0.10);
  }

  /* Button hover lift */
  .btn-primary {
    transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(5,150,105,0.30);
  }
  .btn-primary:active:not(:disabled) {
    transform: translateY(0px) scale(0.98);
  }
`;


const HERO_IMAGE =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85";


function InputField({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-semibold text-emerald-800/50 uppercase tracking-[0.18em] pl-1 font-body">
        {label}
      </label>
      <div className="relative input-wrap">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 input-icon transition-colors duration-200">
          <Icon className="w-[18px] h-[18px]" />
        </span>
        {children}
      </div>
    </div>
  );
}

export default function Login() {
  const [role, setRole]                 = useState("GN_OFFICER");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState(null);
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("https://final-year-project-backend-su8k.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      console.log("API Response:", JSON.stringify(data, null, 2));

      localStorage.setItem("token",       data.token);
      localStorage.setItem("userRole",    data.user.role);
      localStorage.setItem("userName",    data.user.name);
      localStorage.setItem("userId",      data.user.id);
      localStorage.setItem("gnDivision", data.user.gn_division || data.user.gnDivision || "");
      localStorage.setItem("gnOfficerId", data.user.gnOfficerId || "");

      if (data.user.role === "GN_OFFICER") navigate("/verify");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setError(null);
    setEmail("");
    setPassword("");
  };

  const isGN = role === "GN_OFFICER";

  return (
    <>
      <style>{fontStyle}</style>

      <div className="min-h-screen flex font-body" style={{ background: "#F7F6F3" }}>

        <div className="hidden lg:flex w-[46%] relative overflow-hidden grain">

        
          <img
            src={HERO_IMAGE}
            alt="Community volunteers supporting families across Sri Lanka"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(0.65) brightness(0.7)" }}
          />

          
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(1, 22, 14, 0.62)",
              zIndex: 2,
            }}
          />

         
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(175deg, rgba(1,30,18,0.30) 0%, rgba(1,30,18,0.55) 45%, rgba(1,22,12,0.90) 80%, rgba(0,14,8,0.98) 100%)",
              zIndex: 3,
            }}
          />

         
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 55% at 30% 58%, rgba(0,20,12,0.72) 0%, transparent 70%)",
              zIndex: 4,
            }}
          />

       
          <div className="relative z-20 flex flex-col justify-between w-full p-12 xl:p-16">

           
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6"
                style={{ background: "rgba(52,211,153,0.20)", border: "1.5px solid rgba(52,211,153,0.35)", backdropFilter: "blur(8px)" }}
              >
                <Heart className="w-5 h-5 text-emerald-300 fill-current" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight text-white uppercase hero-logo-text">
                  HOPE<span className="text-emerald-300 font-display italic font-normal">Connect</span>
                </span>
                <span className="text-[9px] font-semibold text-emerald-400/80 tracking-[0.32em] uppercase mt-0.5 hero-logo-text">
                  Foundations
                </span>
              </div>
            </Link>

          
            <div className="flex-1 flex flex-col justify-center py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xs"
                >
                 
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-px bg-emerald-400/70" />
                    <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-[0.25em] hero-eyebrow">
                      {isGN ? "GN Officer Portal" : "NGO Partner Portal"}
                    </span>
                  </div>

               
                  <h2
                    className="font-display text-white leading-[1.08] mb-5 hero-headline"
                    style={{ fontSize: "clamp(2.4rem, 3.5vw, 3.2rem)" }}
                  >
                    {isGN ? (
                      <>
                       <span className="text-emerald-300 font-display" style={{ fontStyle: "italic" }}>
                          Empowering<br />
                        </span>
                        <em className="text-emerald-300 not-italic font-display" style={{ fontStyle: "italic" }}>
                          Community<br />Service
                        </em>
                      </>
                    ) : (
                      <>
                        <span className="text-emerald-300 font-display" style={{ fontStyle: "italic" }}>
                          Restoring Hope<br />
                        </span>
                        <em className="text-emerald-300 font-display" style={{ fontStyle: "italic" }}>
                          With Every<br />Connection
                        </em>
                      </>
                    )}
                  </h2>

                 
                  <p className="font-display italic text-white/80 leading-relaxed hero-quote" style={{ fontSize: "1.05rem" }}>
                    {isGN
                      ? '"Your verification ensures every rupee of support reaches the right family in your division."'
                      : '"Our secure portals provide a transparent bridge between community leaders, NGOs, and those who need it most."'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

           
            <div className="float-card">
              <div
                className="rounded-2xl p-5 flex items-center gap-5 max-w-xs"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(52,211,153,0.18)" }}
                >
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-snug">
                    100+ Families Supported
                  </p>
                  <p className="text-white/45 text-xs mt-0.5 font-body">
                    Across 3 provinces · 2026
                  </p>
                </div>
              </div>
            </div>

           
            <div className="mt-8">
              <p className="text-[9px] font-semibold text-white/20 uppercase tracking-[0.28em]">
                © 2025 HopeConnect Foundations · Secure Portal
              </p>
            </div>
          </div>
        </div>

        
        <div className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px] my-auto"
          >

          
            <div className="lg:hidden flex justify-center mb-10">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-lg font-bold text-emerald-950 uppercase tracking-tight">
                  HOPE<span className="text-emerald-500 font-display italic font-normal">Connect</span>
                </span>
              </Link>
            </div>

            
            <div className="mb-8 text-center lg:text-left">
              <h1 className="font-display text-4xl font-bold text-emerald-950 leading-none mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-gray-400 font-body font-medium">
                Sign in to your{" "}
                <span className="text-emerald-600 font-semibold">
                  {isGN ? "verification dashboard" : "NGO management portal"}
                </span>
              </p>
            </div>

            
            <div
              className="bg-white rounded-3xl p-8 md:p-10"
              style={{
                boxShadow:
                  "0 4px 6px -1px rgba(6,78,59,0.04), 0 24px 48px -8px rgba(6,78,59,0.09), 0 0 0 1px rgba(6,78,59,0.05)",
              }}
            >

             
              <div
                className="flex p-1.5 rounded-2xl mb-8"
                style={{ background: "#F3F4F6" }}
              >
                {[
                  { value: "GN_OFFICER",  Icon: Landmark,  label: "GN Officer" },
                  { value: "NGO_OFFICER", Icon: Building2, label: "NGO Support" },
                ].map(({ value, Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRoleSwitch(value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
                      role === value
                        ? "role-tab-active text-emerald-700"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[13px] font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              
              <form onSubmit={handleLogin} className="space-y-5">

               
                <InputField
                  label={isGN ? "GN Division Email" : "NGO Admin Email"}
                  icon={User}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isGN ? "officer.gn@gov.lk" : "admin@hopeconnect.org"}
                    className="input-field w-full rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-800 placeholder:text-gray-300 transition-all duration-200"
                    style={{
                      background: "#F9FAFB",
                      border: "1.5px solid #E5E7EB",
                    }}
                  />
                </InputField>

                
                <InputField label="Password" icon={Lock}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full rounded-xl pl-11 pr-12 py-3.5 text-sm font-medium text-gray-800 placeholder:text-gray-300 transition-all duration-200"
                    style={{
                      background: "#F9FAFB",
                      border: "1.5px solid #E5E7EB",
                    }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-emerald-500 transition-colors duration-150"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye     className="w-4 h-4" />}
                  </button>
                </InputField>

              
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 group disabled:opacity-50 mt-2"
                  style={{
                    background: isGN
                      ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                      : "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
                    boxShadow: "0 8px 24px rgba(5,150,105,0.22)",
                  }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Secure Sign In
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                    </>
                  )}
                </button>
              </form>

            </div>

          
            <div className="mt-7 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-350 hover:text-emerald-600 transition-colors duration-150 uppercase tracking-[0.22em]"
                style={{ color: "#9CA3AF" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Public Home
              </Link>
            </div>

           
            <div className="mt-5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] leading-relaxed" style={{ color: "#D1D5DB" }}>
                {isGN ? "Government Internal Portal" : "Partnership Network Protocol"}
                <br />
                <span className="text-emerald-400/70 font-display italic font-normal text-[10px]">
                  Secure Endpoint v2.8.4
                </span>
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
}