import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaClock, FaUndo, FaShippingFast, FaChevronDown } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { MdSupportAgent } from "react-icons/md";
import Footer from "../components/Footer";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

:root {
  --indigo:      #4f46e5;
  --indigo-2:    #6366f1;
  --indigo-pale: #eef2ff;
  --indigo-100:  #e0e7ff;
  --indigo-200:  #c7d2fe;
  --blue:        #2563eb;
  --blue-pale:   #dbeafe;
  --electric:    #818cf8;
  --white:       #ffffff;
  --off-white:   #f8faff;
  --slate-50:    #f8fafc;
  --slate-100:   #f1f5f9;
  --slate-200:   #e2e8f0;
  --slate-400:   #94a3b8;
  --slate-500:   #64748b;
  --slate-700:   #334155;
  --slate-900:   #0f172a;
  --border:      rgba(99,102,241,0.18);
  --border-soft: rgba(99,102,241,0.10);
  --red:         #ef4444;
  --shadow-sm:   0 2px 12px rgba(79,70,229,0.07);
  --shadow-md:   0 6px 32px rgba(79,70,229,0.11);
  --shadow-lg:   0 12px 48px rgba(79,70,229,0.15);
}

.ct-root {
  font-family: 'Instrument Sans', sans-serif;
  background: var(--off-white);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  color: var(--slate-900);
}

/* soft mesh – light version */
.ct-root::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 8% 18%,  rgba(99,102,241,0.09) 0%, transparent 65%),
    radial-gradient(ellipse 50% 60% at 92% 82%,  rgba(59,130,246,0.08) 0%, transparent 65%),
    radial-gradient(ellipse 40% 40% at 55% 5%,   rgba(129,140,248,0.06) 0%, transparent 60%);
  pointer-events: none; z-index: 0;
}

/* light dot-grid */
.ct-root::after {
  content: '';
  position: fixed; inset: 0;
  background-image: radial-gradient(circle, rgba(99,102,241,0.06) 1px, transparent 1px);
  background-size: 36px 36px;
  pointer-events: none; z-index: 0;
}

.ct-inner {
  position: relative; z-index: 1;
  max-width: 1240px; margin: 0 auto;
  padding: 0 24px 90px;
}

/* ════ HERO ════ */
.ct-hero { text-align: center; padding: 88px 0 64px; }

.ct-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--indigo-pale);
  border: 1px solid var(--indigo-200);
  border-radius: 100px; padding: 6px 18px;
  font-size: 11px; font-weight: 700;
  letter-spacing: .13em; text-transform: uppercase;
  color: var(--indigo); margin-bottom: 22px;
}
.ct-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--indigo-2);
  animation: pulseD 2s ease-in-out infinite;
}
@keyframes pulseD { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.6)} }

