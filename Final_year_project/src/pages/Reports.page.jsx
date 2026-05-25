import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FileText,
  Download,
  Calendar,
  Search,
  Layers,
  Sparkles,
} from "lucide-react";

const REPORTS = [
  {
    id: 1,
    type: "annual",
    year: "2023",
    title: "ANNUAL IMPACT REPORT 2023",
    description:
      "A comprehensive review of our programmes, financial stewardship, and measurable outcomes across all provincial initiatives in Sri Lanka for the fiscal year.",
    pdfUrl:
      "https://pub-a572aee24d1f4c139aad84aa55c6cdd6.r2.dev/20240229212243ECPAT-Sri-Lanka_Annual-Report-2019.pdf",
    filename: "Annual_Impact_Report_2023.pdf",
  },
  {
    id: 2,
    type: "annual",
    year: "2020",
    title: "ANNUAL IMPACT REPORT 2020",
    description:
      "Documenting the foundation year of our expanded mandate — outlining early wins, operational pivots, and lessons learned across community-led development programmes.",
    pdfUrl:
      "https://pub-a572aee24d1f4c139aad84aa55c6cdd6.r2.dev/20240229212136Annual-Report-2020.pdf",
    filename: "Annual_Impact_Report_2020.pdf",
  },
  {
    id: 3,
    type: "research",
    year: "2024",
    title: "SEXUAL EXPLOITATION OF BOYS IN SRI LANKA: A HIDDEN CRISIS",
    description:
      "An independent research paper examining the struggles of sexually exploited boys in Sri Lanka and the systemic issues contributing to their vulnerability.",
    pdfUrl:
      "https://pub-a572aee24d1f4c139aad84aa55c6cdd6.r2.dev/20240515171234SEXUAL-EXPLOITATION-OF-BOYS.pdf",
    filename: "Sexual_Exploitation_Boys_Sri_Lanka_Hidden_Crisis.pdf",
  },
  {
    id: 4,
    type: "research",
    year: "2023",
    title: "SRI LANKA:ONLINE CHILD SEXUALEXPLOITATION",
    description:
      "An in-depth analysis of the growing threat of online child sexual exploitation in Sri Lanka and the challenges in addressing it.",
    pdfUrl:
      "https://pub-a572aee24d1f4c139aad84aa55c6cdd6.r2.dev/20240229234405Report-on-Online-Child-Sexual-Exploitation-Legal-Gap-Analysis_ECPAT-Sri-Lanka.pdf",
    filename: "Online_Child_Sexual_Exploitation_Sri_Lanka_2023.pdf",
  },
];

export default function ReportsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  const filteredReports = REPORTS.filter((report) => {
    const matchesFilter = filter === "all" || report.type === filter;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.year.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const onDownload = (e, report) => {
    e.preventDefault();
    window.open(report.pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 ">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzZWFyY2h8ZW58MHx8MHx8fDA%3D"
            alt="Research and reports"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-transparent to-emerald-950/40 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight"
          >
            <span className="text-white">
              Evidence-Based <br />
              <span className="text-emerald-400 font-serif italic font-medium">
                Research
              </span>{" "}
              &amp; Insights
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100/60 max-w-2xl leading-relaxed font-serif italic mb-12"
          >
            Access our comprehensive archive of annual reports and independent
            research papers documenting the systemic changes across Sri Lanka.
          </motion.p>

          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            <Link to="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white">REPORTS &amp; RESEARCH</span>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-gray-50 bg-white sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto invisible-scrollbar">
              {["all", "annual", "research"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    filter === type
                      ? "bg-emerald-950 text-white shadow-xl shadow-emerald-950/20"
                      : "bg-gray-50 text-gray-400 hover:text-emerald-900 border border-transparent hover:border-emerald-100"
                  }`}
                >
                  {type === "all"
                    ? "A-Z Documents"
                    : type === "annual"
                      ? "Annual Reports"
                      : "Research Papers"}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              <input
                type="text"
                placeholder="SEARCH ARCHIVE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:bg-white focus:border-emerald-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-[3rem] p-10 flex gap-8 border border-transparent hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all"
                >
                  <div className="hidden sm:flex flex-col items-center justify-center w-24 h-32 bg-emerald-50 rounded-2xl shrink-0 group-hover:bg-emerald-950 transition-colors">
                    <FileText className="w-10 h-10 text-emerald-600 group-hover:text-emerald-400 transition-colors" />
                    <div className="mt-2 text-[8px] font-black text-emerald-950 uppercase tracking-tighter group-hover:text-white/40">
                      {report.type === "annual"
                        ? "PDF / REPORT"
                        : "PDF / PAPER"}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-lg uppercase tracking-widest border border-emerald-100">
                        {report.type === "annual" ? "Annual" : "Research"}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3 text-emerald-400" />{" "}
                        {report.year}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-emerald-950 mb-6 leading-tight group-hover:text-emerald-700 transition-colors">
                      {report.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-auto border-l border-emerald-100 pl-6 font-medium">
                      {report.description}
                    </p>

                    <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-start">
                      <button
                        onClick={(e) => onDownload(e, report)}
                        className="inline-flex items-center gap-3 text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] hover:text-emerald-950 transition-colors group/link"
                      >
                        <Download className="w-4 h-4 transition-transform group-hover/link:translate-y-0.5" />
                        Download Full Access
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Search className="w-10 h-10 text-emerald-200" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-4 tracking-tight">
                No documents matching your search
              </h3>
              <p className="text-emerald-900/40 font-serif italic">
                Try adjusting your filters or refining your keyword.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-32 rounded-t-[5rem] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 mb-12 tracking-tight">
            Academic Integrity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="bg-[#FAFAFA] p-10 rounded-[3rem]">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950 mb-4 uppercase tracking-widest text-[10px]">
                Data Sourcing
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Our research is compiled in partnership with regional government
                offices and independent verification audits.
              </p>
            </div>
            <div className="bg-[#FAFAFA] p-10 rounded-[3rem]">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950 mb-4 uppercase tracking-widest text-[10px]">
                Annual Review
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Financial and impact transparency reports are released every
                June following our comprehensive annual audit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}