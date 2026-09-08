import React, { useEffect, useState } from "react";

const CSS = `
.odk-splash,
.odk-splash * {
  box-sizing: border-box;
}

.odk-splash {
  position: fixed;
  inset: 0;
  z-index: 999999;

  width: 100%;
  height: 100dvh;
  min-height: 100svh;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  /*
    Blue / purple background inspired by your reference image.
  */
 

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;

  animation: splashFadeIn 350ms ease-out both;
}


/* =========================================================
   BACKGROUND LIGHT
========================================================= */

.odk-splash-light {
  position: absolute;
  width: 60vmax;
  height: 60vmax;

  left: 50%;
  top: 45%;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255, 255, 255, 0.10) 0%,
      rgba(255, 255, 255, 0.035) 35%,
      transparent 70%
    );

  filter: blur(20px);

  pointer-events: none;
  z-index: 0;

  animation: splashLightPulse 5s ease-in-out infinite;
}


/* =========================================================
   BUBBLES
========================================================= */

.odk-splash-bubbles {
  position: absolute;
  inset: 0;

  overflow: hidden;

  pointer-events: none;

  z-index: 1;
}


/*
  Base bubble
*/

.odk-bubble {
  position: absolute;

  display: block;

  border-radius: 50%;

  /*
    Bubble colors match the splash background:
    indigo + blue + violet.
  */
  background:
    radial-gradient(
      circle at 30% 25%,
      rgba(126, 116, 255, 0.45) 0%,
      rgba(91, 78, 225, 0.32) 28%,
      rgba(105, 52, 230, 0.22) 55%,
      rgba(126, 54, 239, 0.08) 72%,
      transparent 78%
    );

  border: 1px solid rgba(139, 130, 255, 0.22);

  box-shadow:
    inset 0 0 20px rgba(116, 108, 245, 0.18),
    0 0 30px rgba(100, 76, 235, 0.14);

  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  opacity: 0;

  will-change: transform, opacity;

  animation:
    bubbleAppear 900ms ease-out forwards,
    bubbleFloat 7s ease-in-out infinite;
}


/*
  Small highlight inside each bubble
*/

.odk-bubble::after {
  content: "";

  position: absolute;

  width: 25%;
  height: 25%;

  top: 16%;
  left: 19%;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255, 255, 255, 0.55),
      rgba(255, 255, 255, 0.08) 65%,
      transparent 75%
    );

  filter: blur(1px);
}


/* ---------------------------------------------------------
   Bubble positions
--------------------------------------------------------- */

.odk-bubble-1 {
  width: 82px;
  height: 82px;

  left: 7%;
  top: 13%;

  animation-delay:
    100ms,
    0s;

  animation-duration:
    900ms,
    8s;
}

.odk-bubble-2 {
  width: 34px;
  height: 34px;

  left: 18%;
  top: 72%;

  animation-delay:
    250ms,
    1.2s;

  animation-duration:
    900ms,
    6.5s;
}

.odk-bubble-3 {
  width: 115px;
  height: 115px;

  right: 6%;
  top: 10%;

  animation-delay:
    350ms,
    0.8s;

  animation-duration:
    900ms,
    10s;
}

.odk-bubble-4 {
  width: 48px;
  height: 48px;

  right: 15%;
  bottom: 15%;

  animation-delay:
    450ms,
    2s;

  animation-duration:
    900ms,
    7s;
}

.odk-bubble-5 {
  width: 24px;
  height: 24px;

  left: 31%;
  top: 8%;

  animation-delay:
    550ms,
    0.5s;

  animation-duration:
    900ms,
    5.5s;
}

.odk-bubble-6 {
  width: 28px;
  height: 28px;

  right: 29%;
  bottom: 10%;

  animation-delay:
    650ms,
    1.5s;

  animation-duration:
    900ms,
    6s;
}

.odk-bubble-7 {
  width: 58px;
  height: 58px;

  left: 3%;
  bottom: 34%;

  animation-delay:
    750ms,
    2.5s;

  animation-duration:
    900ms,
    9s;
}

.odk-bubble-8 {
  width: 40px;
  height: 40px;

  right: 3%;
  top: 48%;

  animation-delay:
    850ms,
    1s;

  animation-duration:
    900ms,
    7.5s;
}


/* =========================================================
   SMALL SPARKLES
========================================================= */

.odk-spark {
  position: absolute;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);

  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.5);

  opacity: 0;

  animation:
    sparkAppear 700ms ease-out forwards,
    sparkFloat 4s ease-in-out infinite;
}

.odk-spark-1 {
  left: 22%;
  top: 30%;

  animation-delay:
    500ms,
    1s;
}

.odk-spark-2 {
  right: 22%;
  bottom: 31%;

  animation-delay:
    800ms,
    0.5s;
}

.odk-spark-3 {
  left: 38%;
  bottom: 17%;

  animation-delay:
    1000ms,
    1.7s;
}

.odk-spark-4 {
  right: 35%;
  top: 18%;

  width: 4px;
  height: 4px;

  animation-delay:
    1200ms,
    2s;
}


/* =========================================================
   LOGO CONTAINER
========================================================= */

.odk-splash-logo-wrap {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 180px;
  height: 180px;

  z-index: 5;
}


/* =========================================================
   SOFT GLOW BEHIND LOGO
========================================================= */

.odk-splash-glow {
  position: absolute;

  width: 150px;
  height: 150px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255, 255, 255, 0.28) 0%,
      rgba(79, 70, 229, 0.20) 30%,
      rgba(124, 58, 237, 0.10) 50%,
      transparent 72%
    );

  filter: blur(18px);

  opacity: 0;

  animation:
    logoGlow 700ms ease-out 250ms forwards,
    logoGlowPulse 1000ms ease-in-out 950ms forwards;
}


/* =========================================================
   MAIN LOGO
========================================================= */

.odk-splash-logo {
  position: relative;

  width: 115px;
  height: 115px;

  object-fit: contain;

  user-select: none;
  -webkit-user-drag: none;

  opacity: 0;

  transform: scale(0.45);

  animation:
    logoZoom 1050ms cubic-bezier(.16, 1, .3, 1) 100ms forwards,
    logoFinalZoom 650ms cubic-bezier(.22, 1, .36, 1) 1150ms forwards;
}


/* =========================================================
   FALLBACK LOGO
========================================================= */

.odk-splash-fallback {
  width: 115px;
  height: 115px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 30px;

  background:
    linear-gradient(
      145deg,
      #4f46e5 0%,
      #6d28d9 52%,
      #2563eb 100%
    );

  box-shadow:
    0 20px 45px rgba(79, 70, 229, 0.30);

  color: white;

  font-size: 58px;
  font-weight: 900;

  opacity: 0;

  transform: scale(0.45);

  animation:
    logoZoom 1050ms cubic-bezier(.16, 1, .3, 1) 100ms forwards,
    logoFinalZoom 650ms cubic-bezier(.22, 1, .36, 1) 1150ms forwards;
}


/* =========================================================
   EXIT
========================================================= */

.odk-splash.exiting {
  pointer-events: none;

  animation:
    splashExit 500ms cubic-bezier(.4, 0, .2, 1)
    forwards;
}


/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes splashFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}


/* =========================================================
   BUBBLE ANIMATIONS
========================================================= */

@keyframes bubbleAppear {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.38;
  }
}

@keyframes bubbleFloat {
  0% {
    transform:
      translate3d(0, 12px, 0)
      scale(0.96);
  }

  50% {
    transform:
      translate3d(8px, -18px, 0)
      scale(1.04);
  }

  100% {
    transform:
      translate3d(0, 12px, 0)
      scale(0.96);
  }
}


/* =========================================================
   SPARK ANIMATIONS
========================================================= */

@keyframes sparkAppear {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.7;
  }
}

@keyframes sparkFloat {
  0%,
  100% {
    transform:
      translateY(5px)
      scale(0.8);

    opacity: 0.35;
  }

  50% {
    transform:
      translateY(-10px)
      scale(1.2);

    opacity: 0.9;
  }
}


/* =========================================================
   LOGO ZOOM
========================================================= */

@keyframes logoZoom {
  0% {
    opacity: 0;
    transform: scale(0.45);
  }

  15% {
    opacity: 1;
  }

  55% {
    transform: scale(1.12);
  }

  78% {
    transform: scale(0.98);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}


/* =========================================================
   FINAL DRAMATIC ZOOM
========================================================= */

@keyframes logoFinalZoom {
  0% {
    transform: scale(1);
  }

  35% {
    transform: scale(1.08);
  }

  100% {
    transform: scale(4.8);
  }
}


/* =========================================================
   GLOW
========================================================= */

@keyframes logoGlow {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes logoGlowPulse {
  0% {
    opacity: 0.75;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(2.2);
  }
}


/* =========================================================
   BACKGROUND LIGHT
========================================================= */

@keyframes splashLightPulse {
  0%,
  100% {
    opacity: 0.55;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.08);
  }
}


/* =========================================================
   SCREEN EXIT
========================================================= */

@keyframes splashExit {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  55% {
    opacity: 1;
    transform: scale(1.03);
  }

  100% {
    opacity: 0;
    transform: scale(1.08);
    filter: blur(5px);
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
  .odk-splash-logo-wrap {
    width: 150px;
    height: 150px;
  }

  .odk-splash-logo,
  .odk-splash-fallback {
    width: 100px;
    height: 100px;
  }

  .odk-splash-fallback {
    border-radius: 26px;
    font-size: 50px;
  }

  .odk-splash-glow {
    width: 130px;
    height: 130px;
  }

  .odk-bubble-1 {
    width: 55px;
    height: 55px;
  }

  .odk-bubble-3 {
    width: 75px;
    height: 75px;
  }

  .odk-bubble-7 {
    width: 42px;
    height: 42px;
  }

  .odk-bubble-8 {
    width: 30px;
    height: 30px;
  }
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .odk-splash,
  .odk-splash *,
  .odk-splash *::before,
  .odk-splash *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
`;


