import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#4f46e5", // indigo
          colorBackground: "#ffffff",
          colorText: "#111827",
        },

        elements: {
          // main container
          rootBox: "bg-white",

          // card (login box)
          card: "bg-white shadow-xl rounded-2xl border border-gray-100",

          // inputs
          formFieldInput:
            "bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500",

          // buttons
          formButtonPrimary:
            "bg-indigo-600 hover:bg-indigo-700 text-white",

          // links
          footerActionLink:
            "text-indigo-600 hover:text-indigo-700",

          // header
          headerTitle: "text-gray-900",
          headerSubtitle: "text-gray-500",
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);