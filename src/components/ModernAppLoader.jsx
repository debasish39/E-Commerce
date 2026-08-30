import React, { useEffect, useState } from "react";

const MESSAGES = [
  "Discover something you'll love",
  "Curating your shopping experience",
  "Finding today's best picks",
  "Almost ready to explore",
];

const PRODUCTS = [
  {
    emoji: "👟",
    label: "Sneakers",
    price: "₹1,299",
    className: "odk-product-1",
  },
  {
    emoji: "⌚",
    label: "Smart Watch",
    price: "₹2,499",
    className: "odk-product-2",
  },
  {
    emoji: "🎧",
    label: "Headphones",
    price: "₹1,899",
    className: "odk-product-3",
  },
  {
    emoji: "👜",
    label: "Fashion",
    price: "₹999",
    className: "odk-product-4",
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

/* =========================================================
   ROOT
========================================================= */

.odk-loader {
  position: fixed;
  inset: 0;

  z-index: 999999;

  width: 100%;
  height: 100dvh;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Plus Jakarta Sans", sans-serif;

  color: #0f172a;

  background:
    radial-gradient(
      circle at 50% 45%,
      rgba(99, 102, 241, 0.10),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #fafbff,
      #f5f3ff 50%,
      #eff6ff
    );
}

/* =========================================================
   BACKGROUND
========================================================= */

.odk-bg {
  position: absolute;
  inset: 0;

  overflow: hidden;

  pointer-events: none;
}

/* soft light */

.odk-light {
  position: absolute;

  width: 420px;
  height: 420px;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(99, 102, 241, 0.12),
      transparent 65%
    );

  filter: blur(10px);

  animation:
    odkLightPulse
    5s
    ease-in-out
    infinite;
}

@keyframes odkLightPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.5;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

/* grid */

.odk-grid {
  position: absolute;
  inset: 0;

  opacity: 0.3;

  background-image:
    linear-gradient(
      rgba(99, 102, 241, 0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(99, 102, 241, 0.035) 1px,
      transparent 1px
    );

  background-size: 50px 50px;

  mask-image:
    radial-gradient(
      ellipse at center,
      black 5%,
      transparent 72%
    );

  -webkit-mask-image:
    radial-gradient(
      ellipse at center,
      black 5%,
      transparent 72%
    );
}

/* =========================================================
   DECORATIVE CIRCLES
========================================================= */

.odk-circle {
  position: absolute;

  left: 50%;
  top: 50%;

  border: 1px solid rgba(99, 102, 241, 0.08);

  border-radius: 50%;

  transform: translate(-50%, -50%);

  animation:
    odkCirclePulse
    5s
    ease-in-out
    infinite;
}

.odk-circle-1 {
  width: 300px;
  height: 300px;
}

.odk-circle-2 {
  width: 460px;
  height: 460px;

  animation-delay: -1s;
}

.odk-circle-3 {
  width: 650px;
  height: 650px;

  animation-delay: -2s;
}

@keyframes odkCirclePulse {
  0%,
  100% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(0.96);
  }

  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.02);
  }
}

/* =========================================================
   PRODUCT CARDS
========================================================= */

.odk-products {
  position: absolute;
  inset: 0;

  pointer-events: none;
}

.odk-product {
  position: absolute;

  width: 150px;

  padding: 10px;

  display: flex;

  align-items: center;

  gap: 9px;

  border: 1px solid rgba(255, 255, 255, 0.9);

  border-radius: 16px;

  background: rgba(255, 255, 255, 0.72);

  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.08);

  backdrop-filter: blur(20px);

  -webkit-backdrop-filter: blur(20px);

  opacity: 0;

  animation:
    odkProductAppear
    1s
    ease-out
    forwards;
}

.odk-product-image {
  width: 39px;
  height: 39px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #eef2ff,
      #dbeafe
    );

  font-size: 19px;
}

.odk-product-info {
  min-width: 0;

  text-align: left;
}

