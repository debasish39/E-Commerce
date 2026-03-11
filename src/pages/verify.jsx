import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { toast } from "sonner";

export default function Verify() {

    const { signUp, setActive } = useSignUp();
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const verifyCode = async (e) => {
        e.preventDefault();

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                toast.success("Account verified 🎉");
                navigate("/");
            }

        } catch (err) {
            toast.error("Invalid verification code");
            console.error(err);
        }
    };

    return (
        <AuthLayout title="Verify Your Email">

            <div className="flex justify-center items-center w-full">

                <div className="
          w-full max-w-md
          bg-black/60
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          shadow-[0_0_40px_rgba(255,0,0,0.25)]
          p-6 sm:p-8
          space-y-6
        ">

                    <div className="text-center space-y-2">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                            Enter Verification Code
                        </h2>

                        <p className="text-gray-400 text-sm">
                            We sent a 6-digit code to your email.
                        </p>
                    </div>

                    <form onSubmit={verifyCode} className="space-y-5">

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="
                w-full
                text-center
                tracking-widest
                text-lg
                p-4
                rounded-xl
                bg-black/50
                border border-gray-700
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/30
                outline-none
                transition
              "
                        />

                        <button
                            type="submit"
                            className="
                w-full
                py-3 sm:py-4
                rounded-xl
                bg-gradient-to-r
                from-red-500
                to-red-600
                text-white
                font-medium
                shadow-lg shadow-red-500/30
                hover:scale-[1.02]
                transition
              "
                        >
                            Verify Account
                        </button>

                    </form>

                </div>

            </div>

        </AuthLayout>
    );
}