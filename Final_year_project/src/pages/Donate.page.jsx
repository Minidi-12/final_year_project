import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
  Building2,
  Package,
  GraduationCap,
  CheckCircle2,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Truck,
  Heart,
  Users,
  BookOpen,
  Smile,
} from "lucide-react";

function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  return { copied, copy };
}

const IMPACT = [
  { icon: Users, stat: "2,400+", label: "Families reached" },
  { icon: BookOpen, stat: "1,200", label: "Students supported" },
  { icon: Heart, stat: "100%", label: "Funds to projects" },
  { icon: Smile, stat: "94%", label: "Donor satisfaction" },
];

const ITEM_CATEGORIES = [
  {
    title: "Essential Clothing",
    desc: "New or clean preloved clothes for children and adults.",
    items: ["School Uniforms", "Casual Wear", "Footwear"],
    color: "from-sky-50 to-white border-sky-100",
    dot: "bg-sky-400",
  },
  {
    title: "Educational Kits",
    desc: "Materials to help children continue their education.",
    items: ["Stationery", "Laptops (Working)", "Books"],
    color: "from-violet-50 to-white border-violet-100",
    dot: "bg-violet-400",
  },
  {
    title: "Household Items",
    desc: "Basic utilities for families affected by disasters.",
    items: ["Dry Rations", "Bed Sheets", "Kitchenware"],
    color: "from-amber-50 to-white border-amber-100",
    dot: "bg-amber-400",
  },
  {
    title: "Medical Supplies",
    desc: "Unopened essential medical equipment.",
    items: ["Wheelchairs", "Crutches", "First Aid Kits"],
    color: "from-rose-50 to-white border-rose-100",
    dot: "bg-rose-400",
  },
];

function CopyField({ label, value, copyKey, copied, onCopy }) {
  const isCopied = copied === copyKey;
  return (
    <div className="group">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1.5">
        {label}
      </p>
      <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-transparent hover:border-emerald-200 transition-colors">
        <span className="font-bold text-emerald-950 text-sm font-mono">
          {value}
        </span>
        <button
          onClick={() => onCopy(value, copyKey)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-emerald-600"
          title="Copy"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function BankCard({ title, fields, accent = false, copied, onCopy }) {
  return (
    <div
      className={`rounded-3xl p-8 border ${accent ? "bg-emerald-950 border-emerald-800" : "bg-white border-gray-100 shadow-sm"}`}
    >
      <p
        className={`text-[9px] font-bold uppercase tracking-[0.25em] mb-6 ${accent ? "text-emerald-400" : "text-gray-400"}`}
      >
        {title}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((f) =>
          accent ? (
            <div key={f.key}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/60 mb-1">
                {f.label}
              </p>
              <p className="font-bold text-white font-mono text-sm">
                {f.value}
              </p>
            </div>
          ) : (
            <CopyField
              key={f.key}
              label={f.label}
              value={f.value}
              copyKey={f.key}
              copied={copied}
              onCopy={onCopy}
            />
          ),
        )}
      </div>
    </div>
  );
}

function TabBank({ copied, onCopy }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-950 mb-1">
          Bank Transfer
        </h2>
        <p className="text-sm text-gray-500 font-serif italic">
          Use the details below for a direct deposit to HopeConnect Foundation.
        </p>
      </div>

      <BankCard
        title="HNB · Homagama Branch — General Fund"
        fields={[
          {
            key: "acc-name",
            label: "Account Name",
            value: "HopeConnect Foundation",
          },
          { key: "acc-number", label: "Account Number", value: "092010085900" },
          { key: "branch", label: "Bank & Branch", value: "HNB (Homagama)" },
          { key: "swift", label: "SWIFT Code", value: "HBLILKLX" },
        ]}
        copied={copied}
        onCopy={onCopy}
      />

      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_23px,rgba(255,255,255,0.03)_24px)] bg-emerald-950" />
        <div className="relative p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Mail className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
                Send a Cheque
              </span>
            </div>
            <p className="text-white font-bold text-sm">
              HopeConnect Foundation
            </p>
            <p className="text-emerald-100/50 text-xs font-serif italic mt-1">
              456 Unity Tower, Galle Road, Colombo 03, Sri Lanka
            </p>
          </div>
          <div className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-emerald-400/40">
            Payable to
            <br />
            <span className="text-emerald-400">HopeConnect</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-100">
        <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-amber-700 text-[9px] font-black">!</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          After your transfer, please email a screenshot of your receipt to{" "}
          <a
            href="mailto:donate@hopeconnect.org"
            className="font-bold underline underline-offset-2"
          >
            donate@hopeconnect.org
          </a>{" "}
          so we can acknowledge your gift and send you an update.
        </p>
      </div>
    </div>
  );
}

