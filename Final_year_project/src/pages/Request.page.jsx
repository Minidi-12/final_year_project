import React, { useState, useEffect } from "react";
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
  CreditCard,
  Users,
  Briefcase,
  Wallet,
  Info,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Zap,
  Droplets,
  Stethoscope,
  GraduationCap,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useCreateb_reqMutation, useGetAllgn_divisionsQuery } from "@/lib/api";

export default function RequestSupport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
   name: "",
   nic: "",
   phone_no: "",
   age: 0,
   gender: "male",
   address: "",
   gn_division: "",
   family_size: 1,
   children_under_18: 0,
   monthly_income: 0,
   employment_type: "Daily wage",
   GovtAllowance: [], // Add default to avoid validation error
   otherIncomeSources: "",
   chronic_illness: {
     exists: false,
     description: "",
   },
   nearest_hospitalkm: 0,
   disabilityInHousehold: false,
   highestEducationLevel: "O/Level",
   distanceToSchoolKm: 0,
   childrenDroppedOut: false,
   housing_type: "temporary",
   safewater_access: false,
   sanitation_access: false,
   electricity_access: false,
   support_types: [], // Will be validated before submit
   support_description: "",
   selfrated_urgency: 5,
});

  const { data: gn_divisions, error, isLoading } = useGetAllgn_divisionsQuery();
  const [createB_req, { isLoading: isCreating }] = useCreateb_reqMutation();

  // Debug logging
  useEffect(() => {
    if (gn_divisions) {
      console.log("GN Divisions loaded:", gn_divisions);
      console.log("Number of divisions:", gn_divisions.length);
      // Check if Walpita is in the list
      const walpita = gn_divisions.find(
        (div) =>
          div.name?.toLowerCase().includes("walpita") ||
          div.gn_division_Name?.toLowerCase().includes("walpita") ||
          div.gn_division_name?.toLowerCase().includes("walpita"),
      );
      if (walpita) {
        console.log(" Walpita found:", walpita);
      } else {
        console.warn(" Walpita not found in divisions");
        console.log(
          "Available division names:",
          gn_divisions.map((d) => ({
            name: d.name,
            gn_division_Name: d.gn_division_Name,
            gn_division_name: d.gn_division_name,
          })),
        );
      }
    }
    if (error) {
      console.error("Error loading GN divisions:", error);
    }
  }, [gn_divisions, error]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];

      if (current.includes(value)) {
        return {
          ...prev,
          [field]: current.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...current, value],
        };
      }
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Helper function to get GN Division name from ID
  const getGnDivisionName = (divisionId) => {
    if (!divisionId || !gn_divisions) return "Unknown";

    // Convert to string for comparison
    const idStr = String(divisionId);

    const division = gn_divisions.find((div) => {
      const divIdStr = String(div.id || div._id || "");
      return divIdStr === idStr;
    });

    if (!division) {
      console.warn("Division not found for ID:", divisionId);
      console.log("Available divisions:", gn_divisions);
      return "Unknown";
    }

    const name =
      division.name || division.gn_division_Name || division.gn_division_name;
    console.log("✓ Division found:", { id: divisionId, name });
    return name || "Unknown";
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate that GN Division is selected
  if (!formData.gn_division || formData.gn_division === "") {
    alert("Please select your GN Division before submitting the form.");
    return;
  }

  // Validate government allowance
  if (!formData.GovtAllowance || formData.GovtAllowance.length === 0) {
    alert("Please select at least one government allowance or select 'Other' if none apply.");
    return;
  }

  // Validate support types
  if (!formData.support_types || formData.support_types.length === 0) {
    alert("Please select at least one support type.");
    return;
  }

  try {
    // Transform formData to match backend schema
    const backendPayload = {
      b_profile: [
        {
          nic: formData.nic,
          name: formData.name,
          phone_no: formData.phone_no,
          age: formData.age,
          gender: formData.gender,
          address: formData.address,
          gn_division: formData.gn_division,
          family_size: formData.family_size,
          children_under_18: formData.children_under_18,
          monthly_income: formData.monthly_income,
          employment_type: formData.employment_type,
          GovtAllowance: formData.GovtAllowance,
          otherIncomeSources: formData.otherIncomeSources || "",
          chronic_illness: {
            exists: formData.chronic_illness.exists,
            description: formData.chronic_illness.description || "",
          },
          nearest_hospitalkm: formData.nearest_hospitalkm,
          disabilityInHousehold: formData.disabilityInHousehold,
          highestEducationLevel: formData.highestEducationLevel,
          distanceToSchoolKm: formData.distanceToSchoolKm || 0,
          childrenDroppedOut: formData.childrenDroppedOut,
          housing_type: formData.housing_type,
          safewater_access: formData.safewater_access,
          sanitation_access: formData.sanitation_access,
          electricity_access: formData.electricity_access,
          support_types: formData.support_types,
          support_description: formData.support_description,
          selfrated_urgency: String(formData.selfrated_urgency), 
        },
      ],
      req_evidence: [], // Empty array for now
      gn_division_Id: formData.gn_division, // Add this field
    };

    console.log("Submitting transformed payload:", backendPayload);

    const _response = await createB_req(backendPayload).unwrap();
    setIsSuccess(true);
  } catch (error) {
    console.error("Error submitting form:", error);
    console.error("Error details:", error.data || error.message);
    
    // More specific error message
    const errorMsg = error.data?.message || error.message || "Unknown error";
    alert(
      `Error submitting your request: ${errorMsg}\n\nPlease ensure:\n- GN Division is selected\n- At least one Government Allowance is selected\n- At least one Support Type is selected`
    );
  }
};

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl shadow-emerald-900/10 border border-emerald-50"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-950 mb-4 tracking-tight">
            Application Filed!
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 italic">
            Your detailed application has been received. Our team will
            coordinate with your local Grama Niladhari division for
            verification.
          </p>
          <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-50 mb-10 text-left">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">
              REFERENCE CODE
            </div>
            <div className="text-lg font-bold text-emerald-950 underline underline-offset-4 decoration-emerald-200">
              HL-BEN-9921-X
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-200 active:scale-95"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-emerald-950 tracking-tight uppercase">
              HOPELINK
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-700 ${s <= step ? "w-10 bg-emerald-600" : "w-4 bg-gray-100"}`}
                ></div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.3em] ml-2">
              Section {step} of 6
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-6 border border-emerald-100/50">
            <ShieldCheck className="w-3 h-3" />{" "}
            <span>Unified Welfare Application</span>
          </div>
          <h1 className="text-4xl font-bold text-emerald-950 mb-4 tracking-tight">
            Request Community Support
          </h1>
          <p className="text-gray-400 font-medium max-w-lg mx-auto italic">
            This information is directly used to assess eligibility for NGO
            distribution. Please ensure all living conditions are accurately
            reported.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-emerald-950/5 border border-emerald-50"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">
                      Personal Identity
                    </h2>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      Enter your legal identification details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="As per NIC"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      NIC Number
                    </label>
                    <input
                      name="nic"
                      required
                      value={formData.nic}
                      onChange={handleInputChange}
                      placeholder="e.g. 199012345678"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      required
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Years"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Phone Number
                    </label>
                    <input
                      name="phone_no"
                      required
                      value={formData.phone_no}
                      onChange={handleInputChange}
                      placeholder="07XXXXXXXX"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">
                      Location & Living
                    </h2>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      Tell us about your housing and utilities
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Permanent Address
                    </label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="No, Village, Town,City"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all h-28 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                        GN Division
                      </label>
                      <select
                        name="gn_division"
                        required
                        value={formData.gn_division}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full text-black bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">
                          {isLoading
                            ? "Loading divisions..."
                            : "Select your GN Division"}
                        </option>
                        {gn_divisions && gn_divisions.length > 0 ? (
                          gn_divisions.map((division) => (
                            <option
                              key={division._id || division.id}
                              value={division._id || division.id}
                              style={{ color: "black" }}
                            >
                              {division.name ||
                                division.gn_division_Name ||
                                division.gn_division_name ||
                                "Unknown"}
                            </option>
                          ))
                        ) : (
                          <option disabled>No divisions available</option>
                        )}
                      </select>
                      {error && (
                        <p className="text-xs text-red-500 font-medium">
                          Error loading divisions:{" "}
                          {error.message || "Unknown error"}
                        </p>
                      )}
                      {!isLoading &&
                        (!gn_divisions || gn_divisions.length === 0) && (
                          <p className="text-xs text-amber-600 font-medium">
                            No GN divisions found. Please contact support.
                          </p>
                        )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                        Housing Type
                      </label>
                      <select
                        name="housing_type"
                        value={formData.housing_type}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="own">Self Owned</option>
                        <option value="rent">Rented</option>
                        <option value="temporary">Temporary Shelter</option>
                        <option value="no-fixed_shelter">No Shelter</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-8 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-50">
                    <h4 className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest mb-6">
                      Utility Access
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-emerald-50 cursor-pointer shadow-sm hover:shadow-md transition-all">
                        <input
                          type="checkbox"
                          name="safewater_access"
                          checked={formData.safewater_access}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded-md border-emerald-200 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-emerald-950">
                            Safe Water
                          </span>
                          <span className="text-[9px] font-medium text-gray-400">
                            Regular Supply
                          </span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-emerald-50 cursor-pointer shadow-sm hover:shadow-md transition-all">
                        <input
                          type="checkbox"
                          name="sanitation_access"
                          checked={formData.sanitation_access}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded-md border-emerald-200 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-emerald-950">
                            Sanitation
                          </span>
                          <span className="text-[9px] font-medium text-gray-400">
                            Private Toilet
                          </span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-emerald-50 cursor-pointer shadow-sm hover:shadow-md transition-all">
                        <input
                          type="checkbox"
                          name="electricity_access"
                          checked={formData.electricity_access}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded-md border-emerald-200 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-emerald-950">
                            Electricity
                          </span>
                          <span className="text-[9px] font-medium text-gray-400">
                            Main Power
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">
                      Socio-Economic
                    </h2>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      Financial and employment background
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Employment Type
                    </label>
                    <select
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white"
                    >
                      <option value="Government">Government Sector</option>
                      <option value="Private">Private Sector</option>
                      <option value="Self employed">Self Employed</option>
                      <option value="Unemployed">Currently Unemployed</option>
                      <option value="Daily wage">Daily Wage Laborer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Monthly Income (LKR)
                    </label>
                    <input
                      name="monthly_income"
                      type="number"
                      required
                      value={formData.monthly_income}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Total Family Size
                    </label>
                    <input
                      name="family_size"
                      type="number"
                      required
                      value={formData.family_size}
                      onChange={handleInputChange}
                      placeholder="Count"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Children Under 18
                    </label>
                    <input
                      name="children_under_18"
                      type="number"
                      value={formData.children_under_18}
                      onChange={handleInputChange}
                      placeholder="Count"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                    Government Allowances Received
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Samurdhi",
                      "Elderly Allowance",
                      "Disability Allowance",
                      "Ath Wasuma",
                      "Other",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleArrayToggle("GovtAllowance", opt)}
                        className={`px-5 py-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all border ${
                          formData.GovtAllowance.includes(opt)
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                            : "bg-white border-emerald-100 text-emerald-950/40 hover:border-emerald-600 hover:text-emerald-600"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                    Other Income Sources
                  </label>
                  <textarea
                    name="otherIncomeSources"
                    value={formData.otherIncomeSources}
                    onChange={handleInputChange}
                    placeholder="Describe any other sources of income (e.g., agricultural work, small business, remittances, rental income, etc.)"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold focus:bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all h-32 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">
                      Health & Services
                    </h2>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      Household health and accessibility
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-widest">
                          Chronic Illness?
                        </span>
                        <span className="text-[9px] font-medium text-gray-400">
                          Regular medication needed
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.chronic_illness.exists}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            chronic_illness: {
                              ...formData.chronic_illness,
                              exists: e.target.checked,
                            },
                          })
                        }
                        className="w-6 h-6 rounded-lg text-emerald-600"
                      />
                    </div>
                    {formData.chronic_illness.exists && (
                      <input
                        placeholder="Mention illness details"
                        value={formData.chronic_illness.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            chronic_illness: {
                              ...formData.chronic_illness,
                              description: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-gray-50 border border-emerald-100 rounded-2xl px-6 py-4 text-sm font-semibold outline-none"
                      />
                    )}
                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-widest">
                          Disabilities?
                        </span>
                        <span className="text-[9px] font-medium text-gray-400">
                          In the current household
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        name="disabilityInHousehold"
                        checked={formData.disabilityInHousehold}
                        onChange={handleInputChange}
                        className="w-6 h-6 rounded-lg text-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-widest flex items-center gap-2">
                        Nearest Hospital (Km)
                      </label>
                      <input
                        name="nearest_hospitalkm"
                        type="number"
                        value={formData.nearest_hospitalkm}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-widest flex items-center gap-2">
                        Highest Education Level
                      </label>
                      <select
                        name="highestEducationLevel"
                        value={formData.highestEducationLevel}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-semibold"
                      >
                        <option value="none">No Schooling</option>
                        <option value="1-10">Grade 1-10</option>
                        <option value="O/Level">O/Level</option>
                        <option value="A/Level">A/Level</option>
                        <option value="degree">University Graduate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">
                      Request & Aid
                    </h2>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      Specific support requirements
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Types of Support Needed
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "financial",
                        "medical",
                        "educational",
                        "sanitation",
                        "pre-loved_items",
                        "counselling",
                        "other",
                      ].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            handleArrayToggle("support_types", opt)
                          }
                          className={`px-5 py-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all border ${
                            formData.support_types.includes(opt)
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                              : "bg-white border-emerald-100 text-emerald-950/40 hover:border-emerald-600 hover:text-emerald-600"
                          }`}
                        >
                          {opt.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                      Detailed Situation Description
                    </label>
                    <textarea
                      name="support_description"
                      required
                      minLength={10}
                      value={formData.support_description}
                      onChange={handleInputChange}
                      placeholder="Explain your current hardship in detail..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-6 text-sm font-semibold focus:bg-white outline-none h-44 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] block pl-1">
                        Self-Rated Urgency (1-5)
                      </label>
                      <div className="flex gap-4">
                        {["1", "2", "3", "4", "5"].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() =>
                               setFormData({ ...formData, selfrated_urgency: r })
                            }
                            className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${formData.selfrated_urgency === r ? "bg-emerald-950 text-white border-emerald-950 scale-110 shadow-lg" : "bg-white text-gray-300 border-gray-100 hover:border-emerald-200 hover:text-emerald-600"}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                      <h4 className="text-[10px] font-bold text-emerald-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-600" /> Upload
                        Evidence
                      </h4>
                      <button
                        type="button"
                        className="w-full py-4 bg-white border-2 border-dashed border-emerald-200 text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-50 transition-all"
                      >
                        Photo or PDF (max 5MB)
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-5 pb-6 border-b border-gray-50">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">
                      Final Review
                    </h2>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      Please verify all information before submission
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        Applicant Name
                      </span>
                      <span className="text-sm font-bold text-emerald-950">
                        {formData.name}
                      </span>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        NIC Number
                      </span>
                      <span className="text-sm font-bold text-emerald-950 uppercase">
                        {formData.nic}
                      </span>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        GN Division
                      </span>
                      <span className="text-sm font-bold text-emerald-950">
                        {getGnDivisionName(formData.gn_division)}
                      </span>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        Income Level
                      </span>
                      <span className="text-sm font-bold text-emerald-950">
                        LKR {formData.monthly_income} /mo
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-50/30 rounded-3xl border border-emerald-50">
                    <span className="text-[9px] font-bold text-emerald-900/60 uppercase tracking-widest block mb-3">
                      Selected Support Modules
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.support_types.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 bg-white rounded-lg text-[9px] font-bold text-emerald-600 border border-emerald-100 uppercase tracking-wider"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Situation Summary
                    </span>
                    <p className="text-sm text-emerald-950 font-medium leading-relaxed italic line-clamp-3">
                      "{formData.support_description}"
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-[10px] text-amber-800 font-bold leading-relaxed tracking-wide">
                    By submitting, you confirm that all information provided is
                    true and accurate. Falsifying welfare documents is a
                    punishable offense under the Social Security Act.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 pt-10 border-t border-gray-50 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-3 text-[10px] font-extrabold text-gray-300 hover:text-emerald-600 transition-all uppercase tracking-[0.3em]"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-4">
              {step < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95"
                >
                  {step === 5 ? "Review Summary" : "Continue"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-12 py-5 bg-emerald-950 hover:bg-black text-white rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-950/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCreating || !formData.gn_division}
                >
                  {isCreating ? (
                    <>
                      Submitting...{" "}
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </>
                  ) : !formData.gn_division ? (
                    <>
                      Select GN Division First{" "}
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Confirm & Submit <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-14 text-center space-y-3">
          <div className="flex items-center justify-center gap-3 opacity-30">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div className="h-px w-24 bg-emerald-950"></div>
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
            Every submission is cryptographically checked for integrity and
            local GN matching.
          </p>
        </div>
      </main>
    </div>
  );
}
