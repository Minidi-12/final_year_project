import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Heart,
  Users,
  MapPin,
  FileCheck,
  BarChart3,
  ArrowRight,
  MessageSquare,
  HandHeart,
  Globe2,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Activity as ActivityIcon,
  Search,
  Building2,
  Truck,
  Sparkles,
  Fingerprint,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import {
  getCategoryLabel,
  PROJECT_EXTRAS_MAP,
  CATEGORY_IMAGES,
} from "../constants";
import { useRef } from "react";
import Preloader from "../components/Preloader";
import { useGetAllprojectsQuery, useGetAllnews_postsQuery } from "../lib/api";

const CountUp = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const easeValue =
        percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(easeValue * value));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, value]);

  return (
    <div ref={elementRef} className="inline-block">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

function RecentActivities() {
  const { data: allPosts = [], isLoading, isError } = useGetAllnews_postsQuery();

  const activities = allPosts
    .filter((p) => p.post_type === "activity")
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-emerald-700">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-sm font-medium">Loading activities…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="text-sm font-medium">Failed to load activities.</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-300">
        <ActivityIcon className="w-12 h-12" />
        <p className="text-sm font-medium text-gray-400">No activities published yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {activities.map((activity, index) => (
        <motion.div
          key={activity._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
          className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all h-full"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={
                activity.image ||
                "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop"
              }
              alt={activity.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <Calendar className="w-3 h-3" /> {activity.date}
              </span>
            </div>
          </div>

          <div className="p-10 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activity.location || "Sri Lanka"}</span>
            </div>

            <h3 className="text-2xl font-bold text-emerald-950 mb-6 leading-tight group-hover:text-emerald-700 transition-colors">
              {activity.title}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed font-serif italic flex-1 border-l-2 border-emerald-50 pl-6 group-hover:border-emerald-200 transition-colors">
              {activity.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const {
    data: backendProjects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetAllprojectsQuery();

  const activeProjects = backendProjects
    .map((project) => {
      const extras = PROJECT_EXTRAS_MAP[project.title] ?? {};
      const category = project.category ?? "other";
      return {
        ...project,
        category,
        status: project.status ?? "active",
        title: project.title ?? "Untitled Project",
        description: project.description ?? "",
        budget: project.budget ?? 0,
        fundsRaised: project.fundsRaised ?? 0,
        image:
          extras.image ?? CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.other,
      };
    })
    .sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return 0;
    })
    .slice(0, 3);

  const testimonials = [
    {
      quote:
        "When we struggled with our daughter's medical expenses, Hopeconnect stepped in with kindness and speed. Their support provided not just medicine, but hope for her future.",
      author: "Sanduni Perera",
      role: "Member of family supported",
      avatar: "https://i.pravatar.cc/400?img=16",
    },
    {
      quote:
        "Participating in the flood relief mission opened my eyes. Hopeconnect's coordination was flawless, ensuring that aid reached the most remote families within hours.",
      author: "Aruna Gunawardana",
      role: "Volunteer, Galle",
      avatar: "https://i.pravatar.cc/400?img=68",
    },
    {
      quote:
        "Getting my kids ready for school was a constant worry until Hopeconnect provided the supplies they needed. Seeing them go to school with confidence was the greatest gift we received.",
      author: "Fathima Rizwan",
      role: "Member of family supported",
      avatar: "https://i.pravatar.cc/400?img=47",
    },
    {
      quote:
        "I've always been wary of where my donations go, but Seeing exactly how my contribution helped a family in Nuwara was a powerful experience.",
      author: "Dulan de Silva",
      role: "Donor, Colombo",
      avatar: "https://i.pravatar.cc/400?img=17",
    },
    {
      quote:
        "As a local officer, I value the integrity of the verification process. Hopeconnect works closely with us to identify the most vulnerable members of our community.",
      author: "Lakshman Perera",
      role: "Grama Niladhari, Walpita",
      avatar: "https://i.pravatar.cc/400?img=59",
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>
      <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 pt-14">
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1920"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl text-left"
            >
              <h1 className="flex flex-col text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-6 tracking-tight leading-[1.05]">
                <span className="text-white/90">Empowring</span>
                <span className="text-emerald-400">the unheard.</span>
              </h1>
              <p className="text-lg md:text-xl text-emerald-50/80 max-w-xl mb-10 leading-relaxed font-serif italic">
                Where technology meets compassion to serve verified community
                needs across Sri Lanka through direct, transparent support.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-5 mt-4">
                <Link
                  to="/request-support"
                  className="w-full sm:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-2xl shadow-emerald-500/40 transition-all transform hover:-translate-y-1.5 active:scale-95 uppercase tracking-widest text-[11px] inline-flex items-center justify-center gap-3 group duration-300"
                >
                  Request Support
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/donate"
                  className="w-full sm:w-auto px-12 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-2xl font-bold transition-all transform hover:-translate-y-1.5 active:scale-95 uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 duration-300"
                >
                  <Heart className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                  Donate Now
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-28 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-1/2 relative"
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
                <div className="relative z-10 bg-emerald-50 rounded-[3rem] p-4">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1664461348296-2dc2207b1c82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgyfHx0cnVzdHxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Official Verification"
                    className="rounded-[2.5rem] w-full aspect-[4/5] object-cover shadow-2xl"
                  />
                  <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-50 group max-w-[240px]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold text-emerald-950 text-sm leading-tight">
                        Verified by Local Authorities
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      Every request features a digital verification certificate
                      from the respective Grama Niladhari.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="lg:w-1/2">
                <h2 className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase pb-4">
                  UNCOMPROMISING INTEGRITY
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-8 leading-[1.1] tracking-tight">
                  Trust is our{" "}
                  <span className="text-emerald-600 italic">Foundation.</span>
                </h3>
                <p className="text-lg text-gray-600 pb-8 leading-relaxed font-serif italic">
                  In a world of information overload, we ensure every story you
                  see on Hopeconnect is authenticated. We've built the first
                  digital bridge between grassroots needs and official
                  government verification.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: "Mandatory GN Certificates",
                      desc: "No project goes live without a physical verification report from the village officer.",
                    },
                    {
                      title: "Evidence-Based Support",
                      desc: "Medical records, school letters, and damage assessments are audited manually.",
                    },
                    {
                      title: "Zero-Intermediary Leakage",
                      desc: "Transparent allocation ensures resources reach the beneficiary's doorstep.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-5 group"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-emerald-950 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-900/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-xs font-bold tracking-[0.4em] uppercase mb-4">
                <span className="text-emerald-400">PROCESS</span>
              </h2>
              <h3 className="text-4xl font-bold mb-4 tracking-tight">
                How Hope is Delivered
              </h3>
              <h4 className="text-emerald-100/60 max-w-xl mx-auto font-serif italic">
                A transparent, secure, and respectful journey for every request.
              </h4>
            </div>

            <div className="grid md:grid-cols-4 gap-12 relative">
              <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-800/0 via-emerald-800 to-emerald-800/0"></div>

              {[
                {
                  step: "01",
                  title: "Submit Request",
                  icon: Search,
                  desc: "Submit a need with supporting documents for medical, education, or disaster relief.",
                },
                {
                  step: "02",
                  title: "Official Verification",
                  icon: Fingerprint,
                  desc: "Local Grama Niladhari officers verify the authenticity and urgency of each case.",
                },
                {
                  step: "03",
                  title: "Community Funding",
                  icon: Users,
                  desc: "Verified projects are published for transparent public donations and support.",
                },
                {
                  step: "04",
                  title: "Direct Impact",
                  icon: Truck,
                  desc: "Resources are delivered directly to beneficiaries with documented impact reports.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative group pt-16"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-400 font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-12 z-20 shadow-xl border border-white/10">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-emerald-500 mb-2 uppercase tracking-widest">
                      {item.step}
                    </div>
                    <h4 className="text-lg font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-emerald-100/50 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-4">
                  IMMEDIATE NEED
                </h2>
                <h3 className="text-3xl font-bold text-emerald-950 mb-4 tracking-tight">
                  Ongoing Projects
                </h3>
                <div className="w-65 h-1 bg-emerald-600 rounded-full"></div>
              </div>
              <Link
                to="/projects"
                className="hidden sm:flex text-emerald-600 font-bold items-center gap-1 hover:underline text-xs uppercase tracking-widest"
              >
                View all projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {projectsLoading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-emerald-700">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-sm font-medium">Loading projects…</p>
              </div>
            )}

            {projectsError && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-red-500">
                <AlertCircle className="w-10 h-10" />
                <p className="text-sm font-medium">
                  Failed to load projects. Please try again.
                </p>
              </div>
            )}

            {!projectsLoading &&
              !projectsError &&
              activeProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
                  <Search className="w-10 h-10" />
                  <p className="text-sm font-medium">
                    No active projects at the moment.
                  </p>
                </div>
              )}

            {!projectsLoading &&
              !projectsError &&
              activeProjects.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeProjects.map((project, i) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-[2rem] overflow-hidden border border-emerald-50 shadow-xl shadow-emerald-950/5 group transition-all flex flex-col h-full"
                    >
                      <div className="h-64 relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-6 left-6">
                          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-bold text-emerald-900 uppercase tracking-widest shadow-sm">
                            {getCategoryLabel(project.category)}
                          </div>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-emerald-950 mb-4 leading-tight group-hover:text-emerald-600 transition-all duration-300">
                          {project.title}
                        </h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium line-clamp-3">
                          {project.description}
                        </p>

                        <div className="mt-auto pt-6 border-t border-emerald-50">
                          <div className="flex flex-col space-y-6">
                            {project.budget > 0 && (
                              <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                  <span className="text-gray-400">
                                    Raised:{" "}
                                    <span className="text-emerald-600">
                                      LKR {project.fundsRaised.toLocaleString()}
                                    </span>
                                  </span>
                                  <span className="text-emerald-950">
                                    {Math.min(
                                      Math.round(
                                        (project.fundsRaised / project.budget) *
                                          100,
                                      ),
                                      100,
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{
                                      width: `${Math.min((project.fundsRaised / project.budget) * 100, 100)}%`,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-emerald-600 rounded-full"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <Link
                                to={`/projects/${project._id}`}
                                className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all text-xs uppercase tracking-widest px-4 py-2 border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 w-fit duration-300"
                              >
                                Read More <ArrowRight className="w-4 h-4" />
                              </Link>
                              <Link
                                to="/donate"
                                className="inline-flex items-center gap-2 font-bold transition-all text-xs uppercase tracking-widest px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 w-fit shadow-md shadow-emerald-200 duration-300"
                              >
                                Donate
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
          </div>
        </section>

        <section className="py-16 md:py-24 bg-emerald-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent)] opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-[11px] font-bold tracking-[0.4em] text-emerald-400/80 uppercase mb-4">
              OUR IMPACT IN NUMBERS
            </h3>
            <p className="text-lg text-emerald-100/60 pb-14  mx-auto italic font-serif">
              "Since 2021, we have been working tirelessly across SRI LANKA."
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  label: "Families Supported",
                  value: 40,
                  suffix: "+",
                  icon: Users,
                },
                {
                  label: "Funds Raised",
                  value: 1,
                  suffix: "M",
                  prefix: "LKR ",
                  icon: BarChart3,
                },
                {
                  label: "Total Requests",
                  value: 500,
                  suffix: "+",
                  icon: Globe2,
                },
                {
                  label: "Districts Covered",
                  value: 4,
                  suffix: "/25",
                  icon: MapPin,
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <div className="text-4xl md:text-5xl font-bold font-display tracking-tight">
                    {stat.prefix}
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-emerald-400/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-14">
              <div>
                <h2 className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-4">
                  MOMENTS OF HOPE
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4 tracking-tight leading-[1.1]">
                  Recent{" "}
                  <span className="text-emerald-600 italic font-serif font-medium">
                    Activities
                  </span>
                </h3>
                <div className="w-64 h-1 bg-emerald-600 rounded-full" />
              </div>
              <Link
                to="/activities"
                className="hidden sm:flex text-emerald-600 font-bold items-center gap-1 hover:underline text-xs uppercase tracking-widest"
              >
                View all activities <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <RecentActivities />

            <div className="mt-10 text-center sm:hidden">
              <Link
                to="/activities"
                className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline"
              >
                View all activities <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-emerald-950 border-y border-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-[10px] font-bold tracking-[0.4em] text-emerald-400/80 uppercase mb-2">
                STRATEGIC PARTNERS
              </h3>
              <div className="w-20 h-1 bg-emerald-100/60 mx-auto rounded-full"></div>
            </div>

            <div className=" flex flex-wrap items-center justify-center gap-12 md:gap-24 transition-all duration-700">
              {[
                { name: "Global Relief", icon: Globe2 },
                { name: "Digital Trust", icon: ShieldCheck },
                { name: "Youth Impact", icon: Users },
                { name: "Future Lanka", icon: Building2 },
                { name: "Tech Aid", icon: ActivityIcon },
              ].map((partner, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 group/partner cursor-default opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
                >
                  <partner.icon className="w-8 h-8 text-white" />
                  <span className="font-bold text-xl tracking-tighter text-white uppercase">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-emerald-50/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="p-12 md:p-20 bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/10 relative text-center border border-emerald-100 min-h-125 flex flex-col justify-center"
            >
              <div className="absolute top-0 right-0 p-10 opacity-50">
                <MessageSquare className="w-16 h-16 md:w-28 md:h-28 text-emerald-400" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-[1.5rem] mx-auto mb-8 overflow-hidden border-4 border-white shadow-xl rotate-3">
                    <img
                      src={testimonials[activeTestimonial].avatar}
                      alt="Profile"
                      className="-rotate-3 w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-xl md:text-2xl text-emerald-950 italic font-serif leading-relaxed mb-8">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  <div className="font-bold text-emerald-950 text-lg">
                    {testimonials[activeTestimonial].author}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2">
                    {testimonials[activeTestimonial].role}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-4 mt-12">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-2xl border border-emerald-100 flex items-center justify-center hover:bg-emerald-50 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6 text-emerald-600" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-2xl border border-emerald-100 flex items-center justify-center hover:bg-emerald-50 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6 text-emerald-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 p-12 md:p-24 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 max-w-2xl mx-auto leading-tight tracking-tight flex flex-wrap items-center justify-center gap-3">
              We are really proud of our kind volunteers & donors{" "}
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white animate-pulse" />
              </div>
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/donate"
                className="px-12 py-5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-[1.5rem] font-bold shadow-2xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-black/30 hover:scale-105 duration-300"
              >
                Donate Now
              </Link>
              <button
                onClick={() => navigate("/volunteer")}
                className="px-12 py-5 bg-white/10 hover:bg-white/20 text-white rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md border border-white/30 uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-black/30 hover:scale-105 duration-300"
              >
                <Users className="w-5 h-5" /> Be a Volunteer
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}