import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import {
  Heart,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Sparkles,
  Clock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Loader2,
  TrendingUp,
  MapPin,
  Target,
  AlertCircle,
} from "lucide-react";

import { useNavigate, Link } from "react-router";

const API_URL = "https://final-year-project-backend-su8k.onrender.com";

// — Fix: helper to track previously submitted emails in sessionStorage
//   so duplicate submissions within the same browser session are caught
//   before hitting the API.
const SUBMITTED_KEY = "hc_volunteer_submitted_emails";
function getSubmittedEmails() {
  try {
    return JSON.parse(sessionStorage.getItem(SUBMITTED_KEY) || "[]");
  } catch {
    return [];
  }
}
function markEmailSubmitted(email) {
  const list = getSubmittedEmails();
  if (!list.includes(email.toLowerCase())) {
    sessionStorage.setItem(SUBMITTED_KEY, JSON.stringify([...list, email.toLowerCase()]));
  }
}

export default function Volunteer() {
  const navigate = useNavigate();
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [isSuccess,       setIsSuccess]       = useState(false);
  const [isLoadingMatches,setIsLoadingMatches]= useState(false);
  const [matchedProjects, setMatchedProjects] = useState([]);

  // — Fix: per-field validation errors and touched tracking
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched,     setTouched]     = useState({});

  const [formData, setFormData] = useState({
    name:            "",
    email:           "",
    Phone_no:        "",
    skills:          [],
    selectedProject: "",
    availability:    "flexible",
    message:         "",
  });

  const skillOptions = [
    "Teaching",
    "Medical Support",
    "Event Planning",
    "Digital Marketing",
    "Logistics",
    "Translation",
    "Counseling",
    "General Labor",
    "Disaster Relief",
  ];

  // — Fix: frontend validation function
  const validate = (data) => {
    const e = {};
    if (!data.name.trim())
      e.name = "Please enter your full name.";
    else if (data.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";

    if (!data.email.trim())
      e.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "That doesn't look like a valid email.";
    else if (getSubmittedEmails().includes(data.email.toLowerCase()))
      e.email = "This email has already been used to register. Each volunteer uses a unique email.";

    if (!data.Phone_no.trim())
      e.Phone_no = "Please enter your phone number.";
    else if (!/^[0-9]{10}$/.test(data.Phone_no.trim()))
      e.Phone_no = "Enter a valid 10-digit Sri Lankan number (e.g. 0771234567).";

    if (data.skills.length === 0)
      e.skills = "Please select at least one skill.";

    if (!data.selectedProject)
      e.selectedProject = "Please select a project from the matches below.";

    return e;
  };

  const blurField = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setFieldErrors(validate(formData));
  };

  useEffect(() => {
    const fetchMatchingProjects = async () => {
      if (formData.skills.length === 0) {
        setMatchedProjects([]);
        return;
      }
      setIsLoadingMatches(true);
      try {
        const response = await axios.post(
          `${API_URL}/api/volunteers/match/preview`,
          { skills: formData.skills.map((s) => s.toLowerCase()) }
        );
        setMatchedProjects(response.data.matches || []);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatchedProjects([]);
      } finally {
        setIsLoadingMatches(false);
      }
    };

    const timeoutId = setTimeout(fetchMatchingProjects, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.skills]);

  const handleToggleSkill = (skill) => {
    const next = {
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter((s) => s !== skill)
        : [...formData.skills, skill],
      selectedProject: "",
    };
    setFormData(next);
    if (touched.skills) setFieldErrors(validate(next));
  };

  const handleChange = (field, value) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    if (touched[field]) setFieldErrors(validate(next));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Touch all fields to show any remaining errors
    const allTouched = Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(formData);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/api/volunteers`, {
        project_id:   formData.selectedProject,
        name:         formData.name,
        email:        formData.email,
        Phone_no:     formData.Phone_no,
        skills:       formData.skills.map((s) => s.toLowerCase()),
        availability: formData.availability,
        message:      formData.message,
      });

      console.log("Registration successful:", response.data);
      // — Fix: mark this email as submitted so re-submissions are blocked
      markEmailSubmitted(formData.email);
      setIsSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      const serverMsg = error.response?.data?.error || "";
      // Surface the error in-form rather than alert() for duplicate errors
      if (serverMsg.toLowerCase().includes("duplicate") || serverMsg.toLowerCase().includes("already")) {
        markEmailSubmitted(formData.email);
        setFieldErrors(e => ({ ...e, email: "This email is already registered as a volunteer." }));
        setTouched(t => ({ ...t, email: true }));
      } else {
        alert(serverMsg || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: error message display
  const ErrMsg = ({ field }) =>
    touched[field] && fieldErrors[field] ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500 mt-1.5"
      >
        <AlertCircle className="w-3 h-3 shrink-0" /> {fieldErrors[field]}
      </motion.p>
    ) : null;

  const inputCls = (field) =>
    `w-full bg-gray-50 border rounded-2xl px-6 py-4 text-sm font-semibold focus:bg-white outline-none focus:ring-4 transition-all ${
      touched[field] && fieldErrors[field]
        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
        : "border-emerald-50 focus:ring-emerald-500/10 focus:border-emerald-500"
    }`;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl shadow-emerald-900/10 border border-emerald-50"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-950 mb-4 tracking-tight">
            Welcome to the Team!
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 italic">
            Thank you for applying to be a volunteer. Our community coordinator
            will reach out within 48 hours. We're also finding the best project
            matches for your skills!
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-200 active:scale-95"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans">
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">

        <div className="lg:w-2/5 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-bold text-emerald-950 mb-6 leading-[1.1] tracking-tight">
              Small acts, <br />
              <span className="text-emerald-600 font-serif italic font-medium">
                Big Changes.
              </span>
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed italic text-lg font-serif">
              Join our network of 75+ volunteers making a difference across Sri
              Lanka. Whether you have 2 hours or 20, your skills can change
              lives.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: Users,
                title: "Community Driven",
                desc: "Work directly with local families and leaders.",
              },
              {
                icon: Compass,
                title: "Skill Growth",
                desc: "Gain experience in social work and logistics.",
              },
              {
                icon: ShieldCheck,
                title: "Certified Impact",
                desc: "Receive official volunteer certificates.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-emerald-50 shadow-sm"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:w-3/5">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-emerald-950/5 border border-emerald-50 space-y-10"
          >
            {/* Personal details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Minidi Sathpiyumi"
                  className={inputCls("name")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => blurField("name")}
                />
                <ErrMsg field="name" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="mini@example.com"
                  className={inputCls("email")}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => blurField("email")}
                />
                <ErrMsg field="email" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0771234567"
                  className={inputCls("Phone_no")}
                  value={formData.Phone_no}
                  onChange={(e) => handleChange("Phone_no", e.target.value)}
                  onBlur={() => blurField("Phone_no")}
                />
                <ErrMsg field="Phone_no" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Availability
                </label>
                <select
                  className="w-full bg-gray-50 border border-emerald-50 rounded-2xl px-6 py-4 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  value={formData.availability}
                  onChange={(e) => handleChange("availability", e.target.value)}
                >
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest block">
                Select Your Skills <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all border ${
                      formData.skills.includes(skill)
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                        : "bg-white border-emerald-100 text-emerald-900/40 hover:border-emerald-600 hover:text-emerald-600"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {formData.skills.length > 0 && (
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3 h-3" />
                  {formData.skills.length} skill{formData.skills.length > 1 ? "s" : ""} selected
                </p>
              )}
              <ErrMsg field="skills" />
            </div>

            {/* Project matches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest">
                  {matchedProjects.length > 0 ? "Best Matches For You" : "Select Project"}
                  {" "}<span className="text-red-400">*</span>
                </label>
                {isLoadingMatches && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      Finding matches...
                    </span>
                  </div>
                )}
              </div>

              {formData.skills.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-emerald-100 text-center">
                  <Sparkles className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-400 font-medium">
                    Select your skills above to see matching projects
                  </p>
                </div>
              ) : matchedProjects.length === 0 && !isLoadingMatches ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-amber-100 bg-amber-50/30 text-center">
                  <p className="text-xs text-amber-600 font-medium">
                    No matching projects found. Please try different skills.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {matchedProjects.map((match, index) => (
                      <motion.button
                        key={match.project._id}
                        type="button"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleChange("selectedProject", match.project._id)}
                        className={`p-5 rounded-2xl text-left transition-all border group relative overflow-hidden ${
                          formData.selectedProject === match.project._id
                            ? "bg-emerald-50 border-emerald-600 shadow-md"
                            : "bg-white border-emerald-50 hover:border-emerald-400/50 hover:shadow-sm"
                        }`}
                      >
                        <div
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                            match.matchScore >= 70
                              ? "bg-emerald-600 text-white"
                              : match.matchScore >= 40
                              ? "bg-amber-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {match.matchScore}% Match
                        </div>

                        <div className="pr-20">
                          <div className="flex items-start gap-3 mb-3">
                            <CheckCircle2
                              className={`w-5 h-5 transition-all mt-0.5 ${
                                formData.selectedProject === match.project._id
                                  ? "text-emerald-600 opacity-100"
                                  : "text-gray-300 opacity-0 group-hover:opacity-50"
                              }`}
                            />
                            <div className="flex-1">
                              <h4
                                className={`text-sm font-bold mb-1 leading-tight ${
                                  formData.selectedProject === match.project._id
                                    ? "text-emerald-700"
                                    : "text-emerald-950"
                                }`}
                              >
                                {match.project.title}
                              </h4>
                              <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                                {match.project.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-3 text-[9px] text-gray-400 font-bold uppercase">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {match.project.location}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded-md">
                              {match.project.category?.replace(/_/g, " ")}
                            </span>
                          </div>

                          {match.matchedSkills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {match.matchedSkills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-bold uppercase tracking-wide"
                                >
                                  ✓ {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {match.missingSkills?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {match.missingSkills.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-gray-100 text-gray-400 rounded-lg text-[9px] font-bold uppercase tracking-wide"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              <ErrMsg field="selectedProject" />
            </div>

            {/* Message */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Why do you want to volunteer?
              </label>
              <textarea
                placeholder="Share your passion..."
                className="w-full bg-gray-50 border border-emerald-50 rounded-2xl px-6 py-4 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all h-32 resize-none"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 disabled:cursor-not-allowed text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.25em] shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  Submit My Application
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.form>

          <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Private & Secure Application Process
          </p>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #059669; }
      `}</style>
    </div>
  );
}