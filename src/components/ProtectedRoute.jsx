import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";
export default function ProtectedRoute({ children }) {
  const { user, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/sign-in"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}