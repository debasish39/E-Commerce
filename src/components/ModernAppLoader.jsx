import React, { useEffect, useRef, useState } from "react";

/* =========================================================
   ODIKART — SPLASH
   One deliberate reveal. Quiet color, honest progress,
   a small rotating status line for a touch of life.

   Design tokens
   - Ink:     #150934  (primary text)
   - Slate:   #6B6580  (secondary text)
   - Indigo:  #4F46E5  (primary brand)
   - Violet:  #7C3AED  (secondary brand)
   - Blue:    #2563EB  (accent)
   - Paper:   #FFFFFF  (base)
========================================================= */

const CSS = `
.odk-root, .odk-root * { box-sizing: border-box; }

.odk-root {
  position: fixed;
  inset: 0;
  z-index: 999999;

  width: 100%;
  height: 100dvh;
  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  isolation: isolate;

  background: #ffffff;

  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;

  animation: odkRootIn 500ms cubic-bezier(.22,1,.36,1) both;
}

.odk-root.is-exiting {
  pointer-events: none;
  animation: odkRootOut 560ms cubic-bezier(.4,0,.2,1) forwards;
}

/* ---------------------------------------------------------
   Background — layered mesh gradient.
   A faint dot grid for structure, three color blobs that
   drift independently (not one gradient pulsing in place),
   a center veil to keep the mark legible, and a fine grain
   layer so the surface reads as tactile, not flat CSS.
--------------------------------------------------------- */

.odk-grid {
  position: absolute;
  inset: 0;
  z-index: -5;

  background-image: radial-gradient(circle, rgba(79,70,229,.14) 1px, transparent 1px);
  background-size: 26px 26px;

  mask-image: radial-gradient(circle at 50% 42%, black 0%, transparent 68%);
  -webkit-mask-image: radial-gradient(circle at 50% 42%, black 0%, transparent 68%);

  opacity: .55;
}

.odk-mesh {
  position: absolute;
  inset: 0;
  z-index: -4;
  overflow: hidden;
  background: #ffffff;
}

.odk-mesh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  will-change: transform;
}

.odk-mesh-blob-a {
  width: 46vmax;
  height: 46vmax;
  right: -16vmax;
  top: -18vmax;
  background: radial-gradient(circle, rgba(124,58,237,.40), transparent 68%);
  animation: odkBlobA 16s ease-in-out infinite;
}

.odk-mesh-blob-b {
  width: 42vmax;
  height: 42vmax;
  left: -14vmax;
  bottom: -16vmax;
  background: radial-gradient(circle, rgba(37,99,235,.36), transparent 68%);
  animation: odkBlobB 19s ease-in-out infinite;
}

.odk-mesh-blob-c {
  width: 30vmax;
  height: 30vmax;
  left: 50%;
  top: 62%;
  background: radial-gradient(circle, rgba(79,70,229,.20), transparent 70%);
  animation: odkBlobC 13s ease-in-out infinite;
}

.odk-wash-veil {
  position: absolute;
  inset: 0;
  z-index: -3;
  background: radial-gradient(circle at 50% 44%, rgba(255,255,255,.86) 0%, rgba(255,255,255,.35) 40%, rgba(255,255,255,0) 66%);
}

.odk-grain {
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: .05;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ---------------------------------------------------------
   Floating bubbles — modern glassmorphism.
   Real refraction (backdrop-filter) + a highlight and a
   colored aura, at varied sizes/speeds so the field reads
   as depth rather than one shape repeated.
--------------------------------------------------------- */

.odk-bubbles {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.odk-bubble {
  position: absolute;
  border-radius: 50%;

  background: linear-gradient(155deg,
    rgba(255,255,255,.55) 0%,
    rgba(124,58,237,.16) 45%,
    rgba(37,99,235,.14) 100%);

  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);

  border: 1px solid rgba(255,255,255,.60);
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,.65),
    inset 0 -6px 10px rgba(79,70,229,.10),
    0 12px 26px rgba(79,70,229,.12);

  opacity: 0;
  animation: odkBubbleIn 900ms ease-out forwards, odkBubbleFloat 9s ease-in-out infinite;
}

/* specular highlight — the glint that reads as "glass" */
.odk-bubble::before {
  content: "";
  position: absolute;
  width: 32%;
  height: 32%;
  top: 14%;
  left: 18%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,.10) 70%, transparent);
  filter: blur(.5px);
}

/* thin rim light along the lower edge */
.odk-bubble::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 -1px 2px rgba(124,58,237,.20);
  pointer-events: none;
}

.odk-bubble-1 { width: 66px; height: 66px; left: 8%;   top: 17%;    --op: .60; animation-duration: 10s;   animation-delay: 260ms, 1.1s; }
.odk-bubble-2 { width: 30px; height: 30px; left: 16%;  bottom: 20%; --op: .46; animation-duration: 7.2s;  animation-delay: 420ms, .4s; }
.odk-bubble-3 { width: 82px; height: 82px; right: 7%;  top: 19%;    --op: .42; animation-duration: 12.5s; animation-delay: 340ms, 1.8s; }
.odk-bubble-4 { width: 42px; height: 42px; right: 15%; bottom: 17%; --op: .50; animation-duration: 8.4s;  animation-delay: 500ms, .8s; }
.odk-bubble-5 { width: 20px; height: 20px; left: 28%;  top: 9%;     --op: .55; animation-duration: 6.2s;  animation-delay: 620ms, 2.1s; }
.odk-bubble-6 { width: 24px; height: 24px; right: 27%; bottom: 9%;  --op: .48; animation-duration: 7.6s;  animation-delay: 760ms, .2s; }
.odk-bubble-7 { width: 48px; height: 48px; left: 3%;   bottom: 40%; --op: .34; animation-duration: 11.3s; animation-delay: 880ms, 1.4s; }
.odk-bubble-8 { width: 36px; height: 36px; right: 2%;  top: 45%;    --op: .36; animation-duration: 9.7s;  animation-delay: 1020ms, .9s; }

.odk-spark {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED, #2563EB);
  box-shadow: 0 0 10px rgba(99,102,241,.55);
  opacity: 0;
  animation: odkSparkIn 700ms ease-out forwards, odkSparkFloat 5s ease-in-out infinite;
}

.odk-spark-1 { left: 24%; top: 32%; animation-delay: 700ms, 1.4s; }
.odk-spark-2 { right: 22%; bottom: 34%; animation-delay: 900ms, .6s; }
.odk-spark-3 { left: 40%; bottom: 14%; animation-delay: 1100ms, 1.9s; }

/* ---------------------------------------------------------
   Corner brackets — one shape, mirrored into all four
   corners. Reads as a focusing/viewfinder frame rather than
   pure decoration; fits a "finding your items" splash.
--------------------------------------------------------- */

.odk-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  opacity: 0;
  filter: drop-shadow(0 2px 6px rgba(79,70,229,.14));
  animation: odkCornerIn 700ms ease-out forwards, odkCornerPulse 4.2s ease-in-out infinite;
}

.odk-corner::before,
.odk-corner::after {
  content: "";
  position: absolute;
  background: linear-gradient(135deg, rgba(124,58,237,.55), rgba(37,99,235,.50));
  border-radius: 999px;
}

.odk-corner::before { top: 0; left: 0; width: 2.5px; height: 100%; }
.odk-corner::after  { top: 0; left: 0; width: 100%; height: 2.5px; }

.odk-corner-tl {
  top: calc(30px + env(safe-area-inset-top, 0px));
  left: 26px;
  animation-delay: 480ms, 1.6s;
}

.odk-corner-tr {
  top: calc(30px + env(safe-area-inset-top, 0px));
  right: 26px;
  transform: scaleX(-1);
  animation-delay: 600ms, 2s;
}

.odk-corner-bl {
  bottom: calc(30px + env(safe-area-inset-bottom, 0px));
  left: 26px;
  transform: scaleY(-1);
  animation-delay: 720ms, 1.2s;
}

.odk-corner-br {
  bottom: calc(30px + env(safe-area-inset-bottom, 0px));
  right: 26px;
  transform: scale(-1, -1);
  animation-delay: 840ms, 2.4s;
}

/* ---------------------------------------------------------
   Stage
--------------------------------------------------------- */

.odk-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* ---- Fallback icon mark (no logo asset available) ---- */

.odk-mark-wrap {
  position: relative;
  width: 116px;
  height: 116px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.odk-mark-glow {
  position: absolute;
  inset: -26px;
  border-radius: 40px;
  background: radial-gradient(circle, rgba(79,70,229,.20), transparent 70%);
  filter: blur(18px);
  opacity: 0;
  animation: odkGlowIn 900ms 260ms cubic-bezier(.22,1,.36,1) forwards,
             odkGlowBreathe 3.2s 1.2s ease-in-out infinite;
}

.odk-mark-ring {
  position: absolute;
  inset: -14px;
  border-radius: 32px;
  border: 1px solid rgba(79,70,229,.18);
  opacity: 0;
  transform: scale(.9);
  animation: odkRingIn 700ms 180ms cubic-bezier(.22,1,.36,1) forwards;
}

.odk-mark {
  position: relative;
  width: 116px;
  height: 116px;
  border-radius: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(155deg, #4F46E5 0%, #6D28D9 55%, #2563EB 100%);
  box-shadow: 0 18px 40px rgba(79,70,229,.28);

  opacity: 0;
  transform: scale(.82);
  animation: odkMarkIn 620ms 60ms cubic-bezier(.34,1.4,.4,1) forwards,
             odkMarkBreathe 3.2s 1.2s ease-in-out infinite;
}

.odk-mark-sweep {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

.odk-mark-sweep::after {
  content: "";
  position: absolute;
  top: -40%;
  bottom: -40%;
  width: 55px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  transform: translateX(-160px) rotate(18deg);
  opacity: 0;
  animation: odkSweep 900ms 820ms ease-out 1;
}

.odk-mark-icon {
  width: 56px;
  height: 56px;
  display: block;
}

/* ---- Logo card (real artwork — the common case) ----
   Transparent surface: the logo's own colors carry it,
   nothing fights or duplicates it. */

.odk-logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.odk-logo-glow {
  position: absolute;
  inset: -24px;
  border-radius: 34px;
  background: radial-gradient(circle, rgba(79,70,229,.18), transparent 72%);
  filter: blur(18px);
  opacity: 0;
  animation: odkGlowIn 900ms 260ms cubic-bezier(.22,1,.36,1) forwards,
             odkGlowBreathe 3.2s 1.2s ease-in-out infinite;
}

.odk-logo-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 128px;
  max-width: min(78vw, 260px);
  padding: 22px 30px;
  border-radius: 26px;

  background: transparent;

  opacity: 0;
  transform: scale(.9);
  animation: odkMarkIn 620ms 60ms cubic-bezier(.34,1.4,.4,1) forwards,
             odkMarkBreathe 3.2s 1.2s ease-in-out infinite;
}

.odk-logo-img {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 64px;
  width: auto;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

/* ---------------------------------------------------------
   Wordmark / tagline
--------------------------------------------------------- */

.odk-word {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  opacity: 0;
  transform: translateY(6px);
  animation: odkWordIn 560ms 360ms cubic-bezier(.22,1,.36,1) forwards;
}

.odk-wordmark {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #150934;
  margin: 0;
}

.odk-tagline {
  font-size: 13px;
  font-weight: 500;
  color: #6B6580;
  margin: 0;
}

/* ---------------------------------------------------------
   Progress — determinate bar with a soft moving shimmer,
   plus a status line that cycles through short phrases.
--------------------------------------------------------- */

.odk-progress-zone {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(48px + env(safe-area-inset-bottom, 0px));

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  opacity: 0;
  animation: odkFadeIn 500ms 520ms ease-out forwards;
}

.odk-progress-track {
  position: relative;
  width: 96px;
  height: 4px;
  border-radius: 999px;
  background: rgba(79,70,229,.12);
  overflow: hidden;
}

.odk-progress-fill {
  position: relative;
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, #4F46E5, #7C3AED, #2563EB);
  background-size: 200% 100%;
  transition: width 120ms linear;
  animation: odkFillShimmer 1.6s linear infinite;
}

.odk-status {
  position: relative;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.odk-status-text {
  position: absolute;
  font-size: 11.5px;
  font-weight: 500;
  color: #9791AB;
  letter-spacing: 0.01em;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(3px);
  animation: odkStatusCycle 2.1s ease-in-out infinite;
}

.odk-status-text:nth-child(2) { animation-delay: 700ms; }
.odk-status-text:nth-child(3) { animation-delay: 1400ms; }

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes odkRootIn { from { opacity: 0; } to { opacity: 1; } }

@keyframes odkRootOut {
  0%   { opacity: 1; transform: scale(1);     filter: blur(0); }
  40%  { opacity: 1; transform: scale(1.015); filter: blur(0); }
  100% { opacity: 0; transform: scale(1.05);  filter: blur(6px); }
}

@keyframes odkBlobA {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50%      { transform: translate3d(-6%, 5%, 0) scale(1.08); }
}

@keyframes odkBlobB {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50%      { transform: translate3d(5%, -6%, 0) scale(1.1); }
}

@keyframes odkBlobC {
  0%, 100% { transform: translate3d(-50%, 0, 0) scale(1); }
  50%      { transform: translate3d(-46%, -8%, 0) scale(1.15); }
}

@keyframes odkMarkIn { to { opacity: 1; transform: scale(1); } }

@keyframes odkMarkBreathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.03); }
}

@keyframes odkRingIn { to { opacity: 1; transform: scale(1); } }

@keyframes odkGlowIn { to { opacity: 1; } }

@keyframes odkGlowBreathe {
  0%, 100% { opacity: .7; transform: scale(1); }
  50%      { opacity: 1;  transform: scale(1.08); }
}

@keyframes odkSweep {
  0%   { transform: translateX(-160px) rotate(18deg); opacity: 0; }
  15%  { opacity: .8; }
  60%  { opacity: .5; }
  100% { transform: translateX(200px) rotate(18deg); opacity: 0; }
}

@keyframes odkWordIn { to { opacity: 1; transform: translateY(0); } }

@keyframes odkFadeIn { to { opacity: 1; } }

@keyframes odkBubbleIn { to { opacity: var(--op, .5); } }

@keyframes odkBubbleFloat {
  0%   { transform: translate3d(0, 10px, 0) rotate(0deg) scale(.96); }
  50%  { transform: translate3d(6px, -14px, 0) rotate(4deg) scale(1.04); }
  100% { transform: translate3d(0, 10px, 0) rotate(0deg) scale(.96); }
}

@keyframes odkSparkIn { to { opacity: .85; } }

@keyframes odkSparkFloat {
  0%, 100% { transform: translate3d(0, 6px, 0) scale(.8); opacity: .35; }
  50%      { transform: translate3d(0, -10px, 0) scale(1.2); opacity: .9; }
}

@keyframes odkCornerIn { to { opacity: 1; } }

@keyframes odkCornerPulse {
  0%, 100% { opacity: .55; }
  50%      { opacity: .9; }
}

@keyframes odkFillShimmer {
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

@keyframes odkStatusCycle {
  0%   { opacity: 0; transform: translateY(3px); }
  10%  { opacity: 1; transform: translateY(0); }
  28%  { opacity: 1; transform: translateY(0); }
  38%  { opacity: 0; transform: translateY(-3px); }
  100% { opacity: 0; transform: translateY(-3px); }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 380px) {
  .odk-mark, .odk-mark-wrap { width: 100px; height: 100px; }
  .odk-mark-glow { inset: -22px; }
  .odk-mark-ring { inset: -12px; }
  .odk-mark-icon { width: 48px; height: 48px; }
  .odk-wordmark { font-size: 21px; }
  .odk-logo-card { padding: 18px 24px; max-width: 82vw; }
  .odk-logo-img { max-height: 52px; }
  .odk-bubble-1 { width: 50px; height: 50px; }
  .odk-bubble-3 { width: 62px; height: 62px; }
  .odk-bubble-6, .odk-bubble-8 { display: none; }
  .odk-corner { width: 24px; height: 24px; }
  .odk-corner-tl, .odk-corner-tr { top: calc(20px + env(safe-area-inset-top, 0px)); }
  .odk-corner-bl, .odk-corner-br { bottom: calc(20px + env(safe-area-inset-bottom, 0px)); }
  .odk-corner-tl, .odk-corner-bl { left: 18px; }
  .odk-corner-tr, .odk-corner-br { right: 18px; }
  .odk-progress-zone { bottom: calc(36px + env(safe-area-inset-bottom, 0px)); }
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .odk-root, .odk-root *, .odk-root *::before, .odk-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
  .odk-mark, .odk-mark-glow, .odk-mark-ring, .odk-word, .odk-progress-zone,
  .odk-bubble, .odk-spark, .odk-logo-card, .odk-logo-glow, .odk-corner {
    opacity: 1 !important;
    transform: none !important;
  }
  .odk-bubble { opacity: .4 !important; }
  .odk-corner { opacity: .7 !important; }
  .odk-corner-tr { transform: scaleX(-1) !important; }
  .odk-corner-bl { transform: scaleY(-1) !important; }
  .odk-corner-br { transform: scale(-1, -1) !important; }
  .odk-status-text { position: static; opacity: 1 !important; }
  .odk-status-text:not(:first-child) { display: none; }
}
`;

