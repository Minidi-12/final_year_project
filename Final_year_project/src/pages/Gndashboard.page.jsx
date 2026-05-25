import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  Filter,
  LogOut,
  LayoutDashboard,
  FileText,
  History,
  Calendar,
  Clock,
  Eye,
  Image as ImageIcon,
  Download,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useGetAllb_reqsQuery } from "../lib/api";
import Preloader from "../components/Preloader";

export default function GNDashboard() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "GN Officer";
  const gnDivision = localStorage.getItem("gnDivision") || "";
  const isMissingDivision = !gnDivision;
  console.log("GN Division from localStorage:", gnDivision);
  console.log("Missing gnDivision:", isMissingDivision);

  const [view, setView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const {
    data: allRequests = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllb_reqsQuery();

  const divisionRequests = allRequests.filter((req) => {
    const profile = req.b_profile?.[0];
    console.log(
      "profile.gn_division:",
      profile?.gn_division,
      "gnDivision:",
      gnDivision,
    );
    if (!profile) return false;
    // Only filter by division if gnDivision is set
    if (!gnDivision) return false;
    return profile.gn_division?.toLowerCase() === gnDivision.toLowerCase();
  });
  console.log("Division Requests:", divisionRequests);

  const filteredRequests = divisionRequests.filter((req) => {
    const profile = req.b_profile?.[0];
    if (!profile) return false;
    const activeStatuses = ["pending", "gn_assigned"];
    const historyStatuses = ["verified", "flagged", "rejected", "resolved"];
    const matchesView =
      view === "dashboard"
        ? activeStatuses.includes(req.status)
        : historyStatuses.includes(req.status);
    const matchesSearch =
      searchQuery === "" ||
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.nic?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesView && matchesSearch;
  });
  console.log("Filtered Requests:", filteredRequests);

  const stats = {
    pending: divisionRequests.filter((r) =>
      ["pending", "gn_assigned"].includes(r.status),
    ).length,
    verified: divisionRequests.filter((r) => r.status === "verified").length,
    flagged: divisionRequests.filter((r) => r.status === "flagged").length,
    total: divisionRequests.length,
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("gnDivision");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>
      <div className="min-h-screen bg-[#F8FAF9] flex font-sans">
        <aside className="w-64 bg-emerald-950 text-white flex flex-col hidden lg:flex">
          <div className="p-7 flex items-center gap-3 border-b border-emerald-900/50">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase">
              HOPE<span className="text-emerald-400 italic">CONNECT</span>
            </span>
          </div>

          <nav className="flex-1 p-5 space-y-2">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "history", icon: History, label: "All History" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  view === item.id
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-5 border-t border-emerald-900/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">
                Administrative Node
              </p>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                GN Division Overview
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-slate-900">
                  {userName.startsWith("Mr.") || userName.startsWith("Ms.")
                    ? userName
                    : `Mr. ${userName}`}
                </div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  Divisional Officer
                </div>
              </div>

              <div className="w-11 h-11 bg-emerald-100 rounded-full flex items-center justify-center ring-2 ring-emerald-200 overflow-hidden">
                <span className="text-sm font-black text-emerald-700">
                  {initials}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-auto">
            {isMissingDivision && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 font-bold">
                    GN Division Not Found
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Your GN Division information is missing. Please log out and
                    log in again, or contact your administrator.
                  </p>
                </div>
              </div>
            )}

            {gnDivision && (
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-slate-600">
                  {gnDivision} Division
                </span>
              </div>
            )}

            {isError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-600 font-medium flex-1">
                  Failed to load requests. Make sure your backend is running on
                  port 3000.
                </p>
                <button
                  onClick={refetch}
                  className="text-xs font-bold text-red-600 underline"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                {
                  label: "Pending Tasks",
                  val: stats.pending,
                  icon: Clock,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                  border: "border-amber-100",
                },
                {
                  label: "Verified Today",
                  val: stats.verified,
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                  border: "border-emerald-100",
                },
                {
                  label: "Flagged Case",
                  val: stats.flagged,
                  icon: AlertCircle,
                  color: "text-red-500",
                  bg: "bg-red-50",
                  border: "border-red-100",
                },
                {
                  label: "Total Managed",
                  val: stats.total,
                  icon: Users,
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                  border: "border-blue-100",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex items-center gap-4`}
                >
                  <div
                    className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {stat.val}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {view === "dashboard"
                      ? "Active Worklist"
                      : "Historical Archive"}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    {filteredRequests.length} record
                    {filteredRequests.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type="text"
                      placeholder="Search name or NIC..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-200 w-60"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-400 border border-gray-100">
                    <Filter className="w-3.5 h-3.5" /> Filters
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      {[
                        "Beneficiary",
                        "Main Need",
                        "Division",
                        "Submitted",
                        "Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${h === "Action" ? "text-right" : "text-left"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <AnimatePresence>
                      {isLoading ? (
                        [...Array(4)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan={6} className="px-6 py-5">
                              <div className="h-7 bg-gray-100 rounded-lg w-full" />
                            </td>
                          </tr>
                        ))
                      ) : filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-3 opacity-20">
                              <FileText className="w-12 h-12" />
                              <p className="text-xs font-bold uppercase tracking-widest">
                                No records found
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredRequests.map((req) => {
                          const profile = req.b_profile?.[0];
                          if (!profile) return null;
                          const date = req.created_at
                            ? new Date(req.created_at).toLocaleDateString()
                            : "—";
                          return (
                            <motion.tr
                              key={req._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-emerald-50/20 transition-colors group"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center font-bold text-emerald-700 text-xs ring-1 ring-emerald-100">
                                    {profile.name?.[0]?.toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-900">
                                      {profile.name}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      {profile.nic}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex flex-wrap gap-1.5">
                                  {profile.support_types
                                    ?.slice(0, 1)
                                    .map((type) => (
                                      <span
                                        key={type}
                                        className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-widest"
                                      >
                                        {type}
                                      </span>
                                    ))}
                                  {profile.support_types?.length > 1 && (
                                    <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-lg">
                                      +{profile.support_types.length - 1}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                  <MapPin className="w-3 h-3 text-emerald-300" />{" "}
                                  {profile.gn_division}
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                  <Calendar className="w-3 h-3 text-emerald-300" />{" "}
                                  {date}
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      req.status === "verified"
                                        ? "bg-emerald-500"
                                        : req.status === "pending"
                                          ? "bg-amber-500 animate-pulse"
                                          : req.status === "gn_assigned"
                                            ? "bg-indigo-500 animate-pulse"
                                            : req.status === "flagged"
                                              ? "bg-orange-500"
                                              : req.status === "resolved"
                                                ? "bg-blue-500"
                                                : "bg-red-500"
                                    }`}
                                  />
                                  <span
                                    className={`text-[11px] font-black uppercase tracking-wider ${
                                      req.status === "verified"
                                        ? "text-emerald-600"
                                        : req.status === "pending"
                                          ? "text-amber-600"
                                          : req.status === "gn_assigned"
                                            ? "text-indigo-600"
                                            : req.status === "flagged"
                                              ? "text-orange-600"
                                              : req.status === "resolved"
                                                ? "text-blue-600"
                                                : "text-red-600"
                                    }`}
                                  >
                                    {req.status.replace("_", " ")}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <button
                                  onClick={() => navigate(`/verify/${req._id}`)}
                                  className="px-5 py-2 bg-emerald-950 hover:bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 inline-flex items-center gap-1.5"
                                >
                                  {view === "dashboard" ? "Verify" : "View"}{" "}
                                  <FileText className="w-3 h-3 opacity-50" />
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        <AnimatePresence>
          {selectedEvidence && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={(e) =>
                e.target === e.currentTarget && setSelectedEvidence(null)
              }
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Request Evidence Documents
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {selectedEvidence.b_profile?.[0]?.name || "Beneficiary"}'s
                      evidence files
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEvidence(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {(() => {
                    // Robust URL extractor — handles plain strings, {url},
                    // {fileUrl}, {file_url}, {path}, {key} from R2 storage
                    const getFileUrl = (file) => {
                      if (!file) return null;
                      if (typeof file === "string") return file;
                      return (
                        file.url ||
                        file.fileUrl ||
                        file.file_url ||
                        file.path ||
                        file.key ||
                        null
                      );
                    };
                    const getFileName = (file, i) => {
                      if (!file) return `Document ${i + 1}`;
                      if (typeof file === "string")
                        return file.split("/").pop() || `Evidence ${i + 1}`;
                      return (
                        file.file_name ||
                        file.fileName ||
                        file.name ||
                        file.original_name ||
                        (getFileUrl(file) || "").split("/").pop() ||
                        `Document ${i + 1}`
                      );
                    };
                    const isPdf = (url = "") =>
                      url.toLowerCase().includes(".pdf") ||
                      url.toLowerCase().includes("pdf");
                    const isImage = (url = "") =>
                      /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url);

                    const docs =
                      selectedEvidence.req_evidence ||
                      selectedEvidence.evidence_documents ||
                      selectedEvidence.documents ||
                      [];

                    if (!docs.length)
                      return (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                          <p className="text-sm text-gray-400">
                            No evidence documents uploaded
                          </p>
                        </div>
                      );

                    return docs.map((file, idx) => {
                      const fileUrl = getFileUrl(file);
                      const fileName = getFileName(file, idx);
                      if (!fileUrl) return null;
                      return (
                        <a
                          key={idx}
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                        >
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors overflow-hidden">
                            {isImage(fileUrl) ? (
                              <img
                                src={fileUrl}
                                alt=""
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : isPdf(fileUrl) ? (
                              <FileText className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {fileName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {isPdf(fileUrl)
                                ? "PDF Document"
                                : isImage(fileUrl)
                                  ? "Image File"
                                  : "Document"}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(fileUrl, "_blank");
                            }}
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </a>
                      );
                    });
                  })()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
