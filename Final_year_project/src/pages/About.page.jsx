import React from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  Heart, 
  Users, 
  ShieldCheck, 
  Target, 
  Eye, 
  MapPin, 
  Mail, 
  Phone,
  ArrowRight,
  Award,
  Globe,
  MessageCircle,
  HandHelping
} from "lucide-react";
import { Link } from "react-router";

export default function AboutUs() {
  const [activeApproach, setActiveApproach] = React.useState("listen");

  const approaches = {
    listen: {
      title: "We Listen",
      text: "A sensitive approach is crucial when talking to children who have been exploited and abused sexually. It is best to allow them to tell their story and show our empathy. We become the audience that listens to their experiences of pain, hurt and emotional changes.",
      icon: <MessageCircle className="w-5 h-5" />
    },
    care: {
      title: "We Care",
      text: "Beyond listening, we take active steps to ensure the well-being of every vulnerable individual. Our care programs focus on immediate relief and long-term psychological support, ensuring no one feels alone in their struggle.",
      icon: <Heart className="w-5 h-5" />
    },
    help: {
      title: "We Help",
      text: "Action is at the heart of HopeLink. We coordinate resources, verify needs, and provide direct assistance—whether it's food, medicine, or legal aid—to bridge the gap between crisis and stability.",
      icon: <HandHelping className="w-5 h-5" />
    }
  };

  const team = [
    { name: "Dr. Rohitha Perera", role: "Executive Director", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Samanthi Silva", role: "Head of Operations", image: "" },
    { name: "Dr. Anura Kumara", role: "Medical Advisor", image: "" },
    { name: "Nilukshi Bandara", role: "Community Outreach", image: "" },
    { name: "Sunil Gamage", role: "Financial Controller", image: "" },
    { name: "Priyantha Deepal", role: "Logistics Manager", image: "" },
    { name: "Dilrukshi Jayalath", role: "Legal Consultant", image: "" },
    { name: "Kamani Wijesinghe", role: "HR Relations", image: "" }
  ];

  const policies = [
    { title: "Transparency Policy", desc: "Every rupee donated is tracked and audit reports are published quarterly for public verification." },
    { title: "Verification Standard", desc: "All aid requests must pass a multi-level verification process involving local GN officers." },
    { title: "Equality & Inclusion", desc: "Support is provided regardless of ethnicity, religion, or political affiliation." },
    { title: "Data Privacy", desc: "Beneficiary data is cryptographically secured as per international digital safety standards." }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-emerald-950 tracking-tight uppercase">HOPELINK</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            <Link to="/" className="hover:text-emerald-600 transition-colors">HOME</Link>
            <Link to="/about-us" className="text-emerald-600">ABOUT US</Link>
            <a href="#" className="hover:text-emerald-600 transition-colors">OUR WORK</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">NEWS</a>
            <Link to="/login" className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-all font-bold">OFFICER LOGIN</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="px-6 max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              <Users className="w-3 h-3" /> <span>Our Identity</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-emerald-950 mb-8 tracking-tight"
            >
              Empowering communities with <br />
              <span className="text-emerald-600 font-serif italic font-medium">Transparency & Compassion.</span>
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="relative rounded-[3rem] overflow-hidden aspect-[4/3] shadow-2xl"
             >
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" 
                  alt="NGO Work" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent"></div>
             </motion.div>
             <div className="space-y-8">
                <div id="who-we-are">
                  <h2 className="text-3xl font-bold text-emerald-950 mb-6">Who We Are</h2>
                  <p className="text-gray-500 font-medium leading-relaxed italic mb-8">
                    Founded in 2021, HopeLink is a non-governmental organization dedicated to bridging the gap between donors and those in genuine need across Sri Lanka. Our platform uses advanced verification methods to ensure aid reaches the right hands.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-emerald-50 shadow-sm">
                      <Target className="w-8 h-8 text-emerald-600 mb-4" />
                      <h4 className="text-sm font-bold text-emerald-950 mb-2">Our Mission</h4>
                      <p className="text-xs text-gray-400 font-medium">To create a transparent welfare ecosystem that empowers every vulnerable citizen.</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-emerald-50 shadow-sm">
                      <Eye className="w-8 h-8 text-emerald-600 mb-4" />
                      <h4 className="text-sm font-bold text-emerald-950 mb-2">Our Vision</h4>
                      <p className="text-xs text-gray-400 font-medium">A Sri Lanka where no basic need goes unmet due to lack of coordination.</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        <section id="board" className="bg-emerald-950 py-32 text-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              <Award className="w-3 h-3" /> <span>The Architects of Hope</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-20 tracking-tight">Board of Members</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative mb-6 rounded-[2.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-xl">
                    <img src={member.image} alt={member.name} className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="policies" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-start">
             <div className="md:w-1/3">
                <div className="sticky top-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    <ShieldCheck className="w-3 h-3" /> <span>Standard Operating Procedures</span>
                  </div>
                  <h2 className="text-4xl font-bold text-emerald-950 mb-6 leading-tight">Built on a <br />Foundation of Trust</h2>
                  <p className="text-gray-400 font-medium leading-relaxed italic">
                    Our policies are designed to protect both the donor's intent and the beneficiary's dignity. We maintain strict compliance with NGO regulatory frameworks.
                  </p>
                </div>
             </div>
             <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {policies.map((policy, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-10 bg-white rounded-[3rem] border border-emerald-50 shadow-xl shadow-emerald-950/5 hover:border-emerald-200 transition-colors"
                  >
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-950 mb-3">{policy.title}</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{policy.desc}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* Polished Approach Section */}
        <section className="bg-emerald-950 py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {Object.entries(approaches).map(([id, app]) => (
                <button
                  key={id}
                  onClick={() => setActiveApproach(id)}
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 min-w-[200px] border-2 ${
                    activeApproach === id 
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-2xl shadow-emerald-600/20 transform -translate-y-1" 
                      : "bg-white/5 border-white/10 text-emerald-100 hover:bg-white/10 active:scale-95"
                  }`}
                >
                  {app.icon}
                  {app.title}
                </button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeApproach}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-4xl mx-auto"
              >
                <p className="text-xl md:text-2xl text-emerald-50 font-medium leading-relaxed tracking-wide opacity-90 italic font-serif">
                  {approaches[activeApproach]?.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="py-24 bg-gray-50/50 border-y border-emerald-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                <Globe className="w-3 h-3" /> <span>Global Network</span>
              </div>
              <h2 className="text-3xl font-bold text-emerald-950">Networks & Partnerships</h2>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {[
                { name: "UNICEF", icon: "https://www.unicef.org/sites/default/files/styles/hero_mobile/public/UNICEF_Logo_Blue.png?itok=3z7m3m8p" },
                { name: "Red Cross", icon: "https://www.redcross.lk/wp-content/uploads/2019/04/SLRCS-Logo.png" },
                { name: "Save the Children", icon: "https://upload.wikimedia.org/wikipedia/en/thumb/0/08/Save_the_Children_logo.svg/1200px-Save_the_Children_logo.svg.png" },
                { name: "World Vision", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/World_Vision_International_logo.svg/1200px-World_Vision_International_logo.svg.png" }
              ].map((partner, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="h-12 md:h-16 w-32 md:w-48 flex items-center justify-center p-2"
                >
                  <img 
                    src={partner.icon} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain filter brightness-0 opacity-60"
                    onError={(e) => {
                      if (e.target instanceof HTMLImageElement && e.target.parentElement) {
                     e.target.parentElement.innerHTML = `<span class="text-xs font-black tracking-tighter text-emerald-950/20 uppercase">${partner.name}</span>`;
                     }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-emerald-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-widest text-emerald-950 uppercase">HOPELINK</span>
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2024 HopeLink Foundation. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
