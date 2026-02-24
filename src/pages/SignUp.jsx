import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export default function SignUp() {
  const { signUp, isLoaded } = useSignUp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= PASSWORD SIGNUP ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);

    try {
      await signUp.create({
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      toast.success("Verification code sent 📩");
      navigate("/");
    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MAGIC LINK SIGNUP ================= */
  const handleMagicLink = async () => {
    if (!isLoaded) return;
    if (!form.email) {
      toast.error("Enter your email first");
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_link",
        redirectUrl: `${window.location.origin}/verify`,
      });

      toast.success("Signup link sent to your email 📩");

    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Failed to send link");
    }
  };

  /* ================= GOOGLE ================= */
  const handleGoogle = async () => {
    if (!isLoaded) return;

    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  /* ================= GITHUB ================= */
  const handleGithub = async () => {
    if (!isLoaded) return;

    await signUp.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

return (
  <AuthLayout title="Create Account">

    <div className="relative w-full max-w-6xl ">

      {/* Background Glow */}
      {/* <div className="absolute -top-20 -left-20 w-60 h-60 bg-red-500/30 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-red-500/30 blur-3xl rounded-full" /> */}

      <div className="
        relative
        bg-black/60
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        shadow-[0_0_40px_rgba(255,80,80,0.2)]
        p-6 sm:p-8
        space-y-6
      ">

        {/* ================= SOCIAL LOGIN ================= */}
        <div className="space-y-3">

          <button
            type="button"
            onClick={handleGoogle}
            className="
              w-full
              flex items-center justify-center gap-3
              py-3 sm:py-4
              rounded-xl
              bg-white
              text-black
              font-medium
              active:scale-95
              transition cursor-pointer border
            "
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGithub}
            className="
              w-full
              flex items-center justify-center gap-3
              py-3 sm:py-4
              rounded-xl
              bg-black/70
            border-white/10
              hover:bg-black
              font-medium
              active:scale-95
              transition cursor-pointer border-2

            "
          >
            <FaGithub size={20} />
            Continue with GitHub
          </button>

        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-gray-500 text-xs">
          <div className="flex-1 h-px bg-white/10" />
          OR
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <input
              placeholder="First Name"
              className="
                w-full
                px-4 py-3
                rounded-xl
                text-sm
                bg-white/5
                border border-white/10
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/30
                outline-none
                transition
              "
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              className="
                w-full
                px-4 py-3
                rounded-xl
                text-sm
                bg-white/5
                border border-white/10
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/30
                outline-none
                transition
              "
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
            />

          </div>

          <input
            type="email"
            required
            placeholder="Email address"
            className="
              w-full
              px-4 py-3
              rounded-xl
              text-sm
              bg-white/5
              border border-white/10
              focus:border-red-500
              focus:ring-2 focus:ring-red-500/30
              outline-none
              transition
            "
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              px-4 py-3
              rounded-xl
              text-sm
              bg-white/5
              border border-white/10
              focus:border-red-500
              focus:ring-2 focus:ring-red-500/30
              outline-none
              transition
            "
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* Primary Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3 sm:py-4
              rounded-xl
              bg-gradient-to-r from-red-500 to-red-600
              text-white
              font-medium
              shadow-lg shadow-red-600/30
              active:scale-95
              transition-all
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          {/* Sign In Link */}
          <div className="pt-4 border-t border-white/10 text-center text-sm">
            <span className="text-gray-400">
              Already have an account?{" "}
            </span>
            <Link
              to="/sign-in"
              className="text-red-400 font-medium hover:text-red-300 transition"
            >
              Sign In
            </Link>
          </div>

        </form>

      </div>
    </div>

  </AuthLayout>
);
}