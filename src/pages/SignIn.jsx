import { useSignIn } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
/* ================= PASSWORD STRENGTH ================= */

export default function SignIn() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const navigate = useNavigate();

    const [step, setStep] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [resetCode, setResetCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const inputsRef = useRef([]);
    /* ================= VALIDATION ================= */

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };
    /* ================= LOGIN ================= */
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Enter a valid email");
            return;
        }

        if (!password) {
            toast.error("Password is required");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (!isLoaded) return;

        setLoading(true);

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {

                await setActive({
                    session: result.createdSessionId,
                });

                toast.success("Login successful");
                window.location.href = "/"
            }

            else if (result.status === "needs_first_factor") {
                await signIn.prepareFirstFactor({
                    strategy: "email_code",
                });

                setTimer(30);
                toast.success("OTP sent");
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

        if (code.length !== 6) {
            toast.error("Enter complete 6 digit code");
            return;
        }

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code,
            });

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

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        if (!value && index > 0) {
            inputsRef.current[index - 1]?.focus();
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

        if (!email) {
            toast.error("Enter email first");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Enter a valid email");
            return;
        }

        try {

            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            });

            toast.success("Reset code sent");
            setStep("reset");

        } catch (err) {
            toast.error(err.errors?.[0]?.message);
        }
    };
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!resetCode) {
            toast.error("Enter reset code");
            return;
        }

        if (resetCode.length !== 6) {
            toast.error("Reset code must be 6 digits");
            return;
        }

        if (!newPassword) {
            toast.error("Enter new password");
            return;
        }

        if (!validatePassword(newPassword)) {
            toast.error("Password must be at least 6 characters");
            return;
        }

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

            <div className="space-y-3">

                {/* ===== SOCIAL LOGIN ===== */}

                <div className="space-y-3">

                    <button
                        type="button"
                        onClick={handleGoogle}
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
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <button
                        type="button"
                        onClick={handleGithub}
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
                        <FaGithub size={20} />
                        Continue with GitHub
                    </button>

                </div>

                {/* ===== DIVIDER ===== */}

                <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="flex-1 h-px bg-white/10" />
                    OR
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* ================= LOGIN ================= */}

                {step === "login" && (
                    <form onSubmit={handleLogin} className="space-y-3">

                        <input
                            type="email"
                            placeholder="Email address"
                            onChange={(e) => setEmail(e.target.value)}
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
                        />

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
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
    hover:text-white
    transition
    "
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                        </div>


                        <button
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
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-red-400 text-sm hover:underline w-full text-right"
                        >
                            Forgot Password?
                        </button>

                        <div className="pt-4 border-t border-white/10 text-center text-sm">
                            <span className="text-gray-400">
                                Don’t have an account?{" "}
                            </span>

                            <Link
                                to="/sign-up"
                                className="text-red-400 font-medium hover:text-red-300"
                            >
                                Create Account
                            </Link>
                        </div>

                    </form>
                )}

                {/* ================= OTP ================= */}

                {step === "otp" && (
                    <div className="space-y-6 text-center">

                        <h2 className="text-xl font-semibold tracking-wide">
                            Verification Code
                        </h2>

                        <p className="text-sm text-gray-400">
                            Enter the 6-digit code sent to your email
                        </p>

                        {step === "otp" && (
                            <div className="space-y-6 text-center">

                                <h2 className="text-xl font-semibold tracking-wide">
                                    Verification Code
                                </h2>

                                <p className="text-sm text-gray-400">
                                    Enter the 6-digit code sent to your email
                                </p>

                                <div className="flex justify-center">

                                    <InputOtp
                                        length={6}
                                        value={otpValue}
                                        onValueChange={handleOtpChange}
                                        classNames={{
                                            input:
                                                "w-12 h-12 sm:w-14 sm:h-14 text-lg font-semibold text-center bg-white/5 border border-white/10 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/40",
                                        }}
                                    />

                                </div>

                                {timer > 0 ? (
                                    <p className="text-gray-400 text-sm">
                                        Resend code in <span className="text-red-400">{timer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={resendOTP}
                                        className="text-red-400 text-sm hover:underline"
                                    >
                                        Resend Code
                                    </button>
                                )}

                            </div>
                        )}



                    </div>
                )}

                {/* ================= RESET PASSWORD ================= */}

                {step === "reset" && (
                    <form
                        onSubmit={handleResetPassword}
                        className="space-y-4"
                    >

                        <input
                            placeholder="Reset Code"
                            onChange={(e) => setResetCode(e.target.value)}
                            className="
            w-full
            p-3
            rounded-xl
            bg-white/5
            border border-white/10
            focus:border-red-500
            focus:ring-2 focus:ring-red-500/30
            outline-none
            "
                        />
                        <div className="relative">

                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                onChange={(e) => setNewPassword(e.target.value)}
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
                            />

                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="
    absolute
    right-3
    top-1/2
    -translate-y-1/2
    text-gray-400
    hover:text-white
    transition
    "
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                        </div>
                        <button
                            className="
            w-full
            py-3
            rounded-2xl
            bg-gradient-to-r from-red-500 to-red-600
            text-white
            hover:scale-[1.02]
            transition
            "
                        >
                            Reset Password
                        </button>

                    </form>
                )}

            </div>

        </AuthLayout>
    );
}