import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Heart,
  Package,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: Users },
    { name: "Orders", path: "/orders", icon: Package },
    { name: "Cart", path: "/cart", icon: ShoppingCart },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
  ];

  return (
    <>
      {/* 📱 Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${
          open ? "visible" : "invisible"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 p-4 transform transition-transform duration-300
          bg-gradient-to-b from-indigo-700 via-blue-600 to-indigo-800 text-white shadow-xl
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-wide">
              Eshop Admin
            </h2>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-white text-indigo-700 shadow-md"
                        : "hover:bg-white/10"
                    }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-4 border-t border-white/20 flex items-center justify-between">

  <span className="text-sm text-white/80">
    Profile
  </span>

  <UserButton
    afterSignOutUrl="/sign-in"
    appearance={{
      elements: {
        userButtonAvatarBox:
          "w-10 h-10 border border-white shadow",
      },
    }}
  />
</div>
        </div>

        {/* Overlay */}
        <div
          className="h-full w-full "
          onClick={() => setOpen(false)}
        />
      </div>

      {/* 💻 Desktop Sidebar */}
   <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 p-4 flex-col
  bg-gradient-to-b from-indigo-700 via-blue-600 to-indigo-800 text-white shadow-xl">

  <h2 className="text-xl font-semibold mb-6 tracking-wide">
    Eshop Admin
  </h2>

  {/* Menu */}
  <nav className="flex flex-col gap-2 flex-1">
    {menuItems.map((item, i) => {
      const Icon = item.icon;
      const active = location.pathname === item.path;

      return (
        <Link
          key={i}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
            ${
              active
                ? "bg-white text-indigo-700 shadow-md"
                : "hover:bg-white/10"
            }`}
        >
          <Icon size={18} />
          {item.name}
        </Link>
      );
    })}
  </nav>

  {/* 👤 User Section */}
  <div className="mt-auto pt-4 border-t border-white/20 flex items-center justify-between">

    <span className="text-sm text-white/80">
      Profile
    </span>

    <UserButton
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          userButtonAvatarBox:
            "w-10 h-10 border-2 border-white shadow hover:scale-105 transition",
          userButtonPopoverCard:
            "rounded-xl shadow-2xl",
        },
      }}
    />
  </div>
</div>
    </>
  );
}