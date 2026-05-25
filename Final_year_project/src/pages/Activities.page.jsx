import React, { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Calendar,
  MapPin,
  Search,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useGetAllnews_postsQuery,
  useCreatenews_postMutation,
  useUpdatenews_postMutation,
  useDeletenews_postMutation,
} from "../lib/api";

const useIsAdmin = () => localStorage.getItem("userRole") === "NGO_OFFICER";

const EMPTY_FORM = {
  title:       "",
  description: "",
  date:        "",
  location:    "",
  image:       "",
};

function validateActivity(f) {
  const e = {};
  if (!f.title.trim())       e.title       = "Title is required.";
  if (!f.description.trim()) e.description = "Description is required.";
  if (!f.date.trim())        e.date        = "Date is required.";
  if (!f.location.trim())    e.location    = "Location is required.";
  if (f.image && !/^https?:\/\/.+/.test(f.image))
                             e.image       = "Enter a valid image URL (starts with http/https).";
  return e;
}

const cls = (field, errors, touched) =>
  `w-full bg-gray-50 border rounded-2xl px-5 py-3.5 text-sm font-medium outline-none transition-all ${
    touched[field] && errors[field]
      ? "border-red-300 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
  }`;

const ErrMsg = ({ field, errors, touched }) =>
  touched[field] && errors[field] ? (
    <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1 font-semibold">
      <AlertCircle className="w-3 h-3" /> {errors[field]}
    </p>
  ) : null;

function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-50">
          <div>
            <h2 className="text-xl font-bold text-emerald-950">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function SuccessBanner({ message }) {
  return (
    <div className="px-8 py-12 text-center">
      <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-bold text-emerald-950 mb-1">{message}</h3>
      <p className="text-sm text-gray-400">Changes will appear on the page momentarily.</p>
    </div>
  );
}

function ModalActions({ onCancel, isLoading, submitLabel }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel}
        className="flex-1 py-3.5 rounded-2xl border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">
        Cancel
      </button>
      <button type="submit" disabled={isLoading}
        className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2">
        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : submitLabel}
      </button>
    </div>
  );
}

function ActivityFormFields({ form, errors, touched, onChange, onBlur }) {
  return (
    <>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
          Title <span className="text-red-400">*</span>
        </label>
        <input name="title" value={form.title} onChange={onChange} onBlur={onBlur}
          placeholder="e.g. Awareness Workshop in Colombo" className={cls("title", errors, touched)} />
        <ErrMsg field="title" errors={errors} touched={touched} />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea name="description" value={form.description} onChange={onChange} onBlur={onBlur}
          rows={4} placeholder="Describe what happened at this activity..."
          className={`${cls("description", errors, touched)} resize-none`} />
        <ErrMsg field="description" errors={errors} touched={touched} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Date <span className="text-red-400">*</span>
          </label>
          <input name="date" value={form.date} onChange={onChange} onBlur={onBlur}
            placeholder="e.g. October 2025" className={cls("date", errors, touched)} />
          <ErrMsg field="date" errors={errors} touched={touched} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
            Location <span className="text-red-400">*</span>
          </label>
          <input name="location" value={form.location} onChange={onChange} onBlur={onBlur}
            placeholder="e.g. Colombo" className={cls("location", errors, touched)} />
          <ErrMsg field="location" errors={errors} touched={touched} />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" /> Image URL
            <span className="text-gray-300 normal-case font-normal">(optional)</span>
          </span>
        </label>
        <input name="image" value={form.image} onChange={onChange} onBlur={onBlur}
          placeholder="https://..." className={cls("image", errors, touched)} />
        <ErrMsg field="image" errors={errors} touched={touched} />
        <p className="text-[10px] text-gray-300 mt-1">Leave blank to use a default image.</p>
      </div>
    </>
  );
}

function AddActivityModal({ onClose }) {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [createPost, { isLoading }] = useCreatenews_postMutation();

  const change = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (touched[e.target.name]) setErrors(validateActivity(next));
  };
  const blur = (e) => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
    setErrors(validateActivity(form));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(EMPTY_FORM).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validateActivity(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await createPost({
        post_type: "activity",
        title:       form.title.trim(),
        description: form.description.trim(),
        date:        form.date.trim(),
        location:    form.location.trim(),
        image:       form.image.trim() ||
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop",
      }).unwrap();
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (err) { console.error("Create activity failed:", err); }
  };

  return (
    <ModalShell title="Add Activity" subtitle="This will appear publicly on the Activities page." onClose={onClose}>
      {success ? <SuccessBanner message="Activity Added!" /> : (
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <ActivityFormFields form={form} errors={errors} touched={touched} onChange={change} onBlur={blur} />
          <ModalActions onCancel={onClose} isLoading={isLoading} submitLabel="Add Activity" />
        </form>
      )}
    </ModalShell>
  );
}

