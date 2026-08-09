import React, { useEffect, useState } from "react";

const MESSAGES = [
  "Preparing your shopping experience",
  "Loading products",
  "Connecting to Odikart",
  "Personalizing your experience",
  "Almost ready",
];

const LOADER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

/* =========================================================
   ROOT
========================================================= */

.odikart-loader {
  position: fixed;
  inset: 0;
  z-index: 999999;

  width: 100%;
  height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  font-family: "Plus Jakarta Sans", sans-serif;

  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(139, 92, 246, 0.20),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 90%,
      rgba(37, 99, 235, 0.18),
      transparent 32%
    ),
    linear-gradient(
      135deg,
      #fafaff 0%,
      #f5f3ff 40%,
      #eff6ff 75%,
      #ffffff 100%
    );
}

/* =========================================================
   BACKGROUND GRID
========================================================= */

.odikart-loader-grid {
  position: absolute;
  inset: 0;

  opacity: 0.45;

  background-image:
    linear-gradient(
      rgba(99, 102, 241, 0.045) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(99, 102, 241, 0.045) 1px,
      transparent 1px
    );

  background-size: 42px 42px;

  mask-image: radial-gradient(
    ellipse at center,
    black 10%,
    transparent 78%
  );

  -webkit-mask-image: radial-gradient(
    ellipse at center,
    black 10%,
    transparent 78%
  );
}

/* =========================================================
   AMBIENT ORBS
========================================================= */

.odikart-orb {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(90px);

  animation: odikartOrbFloat 12s ease-in-out infinite;
}

.odikart-orb-1 {
  width: 360px;
  height: 360px;

  top: -150px;
  left: -130px;

  background: #8b5cf6;

  opacity: 0.15;
}

.odikart-orb-2 {
  width: 330px;
  height: 330px;

  right: -130px;
  bottom: -130px;

  background: #2563eb;

  opacity: 0.14;

  animation-delay: -4s;
}

.odikart-orb-3 {
  width: 220px;
  height: 220px;

  left: 50%;
  top: 50%;

  margin-left: -110px;
  margin-top: -110px;

  background: #6366f1;

  opacity: 0.06;

  animation-delay: -8s;
}

@keyframes odikartOrbFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(25px, -20px, 0) scale(1.06);
  }
}

/* =========================================================
   PARTICLES
========================================================= */

.odikart-particle {
  position: absolute;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #6366f1;

  opacity: 0.25;

  animation: odikartParticle 5s ease-in-out infinite;
}

.odikart-particle-1 {
  left: 13%;
  top: 27%;
}

.odikart-particle-2 {
  right: 15%;
  top: 21%;

  width: 4px;
  height: 4px;

  animation-delay: -1.2s;
}

.odikart-particle-3 {
  left: 17%;
  bottom: 23%;

  width: 4px;
  height: 4px;

  animation-delay: -2.4s;
}

.odikart-particle-4 {
  right: 18%;
  bottom: 27%;

  width: 6px;
  height: 6px;

  animation-delay: -3.5s;
}

@keyframes odikartParticle {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.2;
  }

  50% {
    transform: translateY(-20px) scale(1.35);
    opacity: 0.55;
  }
}

/* =========================================================
   MAIN CONTENT
========================================================= */

.odikart-loader-content {
  position: relative;
  z-index: 10;

  width: min(92%, 430px);

  display: flex;
  justify-content: center;
}

/* =========================================================
   CARD
========================================================= */

.odikart-loader-card {
  position: relative;

  width: 100%;

  padding: 38px 34px 30px;

  border-radius: 34px;

  border: 1px solid rgba(255, 255, 255, 0.85);

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.78),
      rgba(255, 255, 255, 0.55)
    );

  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);

  box-shadow:
    0 35px 100px rgba(79, 70, 229, 0.12),
    0 12px 35px rgba(15, 23, 42, 0.06);

  animation:
    odikartCardIn
    0.8s
    cubic-bezier(0.22, 1, 0.36, 1);
}

