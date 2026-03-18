import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  return (
    <motion.div
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, delay }}
      className="mb-2 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {

  const listRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleItemMouseEnter = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback((item, index) => {

    setSelectedIndex(index);

    if (onItemSelect) {
      onItemSelect(item, index);
    }

  }, [onItemSelect]);

  const handleScroll = useCallback((e) => {

    const { scrollTop, scrollHeight, clientHeight } = e.target;

    setTopGradientOpacity(Math.min(scrollTop / 50, 1));

    const bottomDistance = scrollHeight - (scrollTop + clientHeight);

    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );

  }, []);

  /* Keyboard Navigation */
  useEffect(() => {

    if (!enableArrowNavigation) return;

    const handleKeyDown = (e) => {

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter") {

        if (selectedIndex >= 0 && selectedIndex < items.length) {

          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }

        }

      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);

  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  return (

    <div className={`relative w-full ${className}`}>

      <div
        ref={listRef}
        className={`max-h-[260px] overflow-y-auto p-2 rounded-lg ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded"
            : "scrollbar-hide"
        }`}
        onScroll={handleScroll}
      >

        {items.map((item, index) => (

          <AnimatedItem
            key={index}
            delay={index * 0.03}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >

            <div
            className={`p-3 rounded-lg transition ${
  selectedIndex === index
    ? "bg-blue-500 text-white"
    : "bg-gray-100 hover:bg-blue-50 text-gray-800"
} ${itemClassName}`}
            >
              {item}
            </div>

          </AnimatedItem>

        ))}

      </div>

      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-200 to-transparent pointer-events-none"
            style={{ opacity: topGradientOpacity }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-200 to-transparent pointer-events-none"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}

    </div>
  );
};

// export default AnimatedList;