import React, { useMemo } from "react";
import { getData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRupeeSign, FaTag } from "react-icons/fa";
import { MdTrendingDown } from "react-icons/md";
export default function PeopleAlsoView({ currentProduct }) {
    const { data } = getData();
    const navigate = useNavigate();

    const related = useMemo(() => {
        if (!data || data.length === 0) return [];

        // 👉 Middle-random fallback (home usage)
        if (!currentProduct) {
            const mid = Math.floor(data.length / 2);
            const start = Math.max(0, mid - 10);
            const end = Math.min(data.length, mid + 10);

            const middleChunk = data.slice(start, end);

            return [...middleChunk]
                .sort(() => 0.5 - Math.random())
                .slice(0, 8);
        }

        // 👉 Smart related logic
        return data
            .filter((item) => item.id !== currentProduct.id)
            .map((item) => {
                let score = 0;

                if (item.category === currentProduct.category) score += 50;

                const priceDiff = Math.abs(item.price - currentProduct.price);
                score += Math.max(0, 30 - priceDiff / 100);

                score += (item.rating || 4) * 10;

                return { ...item, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
    }, [data, currentProduct]);

    if (!related.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-4 py-6 rounded-xl">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-2xl font-bold">
                    People also viewed 👀
                </h2>
            </div>

            {/* SCROLL WRAPPER */}
            <div className="relative">


                {/* SCROLL CONTAINER */}
                <div
                    className="
            flex gap-3
            overflow-x-auto
            scroll-smooth
            snap-x snap-mandatory
            px-1 pb-3

            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          "
                >

                    {related.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/products/${item.id}`)}
                            className="
                snap-start
                min-w-[150px] sm:min-w-[190px]

                group
                 bg-gradient-to-br from-white via-blue-50 to-indigo-50 backdrop-blur
                border border-gray-100 
                rounded-xl p-3 
                cursor-pointer 

                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
              "
                        >

                            {/* IMAGE */}
                            <div className="relative flex justify-center mb-2">

                                {/* glow */}
                                <div className="
                  absolute w-20 h-20
                  bg-indigo-100 rounded-full blur-2xl
                  opacity-0 group-hover:opacity-100
                  transition
                " />

                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="
                    relative z-10
                    h-[90px] sm:h-[110px]
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                                />
                            </div>

                            {/* TITLE */}
                            <h3 className="
                text-xs sm:text-sm 
                line-clamp-2 
                text-gray-700
                group-hover:text-indigo-600
                transition
              ">
                                {item.title}
                            </h3>

                            {/* RATING */}
                            <div className="flex items-center gap-1 text-xs mt-1">
                                <FaStar className="text-yellow-400" size={12} />
                                <span>{item.rating?.toFixed(1) || "4.2"}</span>
                            </div>

                            {/* PRICE */}
                            <div className="mt-1 flex flex-col gap-[2px]">

                                {/* Current Price */}
                                <div className="flex items-center gap-1">
                                    <FaRupeeSign size={10} className="text-indigo-600" />
                                    <span className="text-sm font-bold text-gray-900">
                                        {item.price?.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                {/* Discount / Value */}
                                <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                                    <MdTrendingDown size={10} />
                                    <FaTag size={9} />
                                    <span>Best Price</span>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}