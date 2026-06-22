import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import Lottie from "lottie-react";

import successAnimation from "../assets/success.json";
import successmusic from "../assets/successmusic.mp3";

import {
  ShoppingBag,
  ClipboardList,
  Headphones,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Package,
  Home,
  ArrowRight,
  Sparkles,
  CreditCard,
  MapPin,
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Clash+Display:wght@500;600;700&display=swap');

:root{
  --indigo:#4f46e5;
  --blue:#2563eb;
  --slate:#0f172a;
}

*{
  box-sizing:border-box;
}

.os-root{

  font-family:'Outfit',sans-serif;

  min-height:100vh;

  position:relative;
  overflow:hidden;

  display:flex;
  align-items:center;
  justify-content:center;

  padding:40px 20px;

  background:
    radial-gradient(circle at top right,#dbeafe 0%,transparent 30%),
    radial-gradient(circle at bottom left,#c7d2fe 0%,transparent 35%),
    linear-gradient(135deg,#f8fafc,#eef2ff);
}

/* AMBIENT BACKGROUND */

.os-root::before{

  content:"";

  position:absolute;
  inset:-20%;

  background:
    radial-gradient(circle,#6366f122 0%,transparent 40%),
    radial-gradient(circle,#3b82f622 0%,transparent 45%);

  animation:
    osAmbientMove 18s linear infinite;

  pointer-events:none;
}

@keyframes osAmbientMove{

  0%{
    transform:translate3d(0,0,0) rotate(0deg);
  }

  100%{
    transform:translate3d(-4%,2%,0) rotate(10deg);
  }

}

/* FLOATING BLOBS */

.os-blob{
  position:absolute;

  border-radius:999px;

  filter:blur(90px);

  opacity:.5;

  pointer-events:none;
}

.os-blob-1{
  width:340px;
  height:340px;

  background:#6366f1;

  top:-120px;
  right:-80px;

  animation:
    osFloat 8s ease-in-out infinite;
}

.os-blob-2{
  width:260px;
  height:260px;

  background:#60a5fa;

  bottom:-80px;
  left:-60px;

  animation:
    osFloat 10s ease-in-out infinite reverse;
}

@keyframes osFloat{

  0%,100%{
    transform:translateY(0px);
  }

  50%{
    transform:translateY(-22px);
  }

}

/* CONFETTI */

.os-confetti{
  position:fixed;

  opacity:0;

  pointer-events:none;

  z-index:0;

  animation:
    osFall var(--dur) ease-in var(--delay) forwards;
}

@keyframes osFall{

  0%{
    opacity:1;

    transform:
      translateY(-60px)
      rotate(0deg)
      scale(1);
  }

  100%{
    opacity:0;

    transform:
      translateY(420px)
      rotate(720deg)
      scale(.5);
  }

}

/* MAIN LAYOUT */

.os-layout{

  width:100%;
  max-width:1180px;

  display:grid;
  grid-template-columns:1.2fr .8fr;

  gap:28px;

  position:relative;
  z-index:1;
}

/* CARD */

.os-card{

  position:relative;

  overflow:hidden;

  border-radius:36px;

  padding:44px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.72),
      rgba(255,255,255,.42)
    );

  backdrop-filter:
    blur(28px)
    saturate(180%);

  border:
    1px solid rgba(255,255,255,.22);

  outline:
    1px solid rgba(255,255,255,.08);

  box-shadow:
    0 20px 80px rgba(15,23,42,.12),
    inset 0 1px 1px rgba(255,255,255,.35);

  transform-origin:center;

  animation:
    osCinematicIn .9s cubic-bezier(.16,1,.3,1);

  transition:
    transform .4s cubic-bezier(.22,1,.36,1);
}

.os-card:hover{
  transform:translateY(-4px);
}

/* CURSOR GLOW */

.os-card::before{

  content:"";

  position:absolute;
  inset:0;

  background:
    radial-gradient(
      circle at var(--x) var(--y),
      rgba(99,102,241,.14),
      transparent 35%
    );

  opacity:0;

  transition:opacity .3s;

  pointer-events:none;
}

.os-card:hover::before{
  opacity:1;
}

@keyframes osCinematicIn{

  0%{
    opacity:0;

    transform:
      perspective(1600px)
      rotateX(10deg)
      translateY(50px)
      scale(.94);
  }

  100%{
    opacity:1;

    transform:
      perspective(1600px)
      rotateX(0)
      translateY(0)
      scale(1);
  }

}

/* SUCCESS AREA */

.os-success-wrap{
  position:relative;

  display:flex;
  align-items:center;
  justify-content:center;

  margin-bottom:12px;
}

.os-ring{

  position:absolute;

  width:220px;
  height:220px;

  border-radius:999px;

  border:
    1px solid rgba(99,102,241,.14);

  animation:
    osRing 8s linear infinite;
}

@keyframes osRing{

  from{
    transform:rotate(0deg) scale(1);
  }

  to{
    transform:rotate(360deg) scale(1.05);
  }

}

.os-success-glow{

  position:absolute;

  width:220px;
  height:220px;

  border-radius:999px;

  background:
    radial-gradient(circle,#6366f155 0%,transparent 70%);

  filter:blur(40px);

  animation:
    osGlowPulse 3s ease-in-out infinite;
}

@keyframes osGlowPulse{

  0%,100%{
    transform:scale(1);
    opacity:.6;
  }

  50%{
    transform:scale(1.12);
    opacity:1;
  }

}

.os-lottie{
  width:180px;
  height:180px;

  position:relative;
  z-index:2;
}

/* BADGE */

.os-badge{

  display:inline-flex;
  align-items:center;
  gap:8px;

  padding:8px 18px;

  border-radius:999px;

  background:
    linear-gradient(
      135deg,
      rgba(99,102,241,.12),
      rgba(59,130,246,.08)
    );

  border:
    1px solid rgba(199,210,254,.8);

  color:var(--indigo);

  font-size:11px;
  font-weight:700;

  letter-spacing:.14em;
  text-transform:uppercase;

  margin-bottom:18px;
}

.os-badge-dot{

  width:6px;
  height:6px;

  border-radius:50%;

  background:var(--indigo);

  animation:
    osPulse 1.8s ease infinite;
}

@keyframes osPulse{

  0%,100%{
    opacity:1;
    transform:scale(1);
  }

  50%{
    opacity:.5;
    transform:scale(1.6);
  }

}

/* TEXT */

.os-h1{

  font-family:'Clash Display',sans-serif;

  font-size:clamp(2rem,5vw,3.2rem);

  line-height:1.05;

  letter-spacing:-.04em;

  color:var(--slate);

  margin-bottom:16px;
}

.os-h1 span{

  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #2563eb
    );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.os-sub{

  max-width:560px;

  color:#64748b;

  font-size:1rem;

  line-height:1.8;

  margin-bottom:26px;
}

.os-sub strong{
  color:var(--indigo);
}

/* ETA */

.os-eta{

  width:100%;

  display:flex;
  align-items:center;
  gap:14px;

  padding:18px 20px;

  border-radius:24px;

  background:
    linear-gradient(
      135deg,
      rgba(79,70,229,.08),
      rgba(37,99,235,.06)
    );

  border:
    1px solid rgba(99,102,241,.12);

  margin-bottom:28px;
}

.os-eta-icon{

  width:48px;
  height:48px;

  border-radius:18px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:white;

  color:var(--indigo);

  box-shadow:
    0 8px 24px rgba(79,70,229,.12);
}

.os-eta p{

  margin:0;

  font-size:12px;
  font-weight:600;

  color:#64748b;

  text-transform:uppercase;
  letter-spacing:.08em;
}

.os-eta strong{

  color:var(--slate);

  font-size:16px;
}

/* STRIP */

.os-strip{

  width:100%;

  display:grid;
  grid-template-columns:repeat(3,1fr);

  overflow:hidden;

  border-radius:24px;

  margin-bottom:28px;

  background:
    rgba(255,255,255,.45);

  border:
    1px solid rgba(199,210,254,.35);

  backdrop-filter:blur(14px);
}

.os-strip-item{

  padding:20px;

  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;

  transition:
    transform .5s cubic-bezier(.22,1,.36,1),
    background .4s;
}

.os-strip-item:hover{

  transform:
    translateY(-4px)
    scale(1.02);

  background:
    rgba(255,255,255,.55);
}

.os-strip-icon{

  width:44px;
  height:44px;

  border-radius:16px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #eef2ff,
      #dbeafe
    );

  color:var(--indigo);
}

.os-strip-label{

  font-size:11px;
  font-weight:700;

  text-transform:uppercase;

  letter-spacing:.08em;

  color:#94a3b8;
}

.os-strip-val{

  font-size:14px;
  font-weight:700;

  color:#334155;
}

/* TRACKER */

.os-tracker{
  margin-bottom:30px;
}

.os-tracker-steps{

  display:flex;
  justify-content:space-between;

  position:relative;
}

.os-tracker-line{

  position:absolute;

  top:14px;
  left:18px;
  right:18px;

  height:4px;

  border-radius:999px;

  background:#e2e8f0;
}

.os-tracker-fill{

  position:absolute;

  top:14px;
  left:18px;

  height:4px;

  width:0;

  border-radius:999px;

  background:
    linear-gradient(
      90deg,
      #4f46e5,
      #2563eb
    );

  animation:
    osFillBar 1.5s cubic-bezier(.22,1,.36,1) .8s forwards;
}

@keyframes osFillBar{
  to{
    width:calc(33.33% - 6px);
  }
}

.os-step{

  position:relative;
  z-index:2;

  flex:1;

  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
}

.os-step-circle{

  width:32px;
  height:32px;

  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;
}

.os-step.done .os-step-circle{

  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #2563eb
    );

  color:white;
}

.os-step.active .os-step-circle{

  background:white;

  border:2px solid var(--indigo);

  color:var(--indigo);

  animation:
    osActiveGlow 2s ease infinite;
}

.os-step.pending .os-step-circle{

  background:#f1f5f9;

  color:#94a3b8;
}

@keyframes osActiveGlow{

  0%,100%{
    box-shadow:
      0 0 0 0 rgba(79,70,229,.3);
  }

  70%{
    box-shadow:
      0 0 0 14px rgba(79,70,229,0);
  }

}

.os-step-label{

  font-size:11px;
  font-weight:700;

  color:#64748b;
}

/* CTA */

.os-ctas{

  display:flex;
  gap:14px;

  position:sticky;
  bottom:0;
}

.os-btn-primary,
.os-btn-secondary{

  flex:1;

  border:none;

  border-radius:18px;

  padding:16px 20px;

  font-size:14px;
  font-weight:700;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;

  cursor:pointer;

  transition:
    transform .5s cubic-bezier(.22,1,.36,1),
    box-shadow .5s,
    filter .5s;
}

.os-btn-primary{

  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #2563eb
    );

  color:white;

  box-shadow:
    0 12px 34px rgba(79,70,229,.3);
}

.os-btn-secondary{

  background:
    rgba(255,255,255,.55);

  color:var(--indigo);

  border:
    1px solid rgba(199,210,254,.5);
}

.os-btn-primary:hover,
.os-btn-secondary:hover{

  transform:
    translateY(-4px)
    scale(1.02);

  filter:brightness(1.04);
}

.os-btn-primary:active,
.os-btn-secondary:active{
  transform:scale(.97);
}

/* SIDEBAR */

.os-side{

  display:flex;
  flex-direction:column;
  gap:22px;
}

.os-side-card{

  position:relative;

  overflow:hidden;

  border-radius:32px;

  padding:28px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.7),
      rgba(255,255,255,.4)
    );

  backdrop-filter:
    blur(26px)
    saturate(180%);

  border:
    1px solid rgba(255,255,255,.2);

  box-shadow:
    0 20px 60px rgba(15,23,42,.08);
}

