import React, { useEffect, useState } from "react";

const LOADING_STEPS = [
  "Preparing your shopping experience",
  "Discovering products for you",
  "Finding the best deals",
  "Almost ready to shop",
];

const CSS = `
* { box-sizing: border-box; }

.odk-app-loader {
  position: fixed;
  inset: 0;
  z-index: 999999;
  width: 100%;
  height: 100dvh;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:
    max(24px, env(safe-area-inset-top))
    max(18px, env(safe-area-inset-right))
    max(24px, env(safe-area-inset-bottom))
    max(18px, env(safe-area-inset-left));
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #0f172a;
  background:
    radial-gradient(circle at 50% 36%, rgba(99,102,241,.075), transparent 34%),
    linear-gradient(180deg, #fff 0%, #fafbff 52%, #f7f8fc 100%);
}

.odk-app-loader::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.45) 48%, transparent 58%);
  transform: translateX(-120%);
  animation: odkScreenSheen 7s ease-in-out infinite;
}

@keyframes odkScreenSheen {
  0%,65%,100% { transform: translateX(-120%); }
  80% { transform: translateX(120%); }
}

.odk-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.odk-bg-glow {
  position: absolute;
  left: 50%;
  top: 40%;
  width: min(82vw,390px);
  aspect-ratio: 1;
  transform: translate(-50%,-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,.11), rgba(99,102,241,.035) 42%, transparent 72%);
  filter: blur(14px);
  animation: odkAmbientGlow 4.5s ease-in-out infinite;
}

@keyframes odkAmbientGlow {
  0%,100% { transform: translate(-50%,-50%) scale(.9); opacity:.55; }
  50% { transform: translate(-50%,-50%) scale(1.08); opacity:1; }
}

.odk-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(3px);
  opacity: .55;
  animation: odkOrbFloat 8s ease-in-out infinite;
}

.odk-orb-1 {
  width:130px; height:130px; left:-58px; top:10%;
  background:radial-gradient(circle,rgba(129,140,248,.13),transparent 70%);
}
.odk-orb-2 {
  width:165px; height:165px; right:-72px; bottom:8%;
  background:radial-gradient(circle,rgba(59,130,246,.10),transparent 70%);
  animation-delay:-2s;
}
.odk-orb-3 {
  width:92px; height:92px; right:8%; top:15%;
  background:radial-gradient(circle,rgba(139,92,246,.075),transparent 70%);
  animation-delay:-4s;
}

@keyframes odkOrbFloat {
  0%,100% { transform:translate3d(0,0,0); }
  50% { transform:translate3d(0,-16px,0); }
}

.odk-loader-content {
  position:relative;
  z-index:2;
  width:min(100%,380px);
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  animation:odkContentEnter .7s cubic-bezier(.22,1,.36,1);
}

@keyframes odkContentEnter {
  from { opacity:0; transform:translateY(18px) scale(.975); }
  to { opacity:1; transform:translateY(0) scale(1); }
}

.odk-logo-area {
  position:relative;
  width:104px;
  height:104px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.odk-logo-glow {
  position:absolute;
  inset:10px;
  border-radius:30px;
  background:linear-gradient(135deg,#6366f1,#8b5cf6,#2563eb);
  filter:blur(25px);
  opacity:.16;
  animation:odkLogoGlow 3s ease-in-out infinite;
}

@keyframes odkLogoGlow {
  0%,100% { transform:scale(.88); opacity:.11; }
  50% { transform:scale(1.08); opacity:.25; }
}

.odk-logo-border {
  position:absolute;
  inset:0;
  padding:2px;
  border-radius:30px;
  background:conic-gradient(from 0deg,#6366f1,#8b5cf6,#3b82f6,#06b6d4,#6366f1);
  animation:odkLogoRotate 5s linear infinite;
}

.odk-logo-border-inner {
  width:100%;
  height:100%;
  border-radius:28px;
  background:#fff;
}

@keyframes odkLogoRotate { to { transform:rotate(360deg); } }

.odk-logo-card {
  position:absolute;
  inset:9px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  border-radius:24px;
  background:rgba(255,255,255,.98);
  box-shadow:0 22px 48px rgba(15,23,42,.09),0 5px 14px rgba(15,23,42,.055);
  animation:odkLogoFloat 3.2s ease-in-out infinite;
}

.odk-logo-card::after {
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  background:linear-gradient(135deg,rgba(255,255,255,.7),transparent 48%,rgba(99,102,241,.025));
  pointer-events:none;
}

.odk-logo-card img {
  position:relative;
  z-index:2;
  width:66px;
  height:66px;
  object-fit:contain;
  border-radius:16px;
}

.odk-logo-fallback {
  display:none;
  position:relative;
  z-index:2;
  color:#4f46e5;
  font-size:32px;
  font-weight:850;
  letter-spacing:-1px;
}

@keyframes odkLogoFloat {
  0%,100% { transform:translateY(0); }
  50% { transform:translateY(-5px); }
}

.odk-brand { margin-top:23px; }

.odk-title {
  margin:0;
  color:#111827;
  font-size:clamp(26px,7vw,31px);
  line-height:1.05;
  font-weight:850;
  letter-spacing:-1.55px;
}

.odk-title span {
  background:linear-gradient(90deg,#4f46e5,#7c3aed,#2563eb);
  background-clip:text;
  -webkit-background-clip:text;
  color:transparent;
  -webkit-text-fill-color:transparent;
}

.odk-tagline {
  margin:9px 0 0;
  color:#94a3b8;
  font-size:11px;
  line-height:1.45;
  font-weight:550;
}

.odk-status {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  margin-top:25px;
  color:#64748b;
  font-size:10px;
  line-height:1.4;
  font-weight:650;
}

.odk-status-dot {
  width:7px;
  height:7px;
  flex:0 0 auto;
  border-radius:50%;
  background:#22c55e;
  box-shadow:0 0 0 4px rgba(34,197,94,.08);
  animation:odkStatusPulse 1.5s ease-in-out infinite;
}

@keyframes odkStatusPulse {
  0%,100% { transform:scale(.82); opacity:.55; }
  50% { transform:scale(1); opacity:1; }
}

.odk-shopping {
  position:relative;
  width:190px;
  height:76px;
  margin-top:10px;
}

.odk-road {
  position:absolute;
  left:9px;
  right:9px;
  bottom:17px;
  height:2px;
  overflow:hidden;
  border-radius:999px;
  background:#e9edff;
}

.odk-road::after {
  content:"";
  position:absolute;
  top:0;
  left:-60px;
  width:60px;
  height:100%;
  background:linear-gradient(90deg,transparent,rgba(99,102,241,.35),transparent);
  animation:odkRoadShine 1.8s linear infinite;
}

@keyframes odkRoadShine {
  from { left:-60px; } to { left:110%; }
}

.odk-cart {
  position:absolute;
  left:5px;
  bottom:12px;
  width:43px;
  height:29px;
  border-radius:7px 7px 11px 11px;
  background:linear-gradient(135deg,#6366f1,#4f46e5);
  box-shadow:0 8px 20px rgba(79,70,229,.22);
  animation:odkCartTravel 2.8s cubic-bezier(.65,0,.35,1) infinite;
}

.odk-cart::before {
  content:"";
  position:absolute;
  left:-9px;
  top:-8px;
  width:17px;
  height:14px;
  border-left:3px solid #4f46e5;
  border-top:3px solid #4f46e5;
  border-radius:5px 0 0 0;
  transform:rotate(-8deg);
}

.odk-cart::after {
  content:"";
  position:absolute;
  left:7px;
  top:7px;
  width:29px;
  height:2px;
  border-radius:99px;
  background:rgba(255,255,255,.45);
}

.odk-wheel {
  position:absolute;
  bottom:-6px;
  width:9px;
  height:9px;
  border-radius:50%;
  background:#1e1b4b;
  border:2px solid #fff;
}
.odk-wheel-left { left:7px; }
.odk-wheel-right { right:7px; }

@keyframes odkCartTravel {
  0% { left:5px; opacity:0; transform:scale(.82); }
  12% { opacity:1; }
  70% { left:125px; opacity:1; transform:scale(1); }
  88% { left:145px; opacity:0; transform:scale(.88); }
  100% { left:145px; opacity:0; }
}

.odk-product {
  position:absolute;
  bottom:40px;
  width:25px;
  height:25px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:1px solid rgba(255,255,255,.9);
  border-radius:8px;
  background:rgba(255,255,255,.94);
  box-shadow:0 7px 18px rgba(15,23,42,.065);
  font-size:12px;
  opacity:0;
  animation:odkProductMove 2.8s cubic-bezier(.65,0,.35,1) infinite;
}
.odk-product-1 { left:45px; animation-delay:.15s; }
.odk-product-2 { left:73px; animation-delay:.52s; }
.odk-product-3 { left:101px; animation-delay:.89s; }

@keyframes odkProductMove {
  0% { opacity:0; transform:translateY(10px) scale(.65); }
  15% { opacity:1; transform:translateY(0) scale(1); }
  65% { opacity:1; transform:translateY(0) scale(1); }
  80% { opacity:0; transform:translateY(10px) scale(.7); }
  100% { opacity:0; }
}

.odk-message {
  width:100%;
  min-height:21px;
  margin-top:1px;
}

.odk-message-text {
  margin:0;
  color:#475569;
  font-size:11px;
  line-height:1.4;
  font-weight:650;
  animation:odkMessageIn .4s ease;
}

@keyframes odkMessageIn {
  from { opacity:0; transform:translateY(5px); }
  to { opacity:1; transform:translateY(0); }
}

.odk-progress-section {
  width:100%;
  margin-top:18px;
}

.odk-progress-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:8px;
}

.odk-progress-label {
  color:#94a3b8;
  font-size:8px;
  font-weight:750;
  letter-spacing:.08em;
  text-transform:uppercase;
}

.odk-progress-value {
  color:#4f46e5;
  font-size:9px;
  font-weight:850;
  font-variant-numeric:tabular-nums;
}

.odk-progress-track {
  position:relative;
  width:100%;
  height:5px;
  overflow:hidden;
  border-radius:999px;
  background:#ecefff;
}

.odk-progress-bar {
  position:relative;
  height:100%;
  border-radius:inherit;
  background:linear-gradient(90deg,#6366f1,#7c3aed,#2563eb);
  box-shadow:0 0 15px rgba(99,102,241,.24);
  transition:width .25s cubic-bezier(.22,1,.36,1);
}

.odk-progress-shine {
  position:absolute;
  inset-block:0;
  left:-60px;
  width:55px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);
  animation:odkProgressShine 1.25s linear infinite;
}

@keyframes odkProgressShine {
  from { left:-60px; } to { left:110%; }
}

.odk-trust {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:15px;
  margin-top:16px;
}

.odk-trust-item {
  display:flex;
  align-items:center;
  gap:5px;
  color:#a1aab8;
  font-size:8px;
  font-weight:750;
}

.odk-trust-icon { font-size:9px; }

.odk-dots {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:5px;
  margin-top:15px;
}

.odk-dot {
  width:5px;
  height:5px;
  border-radius:50%;
  background:#cbd5e1;
  animation:odkDot 1.2s ease-in-out infinite;
}

.odk-dot:nth-child(2) { animation-delay:.15s; }
.odk-dot:nth-child(3) { animation-delay:.3s; }

@keyframes odkDot {
  0%,60%,100% { transform:translateY(0); opacity:.35; }
  30% { transform:translateY(-4px); opacity:1; background:#6366f1; }
}

.odk-footer {
  margin:14px 0 0;
  color:#c0c6d0;
  font-size:7px;
  line-height:1.4;
  font-weight:750;
  letter-spacing:.14em;
  text-transform:uppercase;
}

@media (max-width:600px) {
  .odk-loader-content { width:min(100%,350px); }
  .odk-logo-area { width:92px; height:92px; }
  .odk-logo-card { inset:8px; border-radius:22px; }
  .odk-logo-border { border-radius:27px; }
  .odk-logo-border-inner { border-radius:25px; }
  .odk-logo-card img { width:59px; height:59px; }
  .odk-brand { margin-top:20px; }
  .odk-status { margin-top:22px; }
  .odk-trust { gap:11px; }
}

@media (max-width:380px) {
  .odk-app-loader { padding-left:14px; padding-right:14px; }
  .odk-loader-content { width:min(100%,330px); }
  .odk-logo-area { width:82px; height:82px; }
  .odk-logo-card { inset:7px; border-radius:20px; }
  .odk-logo-card img { width:53px; height:53px; }
  .odk-brand { margin-top:18px; }
  .odk-title { font-size:24px; }
  .odk-tagline { font-size:9px; }
  .odk-status { margin-top:20px; font-size:9px; }
  .odk-trust { gap:8px; }
  .odk-trust-item { font-size:7px; }
}

@media (max-height:680px) {
  .odk-logo-area {
    transform:scale(.84);
    margin-bottom:-10px;
  }
  .odk-brand { margin-top:10px; }
  .odk-status { margin-top:15px; }
  .odk-shopping {
    margin-top:4px;
    transform:scale(.88);
    margin-bottom:-6px;
  }
  .odk-progress-section { margin-top:10px; }
  .odk-trust { margin-top:10px; }
  .odk-dots,.odk-footer { margin-top:9px; }
}

@media (prefers-reduced-motion:reduce) {
  .odk-app-loader *,
  .odk-app-loader *::before,
  .odk-app-loader *::after {
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
    scroll-behavior:auto !important;
  }
}
`;

