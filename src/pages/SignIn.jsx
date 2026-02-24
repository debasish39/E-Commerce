import { useSignIn } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { Link, Links, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

/* ================= PASSWORD STRENGTH ================= */
const getStrength = (password) => {
  let score = 0;
  if (password.length > 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export default function SignIn() {
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const inputsRef = useRef([]);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        toast.success("Welcome back ");
        navigate("/");
      } else if (result.status === "needs_first_factor") {
        await signIn.prepareFirstFactor({ strategy: "email_code" });
        setTimer(30);
        toast.success("OTP sent ");
        setStep("otp");
      }
    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP ================= */
  const verifyOTP = async (code) => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        toast.success("Login successful ");
        navigate("/");
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

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    if (updated.every((d) => d !== "")) {
      verifyOTP(updated.join(""));
    }
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const resendOTP = async () => {
    await signIn.prepareFirstFactor({ strategy: "email_code" });
    setTimer(30);
    toast.success("OTP resent ");
  };

  /* ================= RESET ================= */
  const handleForgotPassword = async () => {
    if (!email) return toast.error("Enter email first");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      toast.success("Reset code sent ");
      setStep("reset");
    } catch (err) {
      toast.error(err.errors?.[0]?.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        toast.success("Password reset successful ");
        navigate("/");
      }
    } catch (err) {
  const clerkErrors = err.errors || [];

  if (clerkErrors.length > 0) {
    clerkErrors.forEach((error) => {
      toast.error(error.longMessage || error.message);
    });
  } else {
    toast.error("Password reset failed");
  }
}
  };

  const handleGoogle = () =>
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });

  const handleGithub = () =>
    signIn.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });

  return (
    <AuthLayout title="Welcome Back">
      <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-5 sm:p-10 space-y-3 shadow-[0_0_40px_rgba(255,0,0,0.2)]">
      
            <button type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 sm:py-4 rounded-2xl hover:scale-[1.02] transition">
              <FcGoogle size={20}/> Continue with Google
            </button>

            <button type="button"
              onClick={handleGithub}
              className="w-full flex items-center justify-center gap-3 bg-black border border-gray-700 py-3 sm:py-4 rounded-2xl hover:bg-gray-900 transition">
              <FaGithub size={20}/> Continue with GitHub
            </button>
 <div className="flex items-center gap-3 text-gray-500 text-sm">
              <div className="flex-1 h-px bg-gray-700" />
              OR
              <div className="flex-1 h-px bg-gray-700" />
            </div>
        {/* ================= LOGIN ================= */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-3">

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-5 rounded-2xl  bg-white/5
                border border-white/10
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/30
                outline-none  transition"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 sm:p-5 rounded-2xl  bg-white/5
                border border-white/10
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/30
                outline-none transition"
            />

            {password && (
              <div className="flex gap-2">
                {[1,2,3,4].map(level => (
                  <div key={level}
                    className={`h-1 flex-1 rounded ${
                      getStrength(password) >= level
                        ? level <= 2 ? "bg-red-500"
                        : level === 3 ? "bg-yellow-500"
                        : "bg-green-500"
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            )}

            <button disabled={loading}
              className="w-full py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600
              text-white hover:scale-[1.02] transition shadow-lg shadow-red-500/30">
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <button type="button"
              onClick={handleForgotPassword}
              className="text-sm flex justify-end text-red-400 hover:underline text-center w-full">
              Forgot Password?
            </button>

           

  <div className="pt-4 border-t border-white/10 text-center text-sm">
      <span className="text-gray-400">
        Don’t have an account?{" "}
      </span>
      <Link
        to="/sign-up"
        className="
          text-red-400
          font-medium
          hover:text-red-300
          transition
        "
      >
        Create Account
      </Link>
    </div>
          </form>
        )}

        {/* ================= OTP ================= */}
        {step === "otp" && (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-semibold">Enter 6-digit OTP</h2>

            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputsRef.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-14 h-14 text-center text-xl font-semibold bg-black/50 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/40 transition"
                />
              ))}
            </div>

            {timer > 0 ? (
              <p className="text-gray-400 text-sm">Resend in {timer}s</p>
            ) : (
              <button onClick={resendOTP}
                className="text-red-400 text-sm hover:underline">
                Resend OTP
              </button>
            )}
          </div>
        )}

        {/* ================= RESET ================= */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-6 text-center">

            <input
              type="text"
              placeholder="Reset Code" 
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full p-3 sm:p-5 rounded-2xl bg-black/40 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition"
            />

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 sm:p-5 rounded-2xl bg-black/40 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition"
            />

            <button className="w-full py-3 sm:py-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600
              text-white border-2 border-white/10 hover:scale-[1.02] transition">
              Reset Password
            </button>
          </form>
        )}

      </div>
    </AuthLayout>
  );
}