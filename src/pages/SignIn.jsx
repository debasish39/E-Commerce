import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle, FaClock, FaLock } from "react-icons/fa";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();

  const [step, setStep] = useState("login");
 
/* =====================================
   LOGIN TYPE
===================================== */

const [

  loginType,

  setLoginType,

] = useState(

  "password"

);


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

const [errors, setErrors] =
  useState({

    email: "",

    password: "",

    otp: "",

    resetCode: "",

    newPassword: "",

  });


  const inputsRef = useRef([]);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p) => {
    if (p.length < 8 || p.length > 128) return false;
    if (!/[A-Z]/.test(p)) return false;
    if (!/[a-z]/.test(p)) return false;
    if (!/[0-9]/.test(p)) return false;
    return true;
  };
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

const validateField =
  (name, value) => {

    switch (name) {

      case "email":

        if (!value)
          return "Email is required";

        if (!validateEmail(value))
          return "Enter valid email";

        return "";

      case "password":

        if (!value)
          return "Password is required";

        if (value.length < 8 || value.length > 128)
          return "Password must be 8-128 characters";

        if (!/[A-Z]/.test(value))
          return "Add uppercase letter";

        if (!/[a-z]/.test(value))
          return "Add lowercase letter";

        if (!/[0-9]/.test(value))
          return "Add number";

        return "";

      case "otp":

        if (!value)
          return "OTP required";

        if (value.length !== 6)
          return "OTP must be 6 digits";

        return "";

      case "resetCode":

        if (!value)
          return "Reset code required";

        if (value.length !== 6)
          return "Reset code must be 6 digits";

        return "";

      case "newPassword":

        if (!value)
          return "New password required";

        if (value.length < 8 || value.length > 128)
          return "Password must be 8-128 characters";

        if (!/[A-Z]/.test(value))
          return "Add uppercase letter";

        if (!/[a-z]/.test(value))
          return "Add lowercase letter";

        if (!/[0-9]/.test(value))
          return "Add number";

        return "";

      default:

        return "";

    }

  };




/* =====================================
   LOGIN
===================================== */


const handleLogin =
async (e) => {

  e.preventDefault();

  /* =====================================
     VALIDATE FIELDS
  ===================================== */

  const newErrors = {

    email:
      validateField(
        "email",
        email
      ),

    password:

      loginType ===
      "password"

        ? validateField(
            "password",
            password
          )

        : "",

  };

  /* =====================================
     SET ERRORS
  ===================================== */

  setErrors(newErrors);

  /* =====================================
     STOP IF ERRORS
  ===================================== */

  if (

    Object.values(newErrors)
      .some(Boolean)

  ) {

    return;

  }

  setLoading(true);

  try {

    /* =====================================
       API URL
    ===================================== */

    const url =

      loginType ===
      "password"

        ? `${BACKEND_URL}/signin-password`

        : `${BACKEND_URL}/signin-otp`;

    /* =====================================
       BODY
    ===================================== */

    const body =

      loginType ===
      "password"

        ? {

            email:
              email.trim(),

            password,

          }

        : {

            email:
              email.trim(),

          };

    /* =====================================
       API CALL
    ===================================== */

    const res =
      await fetch(

        url,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body:
            JSON.stringify(
              body
            ),

        }

      );

    const data =
      await res.json();

    /* =====================================
       BACKEND ERROR
    ===================================== */

    if (!res.ok) {

      /* INVALID EMAIL */
      if (

        data.message
          ?.toLowerCase()
          .includes("email")

      ) {

        setErrors((prev) => ({

          ...prev,

          email:
            data.message,

        }));

      }

      /* INVALID PASSWORD */
      if (

        data.message
          ?.toLowerCase()
          .includes("password")

      ) {

        setErrors((prev) => ({

          ...prev,

          password:
            data.message,

        }));

      }

      throw new Error(

        data.message ||

        "Login failed"

      );

    }

    /* =====================================
       PASSWORD LOGIN
    ===================================== */

    if (

      loginType ===
      "password"

    ) {

      localStorage.setItem(

        "token",

        data.token

      );

      toast.success(

        "Login successful 🎉"

      );

      window.location.href =
        "/";

      return;

    }

    /* =====================================
       OTP LOGIN
    ===================================== */

    toast.success(

      "OTP sent to email"

    );

    setTimer(30);

    setStep("otp");

  } catch (error) {

    toast.error(
      error.message || "Login failed. Please try again."
    );

  } finally {

    setLoading(false);

  }

};






/* =====================================
   VERIFY OTP
===================================== */

const verifyOTP =
async (code) => {
const otpError = validateField( "otp", code ); if (otpError) { setErrors((prev) => ({ ...prev, otp: otpError, })); return; }
  if (code.length !== 6) {

    toast.error(
      "Enter complete 6-digit code"
    );

    return;

  }

  try {

    const res =
      await fetch(

        `${BACKEND_URL}/verify-signin-otp`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            email,

            otp: code,

          }),

        }

      );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(

        data.message ||

        "Invalid OTP"

      );

    }

    /* =====================================
       SAVE TOKEN
    ===================================== */

    localStorage.setItem(

      "token",

      data.token

    );

    toast.success(
      "Login successful 🎉"
    );

    window.location.href = "/";

  } catch (error) {

    toast.error(
      error.message
    );

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


/* =====================================
   RESEND OTP
===================================== */

const resendOTP =
async () => {

  try {

    const res =
      await fetch(

        `${BACKEND_URL}/resend-login-otp`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            email,

          }),

        }

      );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(

        data.message ||

        "Failed to resend OTP"

      );

    }

    setTimer(30);

    toast.success(
      "OTP resent"
    );

  } catch (error) {

    toast.error(
      error.message
    );

  }

};



  /* ── RESET PASSWORD ── */

