import { useSignUp, useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

export default function SignUp() {
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  /* ================= VALIDATION ================= */

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /* ================= SIGNUP ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signUpLoaded) {
      toast.error("System not ready. Try again.");
      return;
    }

    if (!form.firstName.trim()) return toast.error("First name is required");
    if (!form.lastName.trim()) return toast.error("Last name is required");
    if (!form.email) return toast.error("Email is required");
    if (!validateEmail(form.email))
      return toast.error("Enter a valid email");
    if (!form.password) return toast.error("Password is required");

    setLoading(true);

    try {
      const res = await signUp.create({
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.email,
        password: form.password,
      });

      // 🔥 Handle Clerk status properly
      if (res.status === "complete") {
        toast.success("Account created successfully 🎉");
        navigate("/");
      } else {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        toast.success("Verification code sent 📩");
        navigate("/verify");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.errors?.[0]?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE ================= */

  const handleGoogle = async () => {
    if (!signInLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed");
    }
  };

  /* ================= GITHUB ================= */

  const handleGithub = async () => {
    if (!signInLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error(err);
      toast.error("GitHub sign-in failed");
    }
  };

  return (
    <AuthLayout title="Create Account">
      <div className="space-y-3">
        {/* ===== SOCIAL LOGIN ===== */}

        <button
          onClick={handleGoogle}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-black/10 hover:bg-black/20 transition"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <button
          onClick={handleGithub}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-indigo-300 bg-black/10 hover:bg-black/20 transition"
        >
          <FaGithub size={20} />
          Continue with GitHub
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 h-px bg-black/30" />
          <span>OR</span>
          <div className="flex-1 h-px bg-black/30" />
        </div>

        {/* ===== FORM ===== */}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="First name"
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              className="p-3 rounded-xl border"
            />

            <input
              placeholder="Last name"
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              className="p-3 rounded-xl border"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="p-3 rounded-xl border w-full"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="p-3 rounded-xl border w-full"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* SIGN IN LINK */}

        <div className="text-center text-sm pt-4">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-600">
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}