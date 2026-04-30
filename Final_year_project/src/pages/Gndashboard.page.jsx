import React from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  Heart, 
  Users, 
  MapPin, 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Filter,
  LogOut,
  LayoutDashboard,
  FileText,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router";

export default function GNDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "GN Officer";

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const requests = [
    { id: "REQ-001", name: "H.G. Kusumawathi", type: "Medical Aid", status: "Pending", date: "2 Hours ago", location: "Walpita" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-emerald-950 text-white p-8 flex flex-col hidden lg:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight uppercase">HOPE<span className="text-emerald-400 italic">LINK</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Clock, label: "History" },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${item.active ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-emerald-400/60 hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 text-red-400 hover:text-red-300 text-[11px] font-bold uppercase tracking-widest mt-auto border-t border-white/5 pt-8"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-emerald-50 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Walpita</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                placeholder="Search NIC or Name..." 
                className="bg-gray-50 border border-gray-100 rounded-full pl-12 pr-6 py-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500/10 outline-none w-64 transition-all"
              />
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-emerald-50">
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-950">{userName}</div>
                <div className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest">GN Officer</div>
              </div>
              <img src="" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-900/10" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Pending Tasks", val: "12", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Verified Today", val: "24", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Flagged", val: "03", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
              { label: "Total Managed", val: "1.2K", icon: Users, color: "text-blue-500", bg: "bg-blue-50" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm flex items-center gap-5">
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-emerald-950">{stat.val}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* List Section */}
          <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-2xl shadow-emerald-900/5 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-emerald-950 tracking-tight">Recent Verification Requests</h3>
                <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest shrink-0">Incoming from Hopelink NGO Platform</p>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-emerald-600 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beneficiary</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">GN Division</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map((req, i) => (
                    <tr key={i} className="hover:bg-emerald-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-emerald-600 uppercase text-xs">
                            {req.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-emerald-950">{req.name}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{req.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter shrink-0">{req.type}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <MapPin className="w-3 h-3" /> {req.location}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest">{req.date}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            req.status === 'Verified' ? 'bg-emerald-500' : 
                            req.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            req.status === 'Verified' ? 'text-emerald-600' : 
                            req.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                          }`}>{req.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="w-9 h-9 items-center justify-center bg-gray-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors hidden sm:inline-flex shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/verify/${req.id}`)}
                          className="ml-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-gray-50/50 border-t border-gray-50 text-center">
              <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline">Load All Verification Requests</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}