.odk-product-name {
  display: block;

  overflow: hidden;

  color: #475569;

  font-size: 8px;

  font-weight: 700;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.odk-product-price {
  display: block;

  margin-top: 2px;

  color: #0f172a;

  font-size: 10px;

  font-weight: 800;
}

.odk-product-1 {
  left: 8%;
  top: 25%;

  animation-delay: 0.4s;
}

.odk-product-2 {
  right: 7%;
  top: 20%;

  animation-delay: 0.7s;
}

.odk-product-3 {
  left: 7%;
  bottom: 23%;

  animation-delay: 1s;
}

.odk-product-4 {
  right: 8%;
  bottom: 20%;

  animation-delay: 1.3s;
}

@keyframes odkProductAppear {
  from {
    opacity: 0;

    transform:
      translateY(20px)
      scale(0.85);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }
}

/* =========================================================
   MAIN
========================================================= */

.odk-main {
  position: relative;

  z-index: 20;

  width: min(90%, 410px);

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;

  animation:
    odkMainIn
    0.9s
    cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes odkMainIn {
  from {
    opacity: 0;

    transform:
      translateY(25px)
      scale(0.96);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }
}

/* =========================================================
   LOGO
========================================================= */

.odk-logo {
  position: relative;

  width: 104px;
  height: 104px;

  display: flex;

  align-items: center;
  justify-content: center;
}

.odk-logo-glow {
  position: absolute;

  inset: 12px;

  border-radius: 30px;

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #2563eb
    );

  filter: blur(30px);

  opacity: 0.25;

  animation:
    odkLogoGlow
    3s
    ease-in-out
    infinite;
}

.odk-logo-ring {
  position: absolute;

  inset: 0;

  padding: 2px;

  border-radius: 30px;

  background:
    conic-gradient(
      from 0deg,
      #6366f1,
      #8b5cf6,
      #3b82f6,
      #06b6d4,
      #6366f1
    );

  animation:
    odkRing
    5s
    linear
    infinite;
}

.odk-logo-ring-inner {
  width: 100%;
  height: 100%;

  border-radius: 28px;

  background: #ffffff;
}

.odk-logo-box {
  position: absolute;

  inset: 9px;

  display: flex;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 25px;

  background: #ffffff;

  box-shadow:
    0 18px 50px rgba(79, 70, 229, 0.18);

  animation:
    odkLogoFloat
    3s
    ease-in-out
    infinite;
}

.odk-logo-box img {
  width: 70px;
  height: 70px;

  object-fit: contain;

  border-radius: 18px;
}

.odk-logo-fallback {
  display: none;

  color: #4f46e5;

  font-size: 32px;

  font-weight: 800;
}

@keyframes odkRing {
  to {
    transform: rotate(360deg);
  }
}

@keyframes odkLogoFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes odkLogoGlow {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.18;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.38;
  }
}

/* =========================================================
   BRAND
========================================================= */

.odk-brand {
  margin-top: 21px;
}

.odk-title {
  margin: 0;

  color: #0f172a;

  font-size: 34px;

  line-height: 1;

  font-weight: 800;

  letter-spacing: -1.8px;
}

.odk-title span {
  background:
    linear-gradient(
      135deg,
      #7c3aed,
      #4f46e5,
      #2563eb
    );

  background-clip: text;
  -webkit-background-clip: text;

  color: transparent;
  -webkit-text-fill-color: transparent;
}

.odk-tagline {
  margin: 10px 0 0;

  color: #64748b;

  font-size: 11px;

  font-weight: 500;
}

/* =========================================================
   DISCOVERY BADGES
========================================================= */

.odk-badges {
  display: flex;

  justify-content: center;

  gap: 7px;

  margin-top: 17px;
}

.odk-badge {
  padding: 7px 10px;

  border-radius: 999px;

  color: #64748b;

  font-size: 8px;

  font-weight: 700;

  border: 1px solid rgba(255, 255, 255, 0.8);

  background: rgba(255, 255, 255, 0.6);

  box-shadow:
    0 7px 20px rgba(15, 23, 42, 0.04);

  animation:
    odkBadgeFloat
    3s
    ease-in-out
    infinite;
}

.odk-badge:nth-child(2) {
  animation-delay: -0.7s;
}

.odk-badge:nth-child(3) {
  animation-delay: -1.4s;
}

@keyframes odkBadgeFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

/* =========================================================
   MESSAGE
========================================================= */

.odk-message {
  margin-top: 21px;

  min-height: 42px;
}

.odk-message-title {
  margin: 0;

  color: #0f172a;

  font-size: 14px;

  font-weight: 800;

  letter-spacing: -0.3px;

  animation:
    odkMessage
    0.45s
    ease;
}

.odk-message-subtitle {
  margin: 5px 0 0;

  color: #94a3b8;

  font-size: 9px;

  font-weight: 500;
}

@keyframes odkMessage {
  from {
    opacity: 0;

    transform: translateY(7px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}

/* =========================================================
   LOADING
========================================================= */

.odk-loading {
  width: 100%;

  margin-top: 18px;
}

.odk-loading-top {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 7px;
}

.odk-loading-label {
  color: #94a3b8;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.odk-loading-status {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #6366f1;

  font-size: 8px;

  font-weight: 800;
}

.odk-status-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #22c55e;

  animation:
    odkStatusPulse
    1.2s
    ease-in-out
    infinite;
}

@keyframes odkStatusPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.4);
    opacity: 1;
  }
}

.odk-track {
  position: relative;

  width: 100%;
  height: 5px;

  overflow: hidden;

  border-radius: 999px;

  background: rgba(99, 102, 241, 0.10);
}

.odk-progress {
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
    0 0 15px rgba(99, 102, 241, 0.3);

  transition:
    width
    0.2s
    ease-out;
}

.odk-progress-shine {
  position: absolute;

  top: 0;

  width: 45px;
  height: 100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.8),
      transparent
    );

  animation:
    odkShine
    1.5s
    linear
    infinite;
}

@keyframes odkShine {
  from {
    left: -50px;
  }

  to {
    left: 110%;
  }
}

/* =========================================================
   TRUST
========================================================= */

.odk-trust {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 13px;

  margin-top: 16px;
}

.odk-trust-item {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #94a3b8;

  font-size: 8px;

  font-weight: 700;
}

