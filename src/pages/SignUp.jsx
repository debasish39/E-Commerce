import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function SignUp() {
  const { signUp, isLoaded } = useSignUp();
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
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

  if (!form.firstName.trim()) {
    toast.error("First name is required");
    return;
  }

  if (!form.lastName.trim()) {
    toast.error("Last name is required");
    return;
  }

  if (!form.email) {
    toast.error("Email is required");
    return;
  }

  if (!validateEmail(form.email)) {
    toast.error("Enter a valid email");
    return;
  }

  if (!form.password) {
    toast.error("Password is required");
    return;
  }

  if (!validatePassword(form.password)) {
    toast.error("Password must be at least 6 characters");
    return;
  }

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
    navigate("/verify");

  } catch (err) {
    toast.error(err.errors?.[0]?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
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

      <div className="space-y-1">

        {/* ===== SOCIAL LOGIN ===== */}

        <div className="space-y-3">

          <button
            onClick={handleGoogle}
            type="button"
            className="
            w-full
            flex items-center justify-center gap-3
            py-3
            rounded-2xl
            bg-white
            text-black
            font-medium
            hover:scale-[1.02]
            transition
            "
          >
            <FcGoogle size={20}/>
            Continue with Google
          </button>

          <button
            onClick={handleGithub}
            type="button"
            className="
            w-full
            flex items-center justify-center gap-3
            py-3
            rounded-2xl
            border border-white/10
            bg-white/5
            hover:bg-white/10
            transition
            "
          >
            <FaGithub size={20}/>
            Continue with GitHub
          </button>

        </div>

        {/* ===== DIVIDER ===== */}

        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-white/10"/>
          OR
          <div className="flex-1 h-px bg-white/10"/>
        </div>

        {/* ===== SIGNUP FORM ===== */}

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Name Row */}

          <div className="grid grid-cols-2 gap-3">

            <input
              placeholder="First name"
              className="
              w-full
              p-3
              rounded-xl
              bg-white/5
              border border-white/10
              focus:border-red-500
              focus:ring-2 focus:ring-red-500/30
              outline-none
              transition
              "
              onChange={(e)=>
                setForm({...form, firstName:e.target.value})
              }
            />

            <input
              placeholder="Last name"
              className="
              w-full
              p-3
              rounded-xl
              bg-white/5
              border border-white/10
              focus:border-red-500
              focus:ring-2 focus:ring-red-500/30
              outline-none
              transition
              "
              onChange={(e)=>
                setForm({...form, lastName:e.target.value})
              }
            />

          </div>

          {/* Email */}

          <input
            type="email"
            required
            placeholder="Email address"
            className="
            w-full
            p-3
            rounded-xl
            bg-white/5
            border border-white/10
            focus:border-red-500
            focus:ring-2 focus:ring-red-500/30
            outline-none
            transition
            "
            onChange={(e)=>
              setForm({...form, email:e.target.value})
            }
          />

          {/* Password */}

         <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="
    w-full
    p-3
    rounded-xl
    bg-white/5
    border border-white/10
    focus:border-red-500
    focus:ring-2 focus:ring-red-500/30
    outline-none
    transition
    pr-10
    "
    onChange={(e)=>
      setForm({...form, password:e.target.value})
    }
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-gray-400
    hover:text-red-400
    transition
    "
  >
    {showPassword ? <FaEyeSlash/> : <FaEye/>}
  </button>

</div>

          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            py-3
            rounded-2xl
            bg-gradient-to-r from-red-500 to-red-600
            text-white
            font-medium
            hover:scale-[1.02]
            transition
            shadow-lg shadow-red-500/30
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* ===== SIGN IN LINK ===== */}

        <div className="pt-4 border-t border-white/10 text-center text-sm">

          <span className="text-gray-400">
            Already have an account?{" "}
          </span>

          <Link
            to="/sign-in"
            className="
            text-red-400
            font-medium
            hover:text-red-300
            transition
            "
          >
            Sign In
          </Link>

        </div>

      </div>

    </AuthLayout>
  );
}