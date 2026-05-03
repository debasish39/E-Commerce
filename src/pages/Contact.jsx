import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaClock, FaUndo, FaShippingFast, FaChevronDown, FaShieldAlt } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { MdSupportAgent } from "react-icons/md";
import Footer from "../components/Footer";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --i9:   #1e1b4b;
  --i8:   #3730a3;
  --i7:   #4338ca;
  --i6:   #4f46e5;
  --i5:   #6366f1;
  --i4:   #818cf8;
  --i3:   #a5b4fc;
  --i2:   #c7d2fe;
  --i1:   #e0e7ff;
  --i0:   #eef2ff;
  --b6:   #2563eb;
  --b5:   #3b82f6;
  --b4:   #60a5fa;
  --b3:   #93c5fd;
  --b1:   #dbeafe;
  --b0:   #eff6ff;
  --wh:   #ffffff;
  --of:   #f7f9ff;
  --s9:   #0f172a;
  --s7:   #334155;
  --s5:   #64748b;
  --s4:   #94a3b8;
  --s2:   #e2e8f0;
  --s1:   #f1f5f9;
  --red:  #ef4444;
  --grad: linear-gradient(135deg, var(--i6) 0%, var(--b6) 100%);
  --grad-soft: linear-gradient(135deg, var(--i0) 0%, var(--b0) 100%);
  --sh-xs: 0 1px 6px rgba(79,70,229,0.06);
  --sh-sm: 0 3px 16px rgba(79,70,229,0.09);
  --sh-md: 0 8px 36px rgba(79,70,229,0.13);
  --sh-lg: 0 16px 56px rgba(79,70,229,0.17);
  --border: rgba(99,102,241,0.14);
  --r-lg: 24px;
  --r-md: 16px;
  --r-sm: 12px;
}

/* ── root ── */
.ct-root {
  font-family: 'DM Sans', sans-serif;
  background: var(--of);
  min-height: 100vh;
  color: var(--s9);
  position: relative;
  overflow-x: hidden;
}

/* layered bg mesh */
.ct-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
}
.ct-bg-mesh {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 5% 12%,  rgba(99,102,241,0.10) 0%, transparent 60%),
    radial-gradient(ellipse 55% 65% at 96% 88%,  rgba(37,99,235,0.09)  0%, transparent 60%),
    radial-gradient(ellipse 45% 40% at 50% -5%,  rgba(129,140,248,0.07) 0%, transparent 55%),
    linear-gradient(175deg, #f0f4ff 0%, #edf2ff 30%, #f7f9ff 65%, #ffffff 100%);
}
.ct-bg-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(79,70,229,0.055) 1px, transparent 1px);
  background-size: 34px 34px;
}
/* diagonal stripe accent top-right */
.ct-bg-stripe {
  position: absolute;
  top: -80px; right: -120px;
  width: 480px; height: 480px;
  border: 1px solid rgba(79,70,229,0.07);
  border-radius: 48px;
  transform: rotate(20deg);
}
.ct-bg-stripe-2 {
  width: 320px; height: 320px;
  top: -40px; right: -60px;
  border-color: rgba(37,99,235,0.06);
  transform: rotate(36deg);
}

/* ── inner ── */
.ct-inner {
  position: relative; z-index: 1;
  max-width: 1260px; margin: 0 auto;
  padding: 0 28px 100px;
}

/* ════ HERO ════ */
.ct-hero {
  text-align: center;
  padding: 96px 0 72px;
}

.ct-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--i0);
  border: 1px solid var(--i2);
  border-radius: 100px; padding: 6px 20px;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: .13em; text-transform: uppercase;
  color: var(--i6); margin-bottom: 24px;
  box-shadow: var(--sh-xs);
}
.ct-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--i5);
  box-shadow: 0 0 0 0 rgba(99,102,241,0.5);
  animation: rippleDot 2.2s ease-out infinite;
}
@keyframes rippleDot {
  0%   { box-shadow: 0 0 0 0   rgba(99,102,241,0.5); }
  70%  { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
  100% { box-shadow: 0 0 0 0   rgba(99,102,241,0); }
}

.ct-h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.8rem, 6.5vw, 5.2rem);
  font-weight: 800; line-height: 1.02; letter-spacing: -.03em;
  color: var(--s9); margin-bottom: 20px;
}
.ct-h1 em {
  font-style: normal;
  background: linear-gradient(130deg, var(--i7) 0%, var(--i5) 40%, var(--b5) 80%, var(--b4) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}
.ct-hero-sub {
  color: var(--s5); font-size: 1.05rem;
  max-width: 460px; margin: 0 auto 52px;
  line-height: 1.7; font-weight: 400;
}

/* stats row */
.ct-stats {
  display: inline-flex; flex-wrap: wrap; justify-content: center;
  background: var(--wh);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--sh-sm);
  overflow: hidden;
}
.ct-stat {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 20px 32px;
  border-right: 1px solid rgba(99,102,241,0.09);
  position: relative;
}
.ct-stat:last-child { border-right: none; }
.ct-stat::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--grad); opacity: 0;
  transition: opacity .2s;
}
.ct-stat:hover::before { opacity: 1; }
.ct-stat-num {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.85rem; font-weight: 800;
  background: var(--grad);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  line-height: 1;
}
.ct-stat-lbl {
  font-size: 10.5px; color: var(--s4);
  font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
}