function EditActivityModal({ activity, onClose }) {
  const [form, setForm] = useState({
    title:       activity.title       || "",
    description: activity.description || "",
    date:        activity.date        || "",
    location:    activity.location    || "",
    image:       activity.image       || "",
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [updatePost, { isLoading }] = useUpdatenews_postMutation();

  const change = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (touched[e.target.name]) setErrors(validateActivity(next));
  };
  const blur = (e) => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
    setErrors(validateActivity(form));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(EMPTY_FORM).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validateActivity(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await updatePost({
        id:          activity._id,
        title:       form.title.trim(),
        description: form.description.trim(),
        date:        form.date.trim(),
        location:    form.location.trim(),
        image:       form.image.trim() ||
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop",
      }).unwrap();
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (err) { console.error("Update activity failed:", err); }
  };

  return (
    <ModalShell title="Edit Activity" subtitle="Changes will appear publicly immediately." onClose={onClose}>
      {success ? <SuccessBanner message="Activity Updated!" /> : (
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <ActivityFormFields form={form} errors={errors} touched={touched} onChange={change} onBlur={blur} />
          <ModalActions onCancel={onClose} isLoading={isLoading} submitLabel="Save Changes" />
        </form>
      )}
    </ModalShell>
  );
}

function DeleteConfirmModal({ item, itemType = "item", onClose }) {
  const [deletePost, { isLoading }] = useDeletenews_postMutation();
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePost(item._id).unwrap();
      setSuccess(true);
      setTimeout(onClose, 1400);
    } catch (err) { console.error("Delete failed:", err); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {success ? (
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950 mb-1">Deleted!</h3>
            <p className="text-sm text-gray-400">The {itemType} has been removed.</p>
          </div>
        ) : (
          <div className="px-8 py-8">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-emerald-950 text-center mb-2">
              Delete {itemType}?
            </h2>
            <p className="text-sm text-gray-400 text-center mb-2 leading-relaxed">
              You are about to permanently delete:
            </p>
            <p className="text-sm font-semibold text-emerald-950 text-center mb-6 px-4 leading-snug">
              "{item.title}"
            </p>
            <p className="text-xs text-red-400 text-center mb-8 font-medium">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} disabled={isLoading}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                  : <><Trash2 className="w-4 h-4" /> Delete</>
                }
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function Activities() {
  const isAdmin = useIsAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery,  setSearchQuery]  = useState("");

  const { data: allPosts = [], isLoading, isError } = useGetAllnews_postsQuery();

  const activities = useMemo(() =>
    allPosts
      .filter((p) => p.post_type === "activity")
      .filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [allPosts, searchQuery]
  );

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 pt-20">

      <section className="bg-emerald-950 py-32 md:py-40 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2000"
            alt="Community volunteers helping people" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl opacity-30 z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight max-w-4xl">
            <span className="text-white">Stories of <br />
              <span className="text-emerald-400 font-serif italic font-medium">Progress</span> & Hope
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100/60 max-w-2xl leading-relaxed font-serif italic mb-12">
            Explore our daily efforts on the ground—from community workshops to
            emergency relief distributions across Sri Lanka.
          </motion.p>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
            <Link to="/" className="hover:text-white transition-colors">HOME</Link>
            <span className="text-white/20">/</span>
            <span className="text-white">ACTIVITIES</span>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            <input type="text" placeholder="Search activities..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 pl-11 pr-5 py-3 rounded-2xl text-xs font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
          </div>
          {isAdmin && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
              <Plus className="w-4 h-4" /> Add Activity
            </motion.button>
          )}
        </div>
      </div>

      <section className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-emerald-700">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-sm font-medium">Loading activities…</p>
            </div>
          )}
          {isError && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-red-500">
              <AlertCircle className="w-10 h-10" />
              <p className="text-sm font-medium">Failed to load activities. Please try again.</p>
            </div>
          )}
          {!isLoading && !isError && activities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-300">
              <Search className="w-12 h-12" />
              <p className="text-sm font-medium text-gray-400">
                {searchQuery ? "No activities match your search." : "No activities published yet."}
              </p>
              {isAdmin && !searchQuery && (
                <button onClick={() => setShowAddModal(true)}
                  className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all">
                  <Plus className="w-4 h-4" /> Add the first activity
                </button>
              )}
            </div>
          )}

          {!isLoading && !isError && activities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div key={activity._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={activity.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&auto=format&fit=crop"}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-6 left-6 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                          <Calendar className="w-3 h-3" /> {activity.date}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditTarget(activity); }}
                            title="Edit"
                            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(activity); }}
                            title="Delete"
                            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-10 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{activity.location || "Sri Lanka"}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-emerald-950 mb-6 leading-tight group-hover:text-emerald-700 transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-serif italic flex-1 border-l-2 border-emerald-50 pl-6 group-hover:border-emerald-200 transition-colors">
                        {activity.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showAddModal  && <AddActivityModal   onClose={() => setShowAddModal(false)} />}
        {editTarget    && <EditActivityModal  activity={editTarget}  onClose={() => setEditTarget(null)} />}
        {deleteTarget  && <DeleteConfirmModal item={deleteTarget}    onClose={() => setDeleteTarget(null)} itemType="activity" />}
      </AnimatePresence>
    </div>
  );
}