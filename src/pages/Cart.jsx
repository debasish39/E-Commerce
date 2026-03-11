import React, { useEffect } from 'react';
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
import { toast } from 'sonner';
import razorpayLogo from "../assets/razorpay.png";
import codLogo from "../assets/cod.png";
import { FaCreditCard } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { FaUser, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { AiFillEnvironment } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
const Cart = ({ location, getLocation, onLocationChange }) => {
  const { cartItem, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [address, setAddress] = React.useState({
    name: "",
    street: "",
    state: "",
    postcode: "",
    country: "",
  });
  useEffect(() => {
    if (location) {
      setAddress({
        name: user?.fullName || "",
        street:
          location.city ||
          location.town ||
          location.village ||
          location.county ||
          "",
        state: location.state || "",
        postcode: location.postcode || "",
        country: location.country || "",
      });
    }
  }, [location, user]);
  const [paymentType, setPaymentType] = React.useState(null);
  const BACKEND_URL = "https://eshop-backend-y0e7.onrender.com";
  // const calculatePrice = (price) => {

  //   let finalPrice;

  //   if (price <= 50) {
  //     finalPrice = price + 69;
  //   }
  //   else if (price <= 100) {
  //     finalPrice = price + 99;
  //   }
  //   else if (price <= 300) {
  //     finalPrice = price + 199;
  //   }
  //   else if (price <= 800) {
  //     finalPrice = price + 299;
  //   }
  //   else if (price <= 2000) {
  //     finalPrice = price + 499;
  //   }
  //   else {
  //     finalPrice = price + 599;
  //   }

  //   // Round to nearest 10
  //   return Math.round(finalPrice / 10) * 10;
  // };
  const totalPrice = cartItem.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  const totalAmount = (totalPrice + 5).toFixed(2);

  const completeOrder = async (phone, paymentMethod = "Razorpay") => {

    if (!user) {
      toast.error("Please login before placing an order");
      return;
    }

    const newOrder = {
      userId: user.id,   // unique user id from Clerk
      user: address.name || user.fullName || "Guest",

      phone: `+91 ${phone}`,

      deliveryAddress: {
        street: address.street,
        state: address.state,
        postcode: address.postcode,
        country: address.country
      },

      total: Number(totalAmount),

      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",

      status: "Processing",

      items: cartItem.map(item => ({
        title: item.title,
        price: Number(item.price),
        quantity: item.quantity
      }))
    };

    try {

      const res = await fetch(`${BACKEND_URL}/api/save-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newOrder)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order failed");
      }

    } catch (err) {
      console.error("Order save failed:", err);
      toast.error("Failed to place order");
      return;
    }

    if (paymentMethod === "Razorpay") {
      toast.success("Payment Successful 🎉");
    } else {
      toast.success("Order placed (Cash on Delivery)");
    }

   await clearCart();
navigate("/order-success");
  };

  const confirmRemoveItem = (id) => {
    toast("Remove item from cart?", {
      description: "This product will be removed permanently.",
      action: {
        label: "Remove",
        onClick: () => {
          removeFromCart(id);

          toast.success("Item removed from cart", {
            description: "The product has been successfully removed.",
          });
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };
  const handleDecrease = (id, quantity) => {
    if (quantity === 1) {
      toast("Remove item from cart?", {
        description: "Quantity will become 0.",
        action: {
          label: "Remove",
          onClick: () => {
            removeFromCart(id);

            toast.success("Item removed from cart", {
              description: "The product has been removed.",
            });
          },
        },
        cancel: {
          label: "Cancel",
        },
      });
    } else {
      decreaseQty(id);

      toast("Quantity decreased", {
        description: "Item quantity updated.",
      });
    }
  };
  /* ================================
       RAZORPAY PAYMENT
    ================================= */
  const handleRazorpayPayment = async () => {
    try {
      if (cartItem.length === 0) {
        toast.error("Cart is empty 🛒");
        return;
      }

      const phone = document.querySelector('input[name="phone"]')?.value;

      if (!/^\d{10}$/.test(phone)) {
        toast.warning("Enter valid 10-digit mobile number");
        return;
      }

      const orderRes = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error("Order creation failed ❌");
        return;
      }

      if (!window.Razorpay) {
        toast.error("Razorpay not loaded");
        return;
      }

      const razor = new window.Razorpay({
        key: "rzp_test_SMNdX5YBGk1ooX",
        amount: orderData.amount,
        currency: "INR",
        name: "EShop",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${BACKEND_URL}/api/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              completeOrder(phone, "Razorpay");// cart clears here
            } else {
              toast.error("Payment verification failed ❌");
            }

          } catch (err) {
            toast.error("Verification server error ❌");
          }
        },

        prefill: {
          name: user?.fullName || "Guest",
          contact: phone,
        },

        theme: {
          color: "#E63946",
        },
      });

      razor.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed ❌");
    }
  };
  const handleCOD = () => {
    if (cartItem.length === 0) {
      toast.error("Cart is empty 🛒");
      return;
    }

    const phone = document.querySelector('input[name="phone"]')?.value;

    if (!/^\d{10}$/.test(phone)) {
      toast.warning("Enter valid 10-digit mobile number");
      return;
    }

    toast("Confirm Cash on Delivery?", {
      action: {
        label: "Confirm",
        onClick: () => completeOrder(phone, "COD"),
      },
    });
  };
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
      doc.text(`₹${calculatePrice(item.price)}`, colX.price, tableY);
      doc.text(
        `₹${(calculatePrice(item.price) * item.quantity).toFixed(2)}`,
        colX.total,
        tableY
      );
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
    if (cartItem.length === 0) {
      toast.error("Your cart is empty 🛒", {
        description: "Add some products before checkout.",
      });
      return;
    }

    const phone = document.querySelector('input[name="phone"]')?.value;

    if (!/^\d{10}$/.test(phone)) {
      toast.warning("Invalid phone number", {
        description: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    toast("Confirm Payment", {
      description: "Have you completed the UPI payment?",
      action: {
        label: "Yes, Completed",
        onClick: () => completeOrder(phone),
      },
    });
  };




  return (
    <div className="min-h-screen px-4 py-10 flex justify-center items-start text-white">
      {cartItem.length > 0 ? (
        <div className="max-w-6xl w-full space-y-8">
          {/* Title */}
          <div
            data-aos="fade-down"
            className="flex flex-row items-center justify-between gap-4"
          >
            <h1 className="text-xl md:text-4xl font-extrabold text-center md:text-left drop-shadow-lg">
              🛒 My Cart <span className="text-red-400">({cartItem.length})</span>
            </h1>

            <button
              onClick={() => navigate('/order-history')}
              className="bg-gradient-to-r from-red-500 to-white/10 text-gray-300 px-5 py-2 rounded-lg font-semibold text-sm sm:text-base hover:scale-105 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FaHistory /> Orders
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-5">
            {cartItem.map((item, index) => (

              <div
key={item.productId}                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="bg-white/10 backdrop-blur-xl border border-white/20
  shadow-lg rounded-2xl p-4 sm:p-5
  flex flex-col sm:flex-row sm:items-center sm:justify-between
  gap-4 sm:gap-6
  transition-all duration-300
  hover:shadow-2xl hover:border-red-400/40
  active:scale-[0.99]"
              >

                {/* PRODUCT */}
                <div
                 onClick={() => navigate(`/products/${item.productId}`)}
                  className="flex items-center gap-4 w-full cursor-pointer group"
                >

                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl
      border border-white/20 object-cover
      group-hover:scale-105 group-active:scale-105
      transition-transform duration-300"
                  />

                  {/* PRODUCT INFO */}
                  <div className="flex flex-col flex-1">

                    <h2
                      className="text-sm sm:text-base font-semibold text-white/90
        line-clamp-2 group-hover:text-red-400 transition"
                    >
                      {item.title}
                    </h2>

                    <p className="text-red-400 font-bold text-lg mt-1">
                      ₹{item.price}
                    </p>

                  </div>

                </div>


                {/* CONTROLS */}
                <div className="flex items-center justify-between sm:justify-end gap-4">

                  {/* QUANTITY */}
                  <div
                    className="flex items-center gap-3
      bg-black/40 border border-white/10
      px-3 py-1 rounded-full
      text-white font-semibold"
                  >

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                       handleDecrease(item.productId, item.quantity);
                      }}
                      className="p-1 rounded-full
        hover:bg-red-500/20
        active:scale-90
        transition"
                    >
                      <AiOutlineMinus />
                    </button>

                    <span className="text-sm w-5 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseQty(item.productId);
                      }}
                      className="p-1 rounded-full
        hover:bg-green-500/20 active:bg-green-500/20 focus:bg-green-500/20
        active:scale-90
        transition"
                    >
                      <AiOutlinePlus />
                    </button>

                  </div>


                  {/* DELETE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item.productId);
                      setShowDeleteAlert(true);
                    }}
                    className="p-3 rounded-full
  bg-white/10 border border-white/10
  hover:bg-red-900/80 hover:border-red-900
  active:bg-red-500/80 active:border-red-900
  focus:bg-red-900/80 focus:border-red-900
  active:scale-95 
  transition-all duration-200 cursor-pointer"
                  >
                    <FaRegTrashAlt className="text-red-400 text-lg" />
                  </button>
                </div>

              </div>

            ))}
          </div>
          {showDeleteAlert && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">

              <div className="bg-black/70 border border-white/20 rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-2xl">

                <h2 className="text-lg font-semibold text-white mb-2">
                  Remove Item?
                </h2>

                <p className="text-gray-400 text-sm mb-5">
                  Are you sure you want to remove this product from your cart?
                </p>

                <div className="flex justify-center gap-4">

                  {/* Cancel */}
                  <button
                    onClick={() => {
                      setShowDeleteAlert(false);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 bg-gray-500/20 border border-gray-400/30 rounded-lg hover:bg-gray-500/30 transition"
                  >
                    Cancel
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      removeFromCart(selectedItem);
                      setShowDeleteAlert(false);
                      setSelectedItem(null);

                      toast.success("Item removed from cart");
                    }}
                    className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition cursor-pointer"
                  >
                    Remove
                  </button>

                </div>
              </div>
            </div>
          )}
          {/* Delivery & Bill Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Delivery Info */}
            <div
              data-aos="fade-right"
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-7"
            >

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20">
                  <AiFillEnvironment className="text-red-400 text-lg" />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    Delivery Information
                  </h2>
                  <p className="text-xs text-gray-400">
                    Enter your shipping details
                  </p>
                </div>
              </div>


              {/* Form */}
              <div className="space-y-5">

                {/* Name */}
                <div className="relative group">

                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition" />

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                    className="w-full pl-11 pr-3 py-3 rounded-xl
        bg-black/30 border border-white/10
        text-white placeholder-gray-400
        focus:outline-none
        focus:border-red-500
        focus:ring-2 focus:ring-red-500/20
        transition-all"
                  />

                </div>


                {/* Address */}
                <div className="relative group">

                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition" />

                  <input
                    type="text"
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="w-full pl-11 pr-3 py-3 rounded-xl
        bg-black/30 border border-white/10
        text-white placeholder-gray-400
        focus:outline-none
        focus:border-red-500
        focus:ring-2 focus:ring-red-500/20
        transition-all"
                  />

                </div>


                {/* State + Postcode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="relative group">

                    <MdLocationCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition" />

                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="w-full pl-11 pr-3 py-3 rounded-xl
          bg-black/30 border border-white/10
          text-white placeholder-gray-400
          focus:outline-none
          focus:border-red-500
          focus:ring-2 focus:ring-red-500/20
          transition-all"
                    />

                  </div>


                  <input
                    type="text"
                    placeholder="Post Code"
                    value={address.postcode}
                    onChange={(e) =>
                      setAddress({ ...address, postcode: e.target.value })
                    }
                    className="w-full px-3 py-3 rounded-xl
        bg-black/30 border border-white/10
        text-white placeholder-gray-400
        focus:outline-none
        focus:border-red-500
        focus:ring-2 focus:ring-red-500/20
        transition-all"
                  />

                </div>


                {/* Country + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                    className="w-full px-3 py-3 rounded-xl
        bg-black/30 border border-white/10
        text-white placeholder-gray-400
        focus:outline-none
        focus:border-red-500
        focus:ring-2 focus:ring-red-500/20
        transition-all"
                  />

                  {/* Phone */}
                  <div className="flex items-center rounded-xl bg-black/30 border border-white/10 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition">

                    <span className="px-3 text-gray-400 text-sm">
                      +91
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Phone Number"
                      maxLength="10"
                      inputMode="numeric"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                      }}
                      className="flex-1 bg-transparent py-3 px-2 text-white placeholder-gray-400 focus:outline-none"
                    />

                  </div>

                </div>

              </div>


  <div className="flex flex-col sm:flex-row gap-4 pt-3">

  {/* Save Address */}
  <button
    className="w-full group relative overflow-hidden
    bg-gradient-to-br from-red-900/40 to-black/10
    backdrop-blur-xl
    border border-red-900/40
    rounded-2xl px-5 py-3

    flex items-center justify-center gap-2
    text-white/90 font-medium

    shadow-lg shadow-black/40

    hover:border-red-500
    hover:shadow-red-600/30
    hover:-translate-y-[2px]

    active:scale-[0.96]
    active:bg-red-500/10

    transition-all duration-300 cursor-pointer
    "
  >
    <FaSave className="text-sm opacity-90 group-hover:text-red-400 transition-colors" />
    Save Address

    {/* hover glow */}
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"></span>
  </button>


  {/* Detect Location */}
  <button
    onClick={() => {
      if (!navigator.geolocation) {
        toast.error("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition((pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        toast.success("Location updated");
      });
    }}
    className="
    w-full group relative overflow-hidden
    bg-gradient-to-br from-red-900/40 to-black/10
    backdrop-blur-xl
    border border-red-900/40
    rounded-2xl px-5 py-3

    flex items-center justify-center gap-2
    text-white/90 font-medium

    shadow-lg shadow-black/40

    hover:border-red-500
    hover:shadow-red-600/30
    hover:-translate-y-[2px]

    active:scale-[0.96]
    active:bg-red-500/10

    transition-all duration-300 cursor-pointer
    "
  >
    <MdMyLocation className="text-lg opacity-90 group-hover:text-red-400 transition-colors" />
    Detect Location

    {/* glow effect */}
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"></span>
  </button>

</div>

            </div>

            {/* Bill Details */}
            <div
              data-aos="fade-left"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl text-white/90 space-y-3"
            >
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
                <div className="mt-6 text-center space-y-2 inline border-t border-white/30 pt-4">
                  {/* <h2 className="font-semibold text-base flex items-center justify-center gap-2"><FaQrcode /> Pay via UPI</h2>
                  <p className="text-xs text-gray-300">Scan the QR below or tap to pay with your UPI app.</p>
                  <div className="text-center">
                    <a href={upiPaymentLink} target="_blank" rel="noreferrer">
                      <img src={upiQrCodeUrl} alt="UPI QR Code" className="w-40 h-40 mx-auto rounded-lg border border-white/20 shadow-md hover:scale-105 transition-transform" />
                    </a>
                    <a href={upiPaymentLink} target="_blank" rel="noreferrer" className="inline-block mt-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300">Buy Now</a>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">UPI ID: <span className="font-medium">{UPI_ID}</span></p> */}
                  <div
                    data-aos="zoom-in"
                    className="w-full space-y-6"
                  >
                    {/* Section Title */}
                    <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 tracking-wide">
                      <MdPayments className="text-xl text-white/80" />
                      Choose Payment Method
                    </h3>

                    {/* Razorpay Payment */}
                    <button
                      onClick={() => {
                        setPaymentType("razorpay");
                        onOpen();
                      }}
                      className="w-full group relative overflow-hidden
  bg-gradient-to-r from-black/10 to-black/5
  backdrop-blur-xl
  border border-white/20
  rounded-2xl p-3
  flex items-center justify-between
  transition-all duration-300
  hover:border-green-400 hover:shadow-xl hover:shadow-green-500/20
  active:border-green-400 active:bg-green-500/10 active:scale-[0.98]
  focus:border-green-400 focus:bg-green-500/10"
                    >
                      <div className="flex items-center gap-4">

                        {/* Icon */}
                        <div className="w-14 h-14 flex items-center justify-center
      rounded-xl bg-black/50 border border-white/10
      group-hover:scale-105 transition">

                          <FaCreditCard className="text-green-400 text-2xl" />

                        </div>

                        {/* Info */}
                        <div className="flex flex-col text-left space-y-1">

                          <span className="text-white font-semibold">
                            Pay Online
                          </span>

                          {/* <span className="text-gray-400 text-xs">
          UPI • Debit Card • Credit Card • Netbanking
        </span> */}

                          <div className="flex gap-2 mt-1">

                            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md
          bg-green-500/20 text-green-400">
                              <FaCheckCircle /> Secure
                            </span>

                            <span className="text-xs px-2 py-1 rounded-md
          bg-blue-500/20 text-blue-400">
                              Instant
                            </span>

                          </div>

                        </div>

                      </div>

                      <IoArrowForward
                        className="text-gray-400 text-xl
  group-hover:text-green-400
  group-active:text-green-400
  group-hover:translate-x-1
  group-active:translate-x-1
  transition"
                      />

                    </button>



                    {/* Cash On Delivery */}
                    <button
                      onClick={() => {
                        setPaymentType("cod");
                        onOpen();
                      }}
                      className="w-full group relative overflow-hidden
  bg-gradient-to-r from-black/30 to-black/5
  backdrop-blur-xl
  border border-white/20
  rounded-2xl p-3
  flex items-center justify-between
  transition-all duration-300
  hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-500/20
  active:border-yellow-400 active:bg-yellow-500/10 active:scale-[0.98]
  focus:border-yellow-400 focus:bg-yellow-500/10"
                    >

                      <div className="flex items-center gap-4">

                        {/* Icon */}
                        <div className="w-14 h-14 flex items-center justify-center
      rounded-xl bg-black/30 border border-white/10
      group-hover:scale-105 transition">

                          <FaWallet className="text-yellow-400 text-2xl" />

                        </div>

                        <div className="flex flex-col text-left space-y-1">

                          <span className="text-white font-semibold">
                            Cash on Delivery
                          </span>

                          {/* <span className="text-gray-400 text-sm">
          Pay when the order arrives
        </span> */}

                          <span className="text-xs px-2 py-1 rounded-md w-fit
        bg-yellow-500/20 text-yellow-400">
                            Offline Payment
                          </span>

                        </div>

                      </div>

                      <IoArrowForward className="text-gray-400 text-xl
  group-hover:text-yellow-400
  group-active:text-yellow-400
  group-hover:translate-x-1
  group-active:translate-x-1
  transition" />

                    </button>


                    {/* Security Badge */}
                    <div className="flex justify-center items-center gap-2 text-xs text-gray-400 mt-2">
                      🔒 Secure Payments powered by Razorpay
                    </div>

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
      <Modal
        isOpen={isOpen}
        placement="center"
        backdrop="blur"
        onClose={onClose}
        hideCloseButton
        className="z-[9999]" scrollBehavior={scrollBehavior}
      >
        <ModalContent className="bg-black/50 mx-auto backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white  w-[95%] 
      sm:w-[90%] 
      md:w-[80%] 
      lg:w-[60%] 
      xl:w-[50%]
      max-h-[90vh]">

          {(onClose) => (
            <>
              {/* HEADER */}
              <ModalHeader className="flex items-center gap-2 text-red-300 text-lg font-semibold border-b border-white/20">

                <MdPayments className="text-xl text-white" />
                Payment Instructions

              </ModalHeader>

              {/* BODY */}
              <ModalBody data-aos="zoom-in-up" className="space-y-5">
                {/* RAZORPAY */}
                {paymentType === "razorpay" && (
                  <div className="space-y-4">

                    {/* Title */}
                    <div className="flex items-center gap-3">

                      <img
                        src={razorpayLogo}
                        className="w-10 h-10 rounded-lg bg-white p-1"
                      />

                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <FaCreditCard className="text-green-400" />
                          Razorpay Secure Payment
                        </p>

                        <p className="text-xs text-gray-400">
                          UPI • Cards • Netbanking • Wallets
                        </p>
                      </div>

                    </div>

                    {/* Steps */}
                    <div className="bg-black/30 border border-white/10 rounded-xl p-4">

                      <ul className="space-y-2 text-sm text-gray-300">

                        <li className="flex gap-2">
                          <FaCheckCircle className="text-green-400 mt-[3px]" />
                          Select UPI / Card / Netbanking
                        </li>

                        <li className="flex gap-2">
                          <FaCheckCircle className="text-green-400 mt-[3px]" />
                          Complete payment in Razorpay popup
                        </li>

                        <li className="flex gap-2">
                          <FaCheckCircle className="text-green-400 mt-[3px]" />
                          Do not close the payment window
                        </li>

                        <li className="flex gap-2">
                          <FaCheckCircle className="text-green-400 mt-[3px]" />
                          You will be redirected after payment
                        </li>

                      </ul>

                    </div>

                    {/* Security */}
                    <div className="text-xs bg-green-500/20 border border-green-400/30 text-green-300 p-3 rounded-lg">
                      🔒 Secure payment powered by Razorpay
                    </div>

                  </div>
                )}

                {/* COD */}
                {paymentType === "cod" && (
                  <div className="space-y-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={codLogo}
                        className="w-10 h-10 rounded-lg bg-white p-1"
                      />

                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <FaWallet className="text-yellow-400" />
                          Cash On Delivery
                        </p>

                        <p className="text-xs text-gray-400">
                          Pay when your order arrives
                        </p>
                      </div>

                    </div>

                    <div className="bg-black/30 border border-white/10 rounded-xl p-4">

                      <ul className="space-y-2 text-sm text-gray-300">

                        <li className="flex gap-2">
                          <FaCheckCircle className="text-yellow-400 mt-[3px]" />
                          Pay when the order arrives
                        </li>

                        <li className="flex gap-2">
                          <FaCheckCircle className="text-yellow-400 mt-[3px]" />
                          Delivery time: 3-5 days
                        </li>

                        <li className="flex gap-2">
                          <FaCheckCircle className="text-yellow-400 mt-[3px]" />
                          Keep exact change ready
                        </li>

                      </ul>

                    </div>

                    <div className="text-xs bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 px-1 rounded-lg">
                      💡 COD orders may be confirmed by phone
                    </div>

                  </div>
                )}

              </ModalBody>

              {/* FOOTER */}
              <ModalFooter className="border-t border-white/20">

                <Button
                  variant="light"
                  onPress={onClose}
                  className="text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>

                <Button
                  className="bg-gradient-to-r from-red-500 to-black/10 rounded-xl border border-white/20 text-white font-semibold px-6 hover:scale-105 transition"
                  onPress={() => {
                    onClose();

                    if (paymentType === "razorpay") {
                      handleRazorpayPayment();
                    }

                    if (paymentType === "cod") {
                      handleCOD();
                    }
                  }}
                >
                  Continue →
                </Button>

              </ModalFooter>
            </>
          )}

        </ModalContent>
      </Modal>
    </div>
  );
};

export default Cart;