import { useUser, UserProfile, SignOutButton } from "@clerk/clerk-react";
import { useState } from "react";
import { FaSignOutAlt, FaUser, FaTimes, FaShieldAlt, FaEnvelope } from "react-icons/fa";
import FuzzyText from "../components/FuzzyText";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@heroui/react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  if (!isLoaded) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap');

        :root {
          --p-indigo-950: #1e1b4b;
          --p-indigo-900: #312e81;
          --p-indigo-700: #4338ca;
          --p-indigo-600: #4f46e5;
          --p-indigo-500: #6366f1;
          --p-indigo-400: #818cf8;
          --p-indigo-200: #c7d2fe;
          --p-indigo-100: #e0e7ff;
          --p-indigo-50:  #eef2ff;
          --p-blue-600:   #2563eb;
          --p-blue-500:   #3b82f6;
          --p-blue-400:   #60a5fa;
          --p-blue-100:   #dbeafe;
          --p-blue-50:    #eff6ff;
          --p-white:      #ffffff;
          --p-slate-700:  #334155;
          --p-slate-500:  #64748b;
          --p-slate-300:  #cbd5e1;
          --p-slate-100:  #f1f5f9;
          --p-grad:       linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
          --p-grad-soft:  linear-gradient(135deg, #eef2ff 0%, #eff6ff 100%);
          --p-shadow-card: 0 4px 24px rgba(79,70,229,0.08), 0 1px 4px rgba(79,70,229,0.04);
          --p-shadow-btn:  0 4px 16px rgba(79,70,229,0.28);
          font-family: 'Lato', sans-serif;
        }

        /* ── page shell ── */
        .pp-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #f0f4ff 0%, #e8f0ff 35%, #f5f8ff 70%, #ffffff 100%);
          padding: 0 0 80px;
          position: relative;
          overflow: hidden;
        }

        /* decorative blobs */
        .pp-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          z-index: 0;
        }
        .pp-blob-1 {
          width: 600px; height: 600px;
          top: -200px; right: -150px;
          background: radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 65%);
          animation: blobDrift1 12s ease-in-out infinite alternate;
        }
        .pp-blob-2 {
          width: 400px; height: 400px;
          bottom: -100px; left: -100px;
          background: radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 65%);
          animation: blobDrift2 15s ease-in-out infinite alternate;
        }
        @keyframes blobDrift1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-30px,40px) scale(1.06); }
        }
        @keyframes blobDrift2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(20px,-25px) scale(1.04); }
        }

        /* dot grid */
        .pp-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(79,70,229,0.07) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
          pointer-events: none;
          z-index: 0;
        }

        .pp-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── hero banner ── */
        .pp-hero {
          position: relative;
          height: 200px;
          border-radius: 0 0 32px 32px;
          overflow: hidden;
          margin-bottom: -60px;
        }

        .pp-hero-mesh {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, #1e1b4b 0%, #4338ca 40%, #2563eb 70%, #4f46e5 100%);
        }

        /* geometric lines on hero */
        .pp-hero-lines {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .pp-hero-lines::before,
        .pp-hero-lines::after {
          content: '';
          position: absolute;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
        }
        .pp-hero-lines::before {
          width: 400px; height: 400px;
          top: -200px; right: -60px;
        }
        .pp-hero-lines::after {
          width: 280px; height: 280px;
          bottom: -140px; left: 60px;
        }

        /* shimmer sweep on hero */
        .pp-hero-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255,255,255,0.06) 50%,
            transparent 70%
          );
          background-size: 200% 100%;
          animation: heroShimmer 4s linear infinite;
        }
        @keyframes heroShimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* centered wordmark */
        .pp-wordmark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pp-wordmark-pill {
          position: relative;
          padding: 12px 32px;
          border-radius: 20px;
          background: rgba(0,0,0,0.25);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .pp-wordmark-pill::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 26px;
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(59,130,246,0.15));
          filter: blur(12px);
          z-index: -1;
        }

        /* ── profile card ── */
        .pp-card {
          background: var(--p-white);
          border-radius: 28px;
          border: 1px solid rgba(79,70,229,0.10);
          box-shadow: var(--p-shadow-card);
          padding: 18px;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .pp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--p-grad);
          border-radius: 28px 28px 0 0;
        }

        /* avatar section */
        .pp-avatar-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .pp-avatar-group {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .pp-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .pp-avatar-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: var(--p-grad);
          padding: 2px;
          z-index: 0;
        }
        .pp-avatar-ring-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          background: white;
        }
        .pp-avatar {
          position: relative;
          z-index: 1;
          width: 76px; height: 76px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 4px 16px rgba(79,70,229,0.20);
        }

        /* online dot */
        .pp-status-dot {
          position: absolute;
          bottom: 4px; right: 4px;
          width: 14px; height: 14px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid white;
          z-index: 2;
          box-shadow: 0 0 6px rgba(34,197,94,0.5);
        }

        .pp-user-name {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--p-indigo-950);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .pp-user-email {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--p-slate-500);
          margin-top: 4px;
          font-weight: 400;
        }
        .pp-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--p-indigo-600);
          background: var(--p-indigo-50);
          border: 1px solid var(--p-indigo-200);
          border-radius: 100px;
          padding: 3px 10px;
          margin-top: 6px;
        }

        /* action buttons */
        .pp-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .pp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 14px;
          font-family: 'Lato', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .pp-btn-outline {
          background: var(--p-indigo-50);
          color: var(--p-indigo-700);
          border: 1.5px solid var(--p-indigo-200);
          box-shadow: 0 2px 8px rgba(79,70,229,0.06);
        }
        .pp-btn-outline:hover {
          background: var(--p-indigo-100);
          border-color: var(--p-indigo-400);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 18px rgba(79,70,229,0.14);
        }

        .pp-btn-primary {
          background: var(--p-grad);
          color: white;
          box-shadow: var(--p-shadow-btn);
        }
        .pp-btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 28px rgba(79,70,229,0.40);
          filter: brightness(1.05);
        }
        .pp-btn-primary:active,
        .pp-btn-outline:active { transform: scale(0.97); }

        /* ── info chips row ── */
        .pp-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(79,70,229,0.07);
        }

        .pp-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          background: var(--p-grad-soft);
          border: 1px solid rgba(79,70,229,0.10);
          font-size: 12.5px;
          color: var(--p-slate-700);
          font-weight: 500;
        }
        .pp-chip-icon {
          width: 22px; height: 22px;
          border-radius: 7px;
          background: var(--p-grad);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          flex-shrink: 0;
        }

        /* ── modal overrides ── */
        /* Profile modal */
        .pp-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 18px;
          border-bottom: 1px solid rgba(79,70,229,0.09);
          background: white;
        }
        .pp-modal-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--p-indigo-950);
          letter-spacing: -0.01em;
        }
        .pp-modal-close {
          width: 34px; height: 34px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: var(--p-indigo-50);
          border: 1px solid var(--p-indigo-200);
          color: var(--p-indigo-600);
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .pp-modal-close:hover {
          background: var(--p-indigo-100);
          color: var(--p-indigo-900);
          transform: scale(1.08);
        }

        /* logout modal */
        .pp-logout-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(37,99,235,0.1));
          border: 1px solid rgba(79,70,229,0.15);
          display: flex; align-items: center; justify-content: center;
          color: var(--p-indigo-600);
          font-size: 20px;
          margin-bottom: 12px;
        }
        .pp-logout-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--p-indigo-950);
        }
        .pp-logout-sub {
          font-size: 13.5px;
          color: var(--p-slate-500);
          line-height: 1.5;
          margin-top: 4px;
        }

        .pp-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid var(--p-slate-300);
          background: white;
          color: var(--p-slate-700);
          transition: all 0.2s ease;
        }
        .pp-btn-ghost:hover {
          border-color: var(--p-indigo-300);
          color: var(--p-indigo-700);
          background: var(--p-indigo-50);
        }

        .pp-btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 22px;
          border-radius: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          background: var(--p-grad);
          color: white;
          box-shadow: var(--p-shadow-btn);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .pp-btn-danger:hover {
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 8px 24px rgba(79,70,229,0.4);
        }
      `}</style>

      <div className="pp-page">
        {/* bg decorations */}
        <div className="pp-blob pp-blob-1" />
        <div className="pp-blob pp-blob-2" />
        <div className="pp-dots" />

        {/* ── HERO BANNER ── */}
        <div className="pp-hero">
          <div className="pp-hero-mesh" />
          <div className="pp-hero-lines" />
          <div className="pp-hero-shimmer" />
          <div className="pp-wordmark">
            <div className="pp-wordmark-pill">
              <FuzzyText
                fontSize="clamp(2rem,6vw,4.5rem)"
                fontWeight={900}
                color="#ffffff"
                baseIntensity={0.12}
                hoverIntensity={0.40}
              >
                E-Shop
              </FuzzyText>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="pp-inner" style={{ paddingTop: 80 }}>

          {/* ── PROFILE CARD ── */}
          <div className="pp-card">
            <div className="pp-avatar-row">

              {/* left: avatar + name */}
              <div className="pp-avatar-group">
                <div className="pp-avatar-wrap">
                  <div className="pp-avatar-ring">
                    <div className="pp-avatar-ring-inner" />
                  </div>
                  <img src={user?.imageUrl} alt="avatar" className="pp-avatar" />
                  <span className="pp-status-dot" title="Online" />
                </div>

                <div>
                  <div className="pp-user-name">{user?.fullName}</div>
                  <div className="pp-user-email">
                    <FaEnvelope size={11} style={{ color: "var(--p-indigo-500)", flexShrink: 0 }} />
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                  <div className="pp-user-badge">
                    <FaShieldAlt size={9} />
                    Verified Member
                  </div>
                </div>
              </div>

              {/* right: action buttons */}
              <div className="pp-actions">
                <button
                  className="pp-btn pp-btn-outline"
                  onClick={() => setOpenProfile(true)}
                >
                  <FaUser size={13} />
                  Profile Settings
                </button>
                <button
                  className="pp-btn pp-btn-primary"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <FaSignOutAlt size={13} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* info chips */}
            <div className="pp-chips">
              <div className="pp-chip">
                <div className="pp-chip-icon">
                  <FaEnvelope size={9} />
                </div>
                {user?.primaryEmailAddress?.emailAddress}
              </div>
              <div className="pp-chip">
                <div className="pp-chip-icon">
                  <FaShieldAlt size={9} />
                </div>
                Account verified
              </div>
              <div className="pp-chip">
                <div className="pp-chip-icon" style={{ fontSize: 9 }}>✦</div>
                Member since {new Date(user?.createdAt).getFullYear?.() || "2024"}
              </div>
            </div>
          </div>

        </div>

        {/* ══ PROFILE SETTINGS MODAL ══ */}
        <Modal
          size="5xl"
          isOpen={openProfile}
          onOpenChange={setOpenProfile}
          backdrop="blur"
          hideCloseButton
          scrollBehavior="inside"
          classNames={{
            base: "bg-white border border-indigo-100 rounded-3xl shadow-2xl",
            backdrop: "bg-indigo-950/30 backdrop-blur-md"
          }}
        >
          <ModalContent>
            <ModalHeader style={{ padding: 0 }}>
              <div className="pp-modal-header" style={{ width: "100%" }}>
                <span className="pp-modal-title">Profile Settings</span>
                <button
                  className="pp-modal-close"
                  onClick={() => setOpenProfile(false)}
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </ModalHeader>
            <ModalBody style={{ margin: 0, padding: "16px" }}>
              <div style={{ maxHeight: "75vh", overflowX: "auto", overflowY: "hidden" }}>
                <UserProfile />
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* ══ LOGOUT CONFIRM MODAL ══ */}
        <Modal
          isOpen={showLogoutConfirm}
          onOpenChange={setShowLogoutConfirm}
          placement="center"
          hideCloseButton
          backdrop="blur"
          classNames={{
            base: "bg-white border border-indigo-100 rounded-3xl shadow-2xl max-w-sm mx-auto",
            backdrop: "bg-indigo-950/20 backdrop-blur-md"
          }}
        >
          <ModalContent>
            <ModalHeader style={{ padding: 0 }}>
              <div style={{ padding: "28px 28px 0", width: "100%" }}>
                <div className="pp-logout-icon">
                  <FaSignOutAlt />
                </div>
                <div className="pp-logout-title">Sign out of E-Shop?</div>
                <div className="pp-logout-sub">
                  You'll need to sign back in to access your cart and orders.
                </div>
              </div>
            </ModalHeader>
            <ModalBody style={{ padding: "16px 28px" }}>
              {/* divider */}
              <div style={{ height: 1, background: "rgba(79,70,229,0.08)", borderRadius: 1 }} />
            </ModalBody>
            <ModalFooter style={{ padding: "0 28px 28px", gap: 10 }}>
              <button
                className="pp-btn-ghost"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <SignOutButton>
                <button className="pp-btn-danger">
                  <FaSignOutAlt size={12} />
                  Yes, Sign Out
                </button>
              </SignOutButton>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </div>
    </>
  );
}