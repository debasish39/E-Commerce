import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function AuthLayout({ title, children }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  /* ESC key close */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div
      className="
      fixed inset-0
      flex items-center justify-center
      bg-gray-200/60 backdrop-blur-md
      z-50
      px-4
      "
    >
      {/* Background glow */}
      <div
        className="
        absolute
        -top-40 -left-40
        w-[500px] h-[500px]
        bg-blue-400/30
        blur-[150px]
        rounded-full
        animate-pulse
      "
      />

      <div
        className="
        absolute
        -bottom-40 -right-40
        w-[500px] h-[500px]
        bg-blue-300/30
        blur-[150px]
        rounded-full
        animate-pulse
      "
      />

      {/* Card */}
      <div
        className="
        relative
        w-full
        max-w-md
        bg-white/80 border border-blue-100
        backdrop-blur-2xl
        rounded-3xl
        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        p-6 sm:p-8
        animate-[fadeIn_0.3s_ease]
        "
      >
        {/* Close button */}
        <button
          onClick={handleClose}
        className="
absolute
top-4 right-4
w-9 h-9
flex items-center justify-center
rounded-full
bg-gray-200
hover:bg-blue-500
text-gray-700
hover:text-white
transition cursor-pointer
"
        >
          <FaTimes size={14} />
        </button>

        {/* Title */}
        <div className="mb-6 text-center">
         <h1
  className="
  text-3xl
  font-semibold
  tracking-tight
  bg-gradient-to-r
  from-blue-600
  via-blue-400
  to-blue-500
  bg-clip-text
  text-transparent
"
>
  {title}
</h1>
        </div>

        {children}
      </div>
    </div>
  );
}