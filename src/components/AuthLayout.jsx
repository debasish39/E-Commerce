export default function AuthLayout({ title, children }) {
  return (
    <div className="
      relative
      min-h-[800px]
      flex
      items-center
      justify-center
      overflow-hidden
      bg-black
      text-white
    ">

      {/* ===== Animated Gradient Background ===== */}

      {/* Large Glow Top Left */}
      <div className="
        absolute
        -top-40
        -left-40
        w-[600px]
        h-[600px]
        bg-red-600/20
        blur-[140px]
        rounded-full
        animate-pulse
      " />

      {/* Large Glow Bottom Right */}
      <div className="
        absolute
        -bottom-40
        -right-40
        w-[600px]
        h-[600px]
        bg-orange-500/20
        blur-[140px]
        rounded-full
        animate-pulse
      " />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ===== Card Container ===== */}
      <div className="
        relative
        w-full
        max-w-md
        mx-4 
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
      py-3 px-3 sm:p-8
       
      ">

        {/* Title */}
        <div className="mb-3 text-center space-y-2">

          <h1 className="
            text-3xl pt-3
            font-semibold
            tracking-tight
            bg-gradient-to-r
            from-red-500
            via-orange-400
            to-red-400
            bg-clip-text
            text-transparent
            animate-gradient
          ">
            {title}
          </h1>

        </div>

        {children}

      </div>
    </div>
  );
}
