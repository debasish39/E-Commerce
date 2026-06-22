import React,
{
  useEffect,
  useState,
} from "react";

const ScrollProgressBar = () => {

  const [
    scrollWidth,

    setScrollWidth,

  ] = useState(0);

  /* =====================================
     HANDLE SCROLL
  ===================================== */

  const handleScroll =
    () => {

      const scrollTop =
        window.scrollY;

      const docHeight =

        document.documentElement
          .scrollHeight -

        window.innerHeight;

      const scrollPercent =

        (scrollTop / docHeight) * 100;

      setScrollWidth(
        scrollPercent
      );

    };

  useEffect(() => {

    window.addEventListener(
      "scroll",
      handleScroll
    );

    handleScroll();

    return () =>

      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  return (

    <>

      {/* TRACK */}
      <div

        style={{

          position: "fixed",

          top: 0,

          left: 0,

          width: "100%",

          height: "4px",

          background:
            "rgba(255,255,255,0.08)",

          backdropFilter:
            "blur(10px)",

          zIndex: 9998,

        }}

      />

      {/* PROGRESS */}
      <div

        style={{

          position: "fixed",

          top: 0,

          left: 0,

          height: "4px",

          width:
            `${scrollWidth}%`,

          background:
            "linear-gradient(90deg,#4f46e5,#7c3aed,#2563eb)",

          backgroundSize:
            "200% 100%",

          zIndex: 9999,

          transition:
            "width 0.15s ease-out",

          boxShadow:
            `
              0 0 10px rgba(99,102,241,0.6),
              0 0 20px rgba(124,58,237,0.4)
            `,

          animation:
            "gradientMove 4s linear infinite",

        }}

      >

        {/* GLOW DOT */}
        <div

          style={{

            position: "absolute",

            right: 0,

            top: "50%",

            transform:
              "translate(50%, -50%)",

            width: "12px",

            height: "12px",

            borderRadius: "50%",

            background:
              "#fff",

            boxShadow:
              `
                0 0 12px #fff,
                0 0 24px #7c3aed,
                0 0 40px #2563eb
              `,

          }}

        />

      </div>

      {/* STYLES */}
      <style>{`

        @keyframes gradientMove {

          0% {

            background-position:
              0% 50%;

          }

          100% {

            background-position:
              200% 50%;

          }

        }

      `}</style>

    </>

  );

};

export default ScrollProgressBar;