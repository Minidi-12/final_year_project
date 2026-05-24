import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Mail, Phone, MapPin, Clock, Send,
  ArrowRight, ShieldCheck, Headphones,
  Loader2, AlertCircle, CheckCircle2, ChevronDown, User
} from "lucide-react";
import { Link } from "react-router";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  ?? "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ?? "";

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };

function validate(f) {
  const e = {};
  if (!f.name.trim())              e.name    = "Please enter your name.";
  else if (f.name.trim().length<2) e.name    = "Name needs at least 2 characters.";

  if (!f.email.trim())             e.email   = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                                   e.email   = "That doesn't look like a valid email.";

  if (f.phone && !/^[+\d\s\-()]{7,15}$/.test(f.phone))
                                   e.phone   = "Enter a valid phone (e.g. +94 77 123 4567).";

  if (!f.subject)                  e.subject = "Please choose a topic.";

  if (!f.message.trim())           e.message = "Please describe what you need help with.";
  else if (f.message.trim().length<20)
                                   e.message = "A bit more detail helps — at least 20 characters.";
  return e;
}

const baseInput =
  "w-full rounded-2xl px-5 py-4 text-sm font-normal bg-white " +
  "border-2 outline-none transition-all duration-200 " +
  "placeholder:text-gray-400";

function fieldBorder(err, touched) {
  if (touched && err)  return "border-red-300   focus:border-red-400   focus:ring-4 focus:ring-red-50";
  if (touched && !err) return "border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50";
  return                      "border-gray-200   focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50";
}

