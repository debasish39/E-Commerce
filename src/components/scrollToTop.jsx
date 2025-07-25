import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // or use any icon library

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  // Show button when scrolled down
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
        className="fixed bottom-12 right-9 z-50 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition duration-300 cursor-pointer"
        title="Scroll to Top" style={{boxShadow:'3px 3px 39px red'}}
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    )
  );
}