.ct-h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.8rem, 6vw, 4.8rem);
  font-weight: 800; line-height: 1.03; letter-spacing: -.025em;
  color: var(--slate-900); margin-bottom: 18px;
}
.ct-h1 em {
  font-style: normal;
  background: linear-gradient(135deg, var(--indigo) 0%, var(--blue) 55%, var(--electric) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.ct-hero-sub {
  color: var(--slate-500); font-size: 1.05rem;
  max-width: 500px; margin: 0 auto 44px; line-height: 1.65;
}

.ct-stats { display: flex; justify-content: center; flex-wrap: wrap; }
.ct-stat {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 0 30px; border-right: 1px solid var(--slate-200);
}
.ct-stat:last-child { border-right: none; }
.ct-stat-num {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.75rem; font-weight: 800;
  color: var(--indigo); line-height: 1;
}
.ct-stat-lbl { font-size: 11px; color: var(--slate-400); font-weight: 500; letter-spacing: .04em; }

/* ════ MAIN GRID ════ */
.ct-grid {
  display: grid; grid-template-columns: 1fr 1.08fr;
  gap: 28px; align-items: start;
}
@media(max-width:900px){
  .ct-grid { grid-template-columns: 1fr; }
  .ct-map-col { order: 2; } .ct-form-col { order: 1; }
}

/* shared card */
.ct-card {
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* ── Left col ── */
.ct-map-col { display: flex; flex-direction: column; gap: 20px; }

.ct-map-frame {
  border-radius: 20px; overflow: hidden;
  height: 320px;
  border: 1px solid var(--border);
  position: relative;
  box-shadow: var(--shadow-md);
}
.ct-map-frame iframe { width:100%; height:100%; display:block; border:0; }
.ct-map-pin {
  position: absolute; bottom: 14px; left: 14px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 10px; padding: 8px 14px;
  font-size: 12px; font-weight: 600;
  color: var(--slate-700);
  display: flex; align-items: center; gap: 7px;
  box-shadow: var(--shadow-sm);
  pointer-events: none;
}
.ct-map-pin svg { color: var(--indigo); }

.ct-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ct-info-card {
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: 18px; padding: 20px;
  display: flex; flex-direction: column; gap: 10px;
  box-shadow: var(--shadow-sm);
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.ct-info-card:hover {
  border-color: var(--border);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.ct-info-icon {
  width: 38px; height: 38px; border-radius: 12px;
  background: linear-gradient(135deg, var(--indigo-pale), var(--blue-pale));
  border: 1px solid var(--indigo-200);
  display: flex; align-items: center; justify-content: center;
  color: var(--indigo); font-size: 15px;
}
.ct-info-lbl { font-size: 10px; font-weight: 700; color: var(--slate-400); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 2px; }
.ct-info-val { font-size: 13px; font-weight: 500; color: var(--slate-700); line-height: 1.45; }

/* ── Form col ── */
.ct-form-inner { padding: 36px 34px 34px; }
.ct-form-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.65rem; font-weight: 700;
  color: var(--slate-900); margin-bottom: 6px; letter-spacing: -.01em;
}
.ct-form-sub { font-size: .85rem; color: var(--slate-400); line-height: 1.5; margin-bottom: 28px; }

.ct-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media(max-width:500px){ .ct-field-row { grid-template-columns: 1fr; } }

.ct-field { display: flex; flex-direction: column; gap: 5px; }
.ct-label { font-size: 11px; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: .08em; }
.ct-wrap { position: relative; }
.ct-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: var(--indigo-200); font-size: 13px;
  pointer-events: none; transition: color .2s;
}
.ct-wrap:focus-within .ct-icon { color: var(--indigo); }

.ct-input, .ct-select, .ct-textarea {
  width: 100%; box-sizing: border-box;
  background: var(--slate-50);
  border: 1.5px solid var(--slate-200);
  border-radius: 12px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: .9rem; color: var(--slate-900); outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.ct-input, .ct-select { padding: 11px 14px 11px 40px; }
.ct-select { padding-left: 14px; appearance: none; cursor: pointer; background-color: var(--slate-50); }
.ct-select option { background: #fff; color: var(--slate-900); }
.ct-textarea { padding: 12px 14px; resize: vertical; min-height: 115px; line-height: 1.55; }
.ct-input::placeholder, .ct-textarea::placeholder { color: var(--slate-400); }

.ct-input:focus, .ct-select:focus, .ct-textarea:focus {
  border-color: var(--indigo-2);
  background: var(--white);
  box-shadow: 0 0 0 4px rgba(99,102,241,0.10);
}
.ct-field-err { border-color: var(--red) !important; background: #fff5f5 !important; }
.ct-err { font-size: 11.5px; color: var(--red); font-weight: 600; }

.ct-submit {
  width: 100%; padding: 14px; border: none; border-radius: 14px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1rem; font-weight: 700; color: #fff; cursor: pointer;
  background: linear-gradient(135deg, var(--indigo) 0%, var(--blue) 100%);
  box-shadow: 0 4px 20px rgba(79,70,229,0.32);
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: transform .18s, box-shadow .18s, opacity .18s;
  position: relative; overflow: hidden; letter-spacing: .01em;
}
.ct-submit::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,.18) 50%, transparent 70%);
  background-size: 200% 100%;
  animation: shimBtn 2.6s ease-in-out infinite;
}
@keyframes shimBtn {
  0%  { background-position: -200% center; }
  100%{ background-position:  200% center; }
}
.ct-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(79,70,229,0.44); }
.ct-submit:active:not(:disabled){ transform: translateY(0); }
.ct-submit:disabled { opacity: .65; cursor: not-allowed; }

.ct-note {
  text-align: center; font-size: .78rem; color: var(--slate-400); margin-top: 14px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.ct-note-line { flex: 1; height: 1px; background: var(--slate-200); }

/* ════ DIVIDER ════ */
.ct-divider {
  display: flex; align-items: center; gap: 20px;
  margin: 76px 0 52px;
}
.ct-divider-line { flex: 1; height: 1px; background: var(--slate-200); }
.ct-divider-badge {
  display: flex; align-items: center; gap: 9px;
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: 100px; padding: 8px 22px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: .88rem; font-weight: 700; color: var(--slate-700);
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}
.ct-divider-icon { color: var(--indigo); font-size: 16px; }

/* ════ FAQ ════ */
.ct-faq-head { text-align: center; margin-bottom: 44px; }
.ct-faq-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 800; color: var(--slate-900);
  line-height: 1.08; letter-spacing: -.02em; margin-bottom: 10px;
}
.ct-faq-title span {
  background: linear-gradient(135deg, var(--indigo), var(--blue));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.ct-faq-sub { color: var(--slate-400); font-size: .95rem; }

.ct-faq-list { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
.ct-faq-item {
  background: var(--white);
  border: 1px solid var(--border-soft);
  border-radius: 18px; overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: border-color .22s, box-shadow .22s, transform .22s;
}
.ct-faq-item:hover {
  border-color: var(--border);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.ct-faq-item.open {
  border-color: var(--indigo-200);
  box-shadow: 0 4px 28px rgba(79,70,229,0.10);
}
.ct-faq-btn {
  width: 100%; background: none; border: none; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 26px; text-align: left; gap: 16px;
}
.ct-faq-q {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1rem; font-weight: 600;
  color: var(--slate-700); transition: color .2s;
}
.ct-faq-item.open .ct-faq-q { color: var(--indigo); }
.ct-faq-icon {
  flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%;
  border: 1.5px solid var(--slate-200);
  background: var(--slate-50);
  display: flex; align-items: center; justify-content: center;
  color: var(--slate-400);
  transition: transform .32s, background .2s, color .2s, border-color .2s;
}
.ct-faq-item.open .ct-faq-icon {
  transform: rotate(180deg);
  background: var(--indigo-pale);
  border-color: var(--indigo-200);
  color: var(--indigo);
}
.ct-faq-body {
  max-height: 0; overflow: hidden;
  transition: max-height .38s cubic-bezier(.4,0,.2,1), opacity .28s;
  opacity: 0;
}
.ct-faq-item.open .ct-faq-body { max-height: 200px; opacity: 1; }
.ct-faq-a {
  padding: 0 26px 22px; color: var(--slate-500);
  font-size: .92rem; line-height: 1.68;
  border-top: 1px solid var(--slate-100); padding-top: 16px;
}

/* ════ ANIMATIONS ════ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fu  { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }
.fu1 { animation-delay: .08s; }
.fu2 { animation-delay: .18s; }
.fu3 { animation-delay: .28s; }
.fu4 { animation-delay: .38s; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ════ MOBILE ════ */
@media(max-width:640px){
  .ct-form-inner { padding: 22px 18px; }
  .ct-hero { padding: 60px 0 44px; }
  .ct-stat { padding: 0 16px; }
  .ct-stat-num { font-size: 1.35rem; }
  .ct-h1 { font-size: 2.4rem; }
}
`;

export default function Contact() {
  const [formData, setFormData] = useState({ name:"", email:"", inquiryType:"", orderId:"", message:"" });
  const [errors,   setErrors]   = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFAQ,  setOpenFAQ]  = useState(null);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const faqs = [
    { q:"How can I track my order?",       a:"After placing an order you will receive a tracking ID via email. Use the order tracking page to check your shipment status in real time." },
    { q:"What is your return policy?",     a:"You can request a return within 7 days of delivery if the product is damaged or defective. Our team processes returns within 2–3 business days." },
    { q:"How long does shipping take?",    a:"Shipping usually takes 3–5 business days depending on your location. Express delivery options are available at checkout." },
    { q:"How can I contact support?",      a:"Use the form on this page or email us directly. We respond to every inquiry within 1–2 business days." },
    { q:"Are my payment details secure?",  a:"Absolutely. All transactions are encrypted with industry-standard SSL. We never store raw card data on our servers." },
  ];

  useEffect(() => {
    const id = "ct-light-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email format";
    if (!formData.inquiryType)  e.inquiryType = "Please select inquiry type";
    if (formData.inquiryType === "order" && !formData.orderId.trim()) e.orderId = "Order ID is required";
    if (!formData.message.trim()) e.message = "Message is required";
    else if (formData.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); toast.error("Please fix the form errors."); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_key:accessKey, ...formData, subject:"E-Commerce Inquiry", from_name:formData.name.trim() }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Message sent successfully!");
        setFormData({ name:"", email:"", inquiryType:"", orderId:"", message:"" });
        setErrors({});
      } else toast.error("Something went wrong. Try again.");
    } catch { toast.error("Submission failed. Check your network."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="ct-root">
        <div className="ct-inner">

          {/* ══ HERO ══ */}
          <div className="ct-hero fu">
            <div className="ct-eyebrow">
              <span className="ct-eyebrow-dot" /> Customer Support
            </div>
            <h1 className="ct-h1">
              We're Here<br /><em>to Help You</em>
            </h1>
            <p className="ct-hero-sub">
              Questions about your order, a product, or anything else — our team is always ready to assist.
            </p>
            <div className="ct-stats">
              {[
                { num:"< 2h", lbl:"Avg. Response"   },
                { num:"99%",  lbl:"Satisfaction"    },
                { num:"24/7", lbl:"Live Support"    },
                { num:"10K+", lbl:"Happy Customers" },
              ].map(s => (
                <div className="ct-stat" key={s.lbl}>
                  <span className="ct-stat-num">{s.num}</span>
                  <span className="ct-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══ MAIN GRID ══ */}
          <div className="ct-grid">

            {/* Left — Map + Info */}
            <div className="ct-map-col fu fu1">
              <div className="ct-card ct-map-frame">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.9316664188245!2d85.61682517655123!3d20.13223376978005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19ad20457753ef%3A0x8d2834dd8305ea76!2sEinstein%20Academy%20of%20Technology%20and%20Management!5e1!3m2!1sen!2sin!4v1761017897848!5m2!1sen!2sin"
                  loading="lazy" title="Location Map"
                />
                <div className="ct-map-pin">
                  <FaMapMarkerAlt /> Einstein Academy Of Technology & Management , Odisha
                </div>
              </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

  {[
    { icon:<FaEnvelope />, lbl:"Email Us", val:"eshopcustomerinfo@gmail.com" },
    { icon:<FaClock />, lbl:"Response Time", val:"Within 1–2 business days" },
    { icon:<FaUndo />, lbl:"Easy Returns", val:"7-day hassle-free returns" },
    { icon:<FaShippingFast />, lbl:"Fast Shipping", val:"3–5 business days" },
  ].map(c => (
    <div
      key={c.lbl}
      className="flex flex-col gap-2 p-4 rounded-xl 
      bg-white/70 backdrop-blur border  border-indigo-100 
      shadow-sm hover:shadow-md transition
      h-[120px]"   // 👈 fixed height
    >

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <div className="text-indigo-600 text-lg flex-shrink-0">
          {c.icon}
        </div>

        <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
          {c.lbl}
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="text-sm text-gray-600 overflow-y-auto pr-1">
        {c.val}
      </div>

    </div>
  ))}

</div>
            </div>

            {/* Right — Form */}
            <div className="ct-card ct-form-col fu fu2">
              <div className="ct-form-inner">
                <div className="ct-form-title">Send a Message</div>
                <p className="ct-form-sub">Fill in the details and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:15 }}>

                  <div className="ct-field-row">
                    <div className="ct-field">
                      <label className="ct-label">Full Name</label>
                      <div className="ct-wrap">
                        <FaUser className="ct-icon" />
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                          placeholder="John Doe"
                          className={`ct-input${errors.name?" ct-field-err":""}`} />
                      </div>
                      {errors.name && <span className="ct-err">{errors.name}</span>}
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Email</label>
                      <div className="ct-wrap">
                        <FaEnvelope className="ct-icon" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="john@example.com"
                          className={`ct-input${errors.email?" ct-field-err":""}`} />
                      </div>
                      {errors.email && <span className="ct-err">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label className="ct-label">Inquiry Type</label>
                    <select name="inquiryType" value={formData.inquiryType} onChange={handleChange}
                      className={`ct-select${errors.inquiryType?" ct-field-err":""}`}>
                      <option value="">Select Inquiry Type</option>
                      <option value="order">Order Issue</option>
                      <option value="product">Product Inquiry</option>
                      <option value="return">Returns & Refunds</option>
                      <option value="general">General Question</option>
                    </select>
                    {errors.inquiryType && <span className="ct-err">{errors.inquiryType}</span>}
                  </div>

                  {formData.inquiryType === "order" && (
                    <div className="ct-field">
                      <label className="ct-label">Order ID</label>
                      <input type="text" name="orderId" value={formData.orderId} onChange={handleChange}
                        placeholder="#123456"
                        className={`ct-input${errors.orderId?" ct-field-err":""}`}
                        style={{ paddingLeft:14 }} />
                      {errors.orderId && <span className="ct-err">{errors.orderId}</span>}
                    </div>
                  )}

                  <div className="ct-field">
                    <label className="ct-label">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      placeholder="Describe your issue or question in detail…"
                      className={`ct-textarea${errors.message?" ct-field-err":""}`} />
                    {errors.message && <span className="ct-err">{errors.message}</span>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="ct-submit">
                    {isSubmitting ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5"
                          style={{ animation:"spin 1s linear infinite" }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <><IoIosSend size={18}/> Submit Request</>
                    )}
                  </button>

                  <p className="ct-note">
                    <span className="ct-note-line"/>
                    We respond within 1–2 business days
                    <span className="ct-note-line"/>
                  </p>
                </form>
              </div>
            </div>

          </div>

          {/* ══ DIVIDER ══ */}
          <div className="ct-divider fu fu3">
            <div className="ct-divider-line"/>
            <div className="ct-divider-badge">
              <MdSupportAgent className="ct-divider-icon"/> Frequently Asked Questions
            </div>
            <div className="ct-divider-line"/>
          </div>

          {/* ══ FAQ ══ */}
          <div className="fu fu4">
            <div className="ct-faq-head">
              <h2 className="ct-faq-title">Got a <span>Question?</span></h2>
              <p className="ct-faq-sub">We've answered the most common ones below.</p>
            </div>
            <div className="ct-faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`ct-faq-item${openFAQ===i?" open":""}`}>
                  <button className="ct-faq-btn" onClick={() => setOpenFAQ(openFAQ===i?null:i)}>
                    <span className="ct-faq-q">{faq.q}</span>
                    <span className="ct-faq-icon"><FaChevronDown size={12}/></span>
                  </button>
                  <div className="ct-faq-body">
                    <p className="ct-faq-a">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer/>
    </>
  );
}