/* ════ MAIN GRID ════ */
.ct-grid {
  display: grid; grid-template-columns: 1fr 1.12fr;
  gap: 28px; align-items: start; margin-top: 72px;
}
@media(max-width:920px){
  .ct-grid { grid-template-columns: 1fr; }
  .ct-map-col { order: 2; } .ct-form-col { order: 1; }
}

/* ── shared card ── */
.ct-card {
  background: var(--wh);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-sm);
  overflow: hidden;
  transition: box-shadow .25s;
}
.ct-card:hover { box-shadow: var(--sh-md); }

/* top gradient rule on cards */
.ct-card-ruled::before {
  content: '';
  display: block; height: 3px;
  background: var(--grad);
}

/* ── left col ── */
.ct-map-col { display: flex; flex-direction: column; gap: 20px; }

.ct-map-frame {
  height: 310px; border-radius: var(--r-lg); overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--sh-md); position: relative;
}
.ct-map-frame iframe { width:100%; height:100%; display:block; border:0; }
.ct-map-pin {
  position: absolute; bottom: 14px; left: 14px;
  background: rgba(255,255,255,0.94); backdrop-filter: blur(14px);
  border: 1px solid var(--border); border-radius: 12px;
  padding: 9px 16px; font-size: 12px; font-weight: 600;
  color: var(--s7); display: flex; align-items: center; gap: 8px;
  box-shadow: var(--sh-sm); pointer-events: none;
}
.ct-map-pin svg { color: var(--i6); flex-shrink: 0; }

/* info grid */
.ct-info-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
}
@media(max-width:400px){ .ct-info-grid { grid-template-columns: 1fr; } }

.ct-info-card {
  background: var(--wh);
  border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 20px;
  display: flex; flex-direction: column; gap: 11px;
  box-shadow: var(--sh-xs);
  transition: border-color .22s, transform .22s, box-shadow .22s;
  min-height: 116px;
}
.ct-info-card:hover {
  border-color: var(--i3);
  transform: translateY(-3px);
  box-shadow: var(--sh-md);
}
.ct-info-top { display: flex; align-items: center; gap: 9px; }
.ct-info-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: var(--grad);
  display: flex; align-items: center; justify-content: center;
  color: var(--wh); font-size: 14px;
  box-shadow: 0 4px 12px rgba(79,70,229,0.25);
}
.ct-info-lbl {
  font-size: 10px; font-weight: 700; color: var(--i5);
  letter-spacing: .09em; text-transform: uppercase;
}
.ct-info-val {
  font-size: 13px; font-weight: 500; color: var(--s7); line-height: 1.5;
}

/* ── right form col ── */
.ct-form-inner { padding: 38px 36px 36px; }

.ct-form-eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: .10em;
  text-transform: uppercase; color: var(--i5);
  margin-bottom: 6px;
}
.ct-form-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.75rem; font-weight: 800;
  color: var(--s9); margin-bottom: 6px; letter-spacing: -.02em;
}
.ct-form-sub {
  font-size: .875rem; color: var(--s4);
  line-height: 1.55; margin-bottom: 28px;
}

.ct-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media(max-width:520px){ .ct-field-row { grid-template-columns: 1fr; } }

.ct-field { display: flex; flex-direction: column; gap: 6px; }

.ct-label {
  font-size: 11px; font-weight: 700;
  color: var(--s5); letter-spacing: .08em; text-transform: uppercase;
}

.ct-wrap { position: relative; }
.ct-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: var(--i3); font-size: 13px; pointer-events: none;
  transition: color .2s;
}
.ct-wrap:focus-within .ct-icon { color: var(--i6); }