function FieldMsg({ err, touched }) {
  return (
    <AnimatePresence>
      {touched && err && (
        <motion.p key="e" initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0"/>{err}
        </motion.p>
      )}
      {touched && !err && (
        <motion.p key="ok" initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0"/>Looks good!
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function ContactUs() {
  const formRef = useRef(null);
  const [form,     setForm]     = useState(EMPTY);
  const [touched,  setTouched]  = useState({});
  const [errors,   setErrors]   = useState({});
  const [status,   setStatus]   = useState("idle");
  const [apiError, setApiError] = useState("");

  const change = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };

  const blur = (e) => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
    setErrors(validate({ ...form, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const all = Object.keys(EMPTY).reduce((a,k)=>({...a,[k]:true}),{});
    setTouched(all);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatus("error");
      setApiError(
        "EmailJS isn't configured yet — add VITE_EMAILJS_SERVICE_ID, " +
        "VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your .env file."
      );
      return;
    }

    setStatus("sending"); setApiError("");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success"); setForm(EMPTY); setTouched({});
      setTimeout(()=>setStatus("idle"), 7000);
    } catch(err) {
      setStatus("error");
      setApiError(err?.text || "Something went wrong. Please try again.");
    }
  };

  const msgLen = form.message.length;

  const inp = (field) => ({
    className: `${baseInput} ${fieldBorder(errors[field], touched[field])}`,
    style: { color: "#1f2937" },
    name: field,
    value: form[field],
    onChange: change,
    onBlur: blur,
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] pt-20">

      <section className="bg-emerald-950 py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://t4.ftcdn.net/jpg/05/85/98/03/360_F_585980340_geg6GaDREebGe3cGAjtuElD6gS7HBvGr.jpg"
            alt="" className="w-full h-full object-cover opacity-30"/>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/95 to-teal-900/80"/>
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-emerald-400/10 blur-3xl"/>
        <div className="absolute -bottom-16 -left-16 w-[350px] h-[350px] rounded-full bg-teal-300/10 blur-3xl"/>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-[.3em] mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-emerald-400 inline-block"/>Get in touch
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-7 max-w-3xl">
               <span className="text-white">We're here to</span>{" "}
              <em className="text-emerald-400 not-italic font-serif">listen</em>
              <br/><span className="text-white">and support you.</span>
            </h1>
            <p className="text-emerald-100/50 text-lg font-serif italic max-w-xl leading-relaxed mb-10">
              Every message is handled with the highest degree of confidentiality and urgency.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-400/70">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-white/20">/</span>
              <span className="text-white/60">Contact us</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            <div className="lg:col-span-4 space-y-6">

              {[
                { icon: MapPin, label:"Our office",    value:"456 Unity Tower, Galle Road, Colombo 03",  sub:"Official administrative office" },
                { icon: Phone,  label:"Call us",       value:"+94 11 234 5678",                          sub:"24/7 emergency line available" },
                { icon: Mail,   label:"Email us",      value:"hello@hopeconnect.org",                    sub:"General & partnership enquiries" },
              ].map((c, i)=>(
                <motion.div key={i}
                  initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}}
                  viewport={{once:true}} transition={{delay:i*.1}}
                  className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-950 group-hover:text-white transition-colors">
                    <c.icon className="w-4.5 h-4.5"/>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{c.label}</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{c.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}}
                viewport={{once:true}} transition={{delay:.35}}
                className="bg-emerald-950 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-emerald-400/10 rounded-full blur-xl"/>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                      <Clock className="w-4 h-4"/>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Office hours</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60 font-serif italic">Mon — Fri</span>
                      <span className="font-semibold text-white">9:00 AM – 5:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span className="text-white/60 font-serif italic">Saturday</span>
                      <span className="font-semibold text-emerald-400">Emergency only</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 font-serif italic">Sunday</span>
                      <span className="font-semibold text-white/40">Closed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5"/> Verified NGO · Confidential support
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-8">
              <motion.div
                initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/60 overflow-hidden">

                <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600"/>

                <div className="p-8 lg:p-12">
                  <AnimatePresence mode="wait">

                    {status === "success" && (
                      <motion.div key="success"
                        initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                        className="py-16 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-7 shadow-lg shadow-emerald-100">
                          <Send className="w-8 h-8 text-emerald-600"/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Message sent!</h2>
                        <p className="text-gray-500 font-serif italic text-base max-w-sm mx-auto leading-relaxed mb-9">
                          Thank you for reaching out. Our team will respond within 24 hours.
                        </p>
                        <button onClick={()=>setStatus("idle")}
                          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-950 transition-colors group">
                          Send another message
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                        </button>
                      </motion.div>
                    )}

                    {status !== "success" && (
                      <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>

                        <div className="flex items-center gap-4 mb-9 pb-8 border-b border-gray-100">
                          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                            <Headphones className="w-5 h-5"/>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Send us a message</h2>
                            <p className="text-sm text-gray-400 mt-0.5">
                              We usually reply within a few hours on business days.
                            </p>
                          </div>
                        </div>

                        <AnimatePresence>
                          {status==="error" && apiError && (
                            <motion.div key="ae"
                              initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                              className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/>
                              <p className="text-sm text-red-600 font-medium">{apiError}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <form ref={formRef} onSubmit={submit} noValidate className="space-y-6">

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Your name <span className="text-red-400">*</span>
                              </label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                                <input
                                  type="text"
                                  name="from_name"
                                  placeholder="e.g. Alexander Perera"
                                  autoComplete="name"
                                  {...inp("name")}
                                  className={`${baseInput} ${fieldBorder(errors.name, touched.name)} pl-11`}
                                  style={{ color: "#1f2937" }}
                                />
                              </div>
                              <FieldMsg err={errors.name} touched={touched.name}/>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Email address <span className="text-red-400">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                                <input
                                  type="email"
                                  name="from_email"
                                  placeholder="you@example.com"
                                  autoComplete="email"
                                  {...inp("email")}
                                  className={`${baseInput} ${fieldBorder(errors.email, touched.email)} pl-11`}
                                  style={{ color: "#1f2937" }}
                                />
                              </div>
                              <FieldMsg err={errors.email} touched={touched.email}/>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Phone <span className="text-gray-300 font-normal normal-case tracking-normal">(optional)</span>
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                                <input
                                  type="tel"
                                  name="phone"
                                  placeholder="+94 77 123 4567"
                                  autoComplete="tel"
                                  {...inp("phone")}
                                  className={`${baseInput} ${fieldBorder(errors.phone, touched.phone)} pl-11`}
                                  style={{ color: "#1f2937" }}
                                />
                              </div>
                              <FieldMsg err={errors.phone} touched={touched.phone}/>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                What's this about? <span className="text-red-400">*</span>
                              </label>
                              <div className="relative">
                                <select
                                  name="subject"
                                  {...inp("subject")}
                                  className={`${baseInput} ${fieldBorder(errors.subject, touched.subject)} appearance-none cursor-pointer`}
                                  style={{ color: form.subject ? "#1f2937" : "#9ca3af" }}
                                >
                                  <option value="" disabled style={{color:"#9ca3af"}}>Select a topic…</option>
                                  <option value="General Inquiry"       style={{color:"#1f2937"}}>General inquiry</option>
                                  <option value="Request Support"       style={{color:"#1f2937"}}>Request support</option>
                                  <option value="Volunteer Application" style={{color:"#1f2937"}}>Volunteer application</option>
                                  <option value="Partnership"           style={{color:"#1f2937"}}>Partnership</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                              </div>
                              <FieldMsg err={errors.subject} touched={touched.subject}/>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Your message <span className="text-red-400">*</span>
                              </label>
                              {msgLen > 0 && (
                                <span className={`text-xs font-medium ${msgLen < 20 ? "text-amber-500" : "text-emerald-500"}`}>
                                  {msgLen < 20 ? `${20 - msgLen} more chars needed` : `${msgLen} chars ✓`}
                                </span>
                              )}
                            </div>
                            <textarea
                              name="message"
                              rows={5}
                              placeholder="Tell us what you need help with. The more detail, the better we can assist you…"
                              {...inp("message")}
                              className={`${baseInput} ${fieldBorder(errors.message, touched.message)} resize-none`}
                              style={{ color: "#1f2937" }}
                            />
                            <FieldMsg err={errors.message} touched={touched.message}/>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2">
                            <p className="flex items-center gap-2 text-xs text-gray-400">
                              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0"/>
                              Your info is private and never shared.
                            </p>
                            <button
                              type="submit"
                              disabled={status==="sending"}
                              className="flex items-center justify-center gap-3 bg-emerald-950 hover:bg-emerald-800 active:scale-[0.98] text-white px-9 py-4 rounded-2xl font-semibold text-sm tracking-wide shadow-lg shadow-emerald-950/25 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {status==="sending" ? (
                                <><Loader2 className="w-4 h-4 animate-spin"/>Sending…</>
                              ) : (
                                <>Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></>
                              )}
                            </button>
                          </div>

                        </form>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}