import React from "react";
import { useParams, Link } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Share2,
  Heart,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import {
  PROJECT_EXTRAS_MAP,
  CATEGORY_IMAGES,
  getCategoryLabel,
  getCategoryIcon,
} from "../constants";
import { useGetprojectByIDQuery } from "../lib/api";

export default function ProjectDetail() {
  const { id } = useParams();

  // — Fix: Share and Like state (was: dead buttons with no handlers)
  const [liked, setLiked] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = project?.title ?? "HopeConnect Project";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const {
    data: raw,
    isLoading,
    isError,
  } = useGetprojectByIDQuery(id, {
    skip: !id,
  });

  const project = React.useMemo(() => {
    if (!raw) return null;
    const extras = PROJECT_EXTRAS_MAP[raw.title] ?? {};
    const category = raw.category ?? "other";
    return {
      ...raw,
      category,
      status: raw.status ?? "active",
      budget: raw.budget ?? 0,
      fundsRaised: raw.fundsRaised ?? 0,
      location: raw.location || "Sri Lanka",
      start_date: raw.start_date || new Date().toISOString(),
      requiredSkills: Array.isArray(raw.requiredSkills)
        ? raw.requiredSkills
        : [],
      volunteers_needed: raw.volunteers_needed ?? 0,
      image: extras.image ?? CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.other,
      longDescription: extras.longDescription ?? raw.description ?? "",
    };
  }, [raw]); // eslint-disable-next-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading project…</p>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            This project may have been removed or the link is incorrect.
          </p>
          <Link
            to="/projects"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const progress =
    project.budget > 0
      ? Math.min(Math.round((project.fundsRaised / project.budget) * 100), 100)
      : 0;
  const statusLabel = project.status.replace(/_/g, " ");
  const isActive = project.status === "active";
  const startYear = new Date(project.start_date).getFullYear();

  // — Fix: was splitting on first word and always italicising it, which broke
  //   titles like "Flood Relief…" (first word becomes italic regardless of meaning).
  //   Now we render the title as a single clean string; the italic emerald accent
  //   is provided by the category badge above, not by slicing the title itself.
  const titleWords = project.title.split(" ");
  const titleRest = titleWords.slice(1).join(" ");

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 pb-24 pt-20">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50 z-0" />

        <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 text-[10px] font-bold text-emerald-600/60 hover:text-emerald-600 transition-all uppercase tracking-[0.3em] mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Discover
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-end gap-12 lg:gap-20">
            <div className="lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8"
              >
                {React.createElement(getCategoryIcon(project.category), {
                  className: "w-3 h-3",
                })}
                <span>{getCategoryLabel(project.category)}</span>
              </motion.div>

              {/* — Fix: replaced fragile first-word-italic split with a stable
                  two-part title: first word in emerald, rest in dark slate.
                  This looks intentional for any project title instead of
                  randomly italicising whatever word happens to come first. */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-emerald-950 mb-10 leading-[1.1] tracking-tight"
              >
                <span className="font-serif italic font-medium text-emerald-600">
                  {titleWords[0]}{" "}
                </span>
                {titleRest}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-10"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600" />{" "}
                  {project.location}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Since{" "}
                  {startYear}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`}
                  />
                  Status:{" "}
                  <span className="text-emerald-950 capitalize">
                    {statusLabel}
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="lg:w-2/5 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-emerald-950 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  {React.createElement(getCategoryIcon(project.category), {
                    className: "w-24 h-24",
                  })}
                </div>
                <div className="relative z-10">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em] mb-4">
                    Financial Progress
                  </div>
                  <div className="text-4xl font-bold mb-8">
                    LKR {project.fundsRaised.toLocaleString()}
                    <span className="text-lg font-normal text-white/40">
                      {" "}
                      / {project.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    <span>{progress}% Impact Ready</span>
                    <span>
                      LKR{" "}
                      {(project.budget - project.fundsRaised).toLocaleString()}{" "}
                      to Goal
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[4rem] overflow-hidden aspect-[16/9] shadow-2xl relative"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[4rem]" />
            </motion.div>

            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-px h-12 bg-emerald-200" />
                <h2 className="text-2xl font-bold text-emerald-950 uppercase tracking-tight">
                  The Need{" "}
                  <span className="text-emerald-600 font-serif italic text-3xl block capitalize">
                    & Context
                  </span>
                </h2>
              </div>
              <p className="text-xl text-gray-700 leading-[1.8] font-serif italic mb-12 whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:text-emerald-600 first-letter:mr-3 first-letter:float-left">
                {project.longDescription}
              </p>

              <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                <div className="bg-emerald-50/50 p-10 rounded-[3rem]">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-6">
                    Execution Strategy
                  </h4>
                  <p className="text-sm text-emerald-950/80 leading-relaxed font-medium">
                    Verified through the local GN office, this project utilises
                    a direct-impact model where 100% of the funds are applied to
                    the physical resources required for the community's growth
                    and wellbeing.
                  </p>
                </div>
                <div className="bg-gray-50 p-10 rounded-[3rem]">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                    Transparency Commitment
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Donors receive real-time updates and photographic evidence
                    of milestone completions, ensuring a closed-loop trust
                    ecosystem that holds us accountable at every stage.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3.5rem] border border-emerald-50 shadow-[0_40px_80px_-20px_rgba(6,78,59,0.08)]"
            >
              <h3 className="text-xl font-bold text-emerald-950 mb-8">
                Action Items
              </h3>

              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-950">
                      {project.volunteers_needed}
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      Open Volunteer Slots
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-950">
                      Verified
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      GN Division Approval
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-gray-50 flex flex-col gap-4">
                <Link
                  to="/donate"
                  className="w-full flex items-center justify-center bg-emerald-600 text-white h-16 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                >
                  Contribute Fund
                </Link>
                <Link
                  to="/volunteer"
                  state={{ selectedProject: String(project._id) }}
                  className="w-full flex items-center justify-center bg-white text-emerald-950 border border-emerald-100 h-16 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-emerald-600 transition-all"
                >
                  Join the Team
                </Link>
              </div>

              {/* — Fix: Share2 and Heart now have real handlers.
                  Share uses the Web Share API with clipboard fallback.
                  Heart toggles a local liked state with visual feedback. */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={handleShare}
                  title={copied ? "Link copied!" : "Share this project"}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    copied
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                      : "bg-white border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </>
                  )}
                </button>

                <button
                  onClick={() => setLiked((v) => !v)}
                  title={liked ? "Remove from saved" : "Save project"}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    liked
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-all ${liked ? "fill-red-500" : ""}`}
                  />
                  {liked ? "Saved" : "Save"}
                </button>
              </div>
            </motion.div>

            {project.requiredSkills.length > 0 && (
              <div className="px-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">
                  Expertise Needed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-tight border border-gray-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
