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
const {
  isOpen: isDeleteOpen,
  onOpen: onDeleteOpen,
  onClose: onDeleteClose,
} = useDisclosure();
const {
  isOpen: isCodConfirmOpen,
  onOpen: onCodConfirmOpen,
  onClose: onCodConfirmClose,
} = useDisclosure();
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
  const totalAmount = totalPrice ;

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
      console.log(orderData);
      if (!orderRes.ok) {
        toast.error("Order creation failed ❌");
        return;
      }

      if (!window.Razorpay) {
        toast.error("Razorpay not loaded");
        return;
      }

      const razor = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY,
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
          color: "#6366F1"
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

  onCodConfirmOpen();
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
            <h1 className="text-xl md:text-4xl font-extrabold text-center text-indigo-500 md:text-left drop-shadow-lg">
              🛒 My Cart <span className="text-indigo-500">({cartItem.length})</span>
            </h1>

           <button
  onClick={() => navigate('/order-history')}
  className="group relative flex items-center gap-2
  px-5 py-2.5 rounded-full font-medium text-sm sm:text-base

  bg-white/70 backdrop-blur-md
  border border-gray-200

  text-gray-700

  shadow-sm hover:shadow-md

  hover:border-indigo-400 hover:text-indigo-600
  hover:bg-white

  hover:scale-[1.03] active:scale-[0.96]

  transition-all duration-300 cursor-pointer"
>
  <FaHistory className="transition-transform duration-300 group-hover:rotate-6" />

  <span className="tracking-wide">Orders</span>
</button>
          </div>

          {/* Cart Items */}
          <div className="space-y-5">
            {cartItem.map((item, index) => (

  <div
  key={item.productId}
  data-aos="fade-up"
  data-aos-delay={index * 80}
  className="group bg-white/60 border border-gray-200
  shadow-sm rounded-xl p-4 sm:p-5

  flex flex-col sm:flex-row sm:items-center sm:justify-between
  gap-4 sm:gap-6

  hover:shadow-md hover:border-indigo-300
  active:scale-[0.99]

  transition-all duration-300"
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
      border border-indigo-300 object-cover
      group-hover:scale-105 group-active:scale-105
      transition-transform duration-300"
                  />

                  {/* PRODUCT INFO */}
             <div className="flex flex-col flex-1">

  <h2
    className="text-sm sm:text-base font-medium text-gray-800
    line-clamp-2 leading-snug
    group-hover:text-indigo-600
    transition-colors duration-300"
  >
    {item.title}
  </h2>

  <p className="text-indigo-600 font-semibold text-lg mt-1">
    ₹{item.price}
  </p>

</div>

                </div>


                {/* CONTROLS */}
                <div className="flex items-center justify-between sm:justify-end gap-4">

                  {/* QUANTITY */}
                 <div
  className="flex items-center gap-3
  border border-gray-300 bg-white
  px-3 py-1.5 rounded-lg
  shadow-sm"
>

  {/* MINUS */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDecrease(item.productId, item.quantity);
    }}
    className="w-7 h-7 flex items-center justify-center
    rounded-md text-gray-600
    hover:bg-gray-100 hover:text-indigo-600
    active:scale-90 transition"
  >
    <AiOutlineMinus />
  </button>

  {/* QTY */}
  <span className="text-sm font-medium text-gray-800 w-5 text-center">
    {item.quantity}
  </span>

  {/* PLUS */}
  <button
    onClick={(e) => {
    e.stopPropagation();

    increaseQty(item.productId);

    toast("Quantity increased", {
      description: "Item quantity updated.",
    });
  }}
    className="w-7 h-7 flex items-center justify-center
    rounded-md text-gray-600
    hover:bg-gray-100 hover:text-indigo-600
    active:scale-90 transition"
  >
    <AiOutlinePlus />
  </button>

</div>


                  {/* DELETE */}
               <button
  onClick={(e) => {
    e.stopPropagation();
    setSelectedItem(item.productId);
    onDeleteOpen();
  }}
  className="group relative w-10 h-10 flex items-center justify-center
  rounded-lg border border-gray-200 bg-white

  text-gray-500

  hover:border-red-400 hover:text-red-500 hover:bg-red-50
  active:scale-90

  shadow-sm hover:shadow-md

  transition-all duration-300 cursor-pointer"
>
  <FaRegTrashAlt className="text-base transition-transform duration-300 group-hover:scale-110" />
</button>
                </div>

              </div>

            ))}
          </div>
  <Modal
  isOpen={isDeleteOpen}
  onClose={onDeleteClose}
  placement="center"
  backdrop="blur"
  hideCloseButton