.odikart-loader-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 12%;

  width: 76%;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.95),
      transparent
    );
}

@keyframes odikartCardIn {
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =========================================================
   LOGO
========================================================= */

.odikart-logo-wrap {
  position: relative;

  width: 128px;
  height: 128px;

  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* Outer rotating gradient */

.odikart-logo-ring {
  position: absolute;
  inset: 0;

  border-radius: 36px;

  padding: 3px;

  background:
    conic-gradient(
      from 0deg,
      #8b5cf6,
      #6366f1,
      #3b82f6,
      #06b6d4,
      #6366f1,
      #8b5cf6
    );

  animation:
    odikartLogoRotate
    4s
    linear
    infinite;
}

.odikart-logo-ring-inner {
  position: absolute;
  inset: 3px;

  border-radius: 33px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f8fafc
    );
}

/* Logo glow */

.odikart-logo-glow {
  position: absolute;

  width: 90px;
  height: 90px;

  border-radius: 30px;

  background: #6366f1;

  filter: blur(35px);

  opacity: 0.22;

  animation:
    odikartLogoGlow
    3s
    ease-in-out
    infinite;
}

/* Actual logo container */

.odikart-logo {
  position: relative;
  z-index: 3;

  width: 88px;
  height: 88px;

  border-radius: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  // background:
  //   linear-gradient(
  //     135deg,
  //     #8b5cf6 0%,
  //     #6366f1 48%,
  //     #2563eb 100%
  //   );

  box-shadow:
    0 18px 45px rgba(79, 70, 229, 0.30),
    inset 0 1px 1px rgba(255, 255, 255, 0.45);

  animation:
    odikartLogoFloat
    3s
    ease-in-out
    infinite;
}

.odikart-logo img {
  width: 93px;
  height: 93px;

  object-fit: contain;

  border-radius: 18px;

  filter:
    drop-shadow(
      0 7px 14px rgba(15, 23, 42, 0.12)
    );
}

.odikart-logo-fallback {
  color: white;

  font-size: 38px;

  font-weight: 800;

  letter-spacing: -3px;
}

@keyframes odikartLogoRotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes odikartLogoFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes odikartLogoGlow {
  0%,
  100% {
    opacity: 0.16;
    transform: scale(0.9);
  }

  50% {
    opacity: 0.30;
    transform: scale(1.08);
  }
}

/* =========================================================
   BRAND
========================================================= */

.odikart-title {
  margin-top: 24px;

  text-align: center;

  font-size: 34px;

  line-height: 1;

  font-weight: 800;

  letter-spacing: -1.8px;

  background:
    linear-gradient(
      135deg,
      #8b5cf6,
      #6366f1 45%,
      #2563eb
    );

  background-clip: text;
  -webkit-background-clip: text;

  color: transparent;
  -webkit-text-fill-color: transparent;
}

.odikart-subtitle {
  margin-top: 10px;

  text-align: center;

  color: #64748b;

  font-size: 13px;

  line-height: 1.6;

  font-weight: 500;
}

/* =========================================================
   STATUS
========================================================= */

.odikart-status {
  min-height: 24px;

  margin-top: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;
}

.odikart-status-dot {
  position: relative;

  width: 8px;
  height: 8px;

  flex-shrink: 0;
}

.odikart-status-dot::before {
  content: "";

  position: absolute;
  inset: 0;

  border-radius: 50%;

  background: #4f46e5;

  animation:
    odikartPing
    1.5s
    ease-out
    infinite;
}

.odikart-status-dot::after {
  content: "";

  position: absolute;

  inset: 2px;

  border-radius: 50%;

  background: #4f46e5;
}

.odikart-status-text {
  color: #64748b;

  font-size: 12px;

  font-weight: 600;

  animation:
    odikartMessage
    0.45s
    ease;
}

@keyframes odikartPing {
  0% {
    transform: scale(1);
    opacity: 0.65;
  }

  75%,
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

@keyframes odikartMessage {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================================
   PROGRESS
========================================================= */

.odikart-progress {
  margin-top: 22px;
}

.odikart-progress-head {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin-bottom: 8px;
}

.odikart-progress-label {
  color: #94a3b8;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 0.18em;

  text-transform: uppercase;
}

.odikart-progress-value {
  color: #4f46e5;

  font-size: 10px;

  font-weight: 800;
}

.odikart-progress-track {
  position: relative;

  width: 100%;
  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background: rgba(99, 102, 241, 0.10);
}

.odikart-progress-bar {
  position: absolute;

  top: 0;
  left: 0;

  width: 35%;
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #8b5cf6,
      #6366f1,
      #3b82f6
    );

  box-shadow:
    0 0 18px rgba(99, 102, 241, 0.35);

  animation:
    odikartProgress
    1.7s
    cubic-bezier(0.65, 0.05, 0.36, 1)
    infinite;
}

.odikart-progress-bar::after {
  content: "";

  position: absolute;

  top: 0;
  bottom: 0;

  width: 55px;

  right: -55px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.75),
      transparent
    );

  transform: skewX(-20deg);

  animation:
    odikartShimmer
    1.2s
    linear
    infinite;
}

