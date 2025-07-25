import React from 'react';

export default function About() {
  return (
    <section className="min-h-screen text-gray-800 py-16 px-6 md:px-12">
      <div className="max-w-full mx-auto">

        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 text-center mb-10">
          About This Website
        </h1>

        {/* Info Card */}
        <div className="  rounded-xl p-6 md:p-10 space-y-8">

          <p className="text-lg leading-relaxed">
            👋 Welcome to <span className="font-bold text-red-600">E-Com</span>, your go-to
            destination for quality products at unbeatable prices. We're a passionate team of
            developers and designers focused on creating a smooth shopping experience.
          </p>

          <p className="text-lg leading-relaxed">
            🛍 From the latest gadgets to fashion and home essentials, our store offers a variety
            of handpicked products. With intelligent filtering, fast search, and fully responsive
            layouts — we bring everything to your fingertips.
          </p>

          <p className="text-lg leading-relaxed">
            💻 This project is part of a full-stack eCommerce app that highlights modern UI/UX,
            smart state management, and robust features. Future updates will include full user
            authentication, shopping cart, and payment integration!
          </p>

          {/* Technologies */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">🧩 Technologies Used:</h2>
            <ul className="list-disc list-inside space-y-1 text-base">
              <li>⚛️ React.js</li>
              <li>🎨 Tailwind CSS</li>
              <li>🧠 Context API for state management</li>
              {/* <li>🔐 Clerk for authentication</li>
              <li>
                🔍 APIs:{" "}
                <code className="bg-white border px-2 py-1 rounded text-blue-600 text-sm">
                  https://dummyjson.com/products
                </code>{" "}
                (recommended),{" "}
                <code className="bg-white border px-2 py-1 rounded text-blue-600 text-sm">
                  https://fakestoreapi.in
                </code>
              </li> */}
            </ul>
          </div>

          {/* Geo API Block
         
            <p className="text-gray-900 text-base">
              🌐 Want to personalize content based on user location? Use the{" "}
              <code className="bg-white border px-2 py-1 rounded text-blue-600 text-sm">
                https://api.geoapify.com/v1/geocode/
              </code>{" "}
              API to detect user location and show localized product listings!
            </p>
           */}
        </div>

      </div>
    </section>
  );
}
