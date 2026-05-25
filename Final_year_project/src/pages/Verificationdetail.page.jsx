import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Heart,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileText,
  ExternalLink,
  Zap,
  Droplets,
  Stethoscope,
  GraduationCap,
  Home,
  Briefcase,
  DollarSign,
  Clock,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useGetb_reqByIDQuery, useUpdateb_reqMutation } from "../lib/api";

export default function VerificationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState("");

  const { data: request, isLoading, isError } = useGetb_reqByIDQuery(id);

  const [updateb_req, { isLoading: isSubmitting }] = useUpdateb_reqMutation();

  const handleAction = async (newStatus) => {
    try {
      await updateb_req({
        id,
        status: newStatus,
        gn_verified: newStatus === "verified",
        gn_notes: comment,
        updated_at: new Date().toISOString(),
      }).unwrap();

      navigate("/verify");
    } catch (err) {
      console.error("Failed to update request:", err);
      alert("Failed to update. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Loading case...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-sm font-bold text-slate-500">
            Failed to load case. It may not exist.
          </p>
          <button
            onClick={() => navigate("/verify")}
            className="px-6 py-2 bg-emerald-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const profile = request.b_profile?.[0];
  const isActionable = ["pending", "gn_assigned"].includes(request.status);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/verify")}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-xl hover:bg-slate-50 border border-slate-200 group transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Case Verification
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                {request.reference_no || request._id}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-[10px] font-medium text-slate-400 uppercase">
                {profile?.gn_division}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            request.status === "verified"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : request.status === "rejected"
                ? "bg-red-50 border-red-200 text-red-700"
                : request.status === "flagged"
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : request.status === "gn_assigned"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
          }`}
        >
          {request.status.replace("_", " ")}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-700 ring-1 ring-emerald-100 shrink-0">
                  {profile?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {profile?.name}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> NIC: {profile?.nic}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {profile?.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {profile?.phone_no}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {profile?.support_types?.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {request.urgency_label && (
                  <div
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${
                      request.urgency_label?.toLowerCase() === "high"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : request.urgency_label?.toLowerCase() === "moderate"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {request.urgency_label} Urgency
                  </div>
                )}
              </div>
            </motion.div>

            {[
              {
                title: "Demographics & Family",
                icon: User,
                items: [
                  ["Age", `${profile?.age} years`],
                  ["Gender", profile?.gender],
                  ["Family Size", profile?.family_size],
                  ["Children under 18", profile?.children_under_18 ?? 0],
                ],
              },
              {
                title: "Financial Status",
                icon: DollarSign,
                items: [
                  [
                    "Monthly Income",
                    `LKR ${profile?.monthly_income?.toLocaleString()}`,
                  ],
                  ["Employment", profile?.employment_type],
                  [
                    "Govt Allowances",
                    profile?.GovtAllowance?.join(", ") || "None",
                  ],
                  ["Other Income", profile?.otherIncomeSources || "None"],
                ],
              },
              {
                title: "Health & Access",
                icon: Stethoscope,
                items: [
                  [
                    "Chronic Illness",
                    profile?.chronic_illness?.exists
                      ? profile.chronic_illness.description
                      : "None",
                  ],
                  ["Nearest Hospital", `${profile?.nearest_hospitalkm} km`],
                  [
                    "Disability in Household",
                    profile?.disabilityInHousehold ? "Yes" : "No",
                  ],
                  [
                    "Healthcare Access",
                    profile?.regular_Healthcare_Access ? "Yes" : "No",
                  ],
                ],
              },
              {
                title: "Housing & Utilities",
                icon: Home,
                items: [
                  ["Housing Type", profile?.housing_type],
                  ["Safe Water", profile?.safewater_access ? " Yes" : " No"],
                  ["Sanitation", profile?.sanitation_access ? " Yes" : " No"],
                  ["Electricity", profile?.electricity_access ? " Yes" : " No"],
                ],
              },
              {
                title: "Education",
                icon: GraduationCap,
                items: [
                  ["Highest Education", profile?.highestEducationLevel],
                  ["Distance to School", `${profile?.distanceToSchoolKm} km`],
                  [
                    "Children Dropped Out",
                    profile?.childrenDroppedOut ? "Yes " : "No",
                  ],
                ],
              },
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-5">
                  <section.icon className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.items.map(([label, value]) => (
                    <div
                      key={label}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                        {label}
                      </div>
                      <div className="text-xs font-bold text-slate-900 capitalize">
                        {value ?? "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 rounded-2xl p-8 text-white"
            >
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
                Beneficiary Statement
              </h3>
              <p className="text-base text-center leading-relaxed text-slate-300">
                "{profile?.support_description}"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5">
                Evidence Documents
              </h3>
              {request.req_evidence?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {request.req_evidence.map((file, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-700 truncate">
                          {file.file_name || "Document"}
                        </span>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    No documents attached
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
                Priority Score
              </h3>
              <div className="flex justify-center items-end gap-1 mb-4">
                <span className="text-5xl font-bold text-slate-900 leading-none">
                  {request.urgency_score ?? profile?.selfrated_urgency ?? "—"}
                </span>
                <span className="text-sm font-bold text-slate-300 mb-1">
                  / 100
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${request.urgency_score ?? 0}%` }}
                  className={`h-full rounded-full ${(request.urgency_score ?? 0) > 70 ? "bg-red-500" : "bg-emerald-500"}`}
                />
              </div>
            </div>

            {isActionable ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase">
                    Officer Console
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Verification Notes
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your verification findings..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 outline-none h-28 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleAction("verified")}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Approve & Verify
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAction("flagged")}
                      disabled={isSubmitting}
                      className="py-3 bg-orange-50 text-orange-700 rounded-xl font-bold text-[10px] uppercase tracking-wider border border-orange-100 hover:bg-orange-100 transition-colors disabled:opacity-50"
                    >
                      Flag Case
                    </button>
                    <button
                      onClick={() => handleAction("rejected")}
                      disabled={isSubmitting}
                      className="py-3 bg-red-50 text-red-700 rounded-xl font-bold text-[10px] uppercase tracking-wider border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Reject Case
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                    Decisions are permanent. Verify against divisional records
                    before submitting.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Case Record
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      request.status === "verified"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : request.status === "rejected"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : request.status === "resolved"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-orange-50 border-orange-200 text-orange-700"
                    }`}
                  >
                    {request.status.replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Your Verification Notes
                  </p>
                  {request.gn_notes ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {request.gn_notes}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center">
                      <p className="text-[10px] font-semibold text-slate-400">
                        No notes were recorded
                      </p>
                    </div>
                  )}
                </div>

                {request.admin_notes && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Admin Decision Notes
                    </p>
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                      <p className="text-xs text-indigo-900 leading-relaxed">
                        {request.admin_notes}
                      </p>
                    </div>
                  </div>
                )}

                {request.updated_at && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <Clock className="w-3 h-3" />
                    Decision recorded:{" "}
                    {new Date(request.updated_at).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
                Contact
              </h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">
                    Mobile
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {profile?.phone_no}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
                Reference
              </h3>
              <div className="text-center">
                <span className="text-sm font-bold text-slate-700 font-mono">
                  {request.reference_no || "Not assigned"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 py-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between opacity-20">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-950" />
            <span className="text-sm font-black uppercase text-emerald-950">
              HOPE<span className="text-emerald-500 italic">CONNECT</span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            GN Officer Portal · Ver 5.0
          </span>
        </div>
      </footer>
    </div>
  );
}