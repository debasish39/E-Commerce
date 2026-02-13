import React from 'react';
import { useCart } from '../context/CartContext';
import { FaRegTrashAlt, FaQrcode, FaCheckCircle, FaHistory, FaWallet } from 'react-icons/fa';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining } from 'react-icons/md';
import { GiShoppingBag } from 'react-icons/gi';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import emptyCart from "../assets/empty-cart.png";
import { jsPDF } from 'jspdf';
import 'react-tooltip/dist/react-tooltip.css';
import Logo from "../assets/logo.png";

const Cart = ({ location, getLocation }) => {
  const { cartItem, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const totalPrice = cartItem.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  const totalAmount = (totalPrice + 5).toFixed(2);

  const UPI_ID = "sonupanda0999@okicici";
  const upiPaymentLink = `upi://pay?pa=${UPI_ID}&pn=Your%20Store&am=${totalAmount}&cu=INR&tn=Payment%20for%20Order`;

  const upiQrCodeUrl =
    cartItem.length > 0 &&
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      upiPaymentLink
    )}`;

const generateInvoice = async (phone) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const centerX = pageWidth / 2;
  const themeColor = [230, 57, 70];
  const lightGray = [245, 245, 245];

  try { doc.addImage(Logo, "PNG", centerX - 15, 10, 30, 30); } 
  catch (err) { console.warn("Logo not found:", err); }

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
  doc.text(`Invoice No: INV-${Date.now().toString().slice(-6)}`, margin, 83);
  doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, 89);

  // ===== CUSTOMER INFO =====
doc.setFont("helvetica", "bold");
doc.text("Bill To:", margin, 105);
doc.setFont("helvetica", "normal");

// Get data directly from input fields
const customerName = document.querySelector('input[placeholder="Full Name"]')?.value || user?.fullName || "Guest";
const customerAddress = document.querySelector('input[placeholder="Address"]')?.value || "";
const customerState = document.querySelector('input[placeholder="State"]')?.value || "";
const customerPostCode = document.querySelector('input[placeholder="PostCode"]')?.value || "";
const customerCountry = document.querySelector('input[placeholder="Country"]')?.value || "";

const customerInfo = [
  customerName,
  customerAddress,
  `${customerState} - ${customerPostCode}`,
  customerCountry,
  `Phone: +91 ${phone}`,
];


  let infoY = 111; // start Y for customer info
  const lineSpacing = 6;

  customerInfo.forEach(line => {
    doc.text(line, margin, infoY);
    infoY += lineSpacing;
  });

  // Add extra white space after phone number
  infoY += 9;

  // ===== SUMMARY BOX =====
  doc.setDrawColor(220);
  doc.setFillColor(...lightGray);
  doc.roundedRect(pageWidth - 75, 80, 60, 40, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.text("Summary", pageWidth - 45, 88, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(`Items: ${cartItem.length}`, pageWidth - 45, 98, { align: "center" });
  doc.text(`Total: ₹${totalAmount}`, pageWidth - 45, 108, { align: "center" });

  // ===== ITEM TABLE =====
  let tableY = infoY + 10; // start table below customer info
  doc.setFillColor(...themeColor);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, tableY - 6, pageWidth - margin * 2, 10, "F");

  const colX = {
    item: margin + 3,
    qty: pageWidth / 2 - 20,
    price: pageWidth / 2 + 5,
    total: pageWidth - margin - 25,
  };

  doc.setFont("helvetica", "bold");
  doc.text("Item", colX.item, tableY);
  doc.text("Qty", colX.qty, tableY);
  doc.text("Price", colX.price, tableY);
  doc.text("Total", colX.total, tableY);

  tableY += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  cartItem.forEach((item, i) => {
    if (tableY > pageHeight - 40) { doc.addPage(); tableY = 30; }
    doc.text(`${i + 1}. ${item.title}`, colX.item, tableY);
    doc.text(`${item.quantity}`, colX.qty, tableY);
    doc.text(`₹${item.price}`, colX.price, tableY);
    doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, colX.total, tableY);
    tableY += 8;
  });

  // ===== TOTALS =====
  tableY += 5;
  doc.setDrawColor(220);
  doc.line(margin, tableY, pageWidth - margin, tableY);
  tableY += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Subtotal:", pageWidth - 65, tableY);
  doc.text(`₹${totalPrice.toFixed(2)}`, pageWidth - margin, tableY, { align: "right" });

  tableY += 6;
  doc.text("Handling:", pageWidth - 65, tableY);
  doc.text("₹5", pageWidth - margin, tableY, { align: "right" });

  tableY += 6;
  doc.setDrawColor(...themeColor);
  doc.line(pageWidth - 80, tableY + 2, pageWidth - margin, tableY + 2);
  tableY += 8;

  doc.setFontSize(13);
  doc.text("Grand Total:", pageWidth - 65, tableY);
  doc.text(`₹${totalAmount}`, pageWidth - margin, tableY, { align: "right" });

  // ===== UPI QR =====
  if (upiQrCodeUrl) {
    tableY += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Payment QR:", margin, tableY);
    try { doc.addImage(upiQrCodeUrl, "PNG", margin, tableY + 4, 35, 35); } 
    catch (err) { console.warn("Failed to load QR:", err); }
    doc.setFont("helvetica", "normal");
    doc.text(`UPI ID: ${UPI_ID}`, margin + 40, tableY + 25);
  }

  // ===== FOOTER =====
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Thank you for shopping with EShop ❤️", centerX, pageHeight - 25, { align: "center" });
  doc.text("For support, contact: djproject963@gmail.com", centerX, pageHeight - 19, { align: "center" });
  doc.text("Generated automatically by EShop © 2025", centerX, pageHeight - 13, { align: "center" });

  doc.save(`EShop-Invoice-${Date.now()}.pdf`);
};

  const handleCheckout = async () => {
    if (cartItem.length === 0) { alert("Your cart is empty!"); return; }

    const phone = document.querySelector('input[name="phone"]').value;
    if (!/^\d{10}$/.test(phone)) { alert("Please enter a valid 10-digit phone number!"); return; }

    if (window.confirm("Have you completed the UPI payment?")) {
      const newOrder = {
        id: Date.now(),
        user: user?.fullName || "Guest",
        phone: `+91 ${phone}`,
        total: totalAmount,
        date: new Date().toLocaleString(),
        items: cartItem.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
        existingOrders.push(newOrder);
        localStorage.setItem("orderHistory", JSON.stringify(existingOrders));
      } catch (err) { console.error("Failed to save order history:", err); }

      try {
        const downloadInvoice = window.confirm("Do you want to download your invoice now?");
        if (downloadInvoice) await generateInvoice(phone);
      } catch (err) { console.error("Invoice generation failed:", err); }

      try {
        if (typeof clearCart === "function") clearCart();
        else localStorage.removeItem("cartItems");
      } catch (err) { localStorage.removeItem("cartItems"); }

      navigate('/order-success');
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 flex justify-center items-start text-white">
      {cartItem.length > 0 ? (
        <div className="max-w-6xl w-full space-y-8">
          {/* Title */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center md:text-left drop-shadow-lg">
              🛒 My Cart <span className="text-red-400">({cartItem.length})</span>
            </h1>

            <button
              onClick={() => navigate('/order-history')}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-lg font-semibold text-sm sm:text-base hover:scale-105 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FaHistory /> View Order History
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-5">
         {cartItem.map((item, index) => (
  <div
    key={index}
    className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 sm:p-5
    flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6
    transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
  >
    {/* ===== Clickable Product Section ===== */}
    <div
      onClick={() => navigate(`/products/${item.id}`)}
      className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto
      cursor-pointer group"
    >
      <img
        src={item.images[0]}
        alt={item.title}
        className="w-24 h-24 rounded-xl border border-white/20 object-cover
        mx-auto sm:mx-0 group-hover:scale-105 transition-transform duration-300"
      />

      <div className="text-center sm:text-left">
        <h1 className="text-base sm:text-lg font-semibold text-white/90 line-clamp-2
        group-hover:text-red-400 transition-colors duration-300">
          {item.title}
        </h1>

        <p className="text-red-400 font-bold text-lg mt-1">
          ₹{item.price}
        </p>
      </div>
    </div>

    {/* ===== Quantity + Delete Controls ===== */}
    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
      
      {/* Quantity Box */}
      <div
        className="bg-red-500/90 text-white flex items-center gap-4
        p-2 rounded-full font-bold text-lg sm:text-xl shadow-md
        mx-auto sm:mx-0"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            decreaseQty(item.id);
          }}
          className="cursor-pointer hover:scale-125 transition-transform"
        >
          <AiOutlineMinus />
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            increaseQty(item.id);
          }}
          className="cursor-pointer hover:scale-125 transition-transform"
        >
          <AiOutlinePlus />
        </button>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("Remove this item from cart?")) {
            removeFromCart(item.id);
          }
        }}
        className="bg-white/10 hover:bg-red-500/90 transition-all
        rounded-full p-3 hover:text-white shadow-md
        mx-auto sm:mx-0 cursor-pointer"
      >
        <FaRegTrashAlt className="text-red-400 text-lg sm:text-xl" />
      </button>
    </div>
  </div>
))}

          </div>

          {/* Delivery & Bill Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Delivery Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl text-white/90 space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold text-red-300 text-center sm:text-left">
                Delivery Information
              </h1>
              {/* Input fields */}
              <div className="flex flex-col space-y-3">
                <input type="text" placeholder="Full Name" defaultValue={user?.fullName || ''} className="p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400" />
                <input type="text" placeholder="Address" defaultValue={location?.county || ''} className="p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" placeholder="State" defaultValue={location?.state || ''} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400" />
                  <input type="text" placeholder="PostCode" defaultValue={location?.postcode || ''} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" placeholder="Country" defaultValue={location?.country || ''} className="sm:w-1/2 p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400" />
                  <div className="flex sm:w-1/2 items-center bg-white/20 border border-white/30 rounded-lg overflow-hidden focus:outline-none focus:border-red-400">
                    <span className="px-3 text-white/70 text-sm sm:text-base select-none">+91</span>
                    <input type="tel" name="phone" required placeholder="Phone Number" maxLength="10" pattern="[0-9]{10}" inputMode="numeric" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10) }} className="flex-1 p-3 bg-transparent text-white text-sm sm:text-base focus:outline-none focus:border-red-400" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 rounded-lg text-sm sm:text-base hover:scale-105 transition-all">Submit</button>
                  <button onClick={getLocation} className="flex-1 border border-red-400 text-red-300 font-semibold py-2 rounded-lg text-sm sm:text-base hover:bg-red-500/90 hover:text-white transition-all">Detect Location</button>
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl text-white/90 space-y-3">
              <h1 className="text-xl sm:text-2xl font-bold text-red-300 text-center sm:text-left">Bill Summary</h1>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <h1 className="flex items-center gap-2"><LuNotebookText /> Items Total</h1>
                  <p>₹{totalPrice}</p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex items-center gap-2"><MdDeliveryDining /> Delivery</h1>
                  <p className="text-red-300"><span className="line-through text-gray-400">₹25</span> FREE</p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex items-center gap-2"><GiShoppingBag /> Handling</h1>
                  <p>₹5</p>
                </div>
                <hr className="border-white/30 my-3" />
                <div className="flex justify-between font-bold text-lg">
                  <h1 className="flex items-center gap-2"><FaWallet /> Grand Total</h1>
                  <p>₹{totalPrice + 5}</p>
                </div>
              </div>

              {/* UPI Payment */}
              {cartItem.length > 0 && (
                <div className="mt-6 text-center space-y-2 border-t border-white/30 pt-4">
                  <h2 className="font-semibold text-base flex items-center justify-center gap-2"><FaQrcode /> Pay via UPI</h2>
                  <p className="text-xs text-gray-300">Scan the QR below or tap to pay with your UPI app.</p>
                  <div className="text-center">
                    <a href={upiPaymentLink} target="_blank" rel="noreferrer">
                      <img src={upiQrCodeUrl} alt="UPI QR Code" className="w-40 h-40 mx-auto rounded-lg border border-white/20 shadow-md hover:scale-105 transition-transform" />
                    </a>
                    <a href={upiPaymentLink} target="_blank" rel="noreferrer" className="inline-block mt-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300">Buy Now</a>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">UPI ID: <span className="font-medium">{UPI_ID}</span></p>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleCheckout}
                      className="bg-green-500/90 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <FaCheckCircle className="w-5 h-5" /> I have completed payment
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center min-h-[80vh] px-4 space-y-6 text-white">
          <img src={emptyCart} alt="Empty Cart" className="w-52 sm:w-64 md:w-80 opacity-90 drop-shadow-lg" />
          <h1 className="text-3xl sm:text-4xl font-bold text-red-300">Your Cart is Empty</h1>
          <p className="text-white/70 text-sm sm:text-base">Browse products and add something to your cart!</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/products')}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105 text-sm sm:text-base cursor-pointer"
            >
              <GiShoppingBag className="w-5 h-5" /> Continue Shopping
            </button>

            {/* View Order History */}
            <button
              onClick={() => navigate('/order-history')}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105 text-sm sm:text-base cursor-pointer"
            >
              <FaHistory className="w-5 h-5" /> View Order History
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
