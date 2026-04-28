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

return ( <AuthLayout title="Verify Your Email"> <div className="flex justify-center items-center w-full">


    <div
      className="
      w-full max-w-md
      rounded-3xl
      p-6 sm:p-8
      space-y-3
    "
    >

      {/* Header */}
      <div className="text-center space-y-2">
   

        <p className="text-gray-400 text-sm">
          We sent a 6-digit code to your email.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={verifyCode} className="space-y-5">

        {/* Code Input */}
        <input
          type="text"
          maxLength={6}
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="
          w-full
          text-center
          tracking-[0.4em]
          text-lg
          p-4
          rounded-xl
          bg-white/5
          border border-indigo-400/30
          focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-500/40
          outline-none
          transition
          "
        />

        {/* Verify Button */}
        <button
          type="submit"
          className="
          w-full
          py-3 sm:py-4
          rounded-xl
          font-medium
          text-white
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-purple-600
          shadow-lg shadow-indigo-500/30
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