/* =====================================
   FORGOT PASSWORD
===================================== */


const handleForgotPassword =
async () => {

  /* =====================================
     VALIDATE EMAIL
  ===================================== */

  const emailError =
    validateField(
      "email",
      email
    );

  /* =====================================
     SET ERROR
  ===================================== */

  setErrors((prev) => ({

    ...prev,

    email:
      emailError,

  }));

  /* =====================================
     STOP IF INVALID
  ===================================== */

  if (emailError)
    return;

  try {

    setLoading(true);

    const res =
      await fetch(

        `${BACKEND_URL}/forgot-password`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            email:
              email.trim(),

          }),

        }

      );

    const data =
      await res.json();

    /* =====================================
       BACKEND ERROR
    ===================================== */

    if (!res.ok) {

      /* EMAIL ERROR */
      if (

        data.message
          ?.toLowerCase()
          .includes("email")

      ) {

        setErrors((prev) => ({

          ...prev,

          email:
            data.message,

        }));

      }

      throw new Error(

        data.message ||

        "Failed to send reset OTP"

      );

    }

    toast.success(

      "Reset OTP sent 📩"

    );

    setStep("reset");

  } catch (error) {

    toast.error(
      error.message || "Failed to send reset OTP. Please try again."
    );

  } finally {

    setLoading(false);

  }

};



/* =====================================
   RESET PASSWORD
===================================== */

const handleResetPassword =
async (e) => {

  e.preventDefault();

  if (!resetCode) {

    toast.error(
      "Enter reset code"
    );

    return;

  }

  if (resetCode.length !== 6) {

    toast.error(
      "Reset code must be 6 digits"
    );

    return;

  }

  if (!newPassword) {

    toast.error(
      "Enter new password"
    );

    return;

  }

  if (

    !validatePassword(
      newPassword
    )

  ) {

    toast.error(

      "Password must be 8-128 characters and contain uppercase, lowercase and a number"

    );

    return;

  }

  setLoading(true);

  try {

    const res =
      await fetch(

        `${BACKEND_URL}/reset-password`,

        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            email,

            otp: resetCode,

            newPassword,

          }),

        }

      );

    const data =
      await res.json();

    if (!res.ok) {

      throw new Error(

        data.message ||

        "Password reset failed"

      );

    }

    toast.success(

      "Password reset successful 🎉"

    );

    setStep("login");

  } catch (error) {

    toast.error(

      error.message

    );

  } finally {

    setLoading(false);

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

{/* =====================================
   LOGIN TYPE TOGGLE
===================================== */}

<div
  className="
    grid
    grid-cols-2
    gap-2
    p-1
    rounded-xl
    bg-indigo-50
  "
>

  {/* PASSWORD */}

  <button

    type="button"

    onClick={() =>
      setLoginType(
        "password"
      )
    }

    className={`
      py-2.5
      rounded-lg
      text-sm
      font-semibold
      transition-all

      ${

        loginType ===
        "password"

          ? `
            bg-white
            text-indigo-600
            shadow-sm
          `

          : `
            text-slate-500
          `

      }
    `}

  >

    Password Login

  </button>

  {/* OTP */}

  <button

    type="button"

    onClick={() =>
      setLoginType(
        "otp"
      )
    }

    className={`
      py-2.5
      rounded-lg
      text-sm
      font-semibold
      transition-all

      ${

        loginType ===
        "otp"

          ? `
            bg-white
            text-indigo-600
            shadow-sm
          `

          : `
            text-slate-500
          `

      }
    `}

  >

    OTP Login

  </button>

</div>


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
              
className={`
  form-input

  ${

    errors.email

      ? "error"

      : ""

  }
`}


              />
             
{

  errors.email && (

    <div
      className="
        form-error
      "
    >

      {errors.email}

    </div>

  )

}


            </div>

      
{/* =====================================
   PASSWORD FIELD
===================================== */}

{

  loginType ===
  "password" && (

    <div
      className="
        form-group
      "
    >

      <label
        className="
          form-label
        "
      >

        Password

      </label>

      <div
        className="
          relative
        "
      >

        <input

          type={
            showPassword

              ? "text"

              : "password"
          }

          placeholder="8+ characters, uppercase, lowercase & number"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          className={`
            form-input

            ${

              errors.password

                ? "error"

                : ""

            }
          `}

        />

        <button

          type="button"

          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }

          className="
            pw-toggle
          "

        >

          {

            showPassword

              ? <FaEyeSlash size={14}/>

              : <FaEye size={14}/>

          }

        </button>

      </div>

     { errors.password && ( <div className=" form-error " > {errors.password} </div> ) }

    </div>

  )

}



            <button
              type="submit"
              disabled={loading}
              className="submit-btn">
    
{

  loading

    ? "Please wait..."

    : loginType ===
      "password"

        ? "Sign In"

        : "Send OTP"

}


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
                  placeholder="8+ characters, uppercase, lowercase & number"
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