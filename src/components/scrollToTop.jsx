import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress = (winScroll / height) * 100;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setShowButton(winScroll > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`
        fixed bottom-21 right-6 z-[999] rounded-2xl
        transition-all duration-500
        ${
          showButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }
      `}
    >
      {/* Glow background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 blur-xl opacity-40 animate-pulse" />

      <button
        onClick={handleClick}
        className="
          relative
          w-14 h-14
          rounded-full
          flex items-center justify-center
          text-white
          overflow-hidden
          backdrop-blur-xl
          bg-white/10
          border border-white/20 
          shadow-[0_15px_40px_rgba(79,70,229,0.35)]
          transition-all duration-300
          hover:scale-110 hover:-translate-y-1
          active:scale-95
          group
        "
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-500 to-blue-600" />

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" />

        {/* Progress circle background */}
        <svg
          className="absolute w-full h-full rotate-[-90deg]"
          viewBox="0 0 36 36"
        >
          {/* Background circle */}
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />

          {/* Progress circle */}
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - scrollProgress}
            strokeLinecap="round"
          />
        </svg>

        {/* Icon + percentage */}
        <div className="relative z-10 flex flex-col items-center leading-none">
          <ArrowUp size={18} className="mb-[2px]" />

          <span className="text-[9px] font-bold">
            {Math.round(scrollProgress)}%
          </span>
        </div>
      </button>
    </div>
  );
}