// components/ScrollProgressBar.jsx
import React, { useEffect, useState } from "react";

const ScrollProgressBar = () => {
    const [scrollWidth, setScrollWidth] = useState(0);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        setScrollWidth(scrollPercent);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "5px",
                width: `${scrollWidth}%`,
                background: "linear-gradient(to right, black, #ff7a00, red)",
                zIndex: 9999,
                transition: "width 0.1s ease-out",
            }}
        />
    );
};

export default ScrollProgressBar;