.os-side-badge{

  display:inline-flex;

  padding:6px 12px;

  border-radius:999px;

  background:#eef2ff;

  color:var(--indigo);

  font-size:11px;
  font-weight:700;

  margin-bottom:18px;
}

.os-side h3{

  margin:0 0 24px;

  font-size:24px;
  font-weight:700;

  color:var(--slate);
}

.os-side-list{

  display:flex;
  flex-direction:column;
  gap:18px;

  margin-bottom:22px;
}

.os-side-row{

  display:flex;
  justify-content:space-between;
  align-items:center;

  color:#64748b;

  font-size:14px;
}

.os-side-row strong{
  color:var(--slate);
}

.os-side-total{

  display:flex;
  justify-content:space-between;
  align-items:center;

  padding-top:20px;

  border-top:
    1px solid rgba(199,210,254,.4);
}

.os-side-total strong{

  font-size:24px;

  color:var(--indigo);
}

/* FOOTER */

.os-foot{

  margin-top:24px;

  display:flex;
  align-items:center;
  gap:8px;

  color:#94a3b8;

  font-size:13px;
}

/* RESPONSIVE */

@media(max-width:980px){

  .os-layout{
    grid-template-columns:1fr;
  }

}

@media(max-width:640px){

  .os-root{
    padding:18px;
  }

  .os-card{
    padding:28px 22px;
  }

  .os-side-card{
    padding:22px;
  }

  .os-strip{
    grid-template-columns:1fr;
  }

  .os-ctas{
    flex-direction:column;
  }

  .os-h1{
    font-size:2rem;
  }

}
`;

const CONFETTI_COLORS = [
  "#4f46e5",
  "#6366f1",
  "#2563eb",
  "#60a5fa",
  "#a5b4fc",
  "#c7d2fe",
];

const STEPS = [
  {
    icon: <CheckCircle2 size={15} />,
    label: "Confirmed",
    state: "done",
  },
  {
    icon: <Package size={15} />,
    label: "Packing",
    state: "active",
  },
  {
    icon: <Truck size={15} />,
    label: "Shipping",
    state: "pending",
  },
  {
    icon: <Home size={15} />,
    label: "Delivered",
    state: "pending",
  },
];

export default function OrderSuccess() {

  const navigate = useNavigate();

  const [confetti, setConfetti] = useState([]);
  const location = useLocation();

  const order = location.state?.order;
  if (!order) {

    return <Navigate to="/" replace />;

  }
  useEffect(() => {

    const audio = new Audio(successmusic);

    audio.volume = 0.45;

    audio.play().catch(() => { });

  }, []);

  useEffect(() => {

    const id = "modern-success-ui";

    if (!document.getElementById(id)) {

      const style = document.createElement("style");

      style.id = id;
      style.textContent = CSS;

      document.head.appendChild(style);

    }

  }, []);

  useEffect(() => {

    const pieces = Array.from(
      { length: 40 },
      (_, i) => ({
        id: i,
        color:
          CONFETTI_COLORS[
          i % CONFETTI_COLORS.length
          ],
        left: `${Math.random() * 100}%`,
        dur: `${1.4 + Math.random() * 1.8}s`,
        delay: `${Math.random() * .8}s`,
        size: `${6 + Math.random() * 8}px`,
      })
    );

    setConfetti(pieces);

  }, []);

  const orderId = useMemo(() => {

    return `#ESH-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

  }, []);

  return (

    <div className="os-root">

      {/* BLOBS */}
      <div className="os-blob os-blob-1" />
      <div className="os-blob os-blob-2" />

      {/* CONFETTI */}
      {confetti.map((p) => (

        <div
          key={p.id}
          className="os-confetti"
          style={{
            left: p.left,
            top: "-20px",

            width: p.size,
            height: p.size,

            background: p.color,

            "--dur": p.dur,
            "--delay": p.delay,
          }}
        />

      ))}

      {/* LAYOUT */}
      <div className="os-layout">

        {/* LEFT */}
        <div
          className="os-card"

          onMouseMove={(e) => {

            const rect =
              e.currentTarget.getBoundingClientRect();

            e.currentTarget.style.setProperty(
              "--x",
              `${e.clientX - rect.left}px`
            );

            e.currentTarget.style.setProperty(
              "--y",
              `${e.clientY - rect.top}px`
            );

          }}
        >

          {/* SUCCESS */}
          <div className="os-success-wrap">

            <div className="os-ring" />

            <div className="os-success-glow" />

            <div className="os-lottie">

              <Lottie
                animationData={successAnimation}
                autoplay
                loop={false}
              />

            </div>

          </div>

          {/* BADGE */}
          <div className="os-badge">

            <span className="os-badge-dot" />

            {order.paymentMethod === "COD"
              ? "Order Placed"
              : "Payment Successful"}
          </div>

          {/* TITLE */}
          <h1 className="os-h1">

            <span>Order confirmed.</span>

            <br />

            We’re preparing it now.

          </h1>

          {/* SUBTEXT */}
          <p className="os-sub">

            Your order has been successfully placed and
            will arrive within{" "}

            <strong>5–7 business days</strong>.

            Real-time updates will be sent to your
            email and phone.

          </p>

          {/* ETA */}
          <div className="os-eta">

            <div className="os-eta-icon">

              <Truck size={20} />

            </div>

            <div>

              <p>Estimated Delivery</p>

              <strong>
                {order.estimatedDelivery || "5–7 Business Days"}
              </strong>

            </div>

          </div>

          {/* STRIP */}
          <div className="os-strip">

            {[
              {
                icon: <Truck size={18} />,
                label: "Estimated",
                val: "5–7 Days",
              },
              {
                icon: <ShieldCheck size={18} />,
                label: "Payment",
                val: "Secured",
              },
              {
                icon: <RotateCcw size={18} />,
                label: "Returns",
                val: "10 Days",
              },
            ].map((s) => (

              <div
                className="os-strip-item"
                key={s.label}
              >

                <div className="os-strip-icon">
                  {s.icon}
                </div>

                <span className="os-strip-label">
                  {s.label}
                </span>

                <span className="os-strip-val">
                  {s.val}
                </span>

              </div>

            ))}

          </div>

          {/* TRACKER */}
          <div className="os-tracker">

            <div className="os-tracker-steps">

              <div className="os-tracker-line" />

              <div className="os-tracker-fill" />

              {STEPS.map((s) => (

                <div
                  key={s.label}
                  className={`os-step ${s.state}`}
                >

                  <div className="os-step-circle">
                    {s.icon}
                  </div>

                  <span className="os-step-label">
                    {s.label}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* CTA */}
          <div className="os-ctas">

            <button
              className="os-btn-primary"
              onClick={() => navigate("/products")}
            >

              <ShoppingBag size={17} />

              Continue Shopping

              <ArrowRight size={16} />

            </button>

            <button
              className="os-btn-secondary"
              onClick={() => navigate("/order-history")}
            >

              <ClipboardList size={17} />

              View Orders

            </button>

          </div>

          {/* FOOTER */}
          <p className="os-foot">

            <Headphones size={14} />

            Need help?

            <span
              onClick={() => navigate("/contact")}
              style={{
                color: "#4f46e5",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Contact Support
            </span>

          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="os-side">

          {/* SUMMARY */}
          <div className="os-side-card">

            <span className="os-side-badge">
              {orderId}
            </span>

            <h3>Order Summary</h3>

            <div className="os-side-list">

              <div className="os-side-row">

                <span>{order.items[0]?.name}</span>

                <strong>
                  ₹{Number(order.totalPrice - 5).toLocaleString()}
                </strong>

              </div>

              <div className="os-side-row">

                <span>Delivery</span>

                <strong>Free</strong>

              </div>

              <div className="os-side-row">

                <span>Payment</span>

                <strong>{order.paymentMethod}</strong>

              </div>

              <div className="os-side-row">

                <span>Shipping</span>

                <strong>Express</strong>

              </div>

            </div>

            <div className="os-side-total">

              <span>Total</span>

              <strong>₹{order.totalPrice.toLocaleString()}</strong>

            </div>

          </div>

          {/* SHIPPING */}
          <div className="os-side-card">

            <span className="os-side-badge">
              Shipping
            </span>

            <h3>Delivery Address</h3>

            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >

              <div
                style={{
                  width: 46,
                  height: 46,

                  borderRadius: 18,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  background:
                    "linear-gradient(135deg,#eef2ff,#dbeafe)",

                  color: "#4f46e5",

                  flexShrink: 0,
                }}
              >

                <MapPin size={20} />

              </div>

              <div>

                <div
                  style={{
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: 6,
                  }}
                >
                  {order.shippingAddress.name}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  {order.shippingAddress.address}

                  <br />

                  {order.shippingAddress.city},

                  {" "}
                  {order.shippingAddress.state}

                  <br />

                  {order.shippingAddress.country}

                  {" "}

                  {order.shippingAddress.postcode}
                </div>

              </div>

            </div>

          </div>

          {/* PAYMENT */}
          <div className="os-side-card">

            <span className="os-side-badge">
              Payment
            </span>

            <h3>Transaction Details</h3>

            <div className="os-side-list">

              {order?.items?.map((item, index) => (

                <div
                  key={index}
                  className="os-side-row"
                >

                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <strong>
                    ₹{Number(item.price).toLocaleString()}
                  </strong>

                </div>

              ))}

              <div className="os-side-row">

                <span>Delivery</span>

                <strong>Free</strong>

              </div>

              <div className="os-side-row">

                <span>Payment</span>

                <strong>
                  {order.paymentMethod}
                </strong>

              </div>

              <div className="os-side-row">

                <span>Shipping</span>

                <strong>
                  {order.deliveryType || "Express"}
                </strong>

              </div>

            </div>

            <button
              className="os-btn-secondary"
              style={{
                width: "100%",
                marginTop: 10,
              }}
            >

              <CreditCard size={16} />

              Download Invoice

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}