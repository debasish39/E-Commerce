import { useSignIn } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle, FaClock, FaLock } from "react-icons/fa";
import { toast } from "sonner";

export default function SignIn() {
  const { signIn, setActive, isLoaded }  = useSignIn();
  const navigate = useNavigate();

  const [step, setStep]                  = useState("login");
  const [email, setEmail]                = useState("");
  const [password, setPassword]          = useState("");
  const [newPassword, setNewPassword]    = useState("");
  const [otp, setOtp]                    = useState(Array(6).fill(""));
  const [resetCode, setResetCode]        = useState("");
  const [loading, setLoading]            = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [timer, setTimer]                = useState(0);
  const [showPassword, setShowPassword]  = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailError, setEmailError]      = useState("");
  const [passwordError, setPasswordError] = useState("");
  const inputsRef = useRef([]);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p) => p.length >= 6;

  /* ── LOGIN ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!email) { setEmailError("Email is required"); return; }
    if (!validateEmail(email)) { setEmailError("Enter a valid email"); return; }
    if (!password) { setPasswordError("Password is required"); return; }
    if (!validatePassword(password)) { setPasswordError("Password must be 6+ characters"); return; }
    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful");
        window.location.href = "/";
      } else if (result.status === "needs_first_factor") {
        await signIn.prepareFirstFactor({ strategy: "email_code" });
        setTimer(30);
        toast.success("OTP sent to your email");
        setStep("otp");
      }
    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP ── */
  const verifyOTP = async (code) => {
    if (code.length !== 6) { toast.error("Enter complete 6-digit code"); return; }
    try {
      const result = await signIn.attemptFirstFactor({ strategy: "email_code", code });
      if (result.status === "complete") {
        toast.success("Login successful");
        window.location.href = "/";
      }
    } catch {
      toast.error("Invalid OTP");
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (!value && index > 0) inputsRef.current[index - 1]?.focus();
    if (updated.every(d => d !== "")) verifyOTP(updated.join(""));
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const resendOTP = async () => {
    await signIn.prepareFirstFactor({ strategy: "email_code" });
    setTimer(30);
    toast.success("OTP resent");
  };

  /* ── RESET PASSWORD ── */
  const handleForgotPassword = async () => {
    setEmailError("");
    if (!email) { setEmailError("Enter email first"); return; }
    if (!validateEmail(email)) { setEmailError("Enter a valid email"); return; }
    try {
      await signIn.create({ strategy: "reset_password_email_code", identifier: email });
      toast.success("Reset code sent to your email");
      setStep("reset");
    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Failed to send reset code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode) { toast.error("Enter reset code"); return; }
    if (resetCode.length !== 6) { toast.error("Reset code must be 6 digits"); return; }
    if (!newPassword) { toast.error("Enter new password"); return; }
    if (!validatePassword(newPassword)) { toast.error("Password must be 6+ characters"); return; }

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });
      if (result.status === "complete") {
        toast.success("Password reset successful");
        window.location.href = "/";
      }
    } catch (err) {
      const clerkErrors = err.errors || [];
      if (clerkErrors.length > 0) {
        clerkErrors.forEach(e => toast.error(e.longMessage || e.message));
      } else {
        toast.error("Password reset failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setSocialLoading("google");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      toast.error("Google sign-in failed");
      setSocialLoading(null);
    }
  };

  const handleGithub = async () => {
    setSocialLoading("github");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      toast.error("GitHub sign-in failed");
      setSocialLoading(null);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        .si-root * { font-family:'Plus Jakarta Sans',sans-serif; }
        .si-serif { font-family:'Syne',sans-serif; }

        @keyframes shimmer {
          0%{background-position:-200% center;}
          100%{background-position:200% center;}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(10px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes fadeIn {
          from{opacity:0;transform:translateY(4px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes pulse {
          0%,100%{transform:scale(1);}
          50%{transform:scale(1.05);}
        }

        .si-enter { animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .si-enter:nth-child(1){animation-delay:0.05s}
        .si-enter:nth-child(2){animation-delay:0.1s}
        .si-enter:nth-child(3){animation-delay:0.15s}

        /* social btn */
        .social-btn {
          width:100%;display:flex;align-items:center;justify-content:center;gap:10px;
          padding:13px 18px;border-radius:14px;
          font-size:14px;font-weight:700;
          border:1.5px solid rgba(99,102,241,0.15);
          background:rgba(255,255,255,0.8);
          backdrop-filter:blur(14px);
          cursor:pointer;transition:all 0.22s;
        }
        .social-btn:hover {
          border-color:rgba(99,102,241,0.35);
          background:rgba(255,255,255,0.95);
          transform:translateY(-2px);
          box-shadow:0 6px 20px rgba(79,70,229,0.15);
        }
        .social-btn:active{transform:scale(0.97);}
        .social-btn.loading { opacity:0.6;pointer-events:none; }

        .spinner {
          width:16px;height:16px;
          border:2.5px solid rgba(79,70,229,0.3);
          border-top-color:#6366f1;
          border-radius:50%;
          animation:spin 0.7s linear infinite;
        }
        @keyframes spin{to{transform:rotate(360deg);}}

        /* divider */
        .divider-wrap {
          display:flex;align-items:center;gap:12px;
          padding:12px 0;
        }
        .divider-line {
          flex:1;height:1px;
          background:linear-gradient(90deg,rgba(99,102,241,0),rgba(99,102,241,0.12),rgba(99,102,241,0));
        }
        .divider-text {
          font-size:12px;font-weight:600;color:#9ca3af;
          letter-spacing:0.05em;text-transform:uppercase;
        }

        /* form group */
        .form-group {
          position:relative;
          animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .form-group:nth-child(1){animation-delay:0.08s}
        .form-group:nth-child(2){animation-delay:0.13s}

        .form-label {
          font-size:12px;font-weight:700;letter-spacing:0.04em;
          color:#6b7280;text-transform:uppercase;
          display:block;margin-bottom:6px;
        }

        .form-input {
          width:100%;
          background:#f8faff;
          border:1.5px solid rgba(99,102,241,0.16);
          border-radius:12px;
          padding:12px 16px;
          font-size:14px;font-weight:500;
          color:#1e1b4b;
          transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .form-input::placeholder{color:#a5b4fc;}
        .form-input:focus{
          outline:none;
          background:white;
          border-color:#6366f1;
          box-shadow:0 0 0 3px rgba(99,102,241,0.12);
        }
        .form-input.error {
          border-color:#f43f5e;
          box-shadow:0 0 0 3px rgba(244,63,94,0.1);
        }

        .form-error {
          font-size:12px;font-weight:600;color:#f43f5e;
          margin-top:5px;display:flex;align-items:center;gap:6px;
          animation:fadeIn 0.3s ease both;
        }

        /* password toggle */
        .pw-toggle {
          position:absolute;right:14px;top:50%;transform:translateY(-50%);
          background:none;border:none;cursor:pointer;
          color:#a5b4fc;transition:color 0.2s;
          padding:4px;
        }
        .pw-toggle:hover{color:#6366f1;}

        /* submit btn */
        .submit-btn {
          width:100%;display:flex;align-items:center;justify-content:center;gap:8px;
          padding:14px 0;border-radius:13px;
          font-size:15px;font-weight:700;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          background-size:200% 100%;
          color:white;border:none;cursor:pointer;
          position:relative;overflow:hidden;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(79,70,229,0.38);
        }
        .submit-btn:active{transform:scale(0.96);}
        .submit-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
        .submit-btn::after {
          content:'';position:absolute;inset:0;border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.4s infinite;
        }

        /* OTP input */
        .otp-input {
          width:44px;height:44px;
          text-align:center;font-size:18px;font-weight:700;
          background:#f8faff;
          border:2px solid rgba(99,102,241,0.16);
          border-radius:12px;
          color:#1e1b4b;
          transition:all 0.2s;
        }
        .otp-input:focus {
          outline:none;
          background:white;
          border-color:#6366f1;
          box-shadow:0 0 0 3px rgba(99,102,241,0.12);
        }

        /* forgot link */
        .forgot-link {
          text-align:right;font-size:13px;font-weight:700;color:#6366f1;
          text-decoration:none;transition:color 0.2s;
          animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both 0.18s backwards;
        }
        .forgot-link:hover{color:#4f46e5;text-decoration:underline;}

        /* signup link */
        .signup-wrap {
          text-align:center;padding-top:14px;border-top:1px solid rgba(99,102,241,0.1);
          font-size:13px;color:#6b7280;
          animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both 0.23s backwards;
        }
        .signup-link {
          font-weight:700;color:#6366f1;text-decoration:none;
          transition:color 0.2s;
        }
        .signup-link:hover{color:#4f46e5;text-decoration:underline;}

        /* otp section */
        .otp-section {
          animation:slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
          space-y:6;text-align:center;
        }
        .otp-title {
          si-serif;font-size:24px;font-weight:700;
          color:#1e1b4b;margin-bottom:8px;
          letter-spacing:-0.02em;
        }
        .otp-desc {
          font-size:13px;color:#6b7280;margin-bottom:28px;
        }

        .otp-inputs-wrap {
          display:flex;justify-content:center;gap:8px;margin-bottom:20px;
        }

        .otp-timer {
          font-size:12px;color:#6b7280;
        }
        .otp-timer-val {
          font-weight:700;color:#6366f1;
        }

        .otp-resend {
          font-size:13px;font-weight:700;color:#6366f1;
          background:none;border:none;cursor:pointer;
          text-decoration:none;transition:color 0.2s;
        }
        .otp-resend:hover{color:#4f46e5;text-decoration:underline;}

        /* reset section */
        .reset-section {
          animation:slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <div className="si-root space-y-4">

        {/* ── SOCIAL LOGIN ── */}
        {(step === "login") && (
          <div className="si-enter space-y-2">
            <button
              onClick={handleGoogle}
              type="button"
              disabled={socialLoading==="google"}
              className={`social-btn ${socialLoading==="google"?"loading":""}`}>
              {socialLoading==="google"
                ? <div className="spinner"/>
                : <FcGoogle size={18}/>}
              <span className="relative z-10">Continue with Google</span>
            </button>

            <button
              onClick={handleGithub}
              type="button"
              disabled={socialLoading==="github"}
              className={`social-btn ${socialLoading==="github"?"loading":""}`}>
              {socialLoading==="github"
                ? <div className="spinner"/>
                : <FaGithub size={18} style={{ color:"#1f2937" }}/>}
              <span className="relative z-10">Continue with GitHub</span>
            </button>
          </div>
        )}

        {/* ── DIVIDER ── */}
        {step === "login" && (
          <div className="si-enter divider-wrap">
            <div className="divider-line"/>
            <span className="divider-text">Or</span>
            <div className="divider-line"/>
          </div>
        )}

        {/* ── LOGIN ── */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="si-enter space-y-3.5">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="eshopcustomerinfo@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`form-input ${emailError?"error":""}`}
              />
              {emailError && <div className="form-error">{emailError}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword?"text":"password"}
                  placeholder="6+ characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`form-input ${passwordError?"error":""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pw-toggle">
                  {showPassword ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
                </button>
              </div>
              {passwordError && <div className="form-error">{passwordError}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn">
              {loading
                ? <><div className="spinner relative z-10"/> Signing In...</>
                : <><span className="relative z-10">Sign In</span> <FaArrowRight size={13} className="relative z-10"/></>}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="forgot-link w-full">
              Forgot Password?
            </button>

            <div className="signup-wrap">
              Don't have an account?{" "}
              <Link to="/sign-up" className="signup-link">
                Create Account
              </Link>
            </div>
          </form>
        )}

        {/* ── OTP ── */}
        {step === "otp" && (
          <div className="otp-section space-y-6">
            <div>
              <h2 className="si-serif otp-title">Verify Your Email</h2>
              <p className="otp-desc">Enter the 6-digit code sent to {email}</p>
            </div>

            <div className="otp-inputs-wrap">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleOtpChange(e.target.value, idx)}
                  ref={el => (inputsRef.current[idx] = el)}
                  className="otp-input"
                />
              ))}
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="otp-timer">
                  Resend code in <span className="otp-timer-val">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={resendOTP}
                  className="otp-resend">
                  Resend Code
                </button>
              )}
            </div>

            <button
              onClick={() => setStep("login")}
              className="w-full py-2.5 text-sm font-600 text-indigo-600 bg-indigo-50 rounded-12 hover:bg-indigo-100 transition">
              ← Back to Login
            </button>
          </div>
        )}

        {/* ── RESET PASSWORD ── */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="reset-section space-y-3.5">
            <div>
              <h2 className="si-serif text-2xl font-bold text-indigo-950 mb-1">Reset Password</h2>
              <p className="text-sm text-slate-400">Enter the code and new password sent to your email</p>
            </div>

            <div className="form-group">
              <label className="form-label">Reset Code</label>
              <input
                type="text"
                placeholder="6-digit code"
                maxLength="6"
                value={resetCode}
                onChange={e => setResetCode(e.target.value.replace(/[^0-9]/g, ""))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword?"text":"password"}
                  placeholder="6+ characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="pw-toggle">
                  {showNewPassword ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn">
              {loading
                ? <><div className="spinner relative z-10"/> Resetting...</>
                : <><FaLock size={13} className="relative z-10"/> Reset Password</>}
            </button>

            <button
              type="button"
              onClick={() => { setStep("login"); setResetCode(""); setNewPassword(""); }}
              className="w-full py-2.5 text-sm font-600 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
              ← Back to Login
            </button>
          </form>
        )}

      </div>
    </AuthLayout>
  );
}