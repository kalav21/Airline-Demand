import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const initialForm = {
  fullName: "",
  company: "",
  email: "",
  roleTitle: "",
  interestArea: "",
  message: ""
};

const interestOptions = [
  "Travel demand prediction",
  "Turn-time / operations analytics",
  "Dashboard development",
  "Data management",
  "General inquiry"
];

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function RequestDemoModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && status !== "submitting") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, status]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Work email is required.";
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = "Enter a valid work email address.";
    }

    if (!form.interestArea) {
      nextErrors.interestArea = "Select an interest area.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setErrors({});
    setStatus("idle");
    setSubmitMessage("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage("");

    if (!validateForm()) return;

    if (!isSupabaseConfigured || !supabase) {
      setStatus("error");
      setSubmitMessage(
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
      );
      return;
    }

    setStatus("submitting");

    const { error } = await supabase.from("demo_requests").insert({
      full_name: form.fullName.trim(),
      company: form.company.trim() || null,
      email: form.email.trim(),
      role_title: form.roleTitle.trim() || null,
      interest_area: form.interestArea,
      message: form.message.trim() || null
    });

    if (error) {
      console.error("Supabase demo request submission failed:", error);
      setStatus("error");
      if (
        error.code === "PGRST205" ||
        error.message?.toLowerCase().includes("schema cache") ||
        error.message?.toLowerCase().includes("demo_requests")
      ) {
        setSubmitMessage(
          "Supabase cannot find the demo_requests table. Confirm the table exists in the public schema, then reload the schema cache."
        );
      } else {
        setSubmitMessage("Submission failed. Please try again or contact me directly.");
      }
      return;
    }

    setForm(initialForm);
    setErrors({});
    setStatus("idle");
    setSubmitMessage("");
    onClose();
    onSuccess();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 grid place-items-center bg-navy-900/80 p-4 backdrop-blur-sm"
      onClick={status === "submitting" ? undefined : resetAndClose}
    >
      <div
        className="modal-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-soft"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-demo-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Analytics Demo
            </p>
            <h2 id="request-demo-title" className="mt-2 text-2xl font-bold text-navy-900">
              Request a Demo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Share a few details and I will follow up about the airline analytics dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            disabled={status === "submitting"}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {submitMessage && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                status === "success"
                  ? "border-teal-200 bg-teal-50 text-teal-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              value={form.fullName}
              onChange={(value) => updateField("fullName", value)}
              error={errors.fullName}
              required
            />
            <Field
              label="Organization / Company"
              value={form.company}
              onChange={(value) => updateField("company", value)}
            />
            <Field
              label="Work email"
              type="email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              error={errors.email}
              required
            />
            <Field
              label="Role / Title"
              value={form.roleTitle}
              onChange={(value) => updateField("roleTitle", value)}
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Interest area <span className="text-teal-700">*</span>
            </span>
            <select
              value={form.interestArea}
              onChange={(event) => updateField("interestArea", event.target.value)}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm font-medium text-navy-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100 ${
                errors.interestArea ? "border-red-400" : "border-slate-300"
              }`}
            >
              <option value="">Select an interest area</option>
              {interestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.interestArea && (
              <p className="mt-2 text-sm text-red-600">{errors.interestArea}</p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Message <span className="font-normal text-slate-500">(optional, recommended)</span>
            </span>
            <textarea
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={4}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              placeholder="Tell me what you would like to see or discuss."
            />
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetAndClose}
              disabled={status === "submitting"}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-400"
            >
              {status === "submitting" ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-teal-700">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100 ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </label>
  );
}

export default RequestDemoModal;