>
  <ModalContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">

    {(onClose) => (
      <>
        {/* HEADER */}
        <ModalHeader className="text-gray-800 font-semibold text-lg">
          Remove Item
        </ModalHeader>

        {/* BODY */}
        <ModalBody className="text-gray-600 text-sm leading-relaxed">
          Are you sure you want to remove this item from your cart?  
          This action cannot be undone.
        </ModalBody>

        {/* FOOTER */}
        <ModalFooter className="flex justify-end gap-3">

          {/* CANCEL */}
          <Button
            variant="light"
            onPress={onDeleteClose}
            className="px-4 py-2 rounded-lg text-gray-600
            hover:text-gray-900 hover:bg-gray-100 transition"
          >
            Cancel
          </Button>

          {/* REMOVE */}
          <Button
            onPress={() => {
              removeFromCart(selectedItem);
              toast.success("Item removed");
              onDeleteClose();
            }}
            className="px-5 py-2 rounded-lg font-medium text-white

            bg-red-500 hover:bg-red-600

            shadow-sm hover:shadow-md
            active:scale-95

            transition-all duration-200"
          >
            Remove
          </Button>

        </ModalFooter>
      </>
    )}

  </ModalContent>
</Modal>
<Modal
  isOpen={isCodConfirmOpen}
  onClose={onCodConfirmClose}
  placement="center"
  backdrop="blur"
  hideCloseButton
>
  <ModalContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">

    {(onClose) => (
      <>
        {/* HEADER */}
        <ModalHeader className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
          <FaWallet className="text-indigo-500" />
          Confirm Order
        </ModalHeader>

        {/* BODY */}
        <ModalBody className="text-gray-600 text-sm leading-relaxed space-y-2">
          <p>
            You selected <span className="font-semibold text-gray-800">Cash on Delivery</span>.
          </p>

          <p className="text-xs text-gray-500">
            Please keep cash ready at the time of delivery.
          </p>
        </ModalBody>

        {/* FOOTER */}
        <ModalFooter className="flex justify-end gap-3">

          {/* CANCEL */}
          <Button
            variant="light"
            onPress={onCodConfirmClose}
            className="px-4 py-2 rounded-lg text-gray-600
            hover:text-gray-900 hover:bg-gray-100 transition"
          >
            Cancel
          </Button>

          {/* CONFIRM */}
          <Button
            onPress={() => {
              const phone = document.querySelector('input[name="phone"]')?.value;
              completeOrder(phone, "COD");
              onCodConfirmClose();
            }}
            className="px-5 py-2 rounded-lg font-medium text-white

            bg-indigo-600 hover:bg-indigo-700

            shadow-sm hover:shadow-md
            active:scale-95

            transition-all duration-200"
          >
            Confirm Order
          </Button>

        </ModalFooter>
      </>
    )}

  </ModalContent>
</Modal>
          {/* Delivery & Bill Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Delivery Info */}
            <div
              data-aos="fade-right"
              className="bg-white/50 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-gray-800 space-y-7"
            >

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-12 h-13 flex items-center justify-center rounded-lg bg-indigo-100">
  <AiFillEnvironment className="text-indigo-600 text-lg" size={30}/>
</div>

               <div>
  <h2 className="text-lg sm:text-xl font-semibold text-indigo-800 tracking-tight">
    Delivery Information
  </h2>

  <p className="text-sm text-gray-500 mt-1">
    Enter your shipping details
  </p>