.odk-trust-icon {
  font-size: 9px;
}

/* =========================================================
   FOOTER
========================================================= */

.odk-footer {
  margin-top: 16px;

  color: #a1aab8;

  font-size: 7px;

  font-weight: 700;

  letter-spacing: 0.15em;

  text-transform: uppercase;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {
  .odk-product {
    display: none;
  }

  .odk-circle-3 {
    width: 480px;
    height: 480px;
  }
}

@media (max-width: 600px) {
  .odk-main {
    width: min(88%, 390px);
  }

  .odk-logo {
    width: 88px;
    height: 88px;
  }

  .odk-logo-box {
    inset: 8px;

    border-radius: 22px;
  }

  .odk-logo-box img {
    width: 60px;
    height: 60px;
  }

  .odk-logo-ring {
    border-radius: 27px;
  }

  .odk-logo-ring-inner {
    border-radius: 25px;
  }

  .odk-title {
    font-size: 28px;
  }

  .odk-tagline {
    font-size: 10px;
  }

  .odk-message {
    margin-top: 17px;
  }

  .odk-loading {
    margin-top: 16px;
  }

  .odk-badges {
    margin-top: 14px;
  }

  .odk-badge {
    padding: 6px 8px;

    font-size: 7px;
  }
}

@media (max-width: 360px) {
  .odk-title {
    font-size: 25px;
  }

  .odk-message-title {
    font-size: 12px;
  }

  .odk-trust {
    gap: 8px;
  }

  .odk-trust-item {
    font-size: 7px;
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
    transition-duration: 0.01ms !important;
  }
}
`;

export default function ModernAppLoader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(5);

  /* =======================================================
     MESSAGE ROTATION
  ======================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((current) => {
        if (current >= MESSAGES.length - 1) {
          return current;
        }

        return current + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =======================================================
     PROGRESS
  ======================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 94) {
          return 94;
        }

        if (current < 25) {
          return Math.min(current + 3, 94);
        }

        if (current < 60) {
          return Math.min(current + 2, 94);
        }

        return Math.min(current + 1, 94);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <div className="odk-loader">

        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div className="odk-bg">

          <div className="odk-light" />

          <div className="odk-grid" />

          <div className="odk-circle odk-circle-1" />

          <div className="odk-circle odk-circle-2" />

          <div className="odk-circle odk-circle-3" />

          {/* Product cards */}

          <div className="odk-products">

            {PRODUCTS.map((product) => (
              <div
                key={product.label}
                className={`odk-product ${product.className}`}
              >

                <div className="odk-product-image">
                  {product.emoji}
                </div>

                <div className="odk-product-info">

                  <span className="odk-product-name">
                    {product.label}
                  </span>

                  <span className="odk-product-price">
                    {product.price}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="odk-main">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="odk-logo">

            <div className="odk-logo-glow" />

            <div className="odk-logo-ring">

              <div className="odk-logo-ring-inner" />

            </div>

            <div className="odk-logo-box">

              <img
                src="/logo.png"
                alt="Odikart"
                onError={(event) => {
                  event.currentTarget.style.display = "none";

                  const fallback =
                    event.currentTarget.nextElementSibling;

                  if (fallback) {
                    fallback.style.display = "block";
                  }
                }}
              />

              <span className="odk-logo-fallback">
                O
              </span>

            </div>

          </div>

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="odk-brand">

            <h1 className="odk-title">
              Shop with{" "}
              <span>Odikart</span>
            </h1>

            <p className="odk-tagline">
              Discover products you'll love.
            </p>

          </div>

          {/* =================================================
              DISCOVERY BADGES
          ================================================= */}

          <div className="odk-badges">

            <span className="odk-badge">
              ✨ New arrivals
            </span>

            <span className="odk-badge">
              🔥 Trending
            </span>

            <span className="odk-badge">
              🎁 Best deals
            </span>

          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <div className="odk-message">

            <h2
              key={messageIndex}
              className="odk-message-title"
            >
              {MESSAGES[messageIndex]}
            </h2>

            <p className="odk-message-subtitle">
              A better way to discover, shop and enjoy.
            </p>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          <div className="odk-loading">

            <div className="odk-loading-top">

              <span className="odk-loading-label">
                Getting things ready
              </span>

              <span className="odk-loading-status">

                <span className="odk-status-dot" />

                {progress}%

              </span>

            </div>

            <div className="odk-track">

              <div
                className="odk-progress"
                style={{
                  width: `${progress}%`,
                }}
              />

              <div className="odk-progress-shine" />

            </div>

          </div>

          {/* =================================================
              TRUST
          ================================================= */}

          <div className="odk-trust">

            <div className="odk-trust-item">
              <span className="odk-trust-icon">
                🔒
              </span>
              Secure
            </div>

            <div className="odk-trust-item">
              <span className="odk-trust-icon">
                ⚡
              </span>
              Fast
            </div>

            <div className="odk-trust-item">
              <span className="odk-trust-icon">
                💙
              </span>
              Trusted
            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <p className="odk-footer">
            Your shopping journey starts here
          </p>

        </main>

      </div>
    </>
  );
}

