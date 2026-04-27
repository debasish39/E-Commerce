import { SignIn } from "@clerk/clerk-react";

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center ">

      <div className="w-full max-w-md  border border-gray-100 shadow-2xl rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
          Admin Login
        </h2>

        <SignIn />

      </div>

    </div>
  );
}