</div>
              </div>


              {/* Form */}
       <div className="space-y-3">

  {/* NAME */}
  <div className="relative">
    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

    <input
      type="text"
      placeholder="Full Name"
      value={address.name}
      onChange={(e) =>
        setAddress({ ...address, name: e.target.value })
      }
      className="w-full pl-10 pr-3 py-3 rounded-lg
      border border-gray-300 bg-white

      text-gray-800 placeholder-gray-400

      focus:outline-none
      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500

      transition"
    />
  </div>

  {/* ADDRESS */}
  <div className="relative">
    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

    <input
      type="text"
      placeholder="Street Address"
      value={address.street}
      onChange={(e) =>
        setAddress({ ...address, street: e.target.value })
      }
      className="w-full pl-10 pr-3 py-3 rounded-lg
      border border-gray-300 bg-white

      focus:outline-none
      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    />
  </div>

  {/* STATE + POSTCODE */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

    <div className="relative">
      <MdLocationCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        placeholder="State"
        value={address.state}
        onChange={(e) =>
          setAddress({ ...address, state: e.target.value })
        }
        className="w-full pl-10 pr-3 py-3 rounded-lg
        border border-gray-300 bg-white

        focus:outline-none
        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </div>

    <input
      type="text"
      placeholder="Post Code"
      value={address.postcode}
      onChange={(e) =>
        setAddress({ ...address, postcode: e.target.value })
      }
      className="w-full px-3 py-3 rounded-lg
      border border-gray-300 bg-white

      focus:outline-none
      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    />
  </div>

  {/* COUNTRY + PHONE */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

    <input
      type="text"
      placeholder="Country"
      value={address.country}
      onChange={(e) =>
        setAddress({ ...address, country: e.target.value })
      }
      className="w-full px-3 py-3 rounded-lg
      border border-gray-300 bg-white

      focus:outline-none
      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    />

    {/* PHONE */}
    <div className="flex items-center rounded-lg
    border border-gray-300 bg-white
    focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">

      <span className="px-3 text-gray-500 text-sm">
        +91
      </span>

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        maxLength="10"
        inputMode="numeric"
        onInput={(e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
        }}
        className="flex-1 py-3 px-2 bg-transparent
        text-gray-800 placeholder-gray-400
        focus:outline-none"
      />
    </div>

  </div>

</div>


 <div className="flex flex-col sm:flex-row gap-4 pt-4">

  {/* PRIMARY — Save Address */}
  <button
    className="w-full group relative flex items-center justify-center gap-2

    px-6 py-3 rounded-xl font-semibold text-white

    bg-gradient-to-r from-indigo-500 to-indigo-600

    shadow-md shadow-indigo-500/20
    hover:shadow-lg hover:shadow-indigo-500/30

    hover:-translate-y-[1px]
    active:scale-[0.97]

    transition-all duration-300 overflow-hidden"
  >

    {/* Glow */}
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100
    bg-gradient-to-r from-transparent via-white/20 to-transparent
    transition duration-500"></span>

    <FaSave className="text-sm transition-transform group-hover:-translate-y-[1px]" />

    <span>Save Address</span>
  </button>


  {/* SECONDARY — Detect Location */}
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
    className="w-full group flex items-center justify-center gap-2

    px-6 py-3 rounded-xl font-medium

    border border-gray-300 bg-white text-gray-700

    hover:border-indigo-400 hover:text-indigo-600
    hover:bg-indigo-50

    shadow-sm hover:shadow-md

    hover:-translate-y-[1px]
    active:scale-[0.97]

    transition-all duration-300"
  >

    <MdMyLocation className="text-lg transition-transform group-hover:rotate-6" />

    <span>Detect Location</span>
  </button>

</div>

            </div>

            {/* Bill Details */}
           <div
  data-aos="fade-left"
  className="bg-white/60 border border-gray-200 rounded-xl p-6 sm:p-8
  shadow-sm space-y-5"
>

  {/* TITLE */}
  <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
    Bill Summary
  </h1>

  {/* PRICE DETAILS */}
  <div className="space-y-3 text-sm sm:text-base text-gray-600">

    <div className="flex justify-between">
      <span className="flex items-center gap-2">
        <LuNotebookText /> Items Total
      </span>
      <span>₹{totalPrice}</span>
    </div>

    <div className="flex justify-between">
      <span className="flex items-center gap-2">
        <MdDeliveryDining /> Delivery
      </span>
      <span className="text-green-600 font-medium">
        <span className="line-through text-gray-400 mr-1">₹25</span>
        FREE
      </span>
    </div>

    <div className="flex justify-between">
      <span className="flex items-center gap-2">
        <GiShoppingBag /> Handling
      </span>
      <span>₹5</span>
    </div>

    <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-800">
      <span className="flex items-center gap-2">
        <FaWallet /> Total
      </span>
      <span className="text-indigo-600">
        ₹{totalPrice + 5}
      </span>
    </div>

  </div>

  {/* PAYMENT */}
  {cartItem.length > 0 && (
    <div className="pt-5 border-t space-y-4">

      {/* TITLE */}
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <MdPayments className="text-lg" />
        Choose Payment Method
      </h3>

      {/* ONLINE PAYMENT */}
      <button
        onClick={() => {
          setPaymentType("razorpay");
          onOpen();
        }}
        className="w-full flex items-center justify-between gap-4
        px-4 py-3 rounded-lg border border-gray-200 bg-white

        hover:border-indigo-400 hover:bg-indigo-50
        hover:shadow-sm

        transition-all duration-300"
      >

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 flex items-center justify-center
          rounded-lg bg-indigo-100">
            <FaCreditCard className="text-indigo-600" />
          </div>

          <div className="text-left">
            <p className="text-gray-800 font-medium">
              Pay Online
            </p>

            <div className="flex gap-2 mt-1 text-xs">
              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded">
                Secure
              </span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                Instant
              </span>
            </div>
          </div>

        </div>

        <IoArrowForward className="text-gray-400" />
      </button>


      {/* COD */}
      <button
        onClick={() => {
          setPaymentType("cod");
          onOpen();
        }}
        className="w-full flex items-center justify-between gap-4
        px-4 py-3 rounded-lg border border-gray-200 bg-white

        hover:border-indigo-400 hover:bg-indigo-50
        hover:shadow-sm

        transition-all duration-300"
      >

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 flex items-center justify-center
          rounded-lg bg-yellow-100">
            <FaWallet className="text-yellow-600" />
          </div>

          <div className="text-left">
            <p className="text-gray-800 font-medium">
              Cash on Delivery
            </p>

            <span className="text-xs text-yellow-600">
              Pay when it arrives
            </span>
          </div>

        </div>

        <IoArrowForward className="text-gray-400" />
      </button>

      {/* SECURITY */}
      <div className="text-xs text-center text-gray-400">
        🔒 Secure payments powered by Razorpay
      </div>

    </div>
  )}
</div>
          </div>
        </div>
      ) : (
  <div className="flex flex-col items-center justify-center min-h-[80vh]  text-center">

  {/* IMAGE */}
  <img
    src={emptyCart}
    alt="Empty Cart"
    className="w-52 sm:w-64 md:w-72 mb-3 opacity-90"
  />

  {/* TITLE */}
  <h1 className="text-3xl sm:text-4xl font-bold text-indigo-500 tracking-tight">
    Your cart feels lonely 🛒
  </h1>

  {/* SUBTEXT */}
  <p className="text-gray-600 mt-3 max-w-md text-sm sm:text-base leading-relaxed">
    Looks like you haven’t added anything yet.  
    Explore products and find something you love.
  </p>

  {/* ACTION BUTTONS */}
 <div className="flex flex-col sm:flex-row gap-4 mt-3">

  {/* PRIMARY CTA */}
  <button
    onClick={() => navigate('/products')}
    className="group relative flex items-center justify-center gap-2
    px-7 py-3 rounded-full font-semibold text-white

    bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600

    shadow-lg shadow-indigo-500/20
    hover:shadow-indigo-500/40

    hover:scale-[1.04] active:scale-[0.97]

    transition-all duration-300 overflow-hidden cursor-pointer"
  >

    {/* Glow Effect */}
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 
    bg-gradient-to-r from-transparent via-white/20 to-transparent
    transition duration-500"></span>

    <GiShoppingBag className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5" />

    <span className="tracking-wide">Start Shopping</span>

  </button>


  {/* SECONDARY CTA */}
  <button
    onClick={() => navigate('/order-history')}
    className="group relative flex items-center justify-center gap-2
    px-7 py-3 rounded-full font-medium

    border border-gray-300
    text-gray-700 bg-white/60 backdrop-blur-sm

    hover:border-indigo-400 hover:text-indigo-600
    hover:bg-white

    hover:scale-[1.04] active:scale-[0.97]

    shadow-sm hover:shadow-md

    transition-all duration-300 cursor-pointer"
  >

    <FaHistory className="text-base transition-transform duration-300 group-hover:rotate-6" />

    <span className="tracking-wide">View Orders</span>

  </button>

</div>

  {/* OPTIONAL MICRO TEXT */}
  <p className="text-xs text-gray-600 mt-3">
    Free delivery on all orders 🚚
  </p>

</div>
      )}
    <Modal
  isOpen={isOpen}
  placement="center"
  backdrop="blur"
  onClose={onClose}
  hideCloseButton
  className="z-[9999]"
  scrollBehavior={scrollBehavior}