@keyframes odikartProgress {
  0% {
    transform: translateX(-130%);
    width: 22%;
  }

  45% {
    transform: translateX(120%);
    width: 55%;
  }

  100% {
    transform: translateX(420%);
    width: 22%;
  }
}

@keyframes odikartShimmer {
  from {
    transform: translateX(-90px) skewX(-20deg);
  }

  to {
    transform: translateX(180px) skewX(-20deg);
  }
}

/* =========================================================
   FEATURE ROW
========================================================= */

.odikart-features {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 13px;

  margin-top: 24px;

  padding-top: 19px;

  border-top:
    1px solid
    rgba(148, 163, 184, 0.15);
}

.odikart-feature {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #94a3b8;

  font-size: 9px;

  font-weight: 700;
}

.odikart-feature-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;
}

.odikart-feature-green {
  background: #22c55e;
}

.odikart-feature-blue {
  background: #3b82f6;
}

.odikart-feature-purple {
  background: #8b5cf6;
}

.odikart-feature-divider {
  width: 1px;
  height: 11px;

  background: rgba(148, 163, 184, 0.22);
}

/* =========================================================
   FOOTER
========================================================= */

.odikart-loader-footer {
  position: absolute;

  bottom: 20px;

  left: 0;
  right: 0;

  z-index: 5;

  text-align: center;

  color: #94a3b8;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 0.22em;

  text-transform: uppercase;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .odikart-loader-content {
    width: min(91%, 380px);
  }

  .odikart-loader-card {
    padding: 32px 23px 27px;

    border-radius: 28px;
  }

  .odikart-logo-wrap {
    width: 112px;
    height: 112px;
  }

  .odikart-logo {
    width: 78px;
    height: 78px;

    border-radius: 23px;
  }

  .odikart-logo img {
    width: 62px;
    height: 62px;
  }

  .odikart-logo-fallback {
    font-size: 32px;
  }

  .odikart-title {
    font-size: 29px;

    margin-top: 21px;
  }

  .odikart-subtitle {
    font-size: 12px;
  }

  .odikart-status {
    margin-top: 20px;
  }

  .odikart-features {
    gap: 9px;
  }

  .odikart-feature {
    font-size: 8px;
  }

  .odikart-loader-footer {
    bottom: 13px;

    font-size: 7px;
  }
}

/* =========================================================
   VERY SMALL DEVICES
========================================================= */