export default function ModernAppLoader() {
  const [progress, setProgress] = useState(8);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 94) return 94;
        if (current < 30) return Math.min(current + 3, 94);
        if (current < 65) return Math.min(current + 2, 94);
        return Math.min(current + 1, 94);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => (current + 1) % LOADING_STEPS.length);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <div
        className="odk-app-loader"
        role="status"
        aria-live="polite"
        aria-label="Loading Odikart"
      >
        <div className="odk-bg" aria-hidden="true">
          <div className="odk-bg-glow" />
          <div className="odk-orb odk-orb-1" />
          <div className="odk-orb odk-orb-2" />
          <div className="odk-orb odk-orb-3" />
        </div>

        <main className="odk-loader-content">
          <div className="odk-logo-area" aria-hidden="true">
            <div className="odk-logo-glow" />
            <div className="odk-logo-border">
              <div className="odk-logo-border-inner" />
            </div>

            <div className="odk-logo-card">
              <img
                src="/logo.png"
                alt="Odikart"
                draggable="false"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  const fallback = event.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <span className="odk-logo-fallback">O</span>
            </div>
          </div>

          <div className="odk-brand">
            <h1 className="odk-title">
              Welcome to <span>Odikart</span>
            </h1>
            <p className="odk-tagline">
              Everything you love. One place to shop.
            </p>
          </div>

          <div className="odk-status">
            <span className="odk-status-dot" />
            <span>Your shopping experience is loading</span>
          </div>

          <div className="odk-shopping" aria-hidden="true">
            <div className="odk-road" />
            <div className="odk-product odk-product-1">👟</div>
            <div className="odk-product odk-product-2">⌚</div>
            <div className="odk-product odk-product-3">🎧</div>
            <div className="odk-cart">
              <span className="odk-wheel odk-wheel-left" />
              <span className="odk-wheel odk-wheel-right" />
            </div>
          </div>

          <div className="odk-message">
            <p key={step} className="odk-message-text">
              {LOADING_STEPS[step]}
            </p>
          </div>

          <div className="odk-progress-section">
            <div className="odk-progress-header">
              <span className="odk-progress-label">Loading store</span>
              <span className="odk-progress-value">{progress}%</span>
            </div>

            <div
              className="odk-progress-track"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progress}
              aria-label="Loading store"
            >
              <div
                className="odk-progress-bar"
                style={{ width: `${progress}%` }}
              >
                <div className="odk-progress-shine" />
              </div>
            </div>
          </div>

          <div className="odk-trust" aria-label="Odikart benefits">
            <div className="odk-trust-item">
              <span className="odk-trust-icon">🔒</span>
              <span>Secure</span>
            </div>
            <div className="odk-trust-item">
              <span className="odk-trust-icon">⚡</span>
              <span>Fast</span>
            </div>
            <div className="odk-trust-item">
              <span className="odk-trust-icon">💙</span>
              <span>Trusted</span>
            </div>
          </div>

          <div className="odk-dots" aria-hidden="true">
            <span className="odk-dot" />
            <span className="odk-dot" />
            <span className="odk-dot" />
          </div>

          <p className="odk-footer">
            Your everyday shopping destination
          </p>
        </main>
      </div>
    </>
  );
}
