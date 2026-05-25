import React, { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Heart,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Download,
  Eye,
  FileText,
  ShieldCheck,
  Flag,
  Activity,
  User,
  DollarSign,
  MapPin,
  Phone,
  RefreshCw,
  Zap,
  Award,
  Calendar,
  Settings,
  X,
  UserPlus,
  Trash2,
  AlertTriangle,
  Mail,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  useGetAllb_reqsQuery,
  useGetAllGnOfficersQuery,
  useUpdateb_reqMutation,
  useGetAllgn_divisionsQuery,
  useGetAllprojectsQuery,
  useCreateprojectMutation,
  useDeleteprojectMutation,
  useCreateGnOfficerMutation,
  useDeleteGnOfficerMutation,
  useGetAllvolunteersQuery,
  useDeletevolunteerMutation,
  useDeleteb_reqMutation,
} from "@/lib/api";
import { putImage } from "@/lib/b_req";
import Preloader from "../components/Preloader";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];
const CLUSTER_COLORS = { 1: "#ef4444", 2: "#f59e0b", 3: "#10b981" };
const STATUS_META = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500 animate-pulse",
    border: "border-amber-200",
  },
  gn_assigned: {
    label: "GN Assigned",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500 animate-pulse",
    border: "border-indigo-200",
  },
  verified: {
    label: "Verified",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  flagged: {
    label: "Flagged",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    border: "border-orange-200",
  },
  resolved: {
    label: "Resolved",
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    border: "border-slate-200",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
};

function DecisionBtn({ icon: Icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 py-3 ${color} rounded-xl text-xs font-bold transition-all`}
    >
      {Icon && <Icon className="w-4 h-4" />} {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_META[status] || STATUS_META.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${c.bg} ${c.text} ${c.border} border text-[10px] font-bold`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function ChartCard({ title, sub, children, action }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, val, detail, icon: Icon, color, bg, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 ${bg} ${color} rounded-xl`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-1">
        {val}
      </p>
      <p className="text-xs font-medium text-emerald-600">{detail}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userName = localStorage.getItem("userName") || "Admin";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { data: allRequests = [], isLoading, refetch } = useGetAllb_reqsQuery();
  const { data: gnOfficers = [] } = useGetAllGnOfficersQuery();
  const { data: gnDivisions = [] } = useGetAllgn_divisionsQuery();
  const { data: volunteers = [] } = useGetAllvolunteersQuery();
  const [updateb_req, { isLoading: isUpdating }] = useUpdateb_reqMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteb_reqMutation();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteRequest = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteRequest(confirmDeleteId).unwrap();
      setConfirmDeleteId(null);
      refetch();
    } catch (err) {
      alert("Delete failed: " + (err.data?.message || err.message));
    }
  };

  const NAV = [
    { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
    { id: "queue", icon: Activity, label: "Review Queue" },
    { id: "projects", icon: Briefcase, label: "Projects" },
    { id: "officers", icon: ShieldCheck, label: "GN Network" },
    { id: "volunteers", icon: UserPlus, label: "Volunteers" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewView
            allRequests={allRequests}
            gnDivisions={gnDivisions}
            isLoading={isLoading}
          />
        );
      case "queue":
        return (
          <QueueView
            allRequests={allRequests}
            searchQuery={searchQuery}
            isLoading={isLoading}
            onSelect={(id) => {
              setSelectedId(id);
              setActiveTab("detail");
            }}
            onUpdate={updateb_req}
            confirmDeleteId={confirmDeleteId}
            setConfirmDeleteId={setConfirmDeleteId}
            onDelete={handleDeleteRequest}
            isDeleting={isDeleting}
          />
        );
      case "detail":
        return (
          <DetailView
            id={selectedId}
            allRequests={allRequests}
            isUpdating={isUpdating}
            onUpdate={updateb_req}
            onBack={() => setActiveTab("queue")}
          />
        );
      case "projects":
        return <ProjectsView />;
      case "officers":
        return (
          <OfficersView gnOfficers={gnOfficers} gnDivisions={gnDivisions} />
        );
      case "volunteers":
        return <VolunteersView volunteers={volunteers} />;
      default:
        return (
          <OverviewView
            allRequests={allRequests}
            gnDivisions={gnDivisions}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>
      <div className="min-h-screen bg-[#F8FAFB] flex font-sans">
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden lg:flex sticky top-0 h-screen">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-black text-slate-900 uppercase tracking-tight">
              HOPE<span className="text-emerald-600">CONNECT</span>
            </span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id ||
                  (activeTab === "detail" && item.id === "queue")
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${activeTab === item.id || (activeTab === "detail" && item.id === "queue") ? "text-emerald-600" : ""}`}
                />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {userName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  NGO Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-600 text-sm font-semibold transition-colors rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === "queue"
                ? "Review Queue"
                : activeTab === "projects"
                  ? "Projects"
                  : activeTab}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
                title="Back to Home"
              >
                <Home className="w-4 h-4" />
              </button>
              {activeTab !== "overview" && (
                <button
                  onClick={refetch}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              {(activeTab === "queue" || activeTab === "overview") && (
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    placeholder="Search cases…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-200 outline-none w-56 transition-all"
                  />
                </div>
              )}
            </div>
          </header>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}

function OverviewView({ allRequests, gnDivisions, isLoading }) {
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = allRequests.filter((r) => {
      const d = new Date(r.created_at);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    return {
      total: allRequests.length,
      pending: allRequests.filter((r) => r.status === "pending").length,
      gnAssigned: allRequests.filter((r) => r.status === "gn_assigned").length,
      verified: allRequests.filter((r) => r.status === "verified").length,
      resolved: allRequests.filter((r) => r.status === "resolved").length,
      flagged: allRequests.filter((r) => r.status === "flagged").length,
      rejected: allRequests.filter((r) => r.status === "rejected").length,
      highUrgency: allRequests.filter(
        (r) => r.urgency_label?.toLowerCase() === "high",
      ).length,
      thisMonth: thisMonth.length,
    };
  }, [allRequests]);

  const monthlyTrend = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const counts = {};
    allRequests.forEach((r) => {
      const m = months[new Date(r.created_at).getMonth()];
      counts[m] = (counts[m] || 0) + 1;
    });
    return months
      .filter((m) => counts[m])
      .map((m) => ({ name: m, count: counts[m] || 0 }));
  }, [allRequests]);

  const divisionData = useMemo(() => {
    const map = {};
    allRequests.forEach((r) => {
      const div = r.b_profile?.[0]?.gn_division || "Unknown";
      if (!map[div]) map[div] = { name: div, requests: 0, verified: 0 };
      map[div].requests++;
      if (r.status === "verified" || r.status === "resolved")
        map[div].verified++;
    });
    return Object.values(map);
  }, [allRequests]);

  const supportData = useMemo(() => {
    const map = {};
    allRequests.forEach((r) => {
      r.b_profile?.[0]?.support_types?.forEach((t) => {
        map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.replace("-", " "),
      value,
    }));
  }, [allRequests]);

  const urgencyData = useMemo(
    () => [
      {
        name: "High",
        count: allRequests.filter(
          (r) => r.urgency_label?.toLowerCase() === "high",
        ).length,
        fill: "#ef4444",
      },
      {
        name: "Moderate",
        count: allRequests.filter(
          (r) => r.urgency_label?.toLowerCase() === "moderate",
        ).length,
        fill: "#f59e0b",
      },
      {
        name: "Stable",
        count: allRequests.filter(
          (r) => r.urgency_label?.toLowerCase() === "stable",
        ).length,
        fill: "#10b981",
      },
    ],
    [allRequests],
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          val={stats.total}
          detail="All time"
          icon={FileText}
          color="text-blue-600"
          bg="bg-blue-50"
          delay={0}
        />
        <StatCard
          label="Pending"
          val={stats.pending}
          detail="Awaiting assignment"
          icon={Clock}
          color="text-amber-600"
          bg="bg-amber-50"
          delay={0.05}
        />
        <StatCard
          label="GN Assigned"
          val={stats.gnAssigned}
          detail="In field review"
          icon={MapPin}
          color="text-indigo-600"
          bg="bg-indigo-50"
          delay={0.1}
        />
        <StatCard
          label="Verified"
          val={stats.verified}
          detail="Ready for support"
          icon={CheckCircle2}
          color="text-emerald-600"
          bg="bg-emerald-50"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Resolved"
          val={stats.resolved}
          detail="Aid delivered"
          icon={Award}
          color="text-teal-600"
          bg="bg-teal-50"
          delay={0.2}
        />
        <StatCard
          label="Flagged"
          val={stats.flagged}
          detail="Needs review"
          icon={Flag}
          color="text-orange-600"
          bg="bg-orange-50"
          delay={0.25}
        />
        <StatCard
          label="High Urgency"
          val={stats.highUrgency}
          detail="Priority cases"
          icon={Zap}
          color="text-red-600"
          bg="bg-red-50"
          delay={0.3}
        />
        <StatCard
          label="This Month"
          val={stats.thisMonth}
          detail="New requests"
          icon={Calendar}
          color="text-purple-600"
          bg="bg-purple-50"
          delay={0.35}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Submission Trends"
          sub="Monthly intake volume from real data"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#greenGrad)"
                dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Requests by GN Division"
          sub="Total requests vs verified cases per division"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={divisionData} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey="requests"
                fill="#e2e8f0"
                radius={[6, 6, 0, 0]}
                barSize={28}
                name="Total"
              />
              <Bar
                dataKey="verified"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                barSize={28}
                name="Verified"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Support Type Distribution"
          sub="Breakdown of requested aid categories"
        >
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie
                  data={supportData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {supportData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {supportData.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 capitalize truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.value} requests
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Urgency Distribution"
          sub="ML-assessed case severity breakdown"
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={urgencyData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 700, fill: "#1e293b" }}
                width={75}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{ borderRadius: "12px", border: "none" }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={28}>
                {urgencyData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-8 mt-4 pt-4 border-t border-slate-50">
            {urgencyData.map((item, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-slate-900">
                  {item.count}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> District Poverty
              Index Map
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "High", dot: "bg-red-500" },
              { label: "Moderate", dot: "bg-amber-400" },
              { label: "Stable", dot: "bg-emerald-500" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <span className="text-[10px] font-bold text-slate-400">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <DistrictLeafletMap height={480} />
      </div>
    </div>
  );
}
function QueueView({
  allRequests,
  searchQuery,
  isLoading,
  onSelect,
  onUpdate,
  confirmDeleteId,
  setConfirmDeleteId,
  onDelete,
  isDeleting,
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [filterDivision, setFilterDivision] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const divisions = useMemo(() => {
    const d = new Set(
      allRequests.map((r) => r.b_profile?.[0]?.gn_division).filter(Boolean),
    );
    return ["all", ...d];
  }, [allRequests]);

  const filtered = useMemo(() => {
    return allRequests
      .filter((r) => {
        const p = r.b_profile?.[0];
        const name = p?.name?.toLowerCase() || "";
        const nic = p?.nic?.toLowerCase() || "";
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || name.includes(q) || nic.includes(q);
        const matchStatus = filterStatus === "all" || r.status === filterStatus;
        const matchUrgency =
          filterUrgency === "all" ||
          r.urgency_label?.toLowerCase() === filterUrgency;
        const matchDivision =
          filterDivision === "all" || p?.gn_division === filterDivision;
        return matchSearch && matchStatus && matchUrgency && matchDivision;
      })
      .sort((a, b) => {
        const aIsProcessed = a.status === "verified" || a.status === "rejected";
        const bIsProcessed = b.status === "verified" || b.status === "rejected";

        if (aIsProcessed && !bIsProcessed) return 1;
        if (!aIsProcessed && bIsProcessed) return -1;

        return sortBy === "score"
          ? (b.urgency_score ?? 0) - (a.urgency_score ?? 0)
          : (a.b_profile?.[0]?.name || "").localeCompare(
              b.b_profile?.[0]?.name || "",
            );
      });
  }, [
    allRequests,
    searchQuery,
    filterStatus,
    filterUrgency,
    filterDivision,
    sortBy,
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {Object.keys(STATUS_META).map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none cursor-pointer"
        >
          <option value="all">All Urgency</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="stable">Stable</option>
        </select>
        <select
          value={filterDivision}
          onChange={(e) => setFilterDivision(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none cursor-pointer"
        >
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d === "all" ? "All Divisions" : d}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none cursor-pointer ml-auto"
        >
          <option value="score">Sort: Urgency Score</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
        <span className="text-xs font-semibold text-slate-400">
          {filtered.length} records
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Beneficiary",
                  "Division",
                  "Support",
                  "Urgency Score",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${h === "Action" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-8 bg-slate-100 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-slate-400 text-sm font-medium"
                  >
                    No records match your filters
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const p = req.b_profile?.[0];
                  const urgencyColor =
                    req.urgency_label?.toLowerCase() === "high"
                      ? "text-red-600 bg-red-50"
                      : req.urgency_label?.toLowerCase() === "moderate"
                        ? "text-amber-600 bg-amber-50"
                        : "text-emerald-600 bg-emerald-50";
                  return (
                    <tr
                      key={req._id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 text-xs font-bold ring-1 ring-emerald-100 shrink-0">
                            {p?.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {p?.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {p?.nic}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          <MapPin className="w-3 h-3 text-emerald-400" />{" "}
                          {p?.gn_division || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p?.support_types?.slice(0, 1).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase"
                            >
                              {t}
                            </span>
                          ))}
                          {(p?.support_types?.length || 0) > 1 && (
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[10px] font-bold">
                              +{p.support_types.length - 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl ${urgencyColor} text-xs font-bold`}
                        >
                          <span>{req.urgency_score ?? "—"}</span>
                          {req.urgency_label && (
                            <span className="opacity-60">
                              / {req.urgency_label}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => onSelect(req._id)}
                            className="px-4 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> Review
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(req._id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-95 border border-red-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget &&
              !isDeleting &&
              setConfirmDeleteId(null)
            }
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Delete Request
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                Are you sure you want to delete this beneficiary request?
              </p>

              <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-6">
                <p className="text-xs text-red-700 font-medium leading-relaxed">
                  This action is permanent and cannot be undone. All data
                  associated with this request will be deleted from the
                  database.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-red-200"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailView({ id, allRequests, isUpdating, onUpdate, onBack }) {
  const req = allRequests.find((r) => r._id === id);
  const [notes, setNotes] = useState("");
  const [actionDone, setActionDone] = useState(false);

  if (!req)
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Case not found.</p>
        <button
          onClick={onBack}
          className="mt-4 text-emerald-600 font-semibold text-sm"
        >
          ← Back to Queue
        </button>
      </div>
    );

  const p = req.b_profile?.[0];
  const isActionable = ["pending", "gn_assigned", "verified"].includes(
    req.status,
  );

  const handleAction = async (newStatus) => {
    try {
      await onUpdate({
        id,
        status: newStatus,
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      }).unwrap();
      setActionDone(true);
    } catch (err) {
      alert("Update failed: " + (err.data?.message || err.message));
    }
  };

  const infoGrid = (items) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map(([label, val]) => (
        <div
          key={label}
          className="bg-slate-50 rounded-xl p-3 border border-slate-100"
        >
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
            {label}
          </p>
          <p className="text-sm font-semibold text-slate-800 truncate">
            {val ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900">{p?.name}</h2>
          <p className="text-xs text-slate-400 font-mono">
            {req.reference_no || req._id}
          </p>
        </div>
        <StatusBadge status={req.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Demographics
              </h3>
            </div>
            {infoGrid([
              ["Name", p?.name],
              ["NIC", p?.nic],
              ["Age", p?.age ? `${p.age} years` : null],
              ["Gender", p?.gender],
              ["Phone", p?.phone_no],
              ["GN Division", p?.gn_division],
            ])}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Financial
              </h3>
            </div>
            {infoGrid([
              [
                "Monthly Income",
                p?.monthly_income
                  ? `LKR ${p.monthly_income.toLocaleString()}`
                  : null,
              ],
              ["Employment", p?.employment_type],
              ["Housing", p?.housing_type],
              ["Family Size", p?.family_size],
              ["Children Under 18", p?.children_under_18 ?? 0],
              ["Govt Allowance", p?.GovtAllowance?.join(", ") || "None"],
            ])}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Health & Education
              </h3>
            </div>
            {infoGrid([
              [
                "Chronic Illness",
                p?.chronic_illness?.exists
                  ? p.chronic_illness.description || "Yes"
                  : "None",
              ],
              [
                "Nearest Hospital",
                p?.nearest_hospitalkm ? `${p.nearest_hospitalkm} km` : null,
              ],
              ["Education Level", p?.highestEducationLevel],
              [
                "Distance to School",
                p?.distanceToSchoolKm ? `${p.distanceToSchoolKm} km` : null,
              ],
              ["Disability", p?.disabilityInHousehold ? "Yes" : "No"],
              ["Children Dropped Out", p?.childrenDroppedOut ? "Yes" : "No"],
            ])}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Housing & Utilities
              </h3>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
              {p?.address || "—"}
            </p>
            <div className="flex gap-3">
              {[
                { label: "Safe Water", val: p?.safewater_access },
                { label: "Sanitation", val: p?.sanitation_access },
                { label: "Electricity", val: p?.electricity_access },
              ].map((u) => (
                <div
                  key={u.label}
                  className={`flex-1 p-3 rounded-xl border text-center text-xs font-bold ${u.val ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-100 text-red-600"}`}
                >
                  {u.label}
                  <br />
                  <span className="text-sm">{u.val ? "✅" : "❌"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Beneficiary Statement
            </p>
            <p className="text-sm leading-relaxed text-slate-300 italic">
              "{p?.support_description}"
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Evidence Documents
            </h3>
            {(() => {
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
                req.req_evidence ||
                req.evidence_documents ||
                req.documents ||
                [];
              if (!docs.length)
                return (
                  <div className="text-center py-6 text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No evidence documents uploaded</p>
                  </div>
                );

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {docs.map((file, i) => {
                    const fileUrl = getFileUrl(file);
                    const fileName = getFileName(file, i);
                    if (!fileUrl) return null;
                    return (
                      <a
                        key={i}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors overflow-hidden">
                          {isImage(fileUrl) ? (
                            <img
                              src={fileUrl}
                              alt=""
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling &&
                                  (e.target.nextSibling.style.display = "flex");
                              }}
                            />
                          ) : null}
                          <FileText
                            className={`w-4 h-4 text-emerald-600 group-hover:text-white ${isImage(fileUrl) ? "hidden" : ""}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {fileName}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {isPdf(fileUrl)
                              ? "PDF Document"
                              : isImage(fileUrl)
                                ? "Image File"
                                : "Document"}
                          </p>
                        </div>
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
              Urgency Score
            </p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-5xl font-bold text-slate-900">
                {req.urgency_score ?? "—"}
              </span>
              <span className="text-sm text-slate-400 mb-1">/ 100</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${req.urgency_score ?? 0}%` }}
                className={`h-full rounded-full ${(req.urgency_score ?? 0) >= 70 ? "bg-red-500" : (req.urgency_score ?? 0) >= 40 ? "bg-amber-500" : "bg-emerald-500"}`}
              />
            </div>
            <div className="text-xs font-semibold">
              Label:{" "}
              <span
                className={`font-bold ${req.urgency_label?.toLowerCase() === "high" ? "text-red-600" : req.urgency_label?.toLowerCase() === "moderate" ? "text-amber-600" : "text-emerald-600"}`}
              >
                {req.urgency_label || "Not assessed"}
              </span>
            </div>
            {req.ml_details && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Rule-based</span>
                  <span className="font-bold">{req.ml_details.rule_score}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>ML Score</span>
                  <span className="font-bold">{req.ml_details.ml_score}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Method</span>
                  <span className="font-bold capitalize">
                    {req.ml_details.method}
                  </span>
                </div>
              </div>
            )}
          </div>

          {req.Predictions?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                3-Month Forecast
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart
                  data={req.Predictions.map((p) => ({
                    month: `M${p.month}`,
                    score: p.score,
                  }))}
                >
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "11px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#ef4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              GN Officer Notes
            </p>
            {req.gn_notes ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2">
                <p className="text-xs text-slate-700 leading-relaxed">
                  {req.gn_notes}
                </p>
                {req.gn_verified && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" /> GN Verified
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-[11px] font-semibold text-slate-400">
                  {["pending", "gn_assigned"].includes(req.status)
                    ? "GN Officer has not reviewed this case yet"
                    : "No notes were recorded by the GN Officer"}
                </p>
              </div>
            )}
          </div>

          {isActionable && !actionDone ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Officer
                Decision
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Decision notes (optional)…"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none h-20"
              />
              <div className="space-y-2">
                <button
                  disabled={isUpdating}
                  onClick={() => handleAction("resolved")}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Mark Resolved
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleAction("flagged")}
                    className="py-3 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-[10px] font-bold uppercase tracking-wide hover:bg-orange-100 transition-colors disabled:opacity-50"
                  >
                    Flag Case
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleAction("rejected")}
                    className="py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[10px] font-bold uppercase tracking-wide hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : actionDone ? (
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-bold text-emerald-800">
                  Status updated successfully
                </p>
              </div>
              {notes && (
                <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Your Decision Notes
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-500">
                This case is already <strong>{req.status}</strong> — no further
                action needed.
              </p>
              {req.admin_notes && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Admin Decision Notes
                  </p>
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-900 leading-relaxed">
                      {req.admin_notes}
                    </p>
                  </div>
                </div>
              )}
              {req.updated_at && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <Clock className="w-3 h-3" />
                  {new Date(req.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
              Contact
            </p>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-slate-900">
                {p?.phone_no}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsView() {
  const { data: projects = [], isLoading, refetch } = useGetAllprojectsQuery();
  const [showForm, setShowForm] = useState(false);
  const [selectedProj, setSelectedProj] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");
  const [createproject, { isLoading: isCreating }] = useCreateprojectMutation();
  const [deleteproject, { isLoading: isDeleting }] = useDeleteprojectMutation();
  const EMPTY = {
    title: "",
    budget: "",
    volunteers_needed: "",
    status: "active",
    description: "",
    location: "",
    category: "",
  };
  const [form, setForm] = useState(EMPTY);

  const handleDelete = async () => {
    try {
      await deleteproject(selectedProj._id).unwrap();
      setDeleteConfirm(false);
      setSelectedProj(null);
      setSuccessMsg(` "${selectedProj.title}" deleted successfully.`);
      refetch();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert("Delete failed: " + (err.data?.message || err.message));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim()) return setFormError("Project title is required.");
    if (!form.budget || Number(form.budget) <= 0)
      return setFormError("Please enter a valid budget.");
    if (!form.category) return setFormError("Please select a category.");
    if (form.description.trim().length < 10)
      return setFormError("Description must be at least 10 characters.");

    const statusMap = {
      active: "active",
      Active: "active",
      completed: "completed",
      Completed: "completed",
      on_hold: "on_hold",
      "On Hold": "on_hold",
      "On-hold": "on_hold",
      Ongoing: "on_hold",
    };
    const safeStatus = statusMap[form.status] ?? "active";

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      budget: Number(form.budget),
      fundsRaised: 0,
      volunteers_needed: Number(form.volunteers_needed) || 0,
      status: safeStatus,
      location: form.location.trim() || "Sri Lanka",
      start_date: new Date().toISOString(),
      requiredSkills: [],
      skillsText: "",
    };

    console.log(" Sending to API:", payload);

    try {
      await createproject(payload).unwrap();
      setShowForm(false);
      setForm(EMPTY);
      setSuccessMsg(` Project "${form.title}" launched successfully!`);
      refetch();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setFormError(
        err.data?.message || err.message || "Failed to create project.",
      );
    }
  };

  const statusColor = (s) => {
    if (s?.toLowerCase() === "active")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s?.toLowerCase() === "completed")
      return "bg-slate-100 text-slate-600 border-slate-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const displayProjects =
    projects.length > 0
      ? projects
      : [
          {
            _id: "p1",
            title: "Walpita Housing Phase 1",
            budget: 5000000,
            fundsRaised: 3200000,
            volunteers_needed: 24,
            status: "Active",
          },
          {
            _id: "p2",
            title: "Medical Camp 2024",
            budget: 800000,
            fundsRaised: 750000,
            volunteers_needed: 45,
            status: "Completed",
          },
          {
            _id: "p3",
            title: "Student Scholarships",
            budget: 1200000,
            fundsRaised: 400000,
            volunteers_needed: 10,
            status: "Ongoing",
          },
        ];

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold px-5 py-3.5 rounded-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{" "}
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Community Initiatives
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Active aid projects and resource goals
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setFormError("");
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-200 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Launch New Project
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, i) => {
            const pct =
              project.budget > 0
                ? Math.min(
                    Math.round(
                      ((project.fundsRaised || 0) / project.budget) * 100,
                    ),
                    100,
                  )
                : 0;
            return (
              <motion.div
                key={project._id || i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-slate-500" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-5">
                    {project.volunteers_needed || 0} Volunteers Enrolled
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">
                        Budget Status
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {pct}% Used
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>
                        LKR {(project.fundsRaised || 0).toLocaleString()}
                      </span>
                      <span>
                        Target: {(project.budget || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => {
                      setSelectedProj(project);
                      setDeleteConfirm(false);
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all active:scale-95"
                  >
                    Project Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedProj && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setSelectedProj(null)
            }
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedProj.title}
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        selectedProj.status?.toLowerCase() === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : selectedProj.status?.toLowerCase() === "completed"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {selectedProj.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProj(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {(() => {
                  const pct =
                    selectedProj.budget > 0
                      ? Math.min(
                          Math.round(
                            ((selectedProj.fundsRaised || 0) /
                              selectedProj.budget) *
                              100,
                          ),
                          100,
                        )
                      : 0;
                  return (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                        Financial Progress
                      </p>
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-bold text-slate-900">
                          LKR {(selectedProj.fundsRaised || 0).toLocaleString()}
                        </span>
                        <span className="text-sm text-slate-400 mb-0.5">
                          of {(selectedProj.budget || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                        />
                      </div>
                      <p className="text-xs font-semibold text-slate-500">
                        {pct}% of target reached
                      </p>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-3">
                  {[
                    [
                      "Category",
                      selectedProj.category?.replace(/_/g, " ") || "—",
                    ],
                    ["Location", selectedProj.location || "—"],
                    [
                      "Volunteers",
                      `${selectedProj.volunteers_needed || 0} needed`,
                    ],
                    [
                      "Start Date",
                      selectedProj.start_date
                        ? new Date(selectedProj.start_date).toLocaleDateString(
                            "en-GB",
                          )
                        : "—",
                    ],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="bg-slate-50 rounded-xl p-3 border border-slate-100"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-slate-800 capitalize truncate">
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedProj.description && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                      Description
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                      {selectedProj.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100">
                {deleteConfirm ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="text-sm font-bold text-red-800 mb-1">
                      Delete "{selectedProj.title}"?
                    </p>
                    <p className="text-xs text-red-600 mb-4">
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                            Deleting…
                          </>
                        ) : (
                          "Yes, Delete"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedProj(null)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Flag className="w-4 h-4" /> Delete Project
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Launch New Project
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Create a new community aid initiative
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700 flex items-center gap-2"
                  >
                    <X className="w-4 h-4 shrink-0" /> {formError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, title: e.target.value }));
                      setFormError("");
                    }}
                    placeholder="e.g. Walpita Housing Phase 2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Briefly describe the project goals and target community…"
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, category: e.target.value }));
                      setFormError("");
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none"
                  >
                    <option value="">Select a category</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="environment">Environment</option>
                    <option value="community_development">
                      Community Development
                    </option>
                    <option value="disaster_relief">Disaster Relief</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Total Budget (LKR) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                        LKR
                      </span>
                      <input
                        required
                        type="number"
                        min="1"
                        value={form.budget}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, budget: e.target.value }));
                          setFormError("");
                        }}
                        placeholder="5000000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Volunteers Needed
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.volunteers_needed}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          volunteers_needed: e.target.value,
                        }))
                      }
                      placeholder="20"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, status: e.target.value }))
                      }
                    >
                      <option value="active">Active</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Location
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                      placeholder="e.g. Walpita"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                        Saving…
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Launch Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OfficersView({ gnOfficers, gnDivisions }) {
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [viewProofOfficer, setViewProofOfficer] = useState(null);
  const { data: allDivisions = [] } = useGetAllgn_divisionsQuery();
  const [createGnOfficer, { isLoading: isCreating }] =
    useCreateGnOfficerMutation();
  const [deleteGnOfficer, { isLoading: isDeleting }] =
    useDeleteGnOfficerMutation();
  const [form, setForm] = useState({
    name: "",
    phone_no: "",
    gn_division_id: "",
    isActive: true,
    proofFileUrl: "",
    proofFileName: "",
  });
  const [proofFile, setProofFile] = useState(null);
  const fileInputRef = useRef(null);

  const officerToDelete = gnOfficers.find(
    (o) => (o._id || o.id) === confirmDeleteId,
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, JPG, or PNG file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setProofFile(file);
      setForm((p) => ({ ...p, proofFileName: file.name }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone_no.trim() || !form.gn_division_id) {
      alert("Please fill all required fields");
      return;
    }
    if (!proofFile) {
      alert("Please upload proof document (ID, photo, or PDF)");
      return;
    }
    try {
      const proofFileUrl = await putImage({ file: proofFile });

      const submissionData = {
        ...form,
        proofFileUrl,
      };

      await createGnOfficer(submissionData).unwrap();
      setShowModal(false);
      setForm({
        name: "",
        phone_no: "",
        gn_division_id: "",
        isActive: true,
        proofFileUrl: "",
        proofFileName: "",
      });
      setProofFile(null);
    } catch (err) {
      alert("Failed: " + (err.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteGnOfficer(confirmDeleteId).unwrap();
      setConfirmDeleteId(null);
    } catch (err) {
      alert("Delete failed: " + (err.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            GN Officer Network
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {gnOfficers.length} officer{gnOfficers.length !== 1 ? "s" : ""}{" "}
            registered
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-200 active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Add GN Officer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gnOfficers.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No GN officers registered yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-emerald-600 text-sm font-semibold hover:underline"
            >
              + Add your first officer
            </button>
          </div>
        ) : (
          gnOfficers.map((officer, i) => (
            <motion.div
              key={officer._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative"
            >
              <button
                onClick={() => setConfirmDeleteId(officer._id || officer.id)}
                title="Remove officer"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg
                         bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200
                         hover:border-red-300 transition-all hover:scale-110 active:scale-95 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-lg ring-1 ring-emerald-100">
                  {officer.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-900 truncate">
                    {officer.name}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                    {officer.gn_division_id?.gn_division_Name ||
                      "Division not set"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                    Phone
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {officer.phone_no}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                    Status
                  </p>
                  <p
                    className={`text-xs font-bold ${officer.isActive ? "text-emerald-700" : "text-slate-500"}`}
                  >
                    {officer.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              {officer.proofFileUrl ? (
                <button
                  onClick={() => setViewProofOfficer(officer)}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-all active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Proof Document
                </button>
              ) : (
                <div className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-xs font-medium">
                  <FileText className="w-3.5 h-3.5" />
                  No proof document
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          GN Divisions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gnDivisions.map((d, i) => (
            <div
              key={i}
              className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center"
            >
              <p className="text-sm font-bold text-emerald-800">
                {d.gn_division_Name || d.name}
              </p>
              <p className="text-[10px] text-emerald-500 mt-1 uppercase tracking-wide">
                Active Division
              </p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewProofOfficer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setViewProofOfficer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Proof Document</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {viewProofOfficer.name} — {viewProofOfficer.gn_division_id?.gn_division_Name || "Officer"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={viewProofOfficer.proofFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                  <a
                    href={viewProofOfficer.proofFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open
                  </a>
                  <button
                    onClick={() => setViewProofOfficer(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {viewProofOfficer.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{viewProofOfficer.name}</p>
                    <p className="text-[10px] text-slate-400">{viewProofOfficer.phone_no}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {viewProofOfficer.gn_division_id?.gn_division_Name || "—"}
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${viewProofOfficer.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${viewProofOfficer.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                  {viewProofOfficer.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="p-6">
                {viewProofOfficer.proofFileUrl?.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i) ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[300px]">
                    <img
                      src={viewProofOfficer.proofFileUrl}
                      alt="Proof document"
                      className="max-w-full max-h-[420px] object-contain rounded-xl"
                    />
                  </div>
                ) : viewProofOfficer.proofFileUrl?.match(/\.pdf(\?|$)/i) ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height: 460 }}>
                    <iframe
                      src={viewProofOfficer.proofFileUrl}
                      title="Proof PDF"
                      className="w-full h-full rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-10 gap-4 min-h-[220px]">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600 mb-1">Document uploaded</p>
                      <p className="text-xs text-slate-400 mb-4">Click below to view the full document in a new tab</p>
                      <a
                        href={viewProofOfficer.proofFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        Open Document
                      </a>
                    </div>
                  </div>
                )}
                <p className="mt-3 text-[10px] text-slate-400 text-center">
                  Proof document submitted during officer registration · {viewProofOfficer.proofFileName || ""}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Add GN Officer
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Register a new Grama Niladhari Officer
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Nimal Silva"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    required
                    value={form.phone_no}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone_no: e.target.value }))
                    }
                    placeholder="e.g. 0771234567"
                    maxLength={10}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    10-digit mobile number
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    GN Division *
                  </label>
                  <select
                    required
                    value={form.gn_division_id}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, gn_division_id: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 appearance-none"
                  >
                    <option value="">Select GN Division</option>
                    {(allDivisions.length > 0 ? allDivisions : gnDivisions).map(
                      (d, i) => (
                        <option key={i} value={d._id || d.id}>
                          {d.gn_division_Name || d.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Proof Document (Government ID / Photo / PDF) *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-xl px-4 py-6 text-center transition-colors"
                  >
                    <FileText className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600 mb-1">
                      {proofFile ? proofFile.name : "Upload proof document"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      PDF, JPG or PNG (max 5MB)
                    </p>
                  </button>
                  {proofFile && (
                    <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-emerald-700 truncate">
                          {proofFile.name}
                        </p>
                        <p className="text-[10px] text-emerald-600">
                          {(proofFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !proofFile}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading & Adding…
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add Officer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget &&
              !isDeleting &&
              setConfirmDeleteId(null)
            }
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Remove Officer
              </h3>
              <p className="text-sm text-slate-500 mb-1">
                Are you sure you want to remove
              </p>
              <p className="text-base font-bold text-slate-900 mb-1">
                {officerToDelete?.name}
              </p>
              <p className="text-xs text-slate-400 mb-6 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                {officerToDelete?.gn_division_id?.gn_division_Name ||
                  "Unknown division"}
              </p>

              <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-6">
                <p className="text-xs text-red-700 font-medium leading-relaxed">
                  This action is permanent and cannot be undone. Any cases
                  currently assigned to this officer may need to be reassigned.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-red-200"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Removing…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Yes, Remove
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VolunteersView({ volunteers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteVolunteer, { isLoading: isDeleting }] =
    useDeletevolunteerMutation();

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesSearch =
        searchQuery === "" ||
        v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.Phone_no?.includes(searchQuery);

      const matchesSkill =
        filterSkill === "all" ||
        v.skills?.some((s) => s.toLowerCase() === filterSkill.toLowerCase());

      return matchesSearch && matchesSkill;
    });
  }, [volunteers, searchQuery, filterSkill]);

  const allSkills = useMemo(() => {
    const skills = new Set();
    volunteers.forEach((v) => {
      v.skills?.forEach((s) => skills.add(s));
    });
    return Array.from(skills).sort();
  }, [volunteers]);

  const volunteerToDelete = volunteers.find((v) => v._id === confirmDeleteId);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteVolunteer(confirmDeleteId).unwrap();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Failed to delete volunteer:", error);
      alert("Failed to remove volunteer. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Volunteer Applications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {volunteers.length} volunteers registered
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="all">All Skills</option>
            {allSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVolunteers.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">
              No volunteers found
            </p>
          </div>
        ) : (
          filteredVolunteers.map((volunteer, i) => {
            const initials =
              volunteer.name
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "V";
            const projectName = volunteer.project_id?.title || "No Project";

            return (
              <motion.div
                key={volunteer._id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group relative"
              >
                <button
                  onClick={() => setConfirmDeleteId(volunteer._id)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg
                           bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200
                           hover:border-red-300 transition-all hover:scale-110 active:scale-95 shadow-sm"
                  title="Remove volunteer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 pb-5 border-b border-slate-100 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-200 shadow-inner">
                    <span className="text-lg font-black text-indigo-700">
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="text-base font-bold text-slate-900 leading-tight truncate">
                      {volunteer.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Mail className="w-3 h-3 text-indigo-500" />
                      <span className="truncate">{volunteer.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-semibold">{volunteer.Phone_no}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold truncate">
                      {projectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span className="font-medium capitalize">
                      {volunteer.availability}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {volunteer.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                    {volunteer.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">
                        +{volunteer.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {volunteer.message && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                      Message
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 italic">
                      "{volunteer.message}"
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget &&
              !isDeleting &&
              setConfirmDeleteId(null)
            }
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Remove Volunteer
              </h3>
              <p className="text-sm text-slate-500 mb-1">
                Are you sure you want to remove
              </p>
              <p className="text-base font-bold text-slate-900 mb-1">
                {volunteerToDelete?.name}
              </p>
              <p className="text-xs text-slate-400 mb-6 flex items-center justify-center gap-1">
                <Mail className="w-3 h-3 text-indigo-500" />
                {volunteerToDelete?.email}
              </p>

              <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-6">
                <p className="text-xs text-red-700 font-medium leading-relaxed">
                  This action is permanent and cannot be undone. The volunteer's
                  application will be removed from the system.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-red-200"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Removing…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Yes, Remove
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DISTRICT_DATA = [
  {
    name: "Nuwara Eliya",
    dpi: 69.34,
    cluster: "High",
    headcount: 26.3,
    no_safe_water: 14.49,
    unemployment: 4.28,
    lat: 6.9497,
    lng: 80.7891,
  },
  {
    name: "Colombo",
    dpi: 65.0,
    cluster: "High",
    headcount: 2.3,
    no_safe_water: 16.52,
    unemployment: 4.39,
    lat: 6.9271,
    lng: 79.8612,
  },
  {
    name: "Gampaha",
    dpi: 64.71,
    cluster: "High",
    headcount: 5.7,
    no_safe_water: 16.11,
    unemployment: 4.37,
    lat: 7.0873,
    lng: 80.0144,
  },
  {
    name: "Kegalle",
    dpi: 61.3,
    cluster: "High",
    headcount: 20.8,
    no_safe_water: 14.03,
    unemployment: 4.26,
    lat: 7.253,
    lng: 80.3464,
  },
  {
    name: "Kalutara",
    dpi: 56.51,
    cluster: "High",
    headcount: 12.2,
    no_safe_water: 14.35,
    unemployment: 4.27,
    lat: 6.5854,
    lng: 80.0029,
  },
  {
    name: "Mullaitivu",
    dpi: 50.66,
    cluster: "Moderate",
    headcount: 44.5,
    no_safe_water: 9.69,
    unemployment: 4.04,
    lat: 9.2672,
    lng: 80.8144,
  },
  {
    name: "Badulla",
    dpi: 47.6,
    cluster: "Moderate",
    headcount: 32.3,
    no_safe_water: 10.92,
    unemployment: 4.1,
    lat: 6.9934,
    lng: 81.055,
  },
  {
    name: "Matale",
    dpi: 41.01,
    cluster: "Moderate",
    headcount: 19.6,
    no_safe_water: 11.45,
    unemployment: 4.13,
    lat: 7.4675,
    lng: 80.6234,
  },
  {
    name: "Ratnapura",
    dpi: 39.62,
    cluster: "Moderate",
    headcount: 24.9,
    no_safe_water: 10.67,
    unemployment: 4.09,
    lat: 6.6828,
    lng: 80.4013,
  },
  {
    name: "Puttalam",
    dpi: 37.71,
    cluster: "Moderate",
    headcount: 10.5,
    no_safe_water: 12.04,
    unemployment: 4.15,
    lat: 8.0352,
    lng: 79.8358,
  },
  {
    name: "Mannar",
    dpi: 37.83,
    cluster: "Moderate",
    headcount: 8.0,
    no_safe_water: 12.32,
    unemployment: 4.17,
    lat: 8.9785,
    lng: 79.904,
  },
  {
    name: "Kandy",
    dpi: 37.41,
    cluster: "Moderate",
    headcount: 14.3,
    no_safe_water: 11.57,
    unemployment: 4.13,
    lat: 7.2906,
    lng: 80.6337,
  },
  {
    name: "Galle",
    dpi: 37.17,
    cluster: "Moderate",
    headcount: 13.2,
    no_safe_water: 11.65,
    unemployment: 4.14,
    lat: 6.0535,
    lng: 80.221,
  },
  {
    name: "Batticaloa",
    dpi: 36.81,
    cluster: "Moderate",
    headcount: 20.8,
    no_safe_water: 10.76,
    unemployment: 4.09,
    lat: 7.717,
    lng: 81.7002,
  },
  {
    name: "Ampara",
    dpi: 35.38,
    cluster: "Moderate",
    headcount: 17.2,
    no_safe_water: 10.97,
    unemployment: 4.1,
    lat: 7.2999,
    lng: 81.6713,
  },
  {
    name: "Matara",
    dpi: 33.96,
    cluster: "Moderate",
    headcount: 11.1,
    no_safe_water: 11.45,
    unemployment: 4.13,
    lat: 5.9549,
    lng: 80.555,
  },
  {
    name: "Jaffna",
    dpi: 27.94,
    cluster: "Stable",
    headcount: 25.8,
    no_safe_water: 8.17,
    unemployment: 3.97,
    lat: 9.6615,
    lng: 80.0255,
  },
  {
    name: "Vavuniya",
    dpi: 27.84,
    cluster: "Moderate",
    headcount: 13.9,
    no_safe_water: 10.2,
    unemployment: 4.07,
    lat: 8.7514,
    lng: 80.4971,
  },
  {
    name: "Polonnaruwa",
    dpi: 21.75,
    cluster: "Stable",
    headcount: 17.0,
    no_safe_water: 8.41,
    unemployment: 3.98,
    lat: 7.9403,
    lng: 81.0188,
  },
  {
    name: "Trincomalee",
    dpi: 21.15,
    cluster: "Stable",
    headcount: 18.3,
    no_safe_water: 8.03,
    unemployment: 3.97,
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    name: "Kurunegala",
    dpi: 19.69,
    cluster: "Stable",
    headcount: 12.5,
    no_safe_water: 8.75,
    unemployment: 4.0,
    lat: 7.4867,
    lng: 80.3647,
  },
  {
    name: "Hambantota",
    dpi: 15.96,
    cluster: "Stable",
    headcount: 13.6,
    no_safe_water: 7.78,
    unemployment: 3.95,
    lat: 6.1241,
    lng: 81.1185,
  },
  {
    name: "Monaragala",
    dpi: 15.51,
    cluster: "Stable",
    headcount: 21.0,
    no_safe_water: 6.36,
    unemployment: 3.89,
    lat: 6.8728,
    lng: 81.3506,
  },
  {
    name: "Kilinochchi",
    dpi: 24.26,
    cluster: "Stable",
    headcount: 26.4,
    no_safe_water: 7.28,
    unemployment: 3.93,
    lat: 9.3803,
    lng: 80.377,
  },
  {
    name: "Anuradhapura",
    dpi: 13.26,
    cluster: "Stable",
    headcount: 8.1,
    no_safe_water: 8.17,
    unemployment: 3.97,
    lat: 8.3114,
    lng: 80.4037,
  },
];

function DistrictLeafletMap({ height = 480 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!containerRef.current || mapRef.current) return;
      const L = window.L;
      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      }).setView([7.87, 80.77], 7);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      DISTRICT_DATA.forEach((d) => {
        const fill =
          d.cluster === "High"
            ? "#ef4444"
            : d.cluster === "Moderate"
              ? "#f59e0b"
              : "#10b981";

        const marker = L.circleMarker([d.lat, d.lng], {
          radius: 7 + d.dpi / 12,
          fillColor: fill,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.88,
        }).addTo(map);

        marker.bindPopup(
          `
          <div style="font-family:system-ui,sans-serif;min-width:170px;padding:2px">
            <p style="font-size:13px;font-weight:800;color:#0f172a;margin:0 0 8px">${d.name}</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
              <div style="background:#f8fafc;border-radius:8px;padding:6px 8px">
                <p style="font-size:16px;font-weight:900;color:${fill};margin:0">${d.dpi}</p>
                <p style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin:1px 0 0">DPI Score</p>
              </div>
              <div style="background:#f8fafc;border-radius:8px;padding:6px 8px">
                <p style="font-size:16px;font-weight:900;color:#0f172a;margin:0">${d.headcount}%</p>
                <p style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin:1px 0 0">Headcount</p>
              </div>
              <div style="background:#f8fafc;border-radius:8px;padding:6px 8px">
                <p style="font-size:14px;font-weight:800;color:#0f172a;margin:0">${d.no_safe_water}%</p>
                <p style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin:1px 0 0">No Safe Water</p>
              </div>
              <div style="background:#f8fafc;border-radius:8px;padding:6px 8px">
                <p style="font-size:14px;font-weight:800;color:#0f172a;margin:0">${d.unemployment}%</p>
                <p style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin:1px 0 0">Unemployment</p>
              </div>
            </div>
            <div style="margin-top:8px;padding:5px 8px;border-radius:8px;background:${
              d.cluster === "High"
                ? "#fef2f2"
                : d.cluster === "Moderate"
                  ? "#fffbeb"
                  : "#f0fdf4"
            }">
              <p style="font-size:10px;font-weight:800;color:${fill};margin:0">Cluster: ${d.cluster}</p>
            </div>
          </div>
        `,
          { maxWidth: 220 },
        );
      });
    };

    if (window.L) {
      initMap();
    } else {
      const existing = document.getElementById("leaflet-js");
      if (existing) {
        existing.addEventListener("load", initMap);
      } else {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ height, width: "100%" }} />
    </div>
  );
}