.ct-input, .ct-select, .ct-textarea {
  width: 100%; box-sizing: border-box;
  background: var(--s1);
  border: 1.5px solid var(--s2);
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: .9rem; color: var(--s9); outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.ct-input, .ct-select { padding: 12px 14px 12px 40px; height: 46px; }
.ct-select { padding-left: 14px; appearance: none; cursor: pointer; }
.ct-select option { background: #fff; }
.ct-textarea { padding: 13px 14px; resize: vertical; min-height: 118px; line-height: 1.6; }
.ct-input::placeholder, .ct-textarea::placeholder { color: var(--s4); }

.ct-input:focus, .ct-select:focus, .ct-textarea:focus {
  border-color: var(--i4);
  background: var(--wh);
  box-shadow: 0 0 0 4px rgba(99,102,241,0.11);
}
.ct-field-err { border-color: var(--red) !important; background: #fff8f8 !important; }
.ct-err { font-size: 11.5px; color: var(--red); font-weight: 600; margin-top: -2px; }

/* submit */
.ct-submit {
  width: 100%; padding: 14.5px; border: none; border-radius: var(--r-sm);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1rem; font-weight: 700; color: #fff;
  cursor: pointer;
  background: var(--grad);
  box-shadow: 0 4px 20px rgba(79,70,229,0.32), 0 1px 4px rgba(79,70,229,0.15);
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: transform .2s, box-shadow .2s;
  position: relative; overflow: hidden; letter-spacing: .01em;
}
.ct-submit::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.14) 50%, transparent 75%);
  background-size: 200% 100%;
  animation: shimBtn 2.8s ease-in-out infinite;
}
@keyframes shimBtn {
  0%  { background-position: -200% center; }
  100%{ background-position:  200% center; }
}
.ct-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(79,70,229,0.44);
}
.ct-submit:active:not(:disabled) { transform: scale(0.98); }
.ct-submit:disabled { opacity: .6; cursor: not-allowed; }

.ct-note {
  text-align: center; font-size: .77rem; color: var(--s4); margin-top: 14px;
  display: flex; align-items: center; justify-content: center; gap: 12px;
}
.ct-note-line { flex: 1; height: 1px; background: var(--s2); }
.ct-note-icon { color: var(--i4); flex-shrink: 0; }

/* ════ SECTION DIVIDER ════ */
.ct-divider {
  display: flex; align-items: center; gap: 22px;
  margin: 90px 0 58px;
}
.ct-divider-line { flex: 1; height: 1px; background: var(--s2); }
.ct-divider-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--wh);
  border: 1px solid var(--border);
  border-radius: 100px; padding: 10px 26px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: .875rem; font-weight: 700; color: var(--s7);
  white-space: nowrap; box-shadow: var(--sh-sm);
}
.ct-divider-icon {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--grad);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 14px;
}

