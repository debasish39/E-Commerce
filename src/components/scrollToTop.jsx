import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      title="Back to top"

      className={`
        fixed
        right-3
        top-1/2
        z-[999]

        flex
        h-10
        w-10
        -translate-y-1/2
        items-center
        justify-center

        rounded-full

        border
        border-slate-200

        bg-white

        text-slate-700

        shadow-[0_4px_16px_rgba(15,23,42,0.14)]

        transition-all
        duration-300
        ease-out

        hover:scale-105
        hover:bg-slate-50
        hover:text-indigo-600

        active:scale-95

        sm:right-5
        sm:h-11
        sm:w-11

        ${
          showButton
            ? "translate-y-[-50%] opacity-100"
            : "pointer-events-none translate-y-[-35%] opacity-0"
        }
      `}
    >
      <ArrowUp
        size={18}
        strokeWidth={2.5}
      />
    </button>
  );
}

