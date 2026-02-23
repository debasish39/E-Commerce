import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export default function SignIn() {
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [step, setStep] = useState("login"); 
  // login | otp | forgot | reset | linkSent

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= PASSWORD LOGIN ================= */
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
        toast.success("Welcome back 👋");
        navigate("/");
      } else if (result.status === "needs_first_factor") {
        setStep("otp");
      }

    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP VERIFY ================= */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        toast.success("Login successful 🎉");
        navigate("/");
      }
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter email first");
      return;
    }

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      toast.success("Reset code sent to email 📩");
      setStep("reset");
    } catch {
      toast.error("Unable to send reset code");
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        toast.success("Password reset successful 🔐");
        navigate("/");
      }
    } catch {
      toast.error("Invalid reset code");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMAIL LINK LOGIN ================= */
  const handleEmailLinkLogin = async () => {
    if (!isLoaded) return;

    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    try {
      await signIn.create({
        identifier: email,
        strategy: "email_link",
        redirectUrl: `${window.location.origin}/verify-signin`,
      });

      toast.success("Login link sent to your email 📩");
      setStep("linkSent");

    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Failed to send link");
    }
  };

  /* ================= GOOGLE ================= */
  const handleGoogle = async () => {
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  /* ================= GITHUB ================= */
  const handleGithub = async () => {
    await signIn.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <AuthLayout title="Welcome Back">

      {/* ================= LOGIN STEP ================= */}
      {step === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            required
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-black/40 border border-gray-700"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-black/40 border border-gray-700"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl
            bg-gradient-to-r from-red-600 to-pink-600"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleEmailLinkLogin}
            className="w-full py-3 rounded-xl
            border border-red-500 text-red-400
            hover:bg-red-500 hover:text-white transition"
          >
            Login with Email Link
          </button>

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => setStep("forgot")}
              className="text-red-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-700" />
            OR
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3
            bg-white text-black py-3 rounded-xl"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGithub}
            className="w-full flex items-center justify-center gap-3
            bg-black border border-gray-700 py-3 rounded-xl"
          >
            <FaGithub size={20} />
            Continue with GitHub
          </button>

          <p className="text-sm text-center text-gray-400 mt-4">
            Don’t have an account?{" "}
            <Link to="/sign-up" className="text-red-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      )}

      {/* ================= OTP STEP ================= */}
      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">

          <h2 className="text-center text-lg font-semibold">
            Enter Verification Code
          </h2>

          <input
            type="text"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center tracking-widest text-xl p-4
            bg-black/40 border border-red-500/40 rounded-xl"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl
            bg-gradient-to-r from-red-600 to-pink-600"
          >
            Verify OTP
          </button>
        </form>
      )}

      {/* ================= FORGOT STEP ================= */}
      {step === "forgot" && (
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-xl bg-black/40 border border-gray-700"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleForgotPassword}
            className="w-full py-3 rounded-xl
            bg-gradient-to-r from-red-600 to-pink-600"
          >
            Send Reset Code
          </button>
        </div>
      )}

      {/* ================= RESET STEP ================= */}
      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">

          <input
            type="text"
            placeholder="Enter Reset Code"
            className="w-full p-3 rounded-xl bg-black/40 border border-gray-700"
            onChange={(e) => setCode(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 rounded-xl bg-black/40 border border-gray-700"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="w-full py-3 rounded-xl
          bg-gradient-to-r from-red-600 to-pink-600">
            Reset Password
          </button>
        </form>
      )}

      {/* ================= LINK SENT STEP ================= */}
      {step === "linkSent" && (
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-semibold">
            Check Your Email
          </h2>

          <p className="text-gray-400 text-sm">
            We sent a secure login link to <br />
            <span className="text-red-400">{email}</span>
          </p>

          <button
            onClick={() => setStep("login")}
            className="text-red-400 hover:underline text-sm"
          >
            Back to login
          </button>
        </div>
      )}

    </AuthLayout>
  );
}