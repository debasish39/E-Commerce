import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../assets/success.json";
import successmusic from "../assets/successmusic.mp3";
/* ── injected styles ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

.os-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: transparent;
  position: relative;
  overflow: hidden;
}

/* ── confetti particle ── */
.os-confetti {
  position: absolute;
  width: 8px; height: 8px;
  border-radius: 2px;
  opacity: 0;
  animation: osFall var(--dur) ease-in var(--delay) forwards;
  pointer-events: none;
  z-index: 0;
}
@keyframes osFall {
  0%   { opacity: 1; transform: translateY(-60px) rotate(0deg) scale(1); }
  80%  { opacity: .8; }
  100% { opacity: 0; transform: translateY(420px) rotate(720deg) scale(.5); }
}

/* ── card ── */
.os-card {
  position: relative; z-index: 1;
  border-radius: 28px;
  padding: 44px 36px 40px;
  max-width: 440px; width: 100%;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  animation: osCardIn .65s cubic-bezier(.22,1,.36,1) both;
}
@keyframes osCardIn {
  from { opacity:0; transform:translateY(32px) scale(.96); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}

/* glow ring behind card */
.os-card::before {
  content: '';
  position: absolute; inset: -2px;
  border-radius: 30px;
  z-index: -1;
  filter: blur(4px);
}

/* ── lottie wrap ── */
.os-lottie {
  width: 180px; height: 180px;
  animation: osLottieIn .5s cubic-bezier(.22,1,.36,1) .15s both;
}
@keyframes osLottieIn {
  from { opacity:0; transform:scale(.7); }
  to   { opacity:1; transform:scale(1); }
}

/* ── badge ── */
.os-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg,rgba(99,102,241,.12),rgba(59,130,246,.10));
  border: 1px solid rgba(199,210,254,.8);
  border-radius: 100px;
  padding: 5px 16px;
  font-size: 11px; font-weight: 700;
  letter-spacing: .10em; text-transform: uppercase;
  color: #4f46e5;
  margin-bottom: 14px;
  animation: osFadeUp .5s ease .3s both;
}
.os-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #4f46e5;
  animation: osPulse 1.8s ease-in-out infinite;
}
@keyframes osPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.6)} }

