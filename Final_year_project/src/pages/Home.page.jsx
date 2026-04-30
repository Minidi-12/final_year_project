import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
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
  Share2 as Facebook,
  Share2 as Twitter,
  Share2 as Instagram,
  Share2 as Linkedin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useNavigate, Link } from "react-router";
 
export default function Home() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
 
  const navItems = [
    { label: "HOME", href: "/", dropdown: null },
    { label: "ABOUT US", href: "/about-us", dropdown: null },
    { label: "OUR WORK", href: "#", dropdown: ["PROJECTS", "ONGOING PROJECTS", "PROJECT ACHIEVEMENTS", "CAMPAIGNS"] },
    { label: "NEWS", href: "#", dropdown: null },
    { label: "RESOURCES", href: "#", dropdown: ["ANNUAL REPORTS", "RESEARCH REPORTS", "AWARENESS MATERIALS", "OUR PUBLICATIONS"] },
    { label: "CONTACT US", href: "#", dropdown: null },
  ];
 
  const getInvolvedDropdown = ["DONATE", "VOLUNTEER", "REQUEST SUPPORT"];
 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };
 
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
 
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-emerald-900 uppercase">HOPELINK</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-[11px] font-bold tracking-widest text-gray-500 uppercase">
              {navItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative group h-16 flex items-center"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href.startsWith('/') ? (
                    <Link 
                      to={item.href} 
                      className={`flex items-center gap-1 transition-colors hover:text-emerald-600 ${item.label === "HOME" ? "text-emerald-600" : ""}`}
                    >
                      {item.label}
                      {item.dropdown && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.label ? "rotate-180" : ""}`} />}
                    </Link>
                  ) : (
                    <a 
                      href={item.href} 
                      className={`flex items-center gap-1 transition-colors hover:text-emerald-600 ${item.label === "HOME" ? "text-emerald-600" : ""}`}
                    >
                      {item.label}
                      {item.dropdown && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.label ? "rotate-180" : ""}`} />}
                    </a>
                  )}
 
                  <AnimatePresence>
                    {item.dropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 w-64 bg-white border border-emerald-100 rounded-2xl shadow-2xl shadow-emerald-900/10 p-3 z-50 pointer-events-auto"
                      >
                        {item.dropdown.map((subItem) => (
                          <a 
                            key={subItem} 
                            href="#" 
                            className="block px-4 py-3 text-[10px] text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all font-bold tracking-widest"
                          >
                            {subItem}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
 
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden md:block px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-all border border-emerald-200 uppercase tracking-widest">
                Officer Login
              </Link>
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown("GET INVOLVED")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-4 xl:px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 uppercase tracking-widest flex items-center gap-2">
                  GET INVOLVED
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "GET INVOLVED" ? "rotate-180" : ""}`} />
                </button>
 
                <AnimatePresence>
                  {activeDropdown === "GET INVOLVED" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-emerald-950 text-white rounded-[1.5rem] shadow-2xl p-3 z-50 border border-white/10"
                    >
                      {getInvolvedDropdown.map((subItem) => (
                        <button 
                          key={subItem} 
                          onClick={() => {
                            if (subItem === "REQUEST SUPPORT") navigate("/request-support");
                            else if (subItem === "VOLUNTEER") navigate("/volunteer");
                          }}
                          className="w-full text-left px-4 py-3 text-[10px] text-emerald-100/60 hover:text-white hover:bg-white/10 rounded-xl transition-all font-bold tracking-widest uppercase"
                        >
                          {subItem}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>
 
      {/* Hero Section */}
      <section className="relative h-screen max-h-[900px] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Overlay */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 lg:mb-6 border border-white/10">
              <Globe2 className="w-3 h-3" /> <span>Direct Community Support</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-display text-white mb-4 lg:mb-6 tracking-tight leading-[1.05]">
              Empowering <br />
              <span className="text-emerald-400">the unheard.</span>
            </h1>
            <p className="text-base lg:text-lg xl:text-xl text-emerald-50/80 max-w-xl mb-6 lg:mb-8 leading-relaxed font-serif italic">
              Where technology meets compassion to serve verified community needs across Sri Lanka through direct, transparent support.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/request-support" className="px-8 lg:px-10 xl:px-12 py-3.5 lg:py-4 xl:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-2xl shadow-emerald-500/40 transition-all transform hover:-translate-y-1.5 active:scale-95 uppercase tracking-widest text-[11px] inline-flex items-center justify-center gap-3 group">
                Request Support 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 lg:px-10 xl:px-12 py-3.5 lg:py-4 xl:py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-2xl font-bold transition-all transform hover:-translate-y-1.5 active:scale-95 uppercase tracking-widest text-[11px] flex items-center justify-center gap-3">
                <Heart className="w-4 h-4 text-emerald-400" /> 
                Donate Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
 
      {/* Our Mission */}
      <section className="py-12 lg:py-16 xl:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center"
          >
            <h2 className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-3">OUR MISSION</h2>
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-emerald-950 mb-10 lg:mb-12 xl:mb-16 tracking-tight px-4">Protecting rights & wellbeing of everyone</h3>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { title: "Local GN Verification", icon: ShieldCheck, desc: "Working with local Grama Niladhari officers to ensure every request is genuine and reaches the right hands." },
                { title: "Transparent Fund Tracking", icon: FileCheck, desc: "Track every LKR you donate in real-time. We believe in total financial transparency and accountability." },
                { title: "Direct Beneficiary Support", icon: HandHeart, desc: "Your support goes directly to those in need, bypassing intermediaries and maximizing community impact." }
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="p-6 lg:p-8 rounded-3xl bg-emerald-50/30 border border-emerald-100 hover:bg-emerald-50 transition-all group cursor-default">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 lg:mb-6 shadow-sm group-hover:scale-110 transition-transform border border-emerald-50">
                    <item.icon className="w-7 h-7 lg:w-8 lg:h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-lg lg:text-xl font-bold text-emerald-900 mb-3 lg:mb-4">{item.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
 
            <Link 
              to="/about-us"
              className="mt-16 inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all text-xs uppercase tracking-widest cursor-pointer"
            >
              Learn more about Hopelink <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
 
      {/* Ongoing Projects */}
      <section className="py-12 lg:py-16 xl:py-20 bg-emerald-50/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 lg:mb-10 xl:mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-3">IMMEDIATE NEED</h2>
              <h3 className="text-2xl lg:text-3xl font-bold text-emerald-950 mb-2 tracking-tight">Ongoing Projects</h3>
              <div className="w-20 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
            <a href="#" className="text-emerald-600 font-bold flex items-center gap-1 hover:underline text-xs uppercase tracking-widest">
              View all projects <ArrowRight className="w-4 h-4" />
            </a>
          </div>
 
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Educational support", raised: 450000, target: 600000, progress: 75, image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" },
              { title: "Renevate a home", raised: 50000, target: 100000, progress: 50, image: "" },
              { title: "Medical Support for Elders", raised: 120000, target: 200000, progress: 60, image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800" }
            ].map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-emerald-900/5 group border border-emerald-100"
              >
                <div className="h-48 lg:h-56 xl:h-64 relative overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 lg:top-6 left-4 lg:left-6">
                    <span className="px-3 lg:px-4 py-1.5 lg:py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">URGENT</span>
                  </div>
                </div>
                <div className="p-6 lg:p-8 xl:p-10">
                  <h4 className="text-lg lg:text-xl font-bold text-emerald-950 mb-5 lg:mb-6 leading-tight">{project.title}</h4>
                  <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-gray-400">Raised: <span className="text-emerald-600">LKR {project.raised.toLocaleString()}</span></span>
                      <span className="text-emerald-950">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <button className="w-full py-3.5 lg:py-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-900 hover:text-white font-bold rounded-2xl transition-all border border-emerald-100 uppercase tracking-widest text-[10px] active:scale-95">
                    Donate Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Impact Numbers */}
      <section className="py-12 lg:py-16 xl:py-20 bg-emerald-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent)] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-[11px] font-bold tracking-[0.4em] text-emerald-400 uppercase mb-3 lg:mb-4">OUR IMPACT IN NUMBERS</h2>
          <p className="text-base lg:text-lg text-emerald-100/60 mb-10 lg:mb-12 xl:mb-16 max-w-2xl mx-auto italic font-serif px-4">
            "Since 2021, we have been working tirelessly across SRI LANKA."
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 xl:gap-12">
            {[
              { label: "Families Supported", value: "100+", icon: Users },
              { label: "Funds Raised", value: "LKR 100,000", icon: BarChart3 },
              { label: "Total Requests", value: "120", icon: Globe2 },
              { label: "Districts Covered", value: "2/25", icon: MapPin }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-3 lg:space-y-4"
              >
                <div className="text-3xl lg:text-4xl xl:text-5xl font-bold font-display tracking-tight">{stat.value}</div>
                <div className="text-emerald-400/40 text-[10px] font-bold uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Recent Activities */}
      <section className="py-12 lg:py-16 xl:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12 xl:mb-16">
            <h2 className="text-xs font-bold tracking-[0.3em] text-emerald-600 uppercase mb-3 lg:mb-4">MOMENTS OF HOPE</h2>
            <h3 className="text-2xl lg:text-3xl font-bold text-emerald-950 mb-4 tracking-tight">Recent Activities</h3>
            <div className="w-12 h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800"
            ].map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12 }}
                className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-100 border border-emerald-50 shadow-lg shadow-emerald-900/5 group"
              >
                <img src={img} alt="Activity" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Testimonials */}
      <section className="py-16 lg:py-24 xl:py-32 bg-[#FDFCFB] overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-8 lg:p-12 xl:p-16 bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 relative text-center border border-emerald-50"
          >
            <div className="absolute top-0 right-0 p-6 lg:p-10 opacity-5">
              <MessageSquare className="w-24 h-24 lg:w-32 lg:h-32 text-emerald-600" />
            </div>
            
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-emerald-100 rounded-[1.5rem] mx-auto mb-6 lg:mb-8 overflow-hidden border-4 border-white shadow-xl rotate-3">
              <img src="" alt="Profile" className="-rotate-3 w-full h-full object-cover" />
            </div>
            
            <div className="relative z-10">
              <p className="text-lg lg:text-xl xl:text-2xl text-emerald-950 italic font-serif leading-relaxed mb-6 lg:mb-8">
                "Hopelink made it possible for our community to get the medical equipment we desperately needed. The process was fast, respectful, and completely transparent."
              </p>
              <div className="font-bold text-emerald-950 text-base lg:text-lg">Sanduni Anuththara</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2">Grama Niladari Walpita</div>
            </div>
 
            <div className="flex justify-center gap-4 mt-10 lg:mt-12">
              <button className="w-12 h-12 rounded-2xl border border-emerald-100 flex items-center justify-center hover:bg-emerald-50 transition-colors">
                <ChevronLeft className="w-6 h-6 text-emerald-600" />
              </button>
              <button className="w-12 h-12 rounded-2xl border border-emerald-100 flex items-center justify-center hover:bg-emerald-50 transition-colors">
                <ChevronRight className="w-6 h-6 text-emerald-600" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
 
      {/* Pride Section */}
      <section className="py-16 lg:py-24 xl:py-32 bg-white px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-emerald-900 rounded-[2rem] lg:rounded-[3rem] xl:rounded-[4rem] p-8 lg:p-16 xl:p-24 relative overflow-hidden text-center shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.2),transparent)]"></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-8 lg:mb-10 xl:mb-12 max-w-2xl mx-auto leading-tight tracking-tight flex flex-wrap items-center justify-center gap-3">
                We are really proud of our kind volunteers & donors <Heart className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-emerald-400 fill-current shrink-0" />
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
                <button className="px-8 lg:px-10 xl:px-12 py-4 lg:py-4.5 xl:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-bold shadow-2xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  Donate Now
                </button>
                <button 
                  onClick={() => navigate("/volunteer")}
                  className="px-8 lg:px-10 xl:px-12 py-4 lg:py-4.5 xl:py-5 bg-white/10 hover:bg-white/20 text-white rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md border border-white/20 uppercase tracking-widest text-xs"
                >
                  <Users className="w-5 h-5" /> Be a Volunteer
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
 
      {/* Footer */}
      <footer className="bg-gray-50 pt-16 lg:pt-20 xl:pt-24 pb-8 lg:pb-12 border-t border-emerald-100/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12 lg:mb-16 xl:mb-20">
            {/* Branding */}
            <div className="space-y-6 lg:space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-5 lg:mb-6">
                  <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center rotate-3">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl lg:text-2xl font-bold font-display text-emerald-950 tracking-tight uppercase">HOPELINK</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed italic font-serif">
                  "Empowering the unheard, Rebuilding Lives where technology meets compassion."
                </p>
              </div>
 
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
 
            {/* Navigation */}
            <div className="lg:pl-12">
              <h3 className="font-bold text-emerald-950 mb-6 lg:mb-8 uppercase tracking-widest text-[10px]">Main Menu</h3>
              <ul className="space-y-3 lg:space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                {["Home", "About Us", "Our Work", "News", "Contact Us"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-emerald-600 transition-colors flex items-center gap-2 group">
                      <div className="w-0 group-hover:w-3 h-0.5 bg-emerald-600 transition-all duration-300"></div>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
 
            {/* Contact */}
            <div>
              <h3 className="font-bold text-emerald-950 mb-6 lg:mb-8 uppercase tracking-widest text-[10px]">Contact</h3>
              <ul className="space-y-5 lg:space-y-6">
                {[
                  { icon: MapPin, text: "456 Unity Tower, Galle Road, Colombo 03, SL" },
                  { icon: Phone, text: "+94 11 234 5678" },
                  { icon: Mail, text: "hello@hopelink.org" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0 border border-emerald-50">
                      <item.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
 
            {/* Newsletter */}
            <div className="space-y-4 lg:space-y-6">
              <h3 className="font-bold text-emerald-950 mb-6 lg:mb-8 uppercase tracking-widest text-[10px]">Newsletter</h3>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white border border-emerald-100 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
 
          <div className="pt-6 lg:pt-8 border-t border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
            <p className="text-center md:text-left">© 2026 Hopelink Foundation. All Rights Reserved.</p>
            <div className="flex gap-6 lg:gap-8">
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
