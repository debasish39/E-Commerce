import React from 'react';
import { useUser } from '@clerk/clerk-react';

export default function ProtectedRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null; // wait until Clerk loads

  if (!user) {
    // Redirect to Clerk's hosted sign-in with current page as redirect_url
    const redirectURL = encodeURIComponent(window.location.href);
    console.log(window.location.href);
    window.location.href = `https://big-badger-99.accounts.dev/sign-in?redirect_url=${redirectURL}`;
    return null;
  }

  return <>{children}</>;
}
