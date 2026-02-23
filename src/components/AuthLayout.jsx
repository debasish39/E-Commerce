export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center 
    text-white px-4">

      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] 
      bg-red-600/20 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-md 
      bg-white/5 backdrop-blur-2xl
      border border-white/10
      rounded-3xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-center 
        bg-gradient-to-r from-red-500 to-orange-400 
        bg-clip-text text-transparent mb-6">
          {title}
        </h1>

        {children}

      </div>
    </div>
  );
}