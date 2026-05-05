import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const accessKey = import.meta.env.VITE_WEB3FORMS_SUB_ACCESS_KEY;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: "Newsletter Subscriber",
          email,
          subject: "New Newsletter Subscription",
          message: `User subscribed with email: ${email}`,
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("🎉 You are subscribed successfully!");
        setEmail("");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { to: "/contact", label: "Contact" },
    { to: "/track-order", label: "Track Order" },
    { to: "/legal/privacy", label: "Privacy Policy" },
    { to: "/legal/terms", label: "Terms & Conditions" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

        .ft-root {
          /* ── UPDATED: dark indigo/blue/violet surface ── */
          --c-bg:      #0d0e1f;
          --c-surface: #0d0e1f;
          --c-glass:   rgba(99,102,241,0.08);
          --c-border:  rgba(99,120,255,0.18);
          --c-indigo:  #818cf8;
          --c-blue:    #60a5fa;
          --c-accent:  #a5b4fc;
          --c-text:    #c7d2fe;
          --c-muted:   #6b7fba;
          --grad:      linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);

          font-family: 'Outfit', sans-serif;
          position: relative;
          background: var(--c-bg);
          overflow: hidden;
          color: var(--c-text);
        }

        /* ── atmospheric orbs ── */
        .ft-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .ft-orb-1 {
          width: 380px; height: 380px;
          top: -140px; left: -80px;
          background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%);
          animation: ftOrb1 9s ease-in-out infinite alternate;
        }
        .ft-orb-2 {
          width: 300px; height: 300px;
          bottom: -80px; right: -60px;
          background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%);
          animation: ftOrb2 11s ease-in-out infinite alternate;
        }
        /* third accent orb — violet */
        .ft-orb-3 {
          width: 220px; height: 220px;
          top: 40%; right: 28%;
          background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%);
          animation: ftOrb2 14s ease-in-out infinite alternate;
        }
        @keyframes ftOrb1 { from { transform: translate(0,0); } to { transform: translate(20px, 15px); } }
        @keyframes ftOrb2 { from { transform: translate(0,0); } to { transform: translate(-15px, -10px); } }

        /* noise texture */
        .ft-noise {
          position: absolute;
          inset: 0;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* shimmer top border */
        .ft-top-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #6366f1 30%, #60a5fa 60%, transparent 100%);
          background-size: 200% 100%;
          animation: ftLine 4s linear infinite;
          z-index: 5;
        }
        @keyframes ftLine {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* dot grid — now slightly more visible on dark bg */
        .ft-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(99,102,241,0.10) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── inner layout ── */
        .ft-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 40px 40px;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.6fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ft-inner { grid-template-columns: 1fr 1fr; gap: 36px; padding: 44px 28px 32px; }
        }
        @media (max-width: 580px) {
          .ft-inner { grid-template-columns: 1fr; gap: 32px; padding: 40px 20px 28px; }
        }

        /* ── brand col ── */
        .ft-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          /* UPDATED: bright gradient readable on dark */
          background: linear-gradient(135deg, #a5b4fc 0%, #60a5fa 50%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          display: inline-block;
        }

        .ft-tagline {
          font-size: 13px;
          line-height: 1.65;
          color: var(--c-muted);
          max-width: 220px;
          font-weight: 300;
          margin-bottom: 20px;
        }

        /* social row */
        .ft-socials { display: flex; gap: 10px; }

        .ft-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--c-glass);
          border: 1px solid var(--c-border);
          color: var(--c-muted);
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          overflow: hidden;
        }
        .ft-social-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--grad);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ft-social-btn:hover::before { opacity: 1; }
        .ft-social-btn:hover {
          color: white;
          border-color: transparent;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 6px 20px rgba(99,102,241,0.40);
        }
        .ft-social-btn svg { position: relative; z-index: 1; }

        /* ── links col ── */
        .ft-links-title {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          /* UPDATED: bright indigo-300 so it pops on dark */
          color: #a5b4fc;
          margin-bottom: 16px;
        }

        .ft-links { display: flex; flex-direction: column; gap: 2px; }

        .ft-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 0;
          font-size: 13.5px;
          color: var(--c-muted);
          text-decoration: none;
          font-weight: 400;
          transition: all 0.25s ease;
          position: relative;
          width: fit-content;
        }
        .ft-link::after {
          content: '';
          position: absolute;
          bottom: 5px; left: 0;
          width: 0; height: 1px;
          background: var(--grad);
          transition: width 0.3s ease;
          border-radius: 1px;
        }
        .ft-link:hover { color: #c7d2fe; }
        .ft-link:hover::after { width: 100%; }

        .ft-link-arrow {
          font-size: 10px;
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.25s ease;
        }
        .ft-link:hover .ft-link-arrow { opacity: 1; transform: translateX(0); }

        /* ── newsletter col ── */
        .ft-nl-title {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a5b4fc;
          margin-bottom: 6px;
        }

        .ft-nl-sub {
          font-size: 13px;
          color: var(--c-muted);
          font-weight: 300;
          margin-bottom: 18px;
          line-height: 1.5;
        }

        /* input wrapper */
        .ft-form {
          display: flex;
          border-radius: 14px;
          /* UPDATED: dark glass input surface */
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(99,102,241,0.22);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .ft-form.focused {
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 4px 20px rgba(99,102,241,0.10);
        }

        .ft-input {
          flex: 1;
          padding: 12px 16px;
          font-size: 13px;
          font-family: 'Outfit', sans-serif;
          background: transparent;
          border: none;
          outline: none;
          /* UPDATED: light text on dark */
          color: #e0e7ff;
        }
        .ft-input::placeholder { color: var(--c-muted); }

        .ft-submit {
          padding: 11px 20px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: white;
          background: var(--grad);
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          min-width: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ft-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #7c3aed 0%, #60a5fa 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ft-submit:hover::before { opacity: 1; }
        .ft-submit:hover { box-shadow: 0 4px 18px rgba(99,102,241,0.45); }
        .ft-submit:active { transform: scale(0.97); }
        .ft-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .ft-submit span { position: relative; z-index: 1; }

        /* loading dots */
        .ft-dots-loading { display: flex; gap: 3px; align-items: center; position: relative; z-index: 1; }
        .ft-dots-loading span {
          width: 4px; height: 4px; border-radius: 50%;
          background: white; animation: dotBounce 1.2s ease-in-out infinite;
        }
        .ft-dots-loading span:nth-child(2) { animation-delay: 0.2s; }
        .ft-dots-loading span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }

        /* trust badges */
        .ft-badges { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
        .ft-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          /* UPDATED: indigo tint on dark bg */
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.22);
          font-size: 10.5px;
          color: var(--c-muted);
          font-weight: 500;
        }
        .ft-badge-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #818cf8;
        }

        /* ── bottom bar ── */
        .ft-bottom {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(99,102,241,0.14);
          padding: 18px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        @media (max-width: 580px) {
          .ft-bottom { padding: 16px 20px; justify-content: center; text-align: center; }
        }

        .ft-copy {
          font-size: 12px;
          color: var(--c-muted);
          font-weight: 300;
        }
        .ft-copy strong {
          font-weight: 600;
          background: linear-gradient(135deg, #818cf8, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ft-made {
          font-size: 11px;
          color: rgba(107,127,186,0.7);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ft-heart {
          color: #f87171;
          animation: heartbeat 1.8s ease-in-out infinite;
          font-size: 12px;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          20%       { transform: scale(1.2); }
          40%       { transform: scale(1); }
          60%       { transform: scale(1.1); }
        }
      `}</style>

      <footer className="ft-root">
        {/* atmosphere */}
        <div className="ft-orb ft-orb-1" />
        <div className="ft-orb ft-orb-2" />
        <div className="ft-orb ft-orb-3" />
        <div className="ft-noise" />
        <div className="ft-top-line" />
        <div className="ft-dots" />

        {/* main grid */}
        <div className="ft-inner">

          {/* ── BRAND ── */}
          <div>
            <div className="ft-brand-name">E-Shop</div>
            <p className="ft-tagline">
              Premium electronics & gadgets curated for your everyday life.
            </p>
            <div className="ft-socials">
              {[
                { Icon: FaFacebook },
                { Icon: FaInstagram },
                { Icon: FaTwitter },
                { Icon: FaLinkedin },
              ].map(({ Icon }, i) => (
                <a key={i} href="#" className="ft-social-btn" aria-label="social">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── LINKS ── */}
          <div>
            <div className="ft-links-title">Quick Links</div>
            <nav className="ft-links">
              {links.map(({ to, label }) => (
                <Link key={to} to={to} className="ft-link">
                  <span className="ft-link-arrow">→</span>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── NEWSLETTER ── */}
          <div>
            <div className="ft-nl-title">Stay in the Loop</div>
            <p className="ft-nl-sub">
              Exclusive deals & product drops delivered straight to your inbox.
            </p>

            <form
              onSubmit={handleSubscribe}
              className={`ft-form${focused ? " focused" : ""}`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="your@email.com"
                className="ft-input"
              />
              <button type="submit" disabled={loading} className="ft-submit">
                {loading ? (
                  <div className="ft-dots-loading">
                    <span /><span /><span />
                  </div>
                ) : (
                  <span>Join</span>
                )}
              </button>
            </form>

            <div className="ft-badges">
              <span className="ft-badge"><span className="ft-badge-dot" />No spam</span>
              <span className="ft-badge"><span className="ft-badge-dot" />Unsubscribe anytime</span>
            </div>
          </div>

        </div>

        {/* bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copy">
            © {new Date().getFullYear()} <strong>E-Shop</strong>. All rights reserved.
          </p>
          <p className="ft-made">
            Built with <span className="ft-heart">♥</span> for great experiences
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;