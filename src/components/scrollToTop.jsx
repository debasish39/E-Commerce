import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    showButton && (
      <button
        onClick={handleClick}
        className="
        fixed bottom-25 right-7 z-50
        bg-gradient-to-r from-blue-600 to-indigo-600
        hover:from-blue-700 hover:to-indigo-700
        text-white
        p-3
        rounded-full
        shadow-lg
        transition
        duration-300
        hover:scale-110
        active:scale-95
        cursor-pointer
        "
        title="Scroll to Top"
        style={{ boxShadow: "0 8px 25px rgba(99,102,241,0.5)" }}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    )
  );
}