>
  <ModalContent
    className="bg-white mx-auto border border-gray-200
    rounded-xl shadow-xl text-gray-800

    w-[95%] sm:w-[90%] md:w-[75%] lg:w-[55%] xl:w-[45%]
    max-h-[90vh]"
  >
    {(onClose) => (
      <>
        {/* HEADER */}
        <ModalHeader className="flex items-center gap-2 text-lg font-semibold border-b border-gray-200">

          <MdPayments className="text-indigo-600 text-xl" />
          Payment Instructions

        </ModalHeader>

        {/* BODY */}
        <ModalBody className="space-y-5">

          {/* RAZORPAY */}
          {paymentType === "razorpay" && (
            <div className="space-y-4">

              {/* TITLE */}
              <div className="flex items-center gap-3">

                <img
                  src={razorpayLogo}
                  className="w-10 h-10 rounded-lg border"
                />

                <div>
                  <p className="font-semibold flex items-center gap-2 text-gray-800">
                    <FaCreditCard className="text-indigo-600" />
                    Razorpay Payment
                  </p>

                  <p className="text-xs text-gray-500">
                    UPI • Cards • Netbanking • Wallets
                  </p>
                </div>

              </div>

              {/* STEPS */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

                <ul className="space-y-2 text-sm text-gray-600">

                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-500 mt-[3px]" />
                    Select UPI / Card / Netbanking
                  </li>

                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-500 mt-[3px]" />
                    Complete payment in Razorpay popup
                  </li>

                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-500 mt-[3px]" />
                    Do not close the payment window
                  </li>

                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-500 mt-[3px]" />
                    You will be redirected after payment
                  </li>

                </ul>

              </div>

              {/* SECURITY */}
              <div className="text-xs bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg">
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
                  className="w-10 h-10 rounded-lg border"
                />

                <div>
                  <p className="font-semibold flex items-center gap-2 text-gray-800">
                    <FaWallet className="text-yellow-600" />
                    Cash On Delivery
                  </p>

                  <p className="text-xs text-gray-500">
                    Pay when your order arrives
                  </p>
                </div>

              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

                <ul className="space-y-2 text-sm text-gray-600">

                  <li className="flex gap-2">
                    <FaCheckCircle className="text-yellow-500 mt-[3px]" />
                    Pay when the order arrives
                  </li>

                  <li className="flex gap-2">
                    <FaCheckCircle className="text-yellow-500 mt-[3px]" />
                    Delivery time: 3–5 days
                  </li>

                  <li className="flex gap-2">
                    <FaCheckCircle className="text-yellow-500 mt-[3px]" />
                    Keep exact change ready
                  </li>

                </ul>

              </div>

              <div className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-600 px-3 py-2 rounded-lg">
                💡 COD orders may be confirmed by phone
              </div>

            </div>
          )}

        </ModalBody>

        {/* FOOTER */}
        <ModalFooter className="border-t border-gray-200">

          <Button
            variant="light"
            onPress={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white
            font-semibold px-6 rounded-lg

            hover:scale-[1.03] active:scale-[0.97]
            transition-all"
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