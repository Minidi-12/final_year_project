import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  FileText,
  Users,
  Briefcase,
  Wallet,
  Info,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Stethoscope,
  AlertCircle,
  Languages,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useCreateb_reqMutation, useGetAllgn_divisionsQuery } from "@/lib/api";
import ImageInput from "@/components/ImageInput";
import { ChevronDown } from "lucide-react";
import { getT } from "@/lib/i18n";
import Preloader from "@/components/Preloader";


const Err = ({ msg }) =>
  msg ? (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500 mt-1.5 pl-1"
    >
      <AlertCircle className="w-3 h-3 shrink-0" /> {msg}
    </motion.p>
  ) : null;


const LangToggle = ({ lang, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white
               text-xs font-bold text-slate-600 hover:border-emerald-400 hover:text-emerald-700
               transition-all shadow-sm select-none"
    title="Switch language / භාෂාව මාරු කරන්න"
  >
    <Languages className="w-3.5 h-3.5" />
    {lang === "en" ? "සිංහල" : "English"}
  </button>
);


const STEP_ICONS = [User, MapPin, Wallet, Stethoscope, Briefcase, FileText];

export default function RequestSupport() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const t = getT(lang);

  const [step,       setStep]       = useState(1);
  const [isSuccess,  setIsSuccess]  = useState(false);
  const [reqEvidence, setReqEvidence] = useState([]);
  const [errors,     setErrors]     = useState({});

  // — Fix: store the reference number returned by the API after submission
  const [submittedRef,    setSubmittedRef]    = useState("");
  const [refCopied,       setRefCopied]       = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    phone_no: "",
    age: "",
    gender: "male",
    address: "",
    gn_division: "",
    family_size: "",
    children_under_18: "0",
    monthly_income: "",
    employment_type: "Daily wage",
    GovtAllowance: [],
    otherIncomeSources: "",
    chronic_illness: { exists: false, description: "" },
    nearest_hospitalkm: "",
    disabilityInHousehold: false,
    highestEducationLevel: "O/Level",
    distanceToSchoolKm: "0",
    childrenDroppedOut: false,
    housing_type: "temporary",
    safewater_access: false,
    sanitation_access: false,
    electricity_access: false,
    support_types: [],
    support_description: "",
    selfrated_urgency: "",
  });

  const { data: gn_divisions, isLoading } = useGetAllgn_divisionsQuery();
  const [createB_req, { isLoading: isCreating }] = useCreateb_reqMutation();

  const set = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  const toggleArray = (field, value) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    setFormData((p) => {
      const arr = p[field] || [];
      return {
        ...p,
        [field]: arr.includes(value)
          ? arr.filter((x) => x !== value)
          : [...arr, value],
      };
    });
  };


  const validate = (s) => {
    const e = {};
    const err = t.err;
    if (s === 1) {
      if (!formData.name.trim()) e.name = err.nameReq;
      if (!formData.nic.trim()) e.nic = err.nicReq;
      else if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(formData.nic.trim()))
        e.nic = err.nicInvalid;
      if (!formData.age) e.age = err.ageReq;
      else if (Number(formData.age) <= 0 || Number(formData.age) > 100)
        e.age = err.ageRange;
      if (!formData.phone_no.trim()) e.phone_no = err.phoneReq;
      else if (!/^[0-9]{10}$/.test(formData.phone_no.trim()))
        e.phone_no = err.phoneInvalid;
    }
    if (s === 2) {
      if (!formData.address.trim()) e.address = err.addressReq;
      if (!formData.gn_division) e.gn_division = err.gnReq;
      if (!formData.family_size || Number(formData.family_size) < 1)
        e.family_size = err.familyReq;
      if (Number(formData.children_under_18) < 0)
        e.children_under_18 = err.childrenNeg;
    }
    if (s === 3) {
      if (formData.monthly_income === "" || formData.monthly_income === null)
        e.monthly_income = err.incomeReq;
      else if (Number(formData.monthly_income) < 0)
        e.monthly_income = err.incomeNeg;
      if (!formData.employment_type) e.employment_type = err.employReq;
    }
    if (s === 4) {
      if (
        formData.nearest_hospitalkm === "" ||
        formData.nearest_hospitalkm === null
      )
        e.nearest_hospitalkm = err.hospitalReq;
      else if (Number(formData.nearest_hospitalkm) < 0)
        e.nearest_hospitalkm = err.hospitalNeg;
      if (!formData.highestEducationLevel)
        e.highestEducationLevel = err.educationReq;
      if (Number(formData.distanceToSchoolKm) < 0)
        e.distanceToSchoolKm = err.schoolNeg;
    }
    if (s === 5) {
      if (!formData.support_types || formData.support_types.length === 0)
        e.support_types = err.supportTypeReq;
      if (!formData.support_description.trim())
        e.support_description = err.descReq;
      else if (formData.support_description.trim().length < 10)
        e.support_description = err.descShort;
      if (!formData.selfrated_urgency) e.selfrated_urgency = err.urgencyReq;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validate(step)) {
      setStep((p) => p + 1);
      window.scrollTo(0, 0);
    }
  };
  const prevStep = () => {
    setErrors({});
    setStep((p) => p - 1);
    window.scrollTo(0, 0);
  };

  const getGnName = (id) => {
    if (!id || !gn_divisions) return "Unknown";
    const d = gn_divisions.find((x) => String(x._id || x.id) === String(id));
    return d?.gn_division_Name || d?.name || "Unknown";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // — Fix: capture the API response so we can show the reference number
      const result = await createB_req({
        b_profile: [
          {
            nic: formData.nic.trim(),
            name: formData.name.trim(),
            phone_no: formData.phone_no.trim(),
            age: Number(formData.age),
            gender: formData.gender,
            address: formData.address.trim(),
            gn_division: getGnName(formData.gn_division),
            family_size: Number(formData.family_size),
            children_under_18: Number(formData.children_under_18) || 0,
            monthly_income: Number(formData.monthly_income),
            employment_type: formData.employment_type,
            GovtAllowance: formData.GovtAllowance,
            otherIncomeSources: formData.otherIncomeSources || "",
            chronic_illness: {
              exists: formData.chronic_illness.exists,
              description: formData.chronic_illness.description || "",
            },
            nearest_hospitalkm: Number(formData.nearest_hospitalkm),
            disabilityInHousehold: formData.disabilityInHousehold,
            highestEducationLevel: formData.highestEducationLevel,
            distanceToSchoolKm: Number(formData.distanceToSchoolKm) || 0,
            childrenDroppedOut: formData.childrenDroppedOut,
            housing_type: formData.housing_type,
            safewater_access: formData.safewater_access,
            sanitation_access: formData.sanitation_access,
            electricity_access: formData.electricity_access,
            support_types: formData.support_types,
            support_description: formData.support_description.trim(),
            selfrated_urgency: String(formData.selfrated_urgency),
          },
        ],
        req_evidence: reqEvidence,
        gn_division_Id: formData.gn_division,
      }).unwrap();

      // Store reference number from the API response
      const ref = result?.reference_no || result?._id || "";
      setSubmittedRef(ref);
      setIsSuccess(true);
    } catch (err) {
      alert(
        `Submission failed: ${err.data?.message || err.message || "Unknown error"}`,
      );
    }
  };

  const copyRef = async () => {
    if (!submittedRef) return;
    await navigator.clipboard.writeText(submittedRef);
    setRefCopied(true);
    setTimeout(() => setRefCopied(false), 2500);
  };

  const inputCls = (field) =>
    `w-full bg-slate-50 border rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? "border-red-300 focus:ring-red-200"
        : "border-slate-200 focus:ring-emerald-200 focus:border-emerald-400"
    }`;
  const labelCls =
    "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5";

  const STEPS = [
    { id: 1, label: t.steps.identity, icon: STEP_ICONS[0] },
    { id: 2, label: t.steps.location, icon: STEP_ICONS[1] },
    { id: 3, label: t.steps.financial, icon: STEP_ICONS[2] },
    { id: 4, label: t.steps.health, icon: STEP_ICONS[3] },
    { id: 5, label: t.steps.support, icon: STEP_ICONS[4] },
    { id: 6, label: t.steps.review, icon: STEP_ICONS[5] },
  ];

  // — Fix: completely rewritten success screen to prominently display
  //   the reference number and explain how to use it on WhatsApp.
  //   Previously it just showed a generic "your request was submitted" message
  //   with no reference number — the core differentiator of the system.
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl p-10 shadow-xl border border-emerald-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {t.success?.title ?? "Request Submitted!"}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t.success?.body ?? "Your request has been received and will be reviewed by a GN Officer."}
            </p>
          </div>

          {/* Reference number — the most important element on this screen */}
          {submittedRef && (
            <div className="bg-emerald-950 rounded-2xl p-6 mb-6 text-center">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-3">
                Your Reference Number
              </p>
              <p className="text-lg font-mono font-bold text-white break-all mb-4 leading-relaxed">
                {submittedRef}
              </p>
              <button
                onClick={copyRef}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  refCopied
                    ? "bg-emerald-400 text-emerald-950"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {refCopied ? (
                  <><Check className="w-3.5 h-3.5" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy Reference</>
                )}
              </button>
            </div>
          )}

          {/* WhatsApp status query instruction */}
          <div className="flex items-start gap-4 bg-green-50 border border-green-100 rounded-2xl p-5 mb-6">
            <MessageCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-green-800 mb-1 uppercase tracking-wide">
                Track your case on WhatsApp
              </p>
              <p className="text-xs text-green-700 leading-relaxed">
                Save this reference number and send it to our WhatsApp number to
                check your case status at any time — no office visit needed.
              </p>
            </div>
          </div>

          {/* Save reminder */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Please screenshot or write down your reference number. You will need
              it to follow up on your request.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all"
          >
            {t.backToHome ?? "Back to Home"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isCreating && <Preloader />}
      </AnimatePresence>
      <div
        className={`min-h-screen bg-slate-50 font-sans ${lang === "si" ? "font-[Noto_Sans_Sinhala,sans-serif]" : ""}`}
      >
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">
              HOPE<span className="text-emerald-600">CONNECT</span>
            </span>
          </Link>


          <div className="flex items-center gap-3">

            <div className="flex items-center gap-1">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      s.id < step
                        ? "bg-emerald-600 text-white"
                        : s.id === step
                          ? "bg-emerald-950 text-white ring-2 ring-emerald-300"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {s.id < step ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      s.id
                    )}
                  </div>
                  {s.id < 6 && (
                    <div
                      className={`w-5 h-0.5 mx-0.5 ${s.id < step ? "bg-emerald-600" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>


            <LangToggle
              lang={lang}
              onToggle={() => setLang((l) => (l === "en" ? "si" : "en"))}
            />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-4 max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
            {t.stepLabel(step, STEPS[step - 1].label)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {t.s1.heading}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {t.s1.subheading}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>
                          {t.s1.fullName}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInput}
                          placeholder={t.s1.namePlaceholder}
                          className={inputCls("name")}
                        />
                        <Err msg={errors.name} />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t.s1.nic} <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="nic"
                          value={formData.nic}
                          onChange={handleInput}
                          placeholder={t.s1.nicPlaceholder}
                          className={`${inputCls("nic")} uppercase`}
                        />
                        <Err msg={errors.nic} />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t.s1.age} <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="age"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formData.age}
                          onChange={handleInput}
                          placeholder={t.s1.agePlaceholder}
                          maxLength={3}
                          className={`${inputCls("age")} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />
                        <Err msg={errors.age} />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t.s1.gender} <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-3">
                          {[
                            { val: "male", label: t.s1.male },
                            { val: "female", label: t.s1.female },
                          ].map((g) => (
                            <button
                              key={g.val}
                              type="button"
                              onClick={() => set("gender", g.val)}
                              className={`flex-1 py-3.5 rounded-xl border text-sm font-semibold capitalize transition-all ${
                                formData.gender === g.val
                                  ? "bg-emerald-950 text-white border-emerald-950"
                                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>
                          {t.s1.phone} <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="phone_no"
                          type="text"
                          inputMode="numeric"
                          value={formData.phone_no}
                          onChange={handleInput}
                          placeholder={t.s1.phonePlaceholder}
                          maxLength={10}
                          className={inputCls("phone_no")}
                        />
                        <p className="text-[11px] text-slate-400 mt-1 pl-1">
                          {t.s1.phoneHint}
                        </p>
                        <Err msg={errors.phone_no} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {t.s2.heading}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {t.s2.subheading}
                      </p>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t.s2.address} <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInput}
                        placeholder={t.s2.addressPlaceholder}
                        rows={3}
                        className={`${inputCls("address")} resize-none`}
                      />
                      <Err msg={errors.address} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>
                          {t.s2.gnDivision}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="gn_division"
                          value={formData.gn_division}
                          onChange={handleInput}
                          disabled={isLoading}
                          className={`${inputCls("gn_division")} appearance-auto`}
                        >
                          <option value="">
                            {isLoading ? t.s2.gnLoading : t.s2.gnPlaceholder}
                          </option>
                          {gn_divisions?.map((d) => (
                            <option key={d._id || d.id} value={d._id || d.id}>
                              {d.gn_division_Name || d.name}
                            </option>
                          ))}
                        </select>
                        <Err msg={errors.gn_division} />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t.s2.housingType}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="housing_type"
                          value={formData.housing_type}
                          onChange={handleInput}
                          className={`${inputCls("housing_type")} appearance-auto`}
                        >
                          <option value="own">{t.s2.own}</option>
                          <option value="rent">{t.s2.rent}</option>
                          <option value="temporary">{t.s2.temporary}</option>
                          <option value="no-fixed_shelter">
                            {t.s2.noFixed}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t.s2.familySize}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="family_size"
                          type="number"
                          min="1"
                          value={formData.family_size}
                          onChange={handleInput}
                          placeholder={t.s2.familyPlaceholder}
                          className={inputCls("family_size")}
                        />
                        <Err msg={errors.family_size} />
                      </div>
                      <div>
                        <label className={labelCls}>{t.s2.children}</label>
                        <input
                          name="children_under_18"
                          type="number"
                          min="0"
                          value={formData.children_under_18}
                          onChange={handleInput}
                          placeholder="0"
                          className={inputCls("children_under_18")}
                        />
                        <Err msg={errors.children_under_18} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t.s2.utilities}{" "}
                        <span className="text-slate-300 normal-case font-normal">
                          ({t.selectAll})
                        </span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { name: "safewater_access",  label: t.s2.safeWater  },
                          { name: "sanitation_access", label: t.s2.sanitation },
                          { name: "electricity_access",label: t.s2.electricity},
                        ].map((u) => (
                          <label
                            key={u.name}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all text-center ${
                              formData[u.name]
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              name={u.name}
                              checked={formData[u.name]}
                              onChange={handleInput}
                              className="sr-only"
                            />
                            <span className="text-xs font-semibold">
                              {u.label}
                            </span>
                            {formData[u.name] && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {t.s3.heading}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {t.s3.subheading}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>
                          {t.s3.income} <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 pointer-events-none">
                            LKR
                          </span>
                          <input
                            name="monthly_income"
                            type="text"
                            value={formData.monthly_income}
                            onChange={handleInput}
                            placeholder="0"
                            className={`${inputCls("monthly_income")} pl-14`}
                          />
                        </div>
                        <Err msg={errors.monthly_income} />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t.s3.employType}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="employment_type"
                          value={formData.employment_type}
                          onChange={handleInput}
                          className={`${inputCls("employment_type")} appearance-auto`}
                        >
                          <option value="Government">{t.s3.employ.govt}</option>
                          <option value="Private">{t.s3.employ.priv}</option>
                          <option value="Self employed">{t.s3.employ.self}</option>
                          <option value="Unemployed">{t.s3.employ.unemp}</option>
                          <option value="Daily wage">{t.s3.employ.daily}</option>
                        </select>
                        <Err msg={errors.employment_type} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>
                          {t.s3.otherIncome}{" "}
                          <span className="text-slate-300 normal-case font-normal">
                            ({t.optional})
                          </span>
                        </label>
                        <input
                          name="otherIncomeSources"
                          value={formData.otherIncomeSources}
                          onChange={handleInput}
                          placeholder={t.s3.otherPlaceholder}
                          className={inputCls("otherIncomeSources")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t.s3.govtAllowance}{" "}
                        <span className="text-slate-300 normal-case font-normal">
                          ({t.selectAll})
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { val: "Samurdhi",           label: t.s3.allowances.samurdhi   },
                          { val: "Elderly Allowance",  label: t.s3.allowances.elderly    },
                          { val: "Disability Allowance",label: t.s3.allowances.disability},
                          { val: "Ath Wasuma",         label: t.s3.allowances.athWasuma  },
                          { val: "Other",              label: t.s3.allowances.other      },
                        ].map((a) => (
                          <button
                            key={a.val}
                            type="button"
                            onClick={() => toggleArray("GovtAllowance", a.val)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                              formData.GovtAllowance.includes(a.val)
                                ? "bg-emerald-950 text-white border-emerald-950"
                                : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {t.s4.heading}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {t.s4.subheading}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>
                          {t.s4.hospital}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            name="nearest_hospitalkm"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.nearest_hospitalkm}
                            onChange={handleInput}
                            placeholder="0"
                            className={`${inputCls("nearest_hospitalkm")} pr-14`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-medium pointer-events-none">
                            {t.km}
                          </span>
                        </div>
                        <Err msg={errors.nearest_hospitalkm} />
                      </div>
                      <div>
                        <label className={labelCls}>
                          {t.s4.education}{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="highestEducationLevel"
                          value={formData.highestEducationLevel}
                          onChange={handleInput}
                          className={`${inputCls("highestEducationLevel")} appearance-auto`}
                        >
                          <option value="none">{t.s4.edu.none}</option>
                          <option value="1-10">{t.s4.edu.grade}</option>
                          <option value="O/Level">{t.s4.edu.olevel}</option>
                          <option value="A/Level">{t.s4.edu.alevel}</option>
                          <option value="degree">{t.s4.edu.degree}</option>
                          <option value="other">{t.s4.edu.other}</option>
                        </select>
                        <Err msg={errors.highestEducationLevel} />
                      </div>
                      <div>
                        <label className={labelCls}>{t.s4.school}</label>
                        <div className="relative">
                          <input
                            name="distanceToSchoolKm"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.distanceToSchoolKm}
                            onChange={handleInput}
                            placeholder="0"
                            className={`${inputCls("distanceToSchoolKm")} pr-14`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-medium pointer-events-none">
                            {t.km}
                          </span>
                        </div>
                        <Err msg={errors.distanceToSchoolKm} />
                      </div>
                    </div>

                    <div
                      className={`p-5 rounded-xl border transition-all ${formData.chronic_illness.exists ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}
                    >
                      <label
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            chronic_illness: {
                              ...p.chronic_illness,
                              exists: !p.chronic_illness.exists,
                            },
                          }))
                        }
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${formData.chronic_illness.exists ? "bg-red-500 border-red-500" : "border-slate-300"}`}
                        >
                          {formData.chronic_illness.exists && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-700">
                            {t.s4.chronicTitle}
                          </span>
                          <p className="text-[11px] text-slate-400">
                            {t.s4.chronicSub}
                          </p>
                        </div>
                      </label>
                      <AnimatePresence>
                        {formData.chronic_illness.exists && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-4"
                          >
                            <input
                              value={formData.chronic_illness.description}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  chronic_illness: {
                                    ...p.chronic_illness,
                                    description: e.target.value,
                                  },
                                }))
                              }
                              placeholder={t.s4.chronicPlaceholder}
                              className="w-full bg-white border border-red-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-200"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          name: "disabilityInHousehold",
                          label: t.s4.disabilityLabel,
                          sub: t.s4.disabilitySub,
                        },
                        {
                          name: "childrenDroppedOut",
                          label: t.s4.droppedLabel,
                          sub: t.s4.droppedSub,
                        },
                      ].map((item) => (
                        <label
                          key={item.name}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData[item.name] ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200 hover:border-slate-300"}`}
                        >
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={formData[item.name]}
                            onChange={handleInput}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${formData[item.name] ? "bg-amber-500 border-amber-500" : "border-slate-300"}`}
                          >
                            {formData[item.name] && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-700 block">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {item.sub}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="s5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {t.s5.heading}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {t.s5.subheading}
                      </p>
                    </div>

                    <div>
                      <label className={labelCls}>
                        {t.s5.supportType}{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          { val: "financial",     label: t.s5.types.financial     },
                          { val: "medical",       label: t.s5.types.medical       },
                          { val: "educational",   label: t.s5.types.educational   },
                          { val: "sanitation",    label: t.s5.types.sanitation    },
                          { val: "pre-loved_items",label: t.s5.types.prelovedItems},
                          { val: "counselling",   label: t.s5.types.counselling   },
                          { val: "other",         label: t.s5.types.other         },
                        ].map((type) => (
                          <button
                            key={type.val}
                            type="button"
                            onClick={() => toggleArray("support_types", type.val)}
                            className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all ${
                              formData.support_types.includes(type.val)
                                ? "bg-emerald-950 text-white border-emerald-950 shadow-md"
                                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                            }`}
                          >
                            <span className="text-xs font-semibold">
                              {type.label}
                            </span>
                            {formData.support_types.includes(type.val) && (
                              <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-300" />
                            )}
                          </button>
                        ))}
                      </div>
                      <Err msg={errors.support_types} />
                    </div>

                    <div>
                      <label className={labelCls}>
                        {t.s5.describe} <span className="text-red-400">*</span>{" "}
                        <span className="text-slate-300 normal-case font-normal">
                          ({t.min10chars})
                        </span>
                      </label>
                      <textarea
                        name="support_description"
                        value={formData.support_description}
                        onChange={handleInput}
                        placeholder={t.s5.describePlaceholder}
                        rows={5}
                        className={`${inputCls("support_description")} resize-none`}
                      />
                      <div className="flex items-center justify-between mt-1.5 px-1">
                        <Err msg={errors.support_description} />
                        <span
                          className={`text-[11px] font-semibold ml-auto ${formData.support_description.length === 0 ? "text-slate-300" : formData.support_description.length < 10 ? "text-red-400" : "text-emerald-500"}`}
                        >
                          {formData.support_description.length} / 10 min
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>
                        {t.s5.urgency} <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {["1", "2", "3", "4", "5"].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => set("selfrated_urgency", val)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                              formData.selfrated_urgency === val
                                ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-lg font-bold">{val}</span>
                            <span className="text-[10px] font-semibold">
                              {t.s5.urgencyLevels[val]}
                            </span>
                          </button>
                        ))}
                      </div>
                      <Err msg={errors.selfrated_urgency} />
                    </div>

                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                      <div className="flex items-center gap-2 mb-3">
                        <Upload className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">
                          {t.s5.docs}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({t.s5.docsOptional})
                        </span>
                      </div>
                      <ImageInput
                        onChange={(files) => {
                          const list = Array.isArray(files) ? files : [files];
                          setReqEvidence(
                            list
                              .filter(Boolean)
                              .map((f) => ({
                                fileUrl:
                                  f.url ||
                                  f.preview ||
                                  (typeof f === "string" ? f : ""),
                                file_name: f.name || "upload",
                                description: "",
                                uploaded_at: new Date().toISOString(),
                              })),
                          );
                        }}
                        multiple
                        accept="image/*,.pdf"
                        maxSizeMB={5}
                        className="w-full"
                      />
                      {reqEvidence.length > 0 && (
                        <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                          {t.s5.filesReady(reqEvidence.length)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div
                    key="s6"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {t.s6.heading}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {t.s6.subheading}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        [t.s6.fields.name,       formData.name],
                        [t.s6.fields.nic,        formData.nic.toUpperCase()],
                        [t.s6.fields.age,        `${formData.age} ${t.s6.fields.ageUnit}`],
                        [t.s6.fields.phone,      formData.phone_no],
                        [t.s6.fields.gnDivision, getGnName(formData.gn_division)],
                        [t.s6.fields.income,     `LKR ${Number(formData.monthly_income).toLocaleString()}/${t.s6.fields.incomeUnit}`],
                        [t.s6.fields.employment, formData.employment_type],
                        [t.s6.fields.housing,    formData.housing_type],
                      ].map(([label, val]) => (
                        <div
                          key={label}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                            {label}
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {val || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide block mb-2">
                        {t.s6.supportLabel}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {formData.support_types.map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1 bg-white text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 capitalize"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                        {t.s6.descLabel}
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        &ldquo;{formData.support_description}&rdquo;
                      </p>
                    </div>
                    <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        {t.s6.disclaimer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                  {step === 5 ? t.reviewApp : t.continue}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="flex items-center gap-2 px-8 py-2.5 bg-emerald-950 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <span>{t.submitting}</span>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> {t.confirmSubmit}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <p className="text-xs font-medium">{t.footer}</p>
        </div>
      </main>
    </div>
    </>
  );
}