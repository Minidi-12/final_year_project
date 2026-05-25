import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  ShieldCheck,
  Target,
  Eye,
  ArrowRight,
  Award,
  Globe,
  Fingerprint,
  Zap,
  BarChart3,
  Scale,
  Quote,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router";

export default function AboutUs() {
  const [activeValue, setActiveValue] = React.useState(0);
  const navigate = useNavigate();

  const values = [
    {
      title: "Radical Transparency",
      desc: "Every rupee is tracked from the donor's wallet to the beneficiary's hand. Our blockchain-inspired ledger ensures no manipulation.",
      icon: Eye,
      color: "emerald",
    },
    {
      title: "Verified Integrity",
      desc: "We bridge the gap between digital and physical truth by integrating local Grama Niladhari certifications into our core pipeline.",
      icon: ShieldCheck,
      color: "blue",
    },
    {
      title: "Grassroots First",
      desc: "We don't solve problems from an ivory tower. We empower local officers who understand the nuances of their villages.",
      icon: Users,
      color: "amber",
    },
  ];

  const team = [
    {
      name: "Dr. Rohitha Perera",
      role: "CHAIRMAN",
      image:
        "https://media.istockphoto.com/id/660150716/photo/young-businessman-with-beard-smiling-towards-camera.jpg?s=612x612&w=0&k=20&c=bmOLrjsgfJziLXsfquG87i_tvjD4GsPj41HAvzRcflQ=",
    },
    {
      name: "Samanthi Silva",
      role: "VICE CHAIRMAN",
      image:
        "https://s3.amazonaws.com/bizenglish/wp-content/uploads/2023/04/03122952/Chandi-Dharmaratne-Chief-People-Officer-of-Axiata-Digital-Labs-e1680505219989.jpg",
    },
    {
      name: "Dr. Anura Disanayaka",
      role: "EXECUTIVE DIRECTOR",
      image:
        "https://www.seekahost.com/wp-content/uploads/2020/09/Ehantha_Sirisena.jpg",
    },
    {
      name: "Nilukshi Bandara",
      role: "ADMINISTRATIVE SECRETARY",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQEfeZ0x65SWsA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1678890963482?e=2147483647&v=beta&t=OtQsje_wX7uGQ8-cKJ2r7LJ_xnXseY6q2OCTqkMSUT4",
    },
  ];

  return (
    <div className="min-h-screen bg-emerald-50/30 selection:bg-emerald-100 selection:text-emerald-900 pt-24 md:pt-32 pb-20">
      <section className="max-w-7xl  mx-auto px-6 mb-32">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-3/5">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-emerald-950 mb-10 leading-[1.05] tracking-tight"
            >
              Building the{" "}
              <span className="text-emerald-600 italic font-serif">
                Trust Infrastructure
              </span>{" "}
              for social welfare.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 leading-relaxed max-w-2xl font-serif italic mb-12"
            >
              HopeConnect isn't just a donation platform. It is a digital bridge
              built to eliminate the 'verification gap' that leaves thousands of
              genuine needs unheard.
            </motion.p>

            <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-12">
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  The Impact Goal
                </h4>
                <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                  To digitize welfare verification for all 14,022 Grama
                  Niladhari divisions in Sri Lanka.
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Our Commitment
                </h4>
                <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                  Maintaining a{" "}
                  <span className="text-emerald-600 font-bold">
                    100% direct-impact
                  </span>{" "}
                  model with zero administrative leakage.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-2/5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-emerald-900/20"
            >
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200"
                alt="Impact"
                className="w-full h-full object-cover"
              />
            </motion.div>
           
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 z-20 bg-emerald-600 text-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-2"
            >
              <ShieldCheck className="w-8 h-8" />
              <div className="text-center">
                <div className="text-xl font-bold">Verified</div>
                <div className="text-[10px] uppercase font-bold opacity-70">
                  Grassroots Truth
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-950 py-16 md:py-24 overflow-hidden  rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h3 className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 uppercase mb-4">
              THE REASON FOR BEING
            </h3>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our Core Values
            </h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setActiveValue(i)}
                className={`p-12 rounded-[3.5rem] transition-all duration-500 border relative group cursor-default ${
                  activeValue === i
                    ? "bg-white border-white scale-105 shadow-2xl shadow-emerald-500/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors ${
                    activeValue === i
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-white/10 text-emerald-400"
                  }`}
                >
                  <v.icon className="w-8 h-8" />
                </div>
                <h4
                  className={`text-2xl font-bold mb-6 transition-colors ${
                    activeValue === i ? "text-emerald-950" : "text-white"
                  }`}
                >
                  {v.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed font-serif italic transition-colors ${
                    activeValue === i ? "text-gray-500" : "text-emerald-100/40"
                  }`}
                >
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="lg:w-1/2">
            <h2 className="text-[10px] font-bold tracking-[0.4em] text-emerald-600 uppercase mb-4">
              THE DIGITAL BRIDGE
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-8 tracking-tight">
              Solving the{" "}
              <span className="text-emerald-600 font-serif italic">
                Verification Crisis.
              </span>
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed pb-10 font-serif italic">
              "We realized that the biggest barrier to aid wasn't a lack of
              money, but a lack of trust. Donors want to help, but they are
              paralyzed by the fear of misinformation."
            </p>

            <div className="space-y-8">
              {[
                {
                  title: "Grama Niladhari Authentication",
                  desc: "Our system integrates directly with authorized local officers who provide digital stamps on every request.",
                  icon: Fingerprint,
                },
                {
                  title: "Real-time Impact Audits",
                  desc: "Automated tracking using IoT and field reporting ensures LKR 1 donated equals LKR 1 received.",
                  icon: BarChart3,
                },
                {
                  title: "Decentralized Distribution",
                  desc: "Aid flows directly to the GN division, ensuring zero middlemen and maximum efficiency.",
                  icon: Zap,
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 bg-white border border-emerald-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-600 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-emerald-50 rounded-[2.5rem] p-4">
                  <img
                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600"
                    className="rounded-[2rem] w-full aspect-square object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-[2.5rem] p-8">
                  <Quote className="w-8 h-8 text-amber-600 mb-4" />
                  <p className="text-[10px] text-amber-950/60 font-serif italic">
                    "Technology at the service of humanity is our core
                    philosophy."
                  </p>
                </div>
                <div className="bg-emerald-950 rounded-[2.5rem] p-4">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600"
                    className="rounded-[2.5rem] w-full aspect-[3/4] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-950 py-16 md:py-24 rounded-[4rem] mx-4 mb-16 md:mb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h3 className="text-[10px] font-bold tracking-[0.4em] text-emerald-400 uppercase mb-4">
              OUR LEADERSHIP
            </h3>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              The Architects of Hope
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative mb-6 rounded-[2.5rem] overflow-hidden shadow-xl aspect-square bg-white">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-emerald-100/60  mb-1">
                    {member.name}
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-8 tracking-tight">
          Ready to rewrite <br />
          the story of{" "}
          <span className="text-emerald-600 italic font-serif">local aid?</span>
        </h3>
        <p className="text-lg text-gray-500 pb-12 font-serif italic">
          Your expertise, your time, or your funding can change a life today
          through a verified channel.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/donate"
            className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-bold shadow-2xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-black/30 hover:scale-105 duration-300"
          >
            Donate Now
          </Link>
          <button
            onClick={() => navigate("/volunteer")}
            className="px-12 py-5 bg-white/10 hover:bg-white/20 text-emerald-600 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md border border-emerald-600 uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-black/30 hover:scale-105 duration-300"
          >
            <Users className="w-5 h-5" /> Be a Volunteer
          </button>
        </div>
      </section>
    </div>
  );
}
