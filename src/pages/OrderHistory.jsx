import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import Logo from "../assets/logo.png";
import { FaDownload } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";
import AOS from "aos";
import "aos/dist/aos.css";
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useUser();
useEffect(() => {
  AOS.init({
    duration: 800,
    once: false,
    easing: "ease-in-out",
  });
}, []);
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://eshop-backend-y0e7.onrender.com/api/orders/${user.id}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Invalid order response:", data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const generateInvoice = (order) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 15;
  const centerX = pageWidth / 2;

  const primaryColor = [59, 130, 246];   // blue
  const secondaryColor = [99, 102, 241]; // indigo

  /* ================= HEADER ================= */

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);

  try {
    doc.addImage(Logo, "PNG", pageWidth - 45, 5, 30, 30);
  } catch (err) {
    console.warn("Logo not found:", err);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("EShop", margin, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("https://eshop.debasish.xyz", margin, 28);
  doc.text("djproject963@gmail.com", margin, 34);

  /* ================= INVOICE INFO ================= */

  doc.setTextColor(0, 0, 0);

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE", margin, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Invoice No: INV-${order._id.slice(-6)}`,
    pageWidth - margin,
    55,
    { align: "right" }
  );

  doc.text(`Date: ${formattedDate}`, pageWidth - margin, 62, {
    align: "right",
  });
doc.setFontSize(10);

// Set color based on payment method
if (order.paymentMethod === "COD") {
doc.setTextColor(202, 138, 4); // yellow-600 (less bright, more readable)
} else {
  doc.setTextColor(34, 197, 94); // green
}

doc.text(
  `Payment: ${order.paymentMethod || "N/A"}`,
  pageWidth - margin,
  68,
  { align: "right" }
);

// Reset back to normal black after
doc.setTextColor(0, 0, 0);
  /* ================= BILL TO ================= */

  const customerInfo = [
    order.user || "Guest",
    order.deliveryAddress?.street || "",
    `${order.deliveryAddress?.state || ""} ${
      order.deliveryAddress?.postcode || ""
    }`,
    order.deliveryAddress?.country || "",
    `Phone: ${order.phone || ""}`,
  ];

  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, 70, pageWidth - margin * 2, 40, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.text("Bill To", margin + 5, 78);

  doc.setFont("helvetica", "normal");

  let infoY = 85;

  customerInfo.forEach((line) => {
    doc.text(line, margin + 5, infoY);
    infoY += 6;
  });

  /* ================= TABLE ================= */

  let tableY = 120;

  const colX = {
    item: margin + 5,
    qty: pageWidth / 2 - 25,
    price: pageWidth / 2 + 5,
    total: pageWidth - margin - 25,
  };

  // Header
  doc.setFillColor(...primaryColor);
  doc.setTextColor(255, 255, 255);
  doc.roundedRect(
    margin,
    tableY - 6,
    pageWidth - margin * 2,
    10,
    2,
    2,
    "F"
  );

  doc.setFont("helvetica", "bold");

  doc.text("Item", colX.item, tableY);
  doc.text("Qty", colX.qty, tableY);
  doc.text("Price", colX.price, tableY);
  doc.text("Total", colX.total, tableY);

  tableY += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  order.items.forEach((item, i) => {
    if (tableY > pageHeight - 60) {
      doc.addPage();
      tableY = 30;
    }

    // Zebra rows
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, tableY - 5, pageWidth - margin * 2, 8, "F");
    }

    doc.text(`${i + 1}. ${item.title}`, colX.item, tableY);
    doc.text(`${item.quantity}`, colX.qty, tableY);
    doc.text(`₹${item.price.toFixed(2)}`, colX.price, tableY);
    doc.text(
      `₹${(item.price * item.quantity).toFixed(2)}`,
      colX.total,
      tableY
    );

    tableY += 8;
  });

  /* ================= TOTAL BOX ================= */

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  tableY += 10;

  doc.setFillColor(240, 245, 255);
  doc.roundedRect(pageWidth - 90, tableY - 5, 75, 35, 3, 3, "F");

  doc.setFont("helvetica", "bold");

  doc.text("Subtotal:", pageWidth - 85, tableY);
  doc.text(`₹${subtotal.toFixed(2)}`, pageWidth - 20, tableY, {
    align: "right",
  });

  tableY += 7;

  doc.text("Handling:", pageWidth - 85, tableY);
  doc.text("₹5.00", pageWidth - 20, tableY, { align: "right" });

  tableY += 10;

  doc.setTextColor(...secondaryColor);
  doc.setFontSize(13);

  doc.text("Total:", pageWidth - 85, tableY);
  doc.text(`₹${(subtotal + 5).toFixed(2)}`, pageWidth - 20, tableY, {
    align: "right",
  });

  /* ================= FOOTER ================= */

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);

  doc.text(
    "Thank you for shopping with EShop ❤️",
    centerX,
    pageHeight - 25,
    { align: "center" }
  );

  doc.text(
    "For support: djproject963@gmail.com",
    centerX,
    pageHeight - 18,
    { align: "center" }
  );

  doc.text(
    "Generated automatically by EShop © 2026",
    centerX,
    pageHeight - 12,
    { align: "center" }
  );

  /* ================= SAVE ================= */

  doc.save(`EShop-Invoice-${order._id}.pdf`);
};

  return (
    <div className="min-h-screen px-4 py-12 
  flex flex-col items-center">

     <h1
  data-aos="fade-down"
  className="text-3xl md:text-4xl font-bold mb-10 
  text-transparent bg-clip-text 
  bg-gradient-to-r from-blue-600 to-indigo-600"
>
        <span className="text-white">📦</span> Order History
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No previous orders found.</p>
      ) : (
        <div className="w-full max-w-6xl space-y-3">

          {orders.map((order,index) => {
            const subtotal = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            const grandTotal = subtotal + 5;

            const statusStyles = {
              Placed: "bg-yellow-100 text-yellow-700",
              Confirmed: "bg-blue-100 text-blue-700",
              Shipped: "bg-purple-100 text-purple-700",
              Delivered: "bg-green-100 text-green-700",
            };

            return (
         <div
  key={order._id}
  data-aos="fade-up"
  data-aos-delay={index * 120}
  data-aos-duration="700"
  data-aos-easing="ease-out-cubic"
  className="group rounded-2xl border border-gray-200 
  bg-white/60 shadow-sm hover:shadow-xl 
  hover:-translate-y-[2px]
  transition-all duration-300 p-6"
>

                {/* HEADER */}
                <div className="flex justify-between items-center flex-wrap gap-4">

               <div>
  <h2 className="text-lg font-semibold text-gray-800">
    {order.user}
  </h2>

  <div className="flex items-center gap-2 mt-1">
    <p className="text-xs text-gray-500">
      Order ID: #{order._id.slice(-6)}
    </p>

    {/* ✅ PAYMENT METHOD */}
    <span
      className={`text-[10px] px-2 py-0.5 rounded font-medium
      ${
        order.paymentMethod === "COD"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-green-100 text-green-700"
      }`}
    >
      {order.paymentMethod}
    </span>
  </div>
</div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full
                  ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status || "Placed"}
                  </span>

                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* ITEMS */}
                <div className="mt-3 space-y-1">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b border-gray-200 pb-2"
                    >
                      <span className="text-gray-700">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="text-indigo-600 font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-2 text-sm space-y-1 text-gray-600">

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Handling Fee</span>
                    <span>₹5.00</span>
                  </div>

                  <div className="border-t pt-1 flex justify-between font-semibold text-gray-800">
                    <span>Grand Total</span>
                    <span className="text-indigo-600">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="mt-1 flex justify-end">
                  <button
                    onClick={() => generateInvoice(order)}
                    className="flex items-center gap-2 
                  bg-gradient-to-r from-blue-500 to-indigo-600
                  hover:from-blue-600 hover:to-indigo-700
                  text-white px-5 py-2 rounded-lg font-medium
                  shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    <FaDownload />
                    Download Invoice
                  </button>
                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default OrderHistory;