@media (max-width: 360px) {
  .odikart-loader-card {
    padding: 27px 17px 23px;
  }

  .odikart-logo-wrap {
    width: 96px;
    height: 96px;
  }

  .odikart-logo {
    width: 68px;
    height: 68px;
  }

  .odikart-logo img {
    width: 54px;
    height: 54px;
  }

  .odikart-title {
    font-size: 26px;
  }

  .odikart-feature-divider {
    display: none;
  }

  .odikart-features {
    gap: 7px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;

export default function ModernAppLoader() {
  const [messageIndex, setMessageIndex] =
    useState(0);

  const [progress, setProgress] =
    useState(8);

  /* =======================================================
     MESSAGE ROTATION
  ======================================================= */

  useEffect(() => {
    const messageTimer =
      setInterval(() => {
        setMessageIndex(
          (current) =>
            (current + 1) %
            MESSAGES.length
        );
      }, 1200);

    return () => {
      clearInterval(messageTimer);
    };
  }, []);

  /* =======================================================
     REALISTIC PROGRESS
  ======================================================= */

  useEffect(() => {
    const progressTimer =
      setInterval(() => {
        setProgress((current) => {
          if (current >= 94) {
            return 94;
          }

          let increase = 1;

          if (current < 25) {
            increase = 4;
          } else if (current < 55) {
            increase = 2;
          } else if (current < 80) {
            increase = 1;
          }

          return Math.min(
            current + increase,
            94
          );
        });
      }, 180);

    return () => {
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <>
      <style>{LOADER_CSS}</style>

      <div className="odikart-loader">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="odikart-loader-grid" />

        <div className="odikart-orb odikart-orb-1" />

        <div className="odikart-orb odikart-orb-2" />

        <div className="odikart-orb odikart-orb-3" />

        {/* Particles */}

        <span className="odikart-particle odikart-particle-1" />

        <span className="odikart-particle odikart-particle-2" />

        <span className="odikart-particle odikart-particle-3" />

        <span className="odikart-particle odikart-particle-4" />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="odikart-loader-content">

          <div className="odikart-loader-card">

            {/* =================================================
                LOGO
            ================================================= */}

            <div className="odikart-logo-wrap">

              <div className="odikart-logo-ring">
                <div className="odikart-logo-ring-inner" />
              </div>

              <div className="odikart-logo-glow" />

              <div className="odikart-logo">

                <img
                  src="/logo.png"
                  alt="Odikart"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";

                    const fallback =
                      event.currentTarget
                        .nextElementSibling;

                    if (fallback) {
                      fallback.style.display =
                        "block";
                    }
                  }}
                />

                <span
                  className="odikart-logo-fallback"
                  style={{
                    display: "none",
                  }}
                >
                  O
                </span>

              </div>

            </div>

            {/* =================================================
                BRAND
            ================================================= */}

            <h1 className="odikart-title">
              Odikart
            </h1>

            <p className="odikart-subtitle">
              Everything you love, in one place.
            </p>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="odikart-status">

              <span className="odikart-status-dot" />

              <span
                key={messageIndex}
                className="odikart-status-text"
              >
                {MESSAGES[messageIndex]}
              </span>

            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="odikart-progress">

              <div className="odikart-progress-head">

                <span className="odikart-progress-label">
                  Loading
                </span>

                <span className="odikart-progress-value">
                  {progress}%
                </span>

              </div>

              <div className="odikart-progress-track">

                <div
                  className="odikart-progress-bar"
                  style={{
                    animation: "none",
                    width: `${progress}%`,
                    transform: "translateX(0)",
                  }}
                />

              </div>

            </div>

            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="odikart-features">

              <div className="odikart-feature">
                <span
                  className="
                    odikart-feature-dot
                    odikart-feature-green
                  "
                />
                Secure
              </div>

              <span className="odikart-feature-divider" />

              <div className="odikart-feature">
                <span
                  className="
                    odikart-feature-dot
                    odikart-feature-blue
                  "
                />
                Fast
              </div>

              <span className="odikart-feature-divider" />

              <div className="odikart-feature">
                <span
                  className="
                    odikart-feature-dot
                    odikart-feature-purple
                  "
                />
                Reliable
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="odikart-loader-footer">
          Shop smarter · Shop better · Odikart
        </div>

      </div>
    </>
  );
}