export default function OdikartSplash({
  brand = "Odikart",
  logoSrc = "/logo.png",

  /*
    Total splash time.

    0 - 1000ms:
    Logo appears and zooms into position.

    1000 - 1800ms:
    Logo makes the final big zoom.

    1800 - 2300ms:
    Screen disappears and app is revealed.
  */

  duration = 2300,

  onFinish,
}) {
  const [exiting, setExiting] = useState(false);
  const [imageFailed, setImageFailed] =
    useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, duration - 500);

    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <>
      <style>{CSS}</style>

      <div
        className={`odk-splash ${
          exiting ? "exiting" : ""
        }`}
        role="status"
        aria-label={`Loading ${brand}`}
        aria-live="polite"
      >

        {/* =========================================
            Background light
        ========================================= */}

        <div
          className="odk-splash-light"
          aria-hidden="true"
        />


        {/* =========================================
            Floating bubbles
        ========================================= */}

        <div
          className="odk-splash-bubbles"
          aria-hidden="true"
        >
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
          <span className="odk-spark odk-spark-4" />
        </div>


        {/* =========================================
            Logo
        ========================================= */}

        <div className="odk-splash-logo-wrap">

          {/* Soft glow */}
          <div
            className="odk-splash-glow"
            aria-hidden="true"
          />

          {!imageFailed ? (
            <img
              className="odk-splash-logo"
              src={logoSrc}
              alt={brand}
              draggable="false"
              onError={() =>
                setImageFailed(true)
              }
            />
          ) : (
            <div
              className="odk-splash-fallback"
              aria-label={brand}
            >
              O
            </div>
          )}

        </div>

      </div>
    </>
  );
}