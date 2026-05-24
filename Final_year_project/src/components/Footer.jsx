import React from "react";
import { Link } from "react-router";
import { Heart, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const nav = [
    { label: "About Us",          to: "/about-us" },
    { label: "Our Work",          to: "/projects" },
    { label: "Reports",           to: "/reports-and-researches" },
    { label: "Donate",            to: "/donate" },
    { label: "Contact",           to: "/contact-us" },
  ];

  return (
    <footer className="bg-emerald-950 text-white">

    
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.4fr] gap-14">

         
          <div className="space-y-6">
           
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-4.5 h-4.5 text-white fill-white" strokeWidth={0} />
              </div>
              <span className="text-lg font-bold tracking-tight">
                HOPE<span className="text-emerald-400">CONNECT</span>
              </span>
            </div>

            <p className="text-sm text-emerald-100/50 leading-relaxed font-serif italic max-w-xs">
              Empowering communities through transparent, people-first humanitarian initiatives across Sri Lanka.
            </p>

            
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  label: "Facebook",
                  href: "#",
                  d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                },
                {
                  label: "Instagram",
                  href: "#",
                  svg: (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </>
                  ),
                },
                {
                  label: "YouTube",
                  href: "#",
                  svg: (
                    <>
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                    </>
                  ),
                },
              ].map(({ label, href, d, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-emerald-800 flex items-center justify-center text-emerald-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {d ? <path d={d} /> : svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

        
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-500 mb-6">Pages</p>
            <ul className="space-y-3">
              {nav.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-emerald-100/50 hover:text-white transition-colors font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-500 mb-6">Get in Touch</p>
            <ul className="space-y-5">
              {[
                {
                  Icon: MapPin,
                  text: "456 Unity Tower, Galle Road, Colombo 03",
                  href: "#",
                },
                {
                  Icon: Phone,
                  text: "+94 11 234 5678",
                  href: "tel:+94112345678",
                },
                {
                  Icon: Mail,
                  text: "hello@hopeconnect.org",
                  href: "mailto:hello@hopeconnect.org",
                },
              ].map(({ Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-900 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-700 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-emerald-100/50 group-hover:text-white transition-colors leading-relaxed">
                      {text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-medium text-emerald-700 uppercase tracking-widest">
            NGO Registry: GA 00261679
          </p>
          <p className="text-[10px] font-medium text-emerald-700 uppercase tracking-widest">
            © {year} HopeConnect Foundation
          </p>
        </div>
      </div>

    </footer>
  );
}