/* ── heading ── */
.os-h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.6rem, 5vw, 2.1rem);
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  letter-spacing: -.02em;
  margin-bottom: 10px;
  animation: osFadeUp .5s ease .4s both;
}
.os-h1 span {
  background: linear-gradient(135deg,#4f46e5,#2563eb);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* ── sub text ── */
.os-sub {
  font-size: .95rem; color: #64748b;
  line-height: 1.6; max-width: 320px;
  margin-bottom: 28px;
  animation: osFadeUp .5s ease .5s both;
}
.os-sub strong { color: #4f46e5; font-weight: 700; }

/* ── delivery info strip ── */
.os-strip {
  display: flex; align-items: center; gap: 0;
  width: 100%;
  // background: rgba(238,242,255,0.7);
  border: 1px solid rgba(199,210,254,.6);
  border-radius: 16px;
  padding: 14px 0;
  margin-bottom: 28px;
  animation: osFadeUp .5s ease .55s both;
}
.os-strip-item {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 0 12px;
  border-right: 1px solid rgba(199,210,254,.6);
}
.os-strip-item:last-child { border-right: none; }
.os-strip-icon { font-size: 18px; }
.os-strip-label { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing:.06em; }
.os-strip-val   { font-size: 12.5px; font-weight: 700; color: #334155; }

/* ── progress tracker ── */
.os-tracker {
  width: 100%; margin-bottom: 28px;
  animation: osFadeUp .5s ease .6s both;
}
.os-tracker-steps {
  display: flex; align-items: center; justify-content: space-between;
  position: relative;
}
.os-tracker-line {
  position: absolute; top: 14px; left: 14px; right: 14px; height: 3px;
  background: #e2e8f0; border-radius: 2px; z-index: 0;
}
.os-tracker-fill {
  position: absolute; top: 14px; left: 14px; height: 3px;
  background: linear-gradient(90deg,#4f46e5,#2563eb);
  border-radius: 2px; z-index: 1;
  animation: osFillBar 1.4s cubic-bezier(.22,1,.36,1) .8s both;
  width: 0;
}
@keyframes osFillBar { to { width: calc(33.33% - 0px); } }

.os-step {
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  position: relative; z-index: 2; flex: 1;
}
.os-step-circle {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px;
  transition: all .3s;
}
.os-step.done .os-step-circle {
  background: linear-gradient(135deg,#4f46e5,#2563eb);
  color: white;
  box-shadow: 0 3px 12px rgba(79,70,229,0.35);
  animation: osBounce .4s cubic-bezier(.34,1.6,.64,1) var(--delay) both;
}
@keyframes osBounce {
  from { transform:scale(0); opacity:0; }
  to   { transform:scale(1); opacity:1; }
}
.os-step.active .os-step-circle {
  background: white;
  border: 2.5px solid #4f46e5;
  color: #4f46e5;
}
.os-step.pending .os-step-circle {
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  color: #94a3b8;
}
.os-step-label { font-size: 10.5px; font-weight: 600; color: #64748b; white-space: nowrap; }
.os-step.done .os-step-label,
.os-step.active .os-step-label { color: #4f46e5; }

/* ── CTAs ── */
.os-ctas {
  display: flex; gap: 10px; width: 100%; flex-wrap: wrap;
  animation: osFadeUp .5s ease .7s both;
}
.os-btn-primary {
  flex: 1; min-width: 140px;
  padding: 14px 20px; border: none; border-radius: 13px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 700; color: white; cursor: pointer;
  background: linear-gradient(135deg,#4f46e5,#2563eb);
  box-shadow: 0 4px 20px rgba(79,70,229,0.32);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: transform .18s, box-shadow .18s, filter .18s;
  position: relative; overflow: hidden;
}
.os-btn-primary::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);
  background-size:200% 100%; animation:osShim 2.6s ease-in-out infinite;
}
@keyframes osShim { 0%{background-position:-200% center} 100%{background-position:200% center} }
.os-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(79,70,229,.44); filter:brightness(1.06); }
.os-btn-primary:active { transform:scale(.97); }

.os-btn-secondary {
  flex: 1; min-width: 120px;
  padding: 13px 20px; border-radius: 13px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 700; color: #4f46e5; cursor: pointer;
  background: rgba(238,242,255,0.8);
  border: 1.5px solid rgba(199,210,254,.8);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: transform .18s, box-shadow .18s, background .18s;
  backdrop-filter: blur(8px);
}
.os-btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(224,231,255,0.9);
  box-shadow: 0 6px 20px rgba(79,70,229,.12);
}
.os-btn-secondary:active { transform:scale(.97); }

/* ── footnote ── */
.os-foot {
  margin-top: 18px;
  font-size: 11.5px; color: #94a3b8;
  display: flex; align-items: center; gap: 6px;
  animation: osFadeUp .5s ease .75s both;
}
.os-foot::before, .os-foot::after {
  content:''; flex:1; height:1px; background:rgba(199,210,254,.5);
}

@keyframes osFadeUp {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}

@media(max-width:440px){
  .os-card { padding:32px 20px 28px; border-radius:22px; }
  .os-ctas { flex-direction:column; }
  .os-strip-val { font-size:11.5px; }
}
`;

/* confetti colours matching app theme */
const CONFETTI_COLORS = [
  "#4f46e5", "#6366f1", "#2563eb", "#60a5fa",
  "#a5b4fc", "#c7d2fe", "#fb923c", "#fde68a",
];

const STEPS = [
  { icon: "✅", label: "Confirmed", state: "done", delay: ".85s" },
  { icon: "📦", label: "Packing", state: "active", delay: "1s" },
  { icon: "🚚", label: "Shipping", state: "pending", delay: "" },
  { icon: "🏠", label: "Delivered", state: "pending", delay: "" },
];

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);

  /* inject styles once */
  useEffect(() => {
    const id = "os-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);
  useEffect(() => {
    const audio = new Audio(successmusic);

    audio.volume = 0.7;

    audio.play().catch((err) => {
      console.log("Audio autoplay blocked:", err);
    });

  }, []);
  /* spawn confetti */
  useEffect(() => {
    const pieces = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: `${Math.random() * 100}%`,
      dur: `${1.2 + Math.random() * 1.8}s`,
      delay: `${Math.random() * 0.8}s`,
      size: `${6 + Math.random() * 6}px`,
      borderRadius: Math.random() > .5 ? "50%" : "2px",
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="os-root">
      {/* confetti */}
      {confetti.map(p => (
        <div
          key={p.id}
          className="os-confetti"
          style={{
            left: p.left,
            top: "-20px",
            width: p.size, height: p.size,
            borderRadius: p.borderRadius,
            "--dur": p.dur,
            "--delay": p.delay,
          }}
        />
      ))}

      {/* ── CARD ── */}
      <div className="os-card">

        {/* Lottie */}
        <div className="os-lottie">
          <Lottie animationData={successAnimation} autoplay loop={false} />
        </div>

        {/* Badge */}
        <div className="os-badge">
          <span className="os-badge-dot" /> Order Confirmed
        </div>

        {/* Heading */}
        <h1 className="os-h1">
          <span>Thank you</span> for your order! 🎉
        </h1>

        {/* Sub */}
        <p className="os-sub">
          Your order has been placed and will be delivered within{" "}
          <strong>5–7 business days</strong>. We'll send you a tracking link via email.
        </p>

        {/* Info strip */}
        <div className="os-strip">
          {[
            { icon: "📦", label: "Estimated", val: "5–7 Days" },
            { icon: "🔒", label: "Payment", val: "Secured" },
            { icon: "↩️", label: "Returns", val: "10 Days" },
          ].map(s => (
            <div className="os-strip-item" key={s.label}>
              <span className="os-strip-icon">{s.icon}</span>
              <span className="os-strip-label">{s.label}</span>
              <span className="os-strip-val">{s.val}</span>
            </div>
          ))}
        </div>

        {/* Progress tracker */}
        <div className="os-tracker">
          <div className="os-tracker-steps">
            <div className="os-tracker-line" />
            <div className="os-tracker-fill" />
            {STEPS.map(s => (
              <div key={s.label} className={`os-step ${s.state}`}>
                <div
                  className="os-step-circle"
                  style={s.state === "done" ? { "--delay": s.delay } : {}}
                >
                  {s.icon}
                </div>
                <span className="os-step-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="os-ctas">
          <button className="os-btn-primary" onClick={() => navigate("/products")}>
            🛍️ Continue
          </button>
          <button className="os-btn-secondary" onClick={() => navigate("/order-history")}>
            📋 View Orders
          </button>
        </div>

        {/* Footnote */}
        <p className="os-foot">
          Need help? <span
            onClick={() => navigate("/contact")}
            style={{ color: "#4f46e5", fontWeight: 700, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }}
          >Contact Support</span>
        </p>
      </div>
    </div>
  );
}