import { useEffect, useState } from "react";
import {
  FaSignOutAlt,
  FaChevronRight,
  FaEnvelope,
  FaCamera,
  FaCheck,
  FaLock,
  FaUser,
  FaShieldAlt,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSecurity, setOpenSecurity] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="pp-skeleton-page">
        <style>{`
          .pp-skeleton-page { min-height: 100vh; background: #F6F6FB; }
          .pp-skeleton-bar { height: 56px; background: #fff; border-bottom: 1px solid #E7E5F0; }
          .pp-skeleton-block {
            background: linear-gradient(90deg, #ECEBF4 25%, #F5F4FA 37%, #ECEBF4 63%);
            background-size: 400% 100%;
            animation: pp-shimmer 1.4s ease infinite;
            border-radius: 16px;
          }
          @keyframes pp-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
        `}</style>
        <div className="pp-skeleton-bar" />
        <div style={{ maxWidth: 640, margin: "24px auto", padding: "0 16px" }}>
          <div className="pp-skeleton-block" style={{ height: 96, width: 96, borderRadius: "50%", marginBottom: 16 }} />
          <div className="pp-skeleton-block" style={{ height: 20, width: "50%", marginBottom: 10 }} />
          <div className="pp-skeleton-block" style={{ height: 14, width: "35%", marginBottom: 28 }} />
          <div className="pp-skeleton-block" style={{ height: 64, marginBottom: 12 }} />
          <div className="pp-skeleton-block" style={{ height: 64, marginBottom: 12 }} />
        </div>
      </div>
    );
  }

  const memberSince = user?.createdAt
    ? user.createdAt.split("/")[2]?.split(",")[0]
    : "2024";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;900&family=Roboto+Flex:opsz,wght@8..144,400..800&display=swap');

        :root {
          --m-primary: #4F46E5;
          --m-primary-dark: #3730A3;
          --m-primary-container: #E7E5FE;
          --m-on-primary-container: #211B6D;
          --m-secondary: #2563EB;
          --m-surface: #FFFFFF;
          --m-surface-dim: #F6F6FB;
          --m-surface-container: #F1F0F8;
          --m-surface-container-high: #E9E7F4;
          --m-outline: #DEDCE9;
          --m-outline-strong: #C9C6DA;
          --m-on-surface: #1B1B21;
          --m-on-surface-variant: #5F5C6B;
          --m-error: #BA1A1A;
          --m-error-container: #FFDAD6;
          --m-on-error-container: #410002;
          --m-success: #146C2E;
          --m-success-container: #C1F0D0;
          --m-radius-full: 100px;
          --m-radius-lg: 20px;
          --m-radius-xl: 28px;
          --m-elev-1: 0 1px 2px rgba(27,27,33,0.16), 0 1px 4px rgba(27,27,33,0.06);
          --m-elev-2: 0 2px 6px rgba(27,27,33,0.12), 0 4px 14px rgba(27,27,33,0.08);
          --m-elev-3: 0 6px 18px rgba(27,27,33,0.14), 0 2px 6px rgba(27,27,33,0.08);
          font-family: 'Roboto', 'Roboto Flex', system-ui, sans-serif;
        }

        * { font-family: 'Roboto', 'Roboto Flex', system-ui, sans-serif; box-sizing: border-box; }

        @keyframes ppFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ppPop {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ppPulseRing {
          0% { box-shadow: 0 0 0 0 rgba(20,108,46,0.35); }
          100% { box-shadow: 0 0 0 6px rgba(20,108,46,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; }
        }

        /* ════ PAGE / APP BAR ════ */
        .pp-page {
          min-height: 100vh;
          background: var(--m-surface-dim);
          padding-bottom: 48px;
        }

        .pp-appbar {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--m-outline);
          height: 60px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
        }

        .pp-appbar-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--m-on-surface-variant);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .pp-appbar-icon:hover { background: var(--m-surface-container); }

        .pp-appbar-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--m-on-surface);
          letter-spacing: -0.01em;
        }

        .pp-inner {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* ════ PROFILE HEADER ════ */
        .pp-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 16px 24px;
          animation: ppFadeUp 0.45s ease both;
        }

        .pp-avatar-wrap { position: relative; margin-bottom: 16px; }

        .pp-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: var(--m-elev-2);
          border: 3px solid var(--m-surface);
        }

        .pp-status-dot {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 18px;
          height: 18px;
          background: var(--m-success);
          border-radius: 50%;
          border: 3px solid var(--m-surface);
          animation: ppPulseRing 2s ease-out infinite;
        }

        .pp-header h1 {
          font-size: 22px;
          font-weight: 700;
          color: var(--m-on-surface);
          letter-spacing: -0.01em;
          margin: 0 0 4px;
        }

        .pp-header-email {
          font-size: 14px;
          color: var(--m-on-surface-variant);
          font-weight: 500;
          margin-bottom: 12px;
        }

        .pp-chiprow {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .pp-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px 6px 10px;
          border-radius: var(--m-radius-full);
          font-size: 12px;
          font-weight: 600;
          border: 1px solid var(--m-outline-strong);
          color: var(--m-on-surface-variant);
          background: var(--m-surface);
        }

        .pp-chip--verified {
          color: var(--m-success);
          border-color: #A6E3B8;
          background: var(--m-success-container);
        }

        /* ════ QUICK ACTIONS ════ */
        .pp-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin: 20px 0 8px;
          flex-wrap: wrap;
        }

        .pp-mbtn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 20px;
          border-radius: var(--m-radius-full);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: box-shadow 0.15s, background 0.15s, transform 0.1s;
        }
        .pp-mbtn:active { transform: scale(0.97); }

        .pp-mbtn--filled {
          background: var(--m-primary);
          color: #fff;
          box-shadow: var(--m-elev-1);
        }
        .pp-mbtn--filled:hover { background: var(--m-primary-dark); box-shadow: var(--m-elev-2); }

        .pp-mbtn--tonal {
          background: var(--m-primary-container);
          color: var(--m-on-primary-container);
        }
        .pp-mbtn--tonal:hover { background: #DAD7FC; }

        .pp-mbtn--outline {
          background: transparent;
          color: var(--m-on-surface-variant);
          border: 1px solid var(--m-outline-strong);
        }
        .pp-mbtn--outline:hover { background: var(--m-surface-container); }

        .pp-mbtn--danger {
          background: transparent;
          color: var(--m-error);
          border: 1px solid #F3B8B1;
        }
        .pp-mbtn--danger:hover { background: var(--m-error-container); }

        .pp-mbtn--full { width: 100%; justify-content: center; }
        .pp-mbtn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ════ SECTION / LIST ════ */
        .pp-section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--m-on-surface-variant);
          margin: 28px 4px 10px;
        }

        .pp-list {
          background: var(--m-surface);
          border-radius: var(--m-radius-lg);
          border: 1px solid var(--m-outline);
          overflow: hidden;
          box-shadow: var(--m-elev-1);
          animation: ppFadeUp 0.45s ease 0.05s both;
        }

        .pp-tile {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 14px 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--m-outline);
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .pp-list .pp-tile:last-child { border-bottom: none; }
        .pp-tile:hover { background: var(--m-surface-container); }
        .pp-tile:active { background: var(--m-surface-container-high); }

        .pp-tile-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 15px;
          background: var(--m-primary-container);
          color: var(--m-primary-dark);
        }

        .pp-tile-icon--danger {
          background: var(--m-error-container);
          color: var(--m-error);
        }

        .pp-tile-body { flex: 1; min-width: 0; }

        .pp-tile-title {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--m-on-surface);
          margin: 0;
        }
        .pp-tile-title--danger { color: var(--m-error); }

        .pp-tile-sub {
          font-size: 12.5px;
          color: var(--m-on-surface-variant);
          margin: 2px 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pp-tile-chevron { color: var(--m-on-surface-variant); flex-shrink: 0; opacity: 0.6; }

        /* ════ SHEET / MODAL SHARED ════ */
        .pp-sheet-handle {
          width: 36px;
          height: 4px;
          border-radius: 4px;
          background: var(--m-outline-strong);
          margin: 10px auto 4px;
        }

        .pp-sheet-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 20px 16px;
        }

        .pp-sheet-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: var(--m-primary-container);
          color: var(--m-on-primary-container);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .pp-sheet-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--m-on-surface);
          margin: 0;
        }

        .pp-sheet-subtitle {
          font-size: 13px;
          color: var(--m-on-surface-variant);
          margin: 2px 0 0;
        }

        /* ════ FORM FIELDS (Material filled style) ════ */
        .pp-field { margin-bottom: 16px; }

        .pp-field-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--m-on-surface-variant);
          letter-spacing: 0.02em;
          margin-bottom: 6px;
        }

        .pp-field-input {
          width: 100%;
          background: var(--m-surface-container);
          border: 1.5px solid transparent;
          border-bottom: 2px solid var(--m-outline-strong);
          border-radius: 10px 10px 4px 4px;
          padding: 13px 14px;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--m-on-surface);
          transition: all 0.15s;
        }

        .pp-field-input::placeholder { color: #9B98A8; font-weight: 400; }

        .pp-field-input:focus {
          outline: none;
          background: var(--m-surface-container-high);
          border-bottom-color: var(--m-primary);
        }

        .pp-field-input:disabled {
          color: #9B98A8;
          cursor: not-allowed;
          border-bottom-color: var(--m-outline);
        }

        /* ════ UPLOAD ════ */
        .pp-upload {
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1.5px dashed var(--m-outline-strong);
          border-radius: 16px;
          background: var(--m-surface-container);
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pp-upload:hover { background: var(--m-surface-container-high); border-color: var(--m-primary); }

        .pp-upload-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--m-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .pp-upload-title { font-size: 13.5px; font-weight: 700; color: var(--m-on-surface); }
        .pp-upload-desc { font-size: 12px; color: var(--m-on-surface-variant); margin-top: 1px; }

        /* ════ LOGOUT / DELETE DIALOG ════ */
        .pp-dialog-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin: 4px auto 14px;
        }
        .pp-dialog-icon--neutral { background: var(--m-primary-container); color: var(--m-on-primary-container); }
        .pp-dialog-icon--danger { background: var(--m-error-container); color: var(--m-error); }

        .pp-dialog-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--m-on-surface);
          text-align: center;
          margin: 0 0 6px;
        }

        .pp-dialog-text {
          font-size: 13.5px;
          color: var(--m-on-surface-variant);
          text-align: center;
          line-height: 1.55;
          margin: 0;
        }

        @media (max-width: 480px) {
          .pp-header h1 { font-size: 20px; }
          .pp-actions { flex-direction: column; align-items: stretch; }
          .pp-mbtn { justify-content: center; }
        }
      `}</style>

      <div className="pp-page">
        {/* APP BAR */}
        <div className="pp-appbar">
          <button className="pp-appbar-icon" onClick={() => window.history.back()} aria-label="Back">
            <FaArrowLeft size={15} />
          </button>
          <span className="pp-appbar-title">Account</span>
        </div>

        <div className="pp-inner">
          {/* PROFILE HEADER */}
          <div className="pp-header">
            <div className="pp-avatar-wrap">
              <img src={user?.image || "https://i.pravatar.cc/300"} alt="avatar" className="pp-avatar" />
              <span className="pp-status-dot" title="Online" />
            </div>

            <h1>{user?.firstName} {user?.lastName}</h1>
            <div className="pp-header-email">{user?.email}</div>

            <div className="pp-chiprow">
              <span className="pp-chip pp-chip--verified"><FaCheck size={9} /> Verified</span>
              <span className="pp-chip">Member since {memberSince}</span>
            </div>

            <div className="pp-actions">
              <button className="pp-mbtn pp-mbtn--filled" onClick={() => setOpenProfile(true)}>
                <FaUser size={13} /> Edit profile
              </button>
              <button className="pp-mbtn pp-mbtn--tonal" onClick={() => setOpenSecurity(true)}>
                <FaLock size={13} /> Security
              </button>
            </div>
          </div>

          {/* ACCOUNT LIST */}
          <div className="pp-section-label">Account</div>
          <div className="pp-list">
            <button className="pp-tile" onClick={() => setOpenProfile(true)}>
              <div className="pp-tile-icon"><FaUser size={15} /></div>
              <div className="pp-tile-body">
                <p className="pp-tile-title">Profile information</p>
                <p className="pp-tile-sub">Name, phone number and photo</p>
              </div>
              <FaChevronRight className="pp-tile-chevron" size={12} />
            </button>

            <button className="pp-tile" onClick={() => setOpenSecurity(true)}>
              <div className="pp-tile-icon"><FaShieldAlt size={15} /></div>
              <div className="pp-tile-body">
                <p className="pp-tile-title">Security &amp; password</p>
                <p className="pp-tile-sub">Change your account password</p>
              </div>
              <FaChevronRight className="pp-tile-chevron" size={12} />
            </button>
          </div>

          {/* MORE / DANGER ZONE */}
          <div className="pp-section-label">More</div>
          <div className="pp-list">
            <button className="pp-tile" onClick={() => setShowLogoutConfirm(true)}>
              <div className="pp-tile-icon"><FaSignOutAlt size={15} /></div>
              <div className="pp-tile-body">
                <p className="pp-tile-title">Sign out</p>
                <p className="pp-tile-sub">You can sign back in anytime</p>
              </div>
              <FaChevronRight className="pp-tile-chevron" size={12} />
            </button>

            <button className="pp-tile" onClick={() => setShowDeleteConfirm(true)}>
              <div className="pp-tile-icon pp-tile-icon--danger"><FaTrash size={13} /></div>
              <div className="pp-tile-body">
                <p className="pp-tile-title pp-tile-title--danger">Delete account</p>
                <p className="pp-tile-sub">Permanently remove your account and data</p>
              </div>
              <FaChevronRight className="pp-tile-chevron" size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ══ PROFILE SHEET ══ */}
      <Modal
        placement="bottom"
        isOpen={openProfile}
        onOpenChange={setOpenProfile}
        backdrop="blur"
        hideCloseButton
        scrollBehavior="inside"
        classNames={{
          base: "bg-white rounded-t-[28px] rounded-b-none m-0 max-w-full sm:max-w-[520px] sm:mx-auto sm:rounded-[28px] sm:mb-4 max-h-[92vh]",
          backdrop: "bg-black/40",
        }}
      >
        <ModalContent>
          <div className="pp-sheet-handle" />
          <div className="pp-sheet-header">
            <div className="pp-sheet-icon"><FaUser size={17} /></div>
            <div>
              <p className="pp-sheet-title">Profile information</p>
              <p className="pp-sheet-subtitle">Visible to you only</p>
            </div>
          </div>

          <ModalBody style={{ padding: "4px 20px 8px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="pp-field">
                <label className="pp-field-label">First name</label>
                <input
                  type="text"
                  value={user?.firstName || ""}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  className="pp-field-input"
                  placeholder="Enter first name"
                />
              </div>

              <div className="pp-field">
                <label className="pp-field-label">Last name</label>
                <input
                  type="text"
                  value={user?.lastName || ""}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  className="pp-field-input"
                  placeholder="Enter last name"
                />
              </div>

              <div className="pp-field sm:col-span-2">
                <label className="pp-field-label">Email address</label>
                <input type="email" disabled value={user?.email || ""} className="pp-field-input" />
              </div>

              <div className="pp-field sm:col-span-2">
                <label className="pp-field-label">Phone number</label>
                <input
                  type="text"
                  value={user?.phone || ""}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="pp-field-input"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="pp-field sm:col-span-2">
                <label className="pp-field-label">Profile photo</label>
                <label className="pp-upload">
                  <div className="pp-upload-icon"><FaCamera size={15} /></div>
                  <div>
                    <div className="pp-upload-title">Upload a new photo</div>
                    <div className="pp-upload-desc">Camera or gallery supported</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const imageUrl = URL.createObjectURL(file);
                      setUser({ ...user, image: imageUrl, imageFile: file });
                    }}
                  />
                </label>
              </div>
            </div>
          </ModalBody>

          <ModalFooter style={{ padding: "12px 20px 20px" }}>
            <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
              <button onClick={() => setOpenProfile(false)} className="pp-mbtn pp-mbtn--outline pp-mbtn--full">
                Cancel
              </button>
              <button
                disabled={profileLoading}
                onClick={async () => {
                  try {
                    setProfileLoading(true);
                    const formData = new FormData();
                    formData.append("firstName", user.firstName);
                    formData.append("lastName", user.lastName);
                    formData.append("phone", user.phone);
                    if (user.imageFile) formData.append("image", user.imageFile);

                    const res = await fetch(
                      "https://eshop-backend-y0e7.onrender.com/api/auth/update-profile",
                      {
                        method: "PUT",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                      }
                    );

                    const data = await res.json();
                    if (data.success) {
                      setUser(data.user);
                      toast.success("Profile updated");
                      setOpenProfile(false);
                      setTimeout(() => window.location.reload(), 500);
                    } else {
                      toast.error(data.message);
                    }
                  } catch (error) {
                    console.error(error);
                    toast.error("Failed to update profile");
                  } finally {
                    setProfileLoading(false);
                  }
                }}
                className="pp-mbtn pp-mbtn--filled pp-mbtn--full"
              >
                {profileLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══ SECURITY SHEET ══ */}
      <Modal
        placement="bottom"
        isOpen={openSecurity}
        onOpenChange={setOpenSecurity}
        backdrop="blur"
        hideCloseButton
        scrollBehavior="inside"
        classNames={{
          base: "bg-white rounded-t-[28px] rounded-b-none m-0 max-w-full sm:max-w-[440px] sm:mx-auto sm:rounded-[28px] sm:mb-4",
          backdrop: "bg-black/40",
        }}
      >
        <ModalContent>
          <div className="pp-sheet-handle" />
          <div className="pp-sheet-header">
            <div className="pp-sheet-icon"><FaLock size={16} /></div>
            <div>
              <p className="pp-sheet-title">Security &amp; password</p>
              <p className="pp-sheet-subtitle">Update your password</p>
            </div>
          </div>

          <ModalBody style={{ padding: "4px 20px 8px" }}>
            <div className="pp-field">
              <label className="pp-field-label">Current password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="pp-field-input"
              />
            </div>

            <div className="pp-field">
              <label className="pp-field-label">New password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="pp-field-input"
              />
            </div>

            <div className="pp-field" style={{ marginBottom: 4 }}>
              <label className="pp-field-label">Confirm new password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="pp-field-input"
              />
            </div>
          </ModalBody>

          <ModalFooter style={{ padding: "16px 20px 20px" }}>
            <button
              disabled={passwordLoading}
              onClick={async () => {
                try {
                  if (passwordData.newPassword !== passwordData.confirmPassword) {
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
                    toast.success("Password changed");
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setOpenSecurity(false);
                    setTimeout(() => window.location.reload(), 500);
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
              className="pp-mbtn pp-mbtn--filled pp-mbtn--full"
            >
              {passwordLoading ? "Updating..." : "Update password"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══ LOGOUT DIALOG ══ */}
      <Modal
        size="sm"
        isOpen={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "bg-white rounded-[24px] max-w-[340px] mx-4",
          backdrop: "bg-black/40",
        }}
      >
        <ModalContent>
          <ModalBody style={{ padding: "28px 24px 8px" }}>
            <div className="pp-dialog-icon pp-dialog-icon--neutral"><FaSignOutAlt size={18} /></div>
            <p className="pp-dialog-title">Sign out?</p>
            <p className="pp-dialog-text">You'll need to sign back in to access your cart and orders.</p>
          </ModalBody>
          <ModalFooter style={{ padding: "16px 24px 24px", gap: 10 }}>
            <button onClick={() => setShowLogoutConfirm(false)} className="pp-mbtn pp-mbtn--outline pp-mbtn--full">
              Cancel
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/sign-in";
              }}
              className="pp-mbtn pp-mbtn--filled pp-mbtn--full"
            >
              Sign out
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══ DELETE ACCOUNT DIALOG ══ */}
      <Modal
        size="sm"
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "bg-white rounded-[24px] max-w-[360px] mx-4",
          backdrop: "bg-black/40",
        }}
      >
        <ModalContent>
          <ModalBody style={{ padding: "28px 24px 8px" }}>
            <div className="pp-dialog-icon pp-dialog-icon--danger"><FaTrash size={16} /></div>
            <p className="pp-dialog-title">Delete your account?</p>
            <p className="pp-dialog-text">
              This permanently removes your account and all of your data. This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter style={{ padding: "16px 24px 24px", gap: 10 }}>
            <button onClick={() => setShowDeleteConfirm(false)} className="pp-mbtn pp-mbtn--outline pp-mbtn--full">
              Cancel
            </button>
            <button
              disabled={deleteLoading}
              onClick={async () => {
                try {
                  setDeleteLoading(true);
                  const res = await fetch(
                    "https://eshop-backend-y0e7.onrender.com/api/auth/delete-account",
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
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
                } finally {
                  setDeleteLoading(false);
                }
              }}
              className="pp-mbtn pp-mbtn--danger pp-mbtn--full"
              style={{ background: "var(--m-error)", color: "#fff", border: "none" }}
            >
              {deleteLoading ? "Deleting..." : "Delete account"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}