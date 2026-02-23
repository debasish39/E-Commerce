import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export default function VerifySignIn() {
  return <AuthenticateWithRedirectCallback />;
}