function TabItems({ navigate }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-emerald-950 mb-1">
          Donate Goods
        </h2>
        <p className="text-sm text-gray-500 font-serif italic">
          We accept new or gently used items that directly help families in
          need.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {ITEM_CATEGORIES.map((cat) => (
          <div
            key={cat.title}
            className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 hover:shadow-md transition-shadow`}
          >
            <h4 className="font-bold text-emerald-950 mb-1.5 text-sm">
              {cat.title}
            </h4>
            <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
              {cat.desc}
            </p>
            <ul className="space-y-1.5">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${cat.dot}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-8 text-center">
          How It Works
        </p>
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 relative">
          <div className="hidden sm:block absolute top-5 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-emerald-100 z-0" />
          {[
            {
              n: "1",
              title: "Quality Check",
              desc: "Items must be clean and in usable condition.",
            },
            {
              n: "2",
              title: "Get in Touch",
              desc: "Call or email us to arrange a collection or drop-off.",
            },
            {
              n: "3",
              title: "Deliver Hope",
              desc: "Bring or send to our collection centre in Colombo.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="relative z-10 flex-1 flex flex-col items-center text-center px-4 mb-6 sm:mb-0"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm mb-4 shadow-md shadow-emerald-200">
                {s.n}
              </div>
              <p className="text-[10px] font-bold text-emerald-950 uppercase tracking-widest mb-1">
                {s.title}
              </p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/contact-us")}
        className="w-full py-4 rounded-2xl bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200"
      >
        <Truck className="w-4 h-4" /> Coordinate a Donation
      </button>
    </div>
  );
}

function TabScholarships({ copied, onCopy, navigate }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-emerald-950 mb-1">
          Sponsor a Student
        </h2>
        <p className="text-sm text-gray-500 font-serif italic leading-relaxed">
          Help a gifted but financially vulnerable student complete their
          education. Your monthly contribution gives them stability and hope.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 bg-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden">
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-emerald-800 text-emerald-300 text-[8px] font-black uppercase tracking-widest rounded-lg mb-4">
              University · 4-6 Year
            </span>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-black text-white font-mono">
                10,000
              </span>
              <span className="text-emerald-400 font-bold text-xs">
                LKR / mo
              </span>
            </div>
            <p className="text-emerald-100/50 text-xs font-serif italic">
              = LKR 120,000 per academic year
            </p>
            <p className="mt-4 text-[10px] text-emerald-100/40 leading-relaxed">
              Minimum sponsorship period: 1 year. Progress reports sent every 4
              months.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <span className="inline-block px-3 py-1 bg-gray-50 text-gray-500 text-[8px] font-black uppercase tracking-widest rounded-lg self-start">
            School
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Up to O/L
            </p>
            <p className="text-2xl font-black text-emerald-600 font-mono">
              5,000{" "}
              <span className="text-xs text-gray-400 font-normal">LKR/mo</span>
            </p>
          </div>
          <div className="border-t border-gray-50 pt-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Advanced Level
            </p>
            <p className="text-2xl font-black text-emerald-600 font-mono">
              7,500{" "}
              <span className="text-xs text-gray-400 font-normal">LKR/mo</span>
            </p>
          </div>
        </div>
      </div>

      <BankCard
        title="Scholarship Fund · HNB Homagama"
        fields={[
          { key: "s-bank", label: "Bank", value: "Hatton National Bank" },
          {
            key: "s-acc",
            label: "Account Name",
            value: "HopeConnect Foundation",
          },
          { key: "s-num", label: "Account Number", value: "092020143614" },
          { key: "s-branch", label: "Branch Code", value: "7083 / 092" },
          { key: "s-swift", label: "SWIFT", value: "HBLILKLX" },
        ]}
        copied={copied}
        onCopy={onCopy}
      />

      <div className="flex items-start gap-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
        <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center">
          <span className="text-emerald-700 text-[8px] font-black">✓</span>
        </div>
        <p className="text-xs text-emerald-900 leading-relaxed">
          When transferring, please specify{" "}
          <strong>"SCHOLARSHIP FOR UNIVERSITY STUDENT"</strong> or{" "}
          <strong>"SCHOLARSHIP FOR SCHOOL CHILD"</strong> in the reference
          field.
        </p>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-400 mb-6">
          What You'll Receive
        </p>
        <ul className="space-y-3 mb-8">
          {[
            "Student background & family details",
            "Bank account for direct audit trail",
            "Student photographs & enrolment letter",
            "Progress report every 4 months",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-[11px] text-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
          <GraduationCap className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-emerald-950 mb-1">Ananda Jayawardena</p>
          <p className="text-[11px] text-gray-500 font-serif italic leading-relaxed mb-3">
            Education Officer — will guide you through student selection and the
            remittance process.
          </p>
          <a
            href="mailto:ananda@foguc.org"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-800 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> ananda@foguc.org
          </a>
        </div>
      </div>
    </div>
  );
}


export default function Donate() {
  const [activeTab, setActiveTab] = useState("bank");
  const { copied, copy } = useCopy();
  const navigate = useNavigate();

  const tabs = [
    { id: "bank", label: "Bank Transfer", icon: Building2 },
    { id: "items", label: "Donate Items", icon: Package },
    { id: "scholarships", label: "Scholarships", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAF8] selection:bg-emerald-100 selection:text-emerald-900">
      
      <section className="bg-white border-b border-gray-100 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-emerald-950 leading-[1.1] mb-6 tracking-tight">
                Your Kindness
                <br />
                <em className="text-emerald-600 not-italic font-serif font-medium">
                  Powers Change
                </em>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed font-serif max-w-lg">
                Whether it's a one-time gift, a monthly commitment, or donating
                essential goods — every contribution reaches Sri Lanka's most
                vulnerable communities directly.
              </p>
            </motion.div>
          </div>

         
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {IMPACT.map(({ icon: Icon, stat, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className="bg-[#F9FAF8] border border-gray-100 rounded-3xl p-7 hover:border-emerald-100 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  <Icon
                    className="w-4.5 h-4.5 text-emerald-600"
                    strokeWidth={2.2}
                  />
                </div>
                <p className="text-3xl font-black text-emerald-950 leading-none mb-1">
                  {stat}
                </p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
           
            <div className="bg-white border border-gray-100 rounded-2xl p-1.5 flex gap-1 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      active
                        ? "bg-emerald-950 text-white shadow-lg"
                        : "text-gray-400 hover:text-emerald-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

           
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm"
              >
                {activeTab === "bank" && (
                  <TabBank copied={copied} onCopy={copy} />
                )}
                {activeTab === "items" && <TabItems navigate={navigate} />}
                {activeTab === "scholarships" && (
                  <TabScholarships
                    copied={copied}
                    onCopy={copy}
                    navigate={navigate}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

         
          <div className="space-y-6">
            
            <div className="bg-emerald-950 text-white rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-900/40 rounded-full opacity-30 -mb-10 -ml-10" />
              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-400 mb-6">
                  Our Promise
                </p>
                <div className="space-y-5">
                  {[
                    {
                      icon: HandHeart,
                      title: "No Admin Cost",
                      desc: "100% of your donation goes directly to the project.",
                    },
                    {
                      icon: CheckCircle2,
                      title: "Full Transparency",
                      desc: "Track your funds through verified GN reports.",
                    },
                    {
                      icon: Heart,
                      title: "Prompt Updates",
                      desc: "Receive photos and success stories of impact.",
                    },
                  ].map((p) => (
                    <div key={p.title} className="flex gap-4">
                      <div className="w-9 h-9 bg-emerald-900 rounded-xl flex items-center justify-center shrink-0">
                        <p.icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-emerald-100/40 font-serif italic leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-5">
                Need Help?
              </p>
              <p className="text-xs text-gray-500 font-serif italic leading-relaxed mb-6">
                Our team is available Monday to Friday, 9 AM – 5 PM to answer
                any donation queries.
              </p>
              <button
                onClick={() => navigate("/contact-us")}
                className="w-full py-4 bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-emerald-950 flex items-center justify-center gap-3 transition-all group"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                Contact Us
                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl p-8">
              <div className="text-4xl text-emerald-200 font-serif leading-none mb-3">
                "
              </div>
              <p className="text-sm text-emerald-900 font-serif italic leading-relaxed mb-6">
                Sponsoring Kavindi's education has been one of the most
                meaningful decisions of my life. The updates from the team are
                heartfelt and real.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs">
                  R
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-950">
                    Roshan, Dubai
                  </p>
                  <p className="text-[9px] text-gray-400">
                    Scholarship donor since 2022
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


function HandHeart(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
      <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L13 15" />
      <path d="M14 11V9a2 2 0 1 0-4 0v4.5" />
      <path d="M8 15V7a2 2 0 1 0-4 0v11" />
      <path d="M18 15V5a2 2 0 1 0-4 0v2" />
    </svg>
  );
}
