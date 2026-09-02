import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function SignUp() {
 
  const navigate = useNavigate();

  const [showPassword, setShowPassword]     = useState(false);
  const [loading, setLoading]               = useState(false);
  const [socialLoading, setSocialLoading]   = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (name, value) => {
    switch(name) {
      case "firstName":
        return value.trim() ? "" : "First name is required";
      case "lastName":
        return value.trim() ? "" : "Last name is required";
      case "email":
        if (!value) return "Email is required";
        return validateEmail(value) ? "" : "Enter a valid email";
     
case "password":
  if (!value) return "Password is required";

  if (value.length < 8 || value.length > 128) {
    return "Password must be 8-128 characters";
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must contain an uppercase letter";
  }

  if (!/[a-z]/.test(value)) {
    return "Password must contain a lowercase letter";
  }

  if (!/[0-9]/.test(value)) {
    return "Password must contain a number";
  }

  return "";


      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };



const handleSubmit =
async (e) => {

  e.preventDefault();

  /* =====================================
     VALIDATE ALL FIELDS
  ===================================== */

  const newErrors = {

    firstName:
      validateField(

        "firstName",

        form.firstName

      ),

    lastName:
      validateField(

        "lastName",

        form.lastName

      ),

    email:
      validateField(

        "email",

        form.email

      ),

    password:
      validateField(

        "password",

        form.password

      ),

  };

  setErrors(newErrors);

  setTouched({

    firstName: true,

    lastName: true,

    email: true,

    password: true,

  });

  /* =====================================
     STOP IF ERRORS
  ===================================== */

  if (

    Object.values(newErrors)
      .some(Boolean)

  ) {

    // toast.error(

    //   "Please fix all errors"

    // );

    return;

  }

  setLoading(true);

  try {

    const res =
      await fetch(

        `${BACKEND_URL}/signup`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            firstName:
              form.firstName.trim(),

            lastName:
              form.lastName.trim(),

            email:
              form.email.trim(),

            password:
              form.password,

          }),

        }

      );

    const data =
      await res.json();

    /* =====================================
       BACKEND ERRORS
    ===================================== */

    if (!res.ok) {

      /* EMAIL EXISTS */
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

        "Signup failed"

      );

    }

    // toast.success(

    //   "OTP sent successfully 📩"

    // );

    localStorage.setItem(

      "verifyEmail",

      form.email

    );

    navigate(
      "/verify-signup-otp"
    );

  } catch (error) {

    console.error(
      error
    );

    // toast.error(
    //   error.message
    // );

  } finally {

    setLoading(false);

  }

};

 

  return (
    <AuthLayout title="Create Account">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        .su-root * { font-family:'Plus Jakarta Sans',sans-serif; }
        .su-serif { font-family:'Syne',sans-serif; }

        @keyframes shimmer {
          0%{background-position:-200% center;}
          100%{background-position:200% center;}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(10px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes checkMark {
          0%{transform:scale(0.3);}
          50%{transform:scale(1.1);}
          100%{transform:scale(1);}
        }

        .su-enter { animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .su-enter:nth-child(1){animation-delay:0.05s}
        .su-enter:nth-child(2){animation-delay:0.1s}
        .su-enter:nth-child(3){animation-delay:0.15s}

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

        /* form field */
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
        .form-input.success {
          border-color:#10b981;
          background:#f0fdf4;
        }

        /* error & success messages */
        .form-message {
          font-size:12px;font-weight:600;
          margin-top:5px;display:flex;align-items:center;gap:6px;
        }
        .form-message.error { color:#f43f5e; }
        .form-message.success { color:#10b981; }

        .check-icon { animation:checkMark 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

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

        /* spinner */
        .spinner {
          width:16px;height:16px;
          border:2.5px solid rgba(255,255,255,0.3);
          border-top-color:white;
          border-radius:50%;
          animation:spin 0.7s linear infinite;
        }
        @keyframes spin{to{transform:rotate(360deg);}}

        /* sign in link */
        .signin-wrap {
          text-align:center;padding-top:14px;border-top:1px solid rgba(99,102,241,0.1);
          font-size:13px;color:#6b7280;
        }
        .signin-link {
          font-weight:700;color:#6366f1;text-decoration:none;
          transition:color 0.2s;
        }
        .signin-link:hover{color:#4f46e5;text-decoration:underline;}
      `}</style>

      <div className="su-root space-y-4">


        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="su-enter space-y-3.5">

          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Bom"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.firstName && touched.firstName ? "error" : touched.firstName && !errors.firstName ? "success" : ""}`}
              />
              {errors.firstName && touched.firstName && (
                <div className="form-message error">{errors.firstName}</div>
              )}
              {!errors.firstName && touched.firstName && (
                <div className="form-message success">
                  <FaCheckCircle size={11} className="check-icon"/> Ready
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Bhole"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.lastName && touched.lastName ? "error" : touched.lastName && !errors.lastName ? "success" : ""}`}
              />
              {errors.lastName && touched.lastName && (
                <div className="form-message error">{errors.lastName}</div>
              )}
              {!errors.lastName && touched.lastName && (
                <div className="form-message success">
                  <FaCheckCircle size={11} className="check-icon"/> Ready
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. eshopcustomerinfo@gmail.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.email && touched.email ? "error" : touched.email && !errors.email ? "success" : ""}`}
            />
            {errors.email && touched.email && (
              <div className="form-message error">{errors.email}</div>
            )}
            {!errors.email && touched.email && (
              <div className="form-message success">
                <FaCheckCircle size={11} className="check-icon"/> Valid
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
               placeholder="8+ characters, uppercase, lowercase & number"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.password && touched.password ? "error" : touched.password && !errors.password ? "success" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pw-toggle">
                {showPassword ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
              </button>
            </div>
            {errors.password && touched.password && (
              <div className="form-message error">{errors.password}</div>
            )}
            {!errors.password && touched.password && form.password && (
              <div className="form-message success">
                <FaCheckCircle size={11} className="check-icon"/> Strong
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || Object.values(errors).some(e => e)}
            className="submit-btn">
            {loading
              ? <><div className="spinner relative z-10"/> Creating Account...</>
              : <><span className="relative z-10">Create Account</span> <FaArrowRight size={13} className="relative z-10"/></>}
          </button>
        </form>

        {/* ── SIGN IN LINK ── */}
        <div className="su-enter signin-wrap">
          Already have an account?{" "}
          <Link to="/sign-in" className="signin-link">
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}