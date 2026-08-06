import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { X } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

:root {
  --al-ind:   #5046e4;
  --al-blue:  #3b82f6;
  --al-vio:   #7c3aed;
  --al-grad:  linear-gradient(145deg,#5046e4,#7c3aed 55%,#3b82f6);
  --al-f-h:   'Syne',sans-serif;
  --al-f-b:   'DM Sans',sans-serif;
}

/* page shell */
.al-shell {
  position: fixed;
  inset: 0;
  z-index: 60;

  display: flex;
  align-items: flex-start;   /* instead of center */
  justify-content: center;

  padding: 32px 16px;

  font-family: var(--al-f-b);

  overflow-y: auto;
  overflow-x: hidden;

  scrollbar-width: thin;
}

/* layered background */
.al-bg {
  position:absolute; inset:0; z-index:0;
  height: 118vh;
  background:linear-gradient(145deg,#e8e6ff 0%,#dce8ff 40%,#edf1ff 100%);
}

/* animated mesh orbs */
.al-orb {
  position:absolute; border-radius:50%;
  filter:blur(80px); pointer-events:none; z-index:0;
}
.al-orb-1 {
  width:480px; height:480px;
  top:-160px; left:-100px;
  background:radial-gradient(circle,rgba(80,70,228,.28) 0%,transparent 65%);
  animation:alOrb1 10s ease-in-out infinite alternate;
}
.al-orb-2 {
  width:400px; height:400px;
  bottom:-120px; right:-100px;
  background:radial-gradient(circle,rgba(59,130,246,.22) 0%,transparent 65%);
  animation:alOrb2 13s ease-in-out infinite alternate;
}
.al-orb-3 {
  width:260px; height:260px;
  top:40%; right:8%;
  background:radial-gradient(circle,rgba(124,58,237,.16) 0%,transparent 65%);
  animation:alOrb1 16s ease-in-out infinite alternate;
}
@keyframes alOrb1 { from{transform:translate(0,0)} to{transform:translate(22px,18px)} }
@keyframes alOrb2 { from{transform:translate(0,0)} to{transform:translate(-18px,-14px)} }

/* dot grid */
.al-grid {
  position:absolute; inset:0; z-index:0; pointer-events:none;
  background-image:radial-gradient(circle,rgba(80,70,228,.10) 1px,transparent 1px);
  background-size:28px 28px;
}

/* card */
.al-card{
  position:relative;
  z-index:1;
  width:100%;
  max-width:480px;

  background:rgba(255,255,255,.72);
  backdrop-filter:blur(30px);
  -webkit-backdrop-filter:blur(30px);

  border:1px solid rgba(255,255,255,.45);

  border-radius:32px;

  box-shadow:
    0 30px 80px rgba(80,70,228,.15),
    0 10px 30px rgba(59,130,246,.08),
    inset 0 1px 0 rgba(255,255,255,.8);

  padding:40px 34px 32px;
  overflow:hidden;
}
@media(max-width:480px){ .al-card { padding:28px 20px 24px; border-radius:24px; } }
@keyframes alCardIn { from{opacity:0;transform:translateY(22px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

/* shimmer top line */
.al-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background:var(--al-grad);
  background-size:200% 100%;
  animation:alShim 3s linear infinite;
}
@keyframes alShim { 0%{background-position:-100% 0} 100%{background-position:200% 0} }

/* close btn */
.al-close {
  position:absolute; top:14px; right:14px;
  width:32px; height:32px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  background:rgba(80,70,228,.08); border:1px solid rgba(80,70,228,.14);
  color:#a5b4fc; cursor:pointer;
  transition:all .20s; z-index:2;
}
.al-close:hover { background:rgba(239,68,68,.12); border-color:rgba(239,68,68,.25); color:#f87171; transform:scale(1.08); }

/* logo mark */
.al-logo {
  display:flex; align-items:center; justify-content:center;
  gap:10px; margin-bottom:18px;
}
.al-logo-icon {
  width:44px; height:44px; border-radius:14px;
  background:var(--al-grad);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 6px 22px rgba(80,70,228,.38);
  font-family:var(--al-f-h); font-size:1.2rem; font-weight:900; color:white;
  animation:alBounce 2.4s ease-in-out infinite;
}
@keyframes alBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
.al-logo-name {
  font-family:var(--al-f-h); font-size:1.25rem; font-weight:900;
  letter-spacing:-.03em;
  background:var(--al-grad);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text;
}
/* logo */
.al-logo{
  display:flex;
  justify-content:center;
  margin-bottom:24px;
}

.al-logo-wrapper{
  position:relative;
}

.al-logo-wrapper::before{
  content:'';
  position:absolute;
  inset:-20px;
  background:radial-gradient(
    circle,
    rgba(80,70,228,.22),
    transparent 70%
  );
  filter:blur(20px);
  z-index:-1;
}

.al-logo-image{
  height: 90px;
  width:auto;
  object-fit:contain;
  animation:logoFloat 4s ease-in-out infinite;
}

@keyframes logoFloat{
  0%,100%{
    transform:translateY(0px);
  }
  50%{
    transform:translateY(-4px);
  }
}
/* title */
.al-title{
  font-family:var(--al-f-h);
  font-size:30px;
  font-weight:600;
  text-align:center;
  line-height:1.05;
  letter-spacing:-.04em;

  background:linear-gradient(
    135deg,
    #111827,
    #5046e4
  );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}
.al-subtitle {
  font-size:13px; color:#9ca3af; text-align:center; margin-bottom:22px; font-weight:400;
}

/* trust strip at bottom */
.al-trust {
  display:flex; align-items:center; justify-content:center; gap:16px;
  margin-top:18px; padding-top:14px;
  border-top:1px solid rgba(80,70,228,.08);
}
.al-trust-item {
  display:flex; align-items:center; gap:5px;
  font-size:10.5px; font-weight:600; color:#b0b7c8;
}
`;

const SUBTITLES = {
  "Create Account":   "Join thousands of happy shoppers",
  "Welcome Back":     "Good to see you again",
  "Verify Your Email":"One last step to get started",
};

export default function AuthLayout({ title, children }) {
  const navigate = useNavigate();
  const subtitle = SUBTITLES[title] || "";

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") navigate("/"); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="al-shell">
        {/* bg layers */}
        <div className="al-bg"/>
        <div className="al-orb al-orb-1"/>
        <div className="al-orb al-orb-2"/>
        <div className="al-orb al-orb-3"/>
        <div className="al-grid"/>

        {/* card */}
        <div className="al-card">
          {/* close */}
          <button className="al-close" onClick={() => navigate("/")} aria-label="Close">
            <X size={14}/>
          </button>

          {/* logo */}
          <div className="al-logo">
  <div className="al-logo-wrapper">
    <img
      src="/logo.png"
      alt="Odikart"
      className="al-logo-image"
    />
  </div>
</div>

          {/* title */}
          <h1 className="al-title text-3xl font-bold text-center">{title}</h1>
          {subtitle && <p className="al-subtitle">{subtitle}</p>}

          {/* content */}
          {children}

          {/* trust strip */}
          <div className="al-trust">
            {["🔒 Secure","🛡️ Private","⚡ Fast"].map(t => (
              <div key={t} className="al-trust-item">{t}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

