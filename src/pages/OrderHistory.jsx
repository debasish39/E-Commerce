import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import Logo from "../assets/logo.png";
import { FaDownload } from "react-icons/fa";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(savedOrders.reverse()); // newest first
  }, []);

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const centerX = pageWidth / 2;
    const themeColor = [230, 57, 70];

    try {
      doc.addImage(Logo, "PNG", centerX - 15, 10, 30, 30);
    } catch (err) {
      console.warn("Logo not found:", err);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("EShop", centerX, 48, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("https://eshop.debasish.xyz | djproject963@gmail.com", centerX, 54, { align: "center" });

    doc.setDrawColor(...themeColor);
    doc.setLineWidth(0.8);
    doc.line(margin, 60, pageWidth - margin, 60);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("INVOICE", margin, 75);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Invoice No: INV-${order.id.toString().slice(-6)}`, margin, 83);
    doc.text(`Date: ${order.date}`, margin, 89);

    // Customer Info
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", margin, 105);
    doc.setFont("helvetica", "normal");

    const customerInfo = [
      order.user || "Guest",
      order.address || "",
      order.statePostCode || "",
      order.country || "",
      `Phone: ${order.phone}`
    ];

    let infoY = 111;
    const lineSpacing = 7;
    customerInfo.forEach(line => {
      doc.text(line, margin, infoY);
      infoY += lineSpacing;
    });
    infoY += 12;

    // Item Table
    let tableY = infoY + 10;
    const colX = {
      item: margin + 3,
      qty: pageWidth / 2 - 20,
      price: pageWidth / 2 + 5,
      total: pageWidth - margin - 25,
    };

    doc.setFillColor(...themeColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, tableY - 6, pageWidth - margin * 2, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Item", colX.item, tableY);
    doc.text("Qty", colX.qty, tableY);
    doc.text("Price", colX.price, tableY);
    doc.text("Total", colX.total, tableY);

    tableY += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    order.items.forEach((item, i) => {
      if (tableY > pageHeight - 40) { doc.addPage(); tableY = 30; }
      doc.text(`${i + 1}. ${item.title}`, colX.item, tableY);
      doc.text(`${item.quantity}`, colX.qty, tableY);
      doc.text(`₹${item.price.toFixed(2)}`, colX.price, tableY);
      doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, colX.total, tableY);
      tableY += 8;
    });

    // Totals
    tableY += 5;
    doc.setDrawColor(220);
    doc.line(margin, tableY, pageWidth - margin, tableY);
    tableY += 10;

    doc.setFont("helvetica", "bold");
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    doc.text("Subtotal:", pageWidth - 65, tableY);
    doc.text(`₹${subtotal.toFixed(2)}`, pageWidth - margin, tableY, { align: "right" });

    tableY += 6;
    doc.text("Handling:", pageWidth - 65, tableY);
    doc.text("₹5.00", pageWidth - margin, tableY, { align: "right" });

    tableY += 6;
    doc.setDrawColor(...themeColor);
    doc.line(pageWidth - 80, tableY + 2, pageWidth - margin, tableY + 2);
    tableY += 8;

    doc.setFontSize(13);
    doc.text("Grand Total:", pageWidth - 65, tableY);
    doc.text(`₹${(subtotal + 5).toFixed(2)}`, pageWidth - margin, tableY, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for shopping with EShop ❤️", centerX, pageHeight - 25, { align: "center" });
    doc.text("For support, contact: djproject963@gmail.com", centerX, pageHeight - 19, { align: "center" });
    doc.text("Generated automatically by EShop © 2025", centerX, pageHeight - 13, { align: "center" });

    doc.save(`EShop-Invoice-${order.id}.pdf`);
  };

  return (
    <div className="min-h-screen px-4 py-10 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-red-400">📜 Order History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-300">No previous orders found.</p>
      ) : (
        <div className="w-full max-w-6xl space-y-6">
          {orders.map((order) => {
            const subtotal = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const grandTotal = subtotal + 5;

            const statusColor =
              order.status === "Placed"
                ? "bg-red-500 text-yellow-400 border-yellow-400/30"
                : order.status === "Confirmed"
                  ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                  : order.status === "Shipped"
                    ? "bg-purple-500/20 text-purple-400 border-purple-400/30"
                    : order.status === "Delivered"
                      ? "bg-green-500/20 text-green-400 border-green-400/30"
                      : "bg-red-500/20 text-red-400 border-red-400/30";

            return (
              <div
                key={order.id}
                className="relative bg-white/10 backdrop-blur-xl
      border border-white/20 rounded-3xl p-6 shadow-xl
      hover:shadow-red-500/20 hover:scale-[1.01]
      transition-all duration-300"
              >
                {/* Top Header */}
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {order.user}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Order ID: #{order.id.toString().slice(-6)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}`}
                    >
                      {order.status || "Placed"}
                    </span>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mt-3">
                  Phone: {order.phone}
                </p>

                {/* Items */}
                <div className="mt-5 space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm
            border-b border-white/10 pb-2"
                    >
                      <span className="text-white/80">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="text-red-400 font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 text-sm space-y-1">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Handling Fee</span>
                    <span>₹5.00</span>
                  </div>

                  <div className="border-t border-white/20 mt-2 pt-2 flex justify-between font-bold text-lg">
                    <span>Grand Total</span>
                    <span className="text-red-400">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Invoice Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => generateInvoice(order)}
                    className="flex items-center gap-2
          bg-gradient-to-r from-red-500 to-pink-600
          hover:scale-105 transition-all duration-300
          text-white px-5 py-2 rounded-xl text-sm
          shadow-lg hover:shadow-red-500/40 cursor-pointer"
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
