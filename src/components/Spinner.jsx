import React, { useEffect, useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@600;700&display=swap');

/* ══ SPINNER SHELL ══ */
.sp2-bg {
  position: fixed; inset: 0;
  background: linear-gradient(155deg, #f0effd 0%, #eaf0ff 40%, #f5f8ff 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 28px; z-index: 9999;
  font-family: 'DM Sans', sans-serif;
  animation: sp2FU .50s cubic-bezier(.22,1,.36,1) both;
}

/* ambient */
.sp2-orb {
  position: fixed; border-radius: 50%;
  filter: blur(80px); pointer-events: none;
}
.sp2-o1 {
  width: 460px; height: 460px; top: -140px; left: -100px;
  background: radial-gradient(circle, rgba(80,70,228,.14) 0%, transparent 65%);
  animation: sp2Drift 14s ease-in-out infinite alternate;
}
.sp2-o2 {
  width: 360px; height: 360px; bottom: -100px; right: -80px;
  background: radial-gradient(circle, rgba(59,130,246,.11) 0%, transparent 65%);
  animation: sp2Drift 17s ease-in-out infinite alternate-reverse;
}
.sp2-grid {
  position: fixed; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle, rgba(80,70,228,.048) 1px, transparent 1px);
  background-size: 30px 30px;
}

/* ══ ANIMATIONS ══ */
@keyframes sp2FU    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes sp2Drift { from { transform:translate(0,0); } to { transform:translate(16px,12px); } }
@keyframes sp2Spin  { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
@keyframes sp2Bounce{ 0%,100%{transform:translateY(0);} 50%{transform:translateY(-9px);} }
@keyframes sp2Wave  { 0%,100%{height:14px;} 50%{height:46px;} }
@keyframes sp2Pulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.16);opacity:.60;} }
@keyframes sp2Sh    { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }

