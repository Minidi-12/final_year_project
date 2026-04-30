import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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
  Compass
} from "lucide-react";
import { useNavigate, Link } from "react-router";

export default function Volunteer() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    Phone_no: "",
    skills: [],
    selectedProject: "",
    availability: "flexible",
    message: ""
  });

  const skillOptions = [
    "Teaching", "Medical Support", "Event Planning", "Digital Marketing", 
    "Logistics", "Translation", "Counseling", "General Labor"
  ];

  const projectOptions = [
    { id: "edu", name: "Education for All", desc: "Teaching children in rural areas" },
    { id: "med", name: "Medical Outreach", desc: "Mobile clinics and health camps" },
    { id: "dis", name: "Disaster Relief", desc: "Emergency response and logistics" },
    { id: "hou", name: "Community Housing", desc: "Building sustainable shelters" }
  ];

  const handleToggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

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
          <h1 className="text-3xl font-bold text-emerald-950 mb-4 tracking-tight font-display">Welcome to the Team!</h1>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 italic">
            Thank you for applying to be a volunteer. Our community coordinator will reach out to you within 48 hours to discuss next steps.
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
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display text-emerald-950 leading-none">HOPELINK</span>
              <span className="text-[8px] font-bold text-emerald-600 tracking-[0.3em] uppercase">Foundations</span>
            </div>
          </Link>
          <Link to="/" className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Exit to Website
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Left Side: Info */}
        <div className="lg:w-2/5 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" /> <span>Humanitarian Impact</span>
            </div>
            <h1 className="text-5xl font-bold text-emerald-950 mb-6 leading-[1.1] tracking-tight">
              Small acts, <br />
              <span className="text-emerald-600 font-serif italic font-medium">Big Changes.</span>
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed italic text-lg font-serif">
              Join our network of 500+ volunteers making a difference across Sri Lanka. Whether you have 2 hours or 20, your skills can change lives.
            </p>
          </motion.div>

          <div className="space-y-6">
             {[
               { icon: Users, title: "Community Driven", desc: "Work directly with local families and leaders." },
               { icon: Compass, title: "Skill Growth", desc: "Gain experience in social work and logistics." },
               { icon: ShieldCheck, title: "Certified Impact", desc: "Receive official volunteer certificates." }
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
                   <h4 className="text-sm font-bold text-emerald-950 mb-1">{feature.title}</h4>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-3/5">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-emerald-950/5 border border-emerald-50 space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input 
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-emerald-50 rounded-2xl px-6 py-4 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input 
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border border-emerald-50 rounded-2xl px-6 py-4 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input 
                  required
                  type="tel"
                  placeholder="07XXXXXXXX"
                  className="w-full bg-gray-50 border border-emerald-50 rounded-2xl px-6 py-4 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={formData.Phone_no}
                  onChange={e => setFormData({...formData, Phone_no: e.target.value})}
                />
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Availability
                </label>
                <select 
                  className="w-full bg-gray-50 border border-emerald-50 rounded-2xl px-6 py-4 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                  value={formData.availability}
                  onChange={e => setFormData({...formData, availability: e.target.value})}
                >
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest block">Select Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
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
            </div>

            {/* Select Project */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest block">Select Project</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectOptions.map(project => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setFormData({...formData, selectedProject: project.id})}
                    className={`p-4 rounded-2xl text-left transition-all border group ${
                      formData.selectedProject === project.id
                        ? "bg-emerald-50 border-emerald-600 shadow-sm"
                        : "bg-white border-emerald-50 hover:border-emerald-600/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-xs font-bold uppercase tracking-tight ${
                        formData.selectedProject === project.id ? "text-emerald-700" : "text-emerald-900"
                      }`}>{project.name}</h4>
                      <CheckCircle2 className={`w-4 h-4 transition-opacity ${
                        formData.selectedProject === project.id ? "opacity-100 text-emerald-600" : "opacity-0"
                      }`} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight">{project.desc}</p>
                  </button>
                ))}
              </div>
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
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.25em] shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Submit My Application <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </motion.form>

          <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
             <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Private & Secure Application Process
          </p>
        </div>
      </main>
    </div>
  );
}