/* Fallback brand mark — a bag resolving into an "O" — used only
   if the logo asset fails to load, so the splash never shows a
   broken image. */
function MarkIcon() {
  return (
    <svg
      className="odk-mark-icon"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 20c0-6.627 5.373-12 12-12s12 5.373 12 12"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <rect x="10.5" y="20" width="35" height="26" rx="7" fill="#ffffff" />
      <circle cx="28" cy="33" r="6.4" fill="#4F46E5" />
    </svg>
  );
}

const DEFAULT_STATUS_PHRASES = [
  "Loading your cart",
  "Finding today's picks",
  "Almost there",
];

export default function OdikartSplash({
  duration = 2400,
  brand = "Odikart",
  // tagline = "Everything Odisha loves, delivered",
  logoSrc = "/logo.png",
  statusPhrases = DEFAULT_STATUS_PHRASES,
  onFinish,
}) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();

    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const exitTimer = setTimeout(() => setExiting(true), duration);
    const finishTimer = setTimeout(() => onFinish?.(), duration + 560);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <>
      <style>{CSS}</style>

      <div
        className={`odk-root${exiting ? " is-exiting" : ""}`}
        role="status"
        aria-label={`Loading ${brand}`}
        aria-live="polite"
      >
        <div className="odk-grid" aria-hidden="true" />
        <div className="odk-mesh" aria-hidden="true">
          <div className="odk-mesh-blob odk-mesh-blob-a" />
          <div className="odk-mesh-blob odk-mesh-blob-b" />
          <div className="odk-mesh-blob odk-mesh-blob-c" />
        </div>
        <div className="odk-wash-veil" aria-hidden="true" />
        <div className="odk-grain" aria-hidden="true" />

        <div className="odk-corner odk-corner-tl" aria-hidden="true" />
        <div className="odk-corner odk-corner-tr" aria-hidden="true" />
        <div className="odk-corner odk-corner-bl" aria-hidden="true" />
        <div className="odk-corner odk-corner-br" aria-hidden="true" />

        <div className="odk-bubbles" aria-hidden="true">
          <span className="odk-bubble odk-bubble-1" />
          <span className="odk-bubble odk-bubble-2" />
          <span className="odk-bubble odk-bubble-3" />
          <span className="odk-bubble odk-bubble-4" />
          <span className="odk-bubble odk-bubble-5" />
          <span className="odk-bubble odk-bubble-6" />
          <span className="odk-bubble odk-bubble-7" />
          <span className="odk-bubble odk-bubble-8" />
          <span className="odk-spark odk-spark-1" />
          <span className="odk-spark odk-spark-2" />
          <span className="odk-spark odk-spark-3" />
        </div>

        <div className="odk-stage">
          {!imgFailed ? (
            <>
              <div className="odk-logo-wrap">
                <div className="odk-logo-glow" aria-hidden="true" />
                <div className="odk-logo-card">
                  <img
                    className="odk-logo-img"
                    src={logoSrc}
                    alt={brand}
                    draggable="false"
                    onError={() => setImgFailed(true)}
                  />
                </div>
              </div>
              {/* {tagline ? <p className="odk-tagline">{tagline}</p> : null} */}
            </>
          ) : (
            <>
              <div className="odk-mark-wrap">
                <div className="odk-mark-glow" aria-hidden="true" />
                <div className="odk-mark-ring" aria-hidden="true" />
                <div className="odk-mark">
                  <div className="odk-mark-sweep" aria-hidden="true" />
                  <MarkIcon />
                </div>
              </div>
              <div className="odk-word">
                <p className="odk-wordmark">{brand}</p>
                {/* {tagline ? <p className="odk-tagline">{tagline}</p> : null} */}
              </div>
            </>
          )}
        </div>

        <div className="odk-progress-zone">
          <div
            className="odk-progress-track"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="odk-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="odk-status">
            {statusPhrases.slice(0, 3).map((phrase, i) => (
              <span className="odk-status-text" key={i}>
                {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}