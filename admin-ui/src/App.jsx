import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
  UserButton
} from "@clerk/clerk-react";

import Sidebar from "./layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Users from "./pages/Users";
import Auth from "./pages/Auth";
export default function App() {
  const [open, setOpen] = useState(false);

  const { user, isLoaded } = useUser();

  // ⏳ Wait until Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // 🔐 Check admin role

  return (
    <BrowserRouter>

      {/* ❌ Not logged in */}
    <Routes>
    <Route path="/sign-in" element={<Auth />} />
  </Routes>

  <SignedOut>
    <Auth />
  </SignedOut>

      {/* ✅ Logged in */}
      <SignedIn>

        
          <div className="flex min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-white ">

            {/* Sidebar */}
            <Sidebar open={open} setOpen={setOpen} />

            {/* Main Content */}
            <div className="flex-1 md:ml-64 backdrop-blur-sm bg-white/70">

              {/* 📱 Mobile Navbar */}
              <div className="md:hidden flex items-center justify-between p-4 shadow bg-indigo-600 text-white sticky top-0 z-40">
                <div className="flex items-center">
                  <button onClick={() => setOpen(true)}>
                    <Menu />
                  </button>

                  <h1 className="ml-4 font-semibold text-lg">
                    Eshop Admin
                  </h1>
                </div>

               
              </div>


              {/* Pages */}
              <div className="sm:p-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/users" element={<Users />} />
                </Routes>
              </div>

            </div>
          </div>
        

      </SignedIn>
    </BrowserRouter>
  );
}