import { useEffect, useState } from "react";
import { FaSignOutAlt, FaUser, FaTimes, FaShieldAlt, FaEnvelope, FaCamera, FaCheck, FaLock } from "react-icons/fa";
import FuzzyText from "../components/FuzzyText";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ProfilePage() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSecurity, setOpenSecurity] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://eshop-backend-y0e7.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
  }, [token]);

  if (loading) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --p-indigo-950: #1e1b4b;
          --p-indigo-900: #312e81;
          --p-indigo-700: #4338ca;
          --p-indigo-600: #4f46e5;
          --p-indigo-500: #6366f1;
          --p-indigo-400: #818cf8;
          --p-indigo-200: #c7d2fe;
          --p-indigo-100: #e0e7ff;
          --p-indigo-50: #eef2ff;
          --p-blue-600: #2563eb;
          --p-blue-500: #3b82f6;
          --p-blue-400: #60a5fa;
          --p-blue-100: #dbeafe;
          --p-blue-50: #eff6ff;
          --p-white: #ffffff;
          --p-slate-700: #334155;
          --p-slate-500: #64748b;
          --p-slate-300: #cbd5e1;
          --p-slate-100: #f1f5f9;
          --p-grad: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
          --p-grad-soft: linear-gradient(135deg, #eef2ff 0%, #eff6ff 100%);
          --p-shadow-card: 0 4px 24px rgba(79, 70, 229, 0.08), 0 1px 4px rgba(79, 70, 229, 0.04);
          --p-shadow-btn: 0 4px 16px rgba(79, 70, 229, 0.28);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }

        /* ════ ANIMATIONS ════ */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes blobDrift1 {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(-30px, 40px) scale(1.06);
          }
        }

        @keyframes blobDrift2 {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(20px, -25px) scale(1.04);
          }
        }

        @keyframes heroShimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes checkMark {
          0% {
            transform: scale(0) rotate(-45deg);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1) rotate(0);
          }
        }

        /* ════ PAGE ════ */
        .pp-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #f0f4ff 0%, #e8f0ff 35%, #f5f8ff 70%, #ffffff 100%);
          padding: 0 0 80px;
          position: relative;
          overflow: hidden;
        }

        .pp-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          z-index: 0;
        }

        .pp-blob-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -150px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 65%);
          animation: blobDrift1 12s ease-in-out infinite alternate;
        }

        .pp-blob-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          left: -100px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.09) 0%, transparent 65%);
          animation: blobDrift2 15s ease-in-out infinite alternate;
        }

        .pp-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(79, 70, 229, 0.05) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
          pointer-events: none;
          z-index: 0;
        }

        .pp-inner {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ════ HERO ════ */
        .pp-hero {
          position: relative;
          height: 220px;
          border-radius: 0 0 40px 40px;
          overflow: hidden;
          margin-bottom: -70px;
          animation: slideInDown 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pp-hero-mesh {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 40%, #2563eb 70%, #4f46e5 100%);
        }

        .pp-hero-lines {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .pp-hero-lines::before,
        .pp-hero-lines::after {
          content: '';
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
        }

        .pp-hero-lines::before {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -60px;
        }

        .pp-hero-lines::after {
          width: 280px;
          height: 280px;
          bottom: -140px;
          left: 60px;
        }

        .pp-hero-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.06) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: heroShimmer 4s linear infinite;
        }

        .pp-wordmark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pp-wordmark-pill {
          position: relative;
          padding: 14px 36px;
          border-radius: 24px;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* ════ PROFILE CARD ════ */
        .pp-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          border: 1.5px solid rgba(79, 70, 229, 0.12);
          box-shadow: 0 20px 60px rgba(79, 70, 229, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05);
          padding: 32px;
          position: relative;
          overflow: hidden;
          margin-bottom: 28px;
          animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        .pp-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--p-grad);
          border-radius: 32px 32px 0 0;
        }

        .pp-avatar-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          flex-wrap: wrap;
        }

        .pp-avatar-group {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .pp-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .pp-avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: var(--p-grad);
          padding: 3px;
          z-index: 0;
          animation: float 3s ease-in-out infinite;
        }

        .pp-avatar-ring-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: white;
        }

        .pp-avatar {
          position: relative;
          z-index: 1;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.25);
        }

        .pp-status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 18px;
          height: 18px;
          background: #10b981;
          border-radius: 50%;
          border: 3px solid white;
          z-index: 2;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
          animation: pulse 2s ease-in-out infinite;
        }

        .pp-user-info h1 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 800;
          color: var(--p-indigo-950);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0;
        }

        .pp-user-email {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--p-slate-500);
          margin-top: 8px;
          font-weight: 500;
        }

        .pp-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--p-indigo-600);
          background: var(--p-indigo-50);
          border: 1.5px solid var(--p-indigo-200);
          border-radius: 100px;
          padding: 5px 14px;
          margin-top: 10px;
        }

        /* ════ ACTIONS ════ */
        .pp-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .pp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          white-space: nowrap;
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
        }

        .pp-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.28s;
        }

        .pp-btn-outline {
          background: rgba(79, 70, 229, 0.08);
          color: var(--p-indigo-700);
          border: 1.5px solid rgba(79, 70, 229, 0.25);
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.05);
        }

        .pp-btn-outline:hover {
          background: rgba(79, 70, 229, 0.15);
          border-color: rgba(79, 70, 229, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.18);
        }

        .pp-btn-primary {
          background: var(--p-grad);
          color: white;
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
        }

        .pp-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(79, 70, 229, 0.4);
          filter: brightness(1.05);
        }

        .pp-btn:active {
          transform: scale(0.96);
        }

        /* ════ CHIPS ════ */
        .pp-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
          padding-top: 28px;
          border-top: 1.5px solid rgba(79, 70, 229, 0.08);
        }

        .pp-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: 14px;
          background: var(--p-grad-soft);
          border: 1.5px solid rgba(79, 70, 229, 0.12);
          font-size: 13px;
          color: var(--p-slate-700);
          font-weight: 600;
        }

        .pp-chip-icon {
          width: 24px;
          height: 24px;
          border-radius: 8px;
          background: var(--p-grad);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          flex-shrink: 0;
        }

        /* ════ MODALS ════ */
        .pp-modal-header {
          position: relative;
          padding: 0;
          border: none;
          overflow: hidden;
        }

        .pp-modal-header-gradient {
          background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 40%, #2563eb 70%, #4f46e5 100%);
          padding: 48px 32px 60px;
          position: relative;
          overflow: hidden;
        }

        .pp-modal-header-gradient::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.08) 50%, transparent 70%);
          animation: heroShimmer 4s linear infinite;
        }

        .pp-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          transition: all 0.28s;
          z-index: 10;
        }

        .pp-modal-close:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1) rotate(90deg);
        }

        .pp-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 1;
          margin: 0 0 8px 0;
        }

        .pp-modal-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
          position: relative;
          z-index: 1;
          margin: 0;
        }

        /* ════ FORM FIELDS ════ */
        .pp-form-group {
          margin-bottom: 24px;
          animation: fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .pp-form-group:nth-child(1) {
          animation-delay: 0.1s;
        }
        .pp-form-group:nth-child(2) {
          animation-delay: 0.15s;
        }
        .pp-form-group:nth-child(3) {
          animation-delay: 0.2s;
        }
        .pp-form-group:nth-child(4) {
          animation-delay: 0.25s;
        }

        .pp-form-label {
          display: block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--p-indigo-700);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .pp-form-input {
          width: 100%;
          background: rgba(248, 250, 255, 0.8);
          border: 1.5px solid rgba(79, 70, 229, 0.15);
          border-radius: 15px;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 500;
          color: var(--p-indigo-950);
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          backdrop-filter: blur(10px);
        }

        .pp-form-input::placeholder {
          color: #cbd5e1;
          font-weight: 500;
        }

        .pp-form-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.95);
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
          backdrop-filter: blur(20px);
        }

        .pp-form-input:disabled {
          background: rgba(241, 245, 249, 0.6);
          color: #94a3b8;
          cursor: not-allowed;
          border-color: rgba(148, 163, 184, 0.2);
        }

        /* ════ UPLOAD BOX ════ */
        .pp-upload-box {
          border: 2.5px dashed rgba(79, 70, 229, 0.25);
          border-radius: 24px;
          background: rgba(238, 242, 255, 0.7);
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.28s;
          position: relative;
          overflow: hidden;
        }

        .pp-upload-box:hover {
          border-color: rgba(79, 70, 229, 0.5);
          background: rgba(238, 242, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(79, 70, 229, 0.15);
        }

        .pp-upload-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: var(--p-grad);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 16px;
          box-shadow: 0 12px 32px rgba(79, 70, 229, 0.25);
        }

        .pp-upload-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--p-indigo-950);
          margin-bottom: 6px;
        }

        .pp-upload-desc {
          font-size: 13px;
          color: var(--p-slate-500);
        }

        /* ════ BUTTONS ════ */
        .pp-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: 1.5px solid rgba(79, 70, 229, 0.2);
          background: rgba(248, 250, 255, 0.8);
          color: var(--p-slate-700);
          transition: all 0.28s;
        }

        .pp-btn-ghost:hover {
          border-color: rgba(79, 70, 229, 0.4);
          color: var(--p-indigo-700);
          background: rgba(238, 242, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.12);
        }

        .pp-btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          background: var(--p-grad);
          color: white;
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pp-btn-danger:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(79, 70, 229, 0.4);
          filter: brightness(1.05);
        }

        .pp-btn-danger:active {
          transform: scale(0.96);
        }

        /* ════ LOGOUT MODAL ════ */
        .pp-logout-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(37, 99, 235, 0.1));
          border: 1.5px solid rgba(79, 70, 229, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--p-indigo-600);
          font-size: 28px;
          margin-bottom: 16px;
        }

        .pp-logout-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 800;
          color: var(--p-indigo-950);
          margin-bottom: 8px;
        }

        .pp-logout-text {
          font-size: 14px;
          color: var(--p-slate-500);
          line-height: 1.6;
        }

        /* ════ RESPONSIVE ════ */
        @media (max-width: 768px) {
          .pp-inner {
            padding: 0 16px;
          }

          .pp-card {
            padding: 24px;
          }

          .pp-avatar-row {
            flex-direction: column;
            gap: 20px;
          }

          .pp-actions {
            width: 100%;
          }

          .pp-btn {
            flex: 1;
            justify-content: center;
          }

          .pp-user-info h1 {
            font-size: 24px;
          }

          .pp-modal-title {
            font-size: 24px;
          }

          .pp-form-input {
            padding: 12px 16px;
            font-size: 16px;
          }
        }
      `}</style>

      <div className="pp-page">
        <div className="pp-blob pp-blob-1" />
        <div className="pp-blob pp-blob-2" />
        <div className="pp-dots" />

        {/* HERO BANNER */}
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

        {/* MAIN CONTENT */}
        <div className="pp-inner" style={{ paddingTop: 100 }}>
          {/* PROFILE CARD */}
          <div className="pp-card">
            <div className="pp-avatar-row">
              <div className="pp-avatar-group">
                <div className="pp-avatar-wrap">
                  <div className="pp-avatar-ring">
                    <div className="pp-avatar-ring-inner" />
                  </div>
                  <img
                    src={user?.image || "https://i.pravatar.cc/300"}
                    alt="avatar"
                    className="pp-avatar"
                  />
                  <span className="pp-status-dot" title="Online" />
                </div>

                <div className="pp-user-info">
                  <h1>
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <div className="pp-user-email">
                    <FaEnvelope size={12} />
                    {user?.email}
                  </div>
                  <div className="pp-user-badge">
                    <FaCheck size={10} />
                    Verified Member
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pp-actions">
                <button
                  className="pp-btn pp-btn-outline"
                  onClick={() => setOpenProfile(true)}
                >
                  <FaUser size={14} />
                  Profile
                </button>

                <button
                  className="pp-btn pp-btn-outline"
                  onClick={() => setOpenSecurity(true)}
                >
                  <FaLock size={14} />
                  Security
                </button>

                <button
                  className="pp-btn pp-btn-primary"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <FaSignOutAlt size={14} />
                  Sign Out
                </button>
                <button
  className="pp-btn pp-btn-danger"
  onClick={async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account and cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        "https://eshop-backend-y0e7.onrender.com/api/auth/delete-account",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Account permanently deleted");

        localStorage.removeItem("token");

        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 1000);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account");
    }
  }}
>
  Delete Account
</button>
              </div>
            </div>

            {/* INFO CHIPS */}
            <div className="pp-chips">
              <div className="pp-chip">
                <div className="pp-chip-icon">
                  <FaEnvelope size={10} />
                </div>
                {user?.email}
              </div>
              <div className="pp-chip">
                <div className="pp-chip-icon">
                  <FaCheck size={10} />
                </div>
                Account verified
              </div>
              <div className="pp-chip">
                <div className="pp-chip-icon">✦</div>
                Member since{" "}
                {user?.createdAt
                  ? user.createdAt.split("/")[2].split(",")[0]
                  : "2024"}
              </div>
            </div>
          </div>
        </div>

        {/* ══ PROFILE MODAL ══ */}
        <Modal
          size="2xl"
          isOpen={openProfile}
          onOpenChange={setOpenProfile}
          backdrop="blur"
          hideCloseButton
          scrollBehavior="inside"
          classNames={{
            base: "bg-white/95 backdrop-blur-xl border border-indigo-100 rounded-[32px] shadow-[0_20px_80px_rgba(79,70,229,0.20)] mx-3 my-4 max-h-[95vh]",
            backdrop: "bg-indigo-950/40 backdrop-blur-md",
          }}
        >
          <ModalContent className="overflow-hidden">
            {/* HEADER */}
            <div className="pp-modal-header">
              <div className="pp-modal-header-gradient">
                <button
                  onClick={() => setOpenProfile(false)}
                  className="pp-modal-close"
                >
                  <FaTimes size={16} />
                </button>
                <h2 className="pp-modal-title">Profile Settings</h2>
                <p className="pp-modal-subtitle">Manage your personal account details</p>
              </div>

              {/* AVATAR */}
              <div style={{ textAlign: "center", marginTop: -52, position: "relative", zIndex: 10 }}>
                <img
                  src={user?.image || "https://i.pravatar.cc/300"}
                  alt="profile"
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "5px solid white",
                    boxShadow: "0 20px 50px rgba(79,70,229,0.25)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: -6,
                    bottom: 6,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "3px solid white",
                  }}
                />
              </div>
            </div>

            {/* BODY */}
            <ModalBody style={{ padding: "48px 32px 24px" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FIRST NAME */}
                <div className="pp-form-group">
                  <label className="pp-form-label">First Name</label>
                  <input
                    type="text"
                    value={user?.firstName || ""}
                    onChange={(e) =>
                      setUser({ ...user, firstName: e.target.value })
                    }
                    className="pp-form-input"
                    placeholder="Enter first name"
                  />
                </div>

                {/* LAST NAME */}
                <div className="pp-form-group">
                  <label className="pp-form-label">Last Name</label>
                  <input
                    type="text"
                    value={user?.lastName || ""}
                    onChange={(e) =>
                      setUser({ ...user, lastName: e.target.value })
                    }
                    className="pp-form-input"
                    placeholder="Enter last name"
                  />
                </div>

                {/* EMAIL */}
                <div className="pp-form-group md:col-span-2">
                  <label className="pp-form-label">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="pp-form-input"
                  />
                </div>

                {/* PHONE */}
                <div className="pp-form-group md:col-span-2">
                  <label className="pp-form-label">Phone Number</label>
                  <input
                    type="text"
                    value={user?.phone || ""}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="pp-form-input"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* UPLOAD */}
                <div className="pp-form-group md:col-span-2">
                  <label className="pp-form-label">Profile Photo</label>
                  <label className="pp-upload-box">
                    <div className="pp-upload-icon">
                      <FaCamera />
                    </div>
                    <div className="pp-upload-title">Upload Profile Photo</div>
                    <div className="pp-upload-desc">Camera or gallery supported</div>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const imageUrl = URL.createObjectURL(file);
                        setUser({
                          ...user,
                          image: imageUrl,
                          imageFile: file,
                        });
                      }}
                    />
                  </label>
                </div>
              </div>
            </ModalBody>

            {/* FOOTER */}
            <ModalFooter style={{ padding: "20px 32px 32px" }}>
              <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                <button
                  onClick={() => setOpenProfile(false)}
                  className="pp-btn-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      const formData = new FormData();
                      formData.append("firstName", user.firstName);
                      formData.append("lastName", user.lastName);
                      formData.append("phone", user.phone);
                      if (user.imageFile) {
                        formData.append("image", user.imageFile);
                      }

                      const res = await fetch(
                        "https://eshop-backend-y0e7.onrender.com/api/auth/update-profile",
                        {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          body: formData,
                        }
                      );

                      const data = await res.json();
                      if (data.success) {
  setUser(data.user);

  toast.success("Profile updated successfully ✨");

  setOpenProfile(false);

  setTimeout(() => {
    window.location.reload();
  }, 500);
}
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to update profile");
                    }
                  }}
                  className="pp-btn pp-btn-primary"
                  style={{ flex: 1 }}
                >
                  <FaCheck size={14} />
                  Save Changes
                </button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* ══ SECURITY MODAL ══ */}
        <Modal
          size="md"
          isOpen={openSecurity}
          onOpenChange={setOpenSecurity}
          backdrop="blur"
          hideCloseButton
          scrollBehavior="inside"
          classNames={{
            base: "bg-white/95 backdrop-blur-xl border border-indigo-100 rounded-[32px] shadow-[0_20px_80px_rgba(79,70,229,0.20)] mx-3 my-4",
            backdrop: "bg-indigo-950/40 backdrop-blur-md",
          }}
        >
          <ModalContent className="overflow-hidden">
            <div className="pp-modal-header">
              <div className="pp-modal-header-gradient">
                <button
                  onClick={() => setOpenSecurity(false)}
                  className="pp-modal-close"
                >
                  <FaTimes size={16} />
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      color: "white",
                    }}
                  >
                    🔒
                  </div>
                  <div>
                    <h2 className="pp-modal-title" style={{ marginBottom: 4 }}>
                      Security Settings
                    </h2>
                    <p className="pp-modal-subtitle">Update your password securely</p>
                  </div>
                </div>
              </div>
            </div>

            <ModalBody style={{ padding: "32px" }}>
              <div className="space-y-6">
                {/* CURRENT PASSWORD */}
                <div className="pp-form-group" style={{ marginBottom: 0 }}>
                  <label className="pp-form-label">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    className="pp-form-input"
                  />
                </div>

                {/* NEW PASSWORD */}
                <div className="pp-form-group" style={{ marginBottom: 0 }}>
                  <label className="pp-form-label">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    className="pp-form-input"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="pp-form-group" style={{ marginBottom: 0 }}>
                  <label className="pp-form-label">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    className="pp-form-input"
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter style={{ padding: "0 32px 32px" }}>
              <button
                disabled={passwordLoading}
                onClick={async () => {
                  try {
                    if (
                      passwordData.newPassword !==
                      passwordData.confirmPassword
                    ) {
                      return toast.error("Passwords do not match");
                    }

                    setPasswordLoading(true);

                    const res = await fetch(
                      "https://eshop-backend-y0e7.onrender.com/api/auth/change-password",
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          currentPassword: passwordData.currentPassword,
                          newPassword: passwordData.newPassword,
                        }),
                      }
                    );

                    const data = await res.json();

                    if (data.success) {
                      toast.success("Password changed successfully 🎉");
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setOpenSecurity(false);
                      setTimeout(() => {
                        window.location.reload();
                      }, 500);
                    } else {
                      toast.error(data.message);
                    }
                  } catch (error) {
                    console.error(error);
                    toast.error("Failed to change password");
                  } finally {
                    setPasswordLoading(false);
                  }
                }}
                className="pp-btn pp-btn-danger w-full"
                style={{ padding: "14px 0" }}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* ══ LOGOUT MODAL ══ */}
        <Modal
          size="sm"
          isOpen={showLogoutConfirm}
          onOpenChange={setShowLogoutConfirm}
          backdrop="blur"
          hideCloseButton
          classNames={{
            base: "bg-white border border-indigo-100 rounded-[28px] shadow-[0_20px_80px_rgba(79,70,229,0.20)] max-w-sm",
            backdrop: "bg-indigo-950/40 backdrop-blur-md",
          }}
        >
          <ModalContent>
          <ModalBody style={{ padding: "32px" }}>
  <div className="flex items-center justify-center gap-3 mb-3">
    <div className="pp-logout-icon">
      <FaSignOutAlt />
    </div>

    <h3 className="pp-logout-title m-0">
      Sign out of E-Shop?
    </h3>
  </div>

  <p className="pp-logout-text text-center">
    You'll need to sign back in to access your cart and orders.
  </p>
</ModalBody>

            <ModalFooter style={{ padding: "0 32px 32px", gap: 12 }}>
             <button
  onClick={() => setShowLogoutConfirm(false)}
  className="pp-btn-ghost flex items-center justify-center gap-2"
  style={{ flex: 1 }}
>
  <span>Cancel</span>
</button>
             <button
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/sign-in";
  }}
  className="pp-btn-danger flex items-center justify-center gap-2"
  style={{ flex: 1 }}
>
  <FaSignOutAlt size={14} />
  <span>Logout</span>
</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}