/* ════ FAQ ════ */
.ct-faq-head { text-align: center; margin-bottom: 48px; }
.ct-faq-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  font-weight: 800; letter-spacing: -.025em;
  color: var(--s9); line-height: 1.06; margin-bottom: 12px;
}
.ct-faq-title span {
  background: linear-gradient(130deg, var(--i7), var(--b5));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ct-faq-sub { color: var(--s4); font-size: .95rem; }

.ct-faq-list {
  max-width: 840px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 10px;
}

.ct-faq-item {
  background: var(--wh);
  border: 1.5px solid rgba(99,102,241,0.10);
  border-radius: var(--r-md); overflow: hidden;
  box-shadow: var(--sh-xs);
  transition: border-color .22s, box-shadow .22s, transform .22s;
}
.ct-faq-item:hover {
  border-color: var(--i3);
  box-shadow: var(--sh-sm);
  transform: translateY(-1px);
}
.ct-faq-item.open {
  border-color: var(--i3);
  box-shadow: 0 6px 28px rgba(79,70,229,0.10);
}

.ct-faq-btn {
  width: 100%; background: none; border: none; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 26px; text-align: left; gap: 16px;
}
.ct-faq-q {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1rem; font-weight: 600;
  color: var(--s7); transition: color .2s; line-height: 1.4;
}
.ct-faq-item.open .ct-faq-q { color: var(--i7); }

.ct-faq-chevron {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 10px;
  border: 1.5px solid var(--s2); background: var(--s1);
  display: flex; align-items: center; justify-content: center;
  color: var(--s4);
  transition: transform .34s cubic-bezier(.4,0,.2,1), background .2s, color .2s, border-color .2s;
}
.ct-faq-item.open .ct-faq-chevron {
  transform: rotate(180deg);
  background: var(--i0); border-color: var(--i2); color: var(--i6);
}

.ct-faq-body {
  max-height: 0; overflow: hidden; opacity: 0;
  transition: max-height .38s cubic-bezier(.4,0,.2,1), opacity .28s;
}
.ct-faq-item.open .ct-faq-body { max-height: 220px; opacity: 1; }
.ct-faq-a {
  padding: 0 26px 22px;
  border-top: 1px solid var(--s1);
  padding-top: 16px;
  color: var(--s5); font-size: .91rem; line-height: 1.7;
}

/* ════ ANIMATIONS ════ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fu  { animation: fadeUp .7s cubic-bezier(.22,1,.36,1) both; }
.fu1 { animation-delay: .08s; }
.fu2 { animation-delay: .18s; }
.fu3 { animation-delay: .30s; }
.fu4 { animation-delay: .42s; }

@keyframes spin { to { transform: rotate(360deg); } }

/* ════ RESPONSIVE ════ */
@media(max-width:640px){
  .ct-inner { padding: 0 16px 80px; }
  .ct-hero { padding: 64px 0 48px; }
  .ct-form-inner { padding: 24px 20px; }
  .ct-stat { padding: 16px 18px; }
  .ct-stat-num { font-size: 1.5rem; }
  .ct-stats { border-radius: 16px; }
  .ct-faq-btn { padding: 18px 20px; }
  .ct-faq-a { padding: 0 20px 18px; padding-top: 14px; }
}
`;

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", inquiryType: "", orderId: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const faqs = [
    { q: "How can I track my order?",      a: "After placing an order you will receive a tracking ID via email. Use the order tracking page to check your shipment status in real time." },
    { q: "What is your return policy?",    a: "You can request a return within 7 days of delivery if the product is damaged or defective. Our team processes returns within 2–3 business days." },
    { q: "How long does shipping take?",   a: "Shipping usually takes 3–5 business days depending on your location. Express delivery options are available at checkout." },
    { q: "How can I contact support?",     a: "Use the form on this page or email us directly. We respond to every inquiry within 1–2 business days." },
    { q: "Are my payment details secure?", a: "Absolutely. All transactions are encrypted with industry-standard SSL. We never store raw card data on our servers." },
  ];

  useEffect(() => {
    const id = "ct-redesign-styles";
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
    if (!formData.inquiryType) e.inquiryType = "Please select inquiry type";
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
        body: JSON.stringify({ access_key: accessKey, ...formData, subject: "E-Commerce Inquiry", from_name: formData.name.trim() }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", inquiryType: "", orderId: "", message: "" });
        setErrors({});
      } else toast.error("Something went wrong. Try again.");
    } catch { toast.error("Submission failed. Check your network."); }
    finally { setIsSubmitting(false); }
  };

  const infoCards = [
    { icon: <FaEnvelope />,     lbl: "Email Us",       val: "eshopcustomerinfo@gmail.com" },
    { icon: <FaClock />,        lbl: "Response Time",  val: "Within 1–2 business days" },
    { icon: <FaUndo />,         lbl: "Easy Returns",   val: "7-day hassle-free returns" },
    { icon: <FaShippingFast />, lbl: "Fast Shipping",  val: "3–5 business days" },
  ];

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="ct-root">

        {/* layered background */}
        <div className="ct-bg">
          <div className="ct-bg-mesh" />
          <div className="ct-bg-grid" />
          <div className="ct-bg-stripe" />
          <div className="ct-bg-stripe ct-bg-stripe-2" />
        </div>

        <div className="ct-inner">

          {/* ══ HERO ══ */}
          <div className="ct-hero fu">
            <div className="ct-eyebrow">
              <span className="ct-eyebrow-dot" />
              Customer Support
            </div>

            <h1 className="ct-h1">
              We&rsquo;re Here<br /><em>to Help You</em>
            </h1>

            <p className="ct-hero-sub">
              Questions about your order, a product, or anything else — our team is always ready to assist.
            </p>

            <div className="ct-stats">
              {[
                { num: "< 2h", lbl: "Avg. Response" },
                { num: "99%",  lbl: "Satisfaction"  },
                { num: "24/7", lbl: "Live Support"  },
                { num: "10K+", lbl: "Happy Customers"},
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

            {/* ── Left: Map + Info Cards ── */}
            <div className="ct-map-col fu fu1">

              <div className="ct-map-frame">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.9316664188245!2d85.61682517655123!3d20.13223376978005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19ad20457753ef%3A0x8d2834dd8305ea76!2sEinstein%20Academy%20of%20Technology%20and%20Management!5e1!3m2!1sen!2sin!4v1761017897848!5m2!1sen!2sin"
                  loading="lazy"
                  title="Location Map"
                />
                <div className="ct-map-pin">
                  <FaMapMarkerAlt />
                  Einstein Academy Of Technology & Management, Odisha
                </div>
              </div>

              <div className="ct-info-grid">
                {infoCards.map(c => (
                  <div className="ct-info-card" key={c.lbl}>
                    <div className="ct-info-top">
                      <div className="ct-info-icon">{c.icon}</div>
                      <div className="ct-info-lbl">{c.lbl}</div>
                    </div>
                    <div className="ct-info-val">{c.val}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* ── Right: Contact Form ── */}
            <div className="ct-card ct-card-ruled ct-form-col fu fu2">
              <div className="ct-form-inner">

                <div className="ct-form-eyebrow">Get in Touch</div>
                <div className="ct-form-title">Send a Message</div>
                <p className="ct-form-sub">Fill in the details and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  <div className="ct-field-row">
                    <div className="ct-field">
                      <label className="ct-label">Full Name</label>
                      <div className="ct-wrap">
                        <FaUser className="ct-icon" />
                        <input
                          type="text" name="name" value={formData.name}
                          onChange={handleChange} placeholder="John Doe"
                          className={`ct-input${errors.name ? " ct-field-err" : ""}`}
                        />
                      </div>
                      {errors.name && <span className="ct-err">{errors.name}</span>}
                    </div>

                    <div className="ct-field">
                      <label className="ct-label">Email</label>
                      <div className="ct-wrap">
                        <FaEnvelope className="ct-icon" />
                        <input
                          type="email" name="email" value={formData.email}
                          onChange={handleChange} placeholder="john@example.com"
                          className={`ct-input${errors.email ? " ct-field-err" : ""}`}
                        />
                      </div>
                      {errors.email && <span className="ct-err">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label className="ct-label">Inquiry Type</label>
                    <select
                      name="inquiryType" value={formData.inquiryType}
                      onChange={handleChange}
                      className={`ct-select${errors.inquiryType ? " ct-field-err" : ""}`}
                    >
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
                      <input
                        type="text" name="orderId" value={formData.orderId}
                        onChange={handleChange} placeholder="#123456"
                        className={`ct-input${errors.orderId ? " ct-field-err" : ""}`}
                        style={{ paddingLeft: 14 }}
                      />
                      {errors.orderId && <span className="ct-err">{errors.orderId}</span>}
                    </div>
                  )}

                  <div className="ct-field">
                    <label className="ct-label">Message</label>
                    <textarea
                      name="message" value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your issue or question in detail…"
                      className={`ct-textarea${errors.message ? " ct-field-err" : ""}`}
                    />
                    {errors.message && <span className="ct-err">{errors.message}</span>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="ct-submit">
                    {isSubmitting ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5"
                          style={{ animation: "spin 1s linear infinite" }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <><IoIosSend size={18} /> Submit Request</>
                    )}
                  </button>

                  <p className="ct-note">
                    <span className="ct-note-line" />
                    <FaShieldAlt className="ct-note-icon" size={11} />
                    Responds within 1–2 business days
                    <span className="ct-note-line" />
                  </p>

                </form>
              </div>
            </div>

          </div>

          {/* ══ DIVIDER ══ */}
          <div className="ct-divider fu fu3">
            <div className="ct-divider-line" />
            <div className="ct-divider-badge">
              <div className="ct-divider-icon">
                <MdSupportAgent size={15} />
              </div>
              Frequently Asked Questions
            </div>
            <div className="ct-divider-line" />
          </div>

          {/* ══ FAQ ══ */}
          <div className="fu fu4">
            <div className="ct-faq-head">
              <h2 className="ct-faq-title">Got a <span>Question?</span></h2>
              <p className="ct-faq-sub">We've answered the most common ones below.</p>
            </div>

            <div className="ct-faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`ct-faq-item${openFAQ === i ? " open" : ""}`}>
                  <button
                    className="ct-faq-btn"
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  >
                    <span className="ct-faq-q">{faq.q}</span>
                    <span className="ct-faq-chevron">
                      <FaChevronDown size={11} />
                    </span>
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

      <Footer />
    </>
  );
}