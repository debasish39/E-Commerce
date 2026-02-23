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

      {/* ============== SOCIAL LOGIN ============== */}
      <div className="space-y-3 mb-6">

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 
          bg-white text-black py-3 rounded-xl hover:scale-105 transition"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <button
          type="button"
          onClick={handleGithub}
          className="w-full flex items-center justify-center gap-3 
          bg-black border border-gray-700 py-3 rounded-xl 
          hover:bg-gray-900 transition"
        >
          <FaGithub size={20} />
          Continue with GitHub
        </button>
      </div>

      <div className="relative my-6">
        <div className="border-t border-gray-700"></div>
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-3 text-sm text-gray-400">
          OR
        </span>
      </div>

      {/* ============== FORM ============== */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="First Name"
            className="p-3 rounded-xl bg-black/40 border border-gray-700"
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
          />

          <input
            placeholder="Last Name"
            className="p-3 rounded-xl bg-black/40 border border-gray-700"
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />
        </div>

        <input
          type="email"
          required
          placeholder="Email"
          className="w-full p-3 rounded-xl bg-black/40 border border-gray-700"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl bg-black/40 border border-gray-700"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl
          bg-gradient-to-r from-orange-500 to-red-600"
        >
          {loading ? "Creating..." : "Sign Up with Password"}
        </button>

        {/* Magic Link Button */}
        <button
          type="button"
          onClick={handleMagicLink}
          className="w-full py-3 rounded-xl
          border border-orange-500 text-orange-400
          hover:bg-orange-500 hover:text-white transition"
        >
          Send Signup Link Instead
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-orange-400 hover:underline">
            Sign In
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}