/* ══ DEFAULT — conic ring ══ */
.sp2-ring-wrap {
  position: relative; width: 92px; height: 92px;
  display: flex; align-items: center; justify-content: center;
}
.sp2-conic {
  position: absolute; inset: 0; border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #5046e4 0deg,
    #7c3aed 90deg,
    #3b82f6 200deg,
    rgba(80,70,228,.10) 260deg,
    rgba(80,70,228,.10) 360deg
  );
  animation: sp2Spin 1.50s linear infinite;
}
.sp2-mask {
  position: absolute; inset: 7px; border-radius: 50%;
  background: rgba(255,255,255,.96); backdrop-filter: blur(16px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 1px;
}
.sp2-pct {
  font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 700;
  background: linear-gradient(135deg, #5046e4, #3b82f6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.sp2-pct-sub {
  font-size: 9.5px; font-weight: 800; letter-spacing: .09em;
  text-transform: uppercase; color: #c4cce0;
}

/* progress bar */
.sp2-pbar-track {
  width: 190px; height: 3px;
  background: rgba(80,70,228,.10); border-radius: 99px; overflow: hidden;
}
.sp2-pbar-fill {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, #5046e4, #7c3aed, #3b82f6);
  background-size: 200% 100%;
  transition: width .32s ease;
}

/* ══ DOTS ══ */
.sp2-dots { display: flex; gap: 9px; align-items: center; }
.sp2-dot {
  width: 12px; height: 12px; border-radius: 50%;
  animation: sp2Bounce 1.20s ease-in-out infinite;
}
.sp2-dot:nth-child(1) { background: #5046e4; }
.sp2-dot:nth-child(2) { background: #7c3aed; animation-delay: .16s; }
.sp2-dot:nth-child(3) { background: #3b82f6; animation-delay: .32s; }

/* ══ PULSAR ══ */
.sp2-pulsar {
  position: relative; width: 82px; height: 82px;
  display: flex; align-items: center; justify-content: center;
}
.sp2-pring {
  position: absolute; border-radius: 50%;
  border: 1.5px solid transparent;
  animation: sp2Spin 1.10s linear infinite;
}
.sp2-pring:nth-child(1) { width:82px; height:82px; border-top-color:#5046e4; }
.sp2-pring:nth-child(2) { width:60px; height:60px; border-top-color:#7c3aed; animation-delay:.28s; }
.sp2-pring:nth-child(3) { width:40px; height:40px; border-top-color:#3b82f6; animation-delay:.56s; }
.sp2-pcore {
  width: 17px; height: 17px; border-radius: 50%;
  background: linear-gradient(135deg, #5046e4, #7c3aed);
  box-shadow: 0 0 14px rgba(80,70,228,.40);
  animation: sp2Pulse 1.40s ease-in-out infinite;
}

/* ══ ORB (gradient) ══ */
.sp2-orb-wrap {
  position: relative; width: 86px; height: 86px;
  display: flex; align-items: center; justify-content: center;
}
.sp2-orb-outer {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #5046e4; border-right-color: #7c3aed;
  animation: sp2Spin 1.60s linear infinite;
}
.sp2-orb-mid {
  position: absolute; inset: 11px; border-radius: 50%;
  border: 1.5px solid transparent;
  border-bottom-color: #3b82f6; border-left-color: #7c3aed;
  animation: sp2Spin 1.10s linear infinite reverse;
}
.sp2-orb-core {
  width: 42px; height: 42px; border-radius: 50%;
  background: rgba(255,255,255,.92); backdrop-filter: blur(12px);
  border: 1px solid rgba(80,70,228,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}

/* ══ WAVE ══ */
.sp2-wave { display: flex; gap: 4px; align-items: flex-end; height: 50px; }
.sp2-wbar {
  width: 5px; border-radius: 3px;
  animation: sp2Wave 1.0s ease-in-out infinite;
}
.sp2-wbar:nth-child(1) { background:#5046e4; animation-delay:0s; }
.sp2-wbar:nth-child(2) { background:#644de6; animation-delay:.10s; }
.sp2-wbar:nth-child(3) { background:#7c3aed; animation-delay:.20s; }
.sp2-wbar:nth-child(4) { background:#5f6ce8; animation-delay:.30s; }
.sp2-wbar:nth-child(5) { background:#3b82f6; animation-delay:.40s; }

/* ══ SKELETON ══ */
.sp2-skel { display: flex; flex-direction: column; gap: 10px; width: 210px; }
.sp2-skel-hd { display: flex; gap: 11px; align-items: center; margin-bottom: 4px; }
.sp2-skel-av {
  width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
  background: rgba(80,70,228,.07); overflow: hidden; position: relative;
}
.sp2-skel-av::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.70),transparent); animation:sp2Sh 1.40s ease-in-out infinite; }
.sp2-skel-rows { display: flex; flex-direction: column; gap: 7px; flex: 1; }
.sp2-skel-row {
  height: 11px; border-radius: 6px;
  background: rgba(80,70,228,.07); overflow: hidden; position: relative;
}
.sp2-skel-row::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.70),transparent); animation:sp2Sh 1.40s ease-in-out infinite; }
.sp2-skel-row.w100 { width:100%; }
.sp2-skel-row.w75  { width:75%; }
.sp2-skel-row.w55  { width:55%; }

/* ══ MESSAGE ══ */
.sp2-msg { text-align: center; animation: sp2FU .70s cubic-bezier(.22,1,.36,1) .15s both; }
.sp2-msg-h { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#1a1535; margin:0; letter-spacing:-.022em; }
.sp2-msg-p { font-size:12.5px; color:#8893a8; font-weight:500; margin:5px 0 0; }
`;

export default function Spinner({ variant = "default", message = "Loading..." }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (variant !== "default") return;
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : Math.min(100, prev + Math.random() * 13 + 2)));
    }, 290);
    return () => clearInterval(timer);
  }, [variant]);

  const pct = Math.round(progress);

  return (
    <>
      <style>{CSS}</style>

      {/* ambient layer */}
      <div className="sp2-orb sp2-o1" />
      <div className="sp2-orb sp2-o2" />
      <div className="sp2-grid" />

      <div className="sp2-bg">

        {/* ── DEFAULT: conic ring + progress bar ── */}
        {variant === "default" && (
          <>
            <div className="sp2-ring-wrap">
              <div className="sp2-conic" />
              <div className="sp2-mask">
                <span className="sp2-pct">{pct}%</span>
                <span className="sp2-pct-sub">loading</span>
              </div>
            </div>

            <div className="sp2-msg">
              <h2 className="sp2-msg-h">{message}</h2>
              <p className="sp2-msg-p">Please wait a moment…</p>
            </div>

            <div className="sp2-pbar-track">
              <div className="sp2-pbar-fill" style={{ width: `${pct}%` }} />
            </div>
          </>
        )}

        {/* ── DOTS ── */}
        {variant === "dots" && (
          <>
            <div className="sp2-dots">
              <div className="sp2-dot" />
              <div className="sp2-dot" />
              <div className="sp2-dot" />
            </div>
            <div className="sp2-msg">
              <h2 className="sp2-msg-h">{message}</h2>
              <p className="sp2-msg-p">Please wait a moment…</p>
            </div>
          </>
        )}

        {/* ── PULSAR ── */}
        {variant === "pulsar" && (
          <>
            <div className="sp2-pulsar">
              <div className="sp2-pring" />
              <div className="sp2-pring" />
              <div className="sp2-pring" />
              <div className="sp2-pcore" />
            </div>
            <div className="sp2-msg">
              <h2 className="sp2-msg-h">{message}</h2>
              <p className="sp2-msg-p">Please wait a moment…</p>
            </div>
          </>
        )}

        {/* ── GRADIENT ORB ── */}
        {variant === "gradient" && (
          <>
            <div className="sp2-orb-wrap">
              <div className="sp2-orb-outer" />
              <div className="sp2-orb-mid" />
              <div className="sp2-orb-core">⚡</div>
            </div>
            <div className="sp2-msg">
              <h2 className="sp2-msg-h">{message}</h2>
              <p className="sp2-msg-p">Please wait a moment…</p>
            </div>
          </>
        )}

        {/* ── WAVE ── */}
        {variant === "wave" && (
          <>
            <div className="sp2-wave">
              <div className="sp2-wbar" />
              <div className="sp2-wbar" />
              <div className="sp2-wbar" />
              <div className="sp2-wbar" />
              <div className="sp2-wbar" />
            </div>
            <div className="sp2-msg">
              <h2 className="sp2-msg-h">{message}</h2>
              <p className="sp2-msg-p">Please wait a moment…</p>
            </div>
          </>
        )}

        {/* ── SKELETON ── */}
        {variant === "skeleton" && (
          <>
            <div className="sp2-skel">
              <div className="sp2-skel-hd">
                <div className="sp2-skel-av" />
                <div className="sp2-skel-rows">
                  <div className="sp2-skel-row w100" />
                  <div className="sp2-skel-row w75" />
                </div>
              </div>
              <div className="sp2-skel-row w100" />
              <div className="sp2-skel-row w100" />
              <div className="sp2-skel-row w75" />
              <div className="sp2-skel-row w55" />
            </div>
            <div className="sp2-msg">
              <h2 className="sp2-msg-h">{message}</h2>
              <p className="sp2-msg-p">Content is being fetched…</p>
            </div>
          </>
        )}

      </div>
    </>
  );
}