import { useNavigate } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Heart } from "lucide-react";
import { Link } from "react-router";

// Quick-links shown below the main card — helps users find where they meant to go
const QUICK_LINKS = [
  { label: "Projects",           to: "/projects"            },
  { label: "Request Support",    to: "/request"             },
  { label: "Volunteer",          to: "/volunteer"           },
  { label: "Donate",             to: "/donate"              },
  { label: "Contact Us",         to: "/contact-us"          },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Logo mark */}
        <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-bold text-emerald-950">
            HOPE<span className="text-emerald-600">CONNECT</span>
          </span>
        </Link>

        {/* Main card */}
        <div className="bg-white rounded-[3rem] p-14 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.08)] border border-emerald-50">

          {/* 404 icon */}
          <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 relative">
            <Search className="w-10 h-10 text-emerald-400" />
            {/* Small "!" badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[11px] font-black text-white">!</span>
            </div>
          </div>

          {/* Error code */}
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.4em] mb-3">
            Error 404
          </div>

          <h1 className="text-2xl font-bold text-emerald-950 mb-3 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-400 font-medium mb-10 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            <br />
            Check the URL or head back to a known page.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-10">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-5">
            Or jump to
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-all uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}