export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white/10 backdrop-blur-lg border border-red-200/40 rounded-2xl p-4 shadow-md">

      {/* Image */}
      <div className="h-39 sm:h-55 bg-gray-600/30 rounded-xl"></div>

      {/* Title */}
      <div className="mt-2 h-2 bg-gray-600/20 rounded w-3/4"></div>

      {/* Brand */}
      <div className="mt-2 h-2 bg-gray-600/40 rounded w-1/2"></div>

      {/* Price */}
      <div className="mt-2 h-2 bg-gray-600/40 rounded w-1/3"></div>

      {/* Button */}
      <div className="mt-3 h-6 bg-gray-700/40 rounded-lg"></div>

    </div>
  );
}