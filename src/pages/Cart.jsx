import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  FaRegTrashAlt,
  FaCheckCircle,
  FaHistory,
  FaWallet,
  FaCreditCard,
  FaUser,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaEnvelope,
  FaShieldAlt,
  FaShoppingBag
} from 'react-icons/fa';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining, MdPayments, MdLocationCity, MdMyLocation } from 'react-icons/md';
import { GiShoppingBag } from 'react-icons/gi';
import { AiOutlinePlus, AiOutlineMinus, AiFillEnvironment } from 'react-icons/ai';
import { IoArrowForward, IoArrowBack } from 'react-icons/io5';
import { BsTelephoneFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import emptyCart from '../assets/empty-cart.png';
import { toast } from 'sonner';
import razorpayLogo from '../assets/razorpay.png';
import successmusic from "../assets/successmusic.mp3";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure,
} from '@heroui/react';

const STEPS = [
  {
    id: 1,
    label: 'Cart',
    icon: <GiShoppingBag size={16} />,
  },
  {
    id: 2,
    label: 'Delivery',
    icon: <AiFillEnvironment size={16} />,
  },
  {
    id: 3,
    label: 'Payment',
    icon: <MdPayments size={16} />,
  },
];

const Cart = ({ location, getLocation, onLocationChange }) => {
  const { cartItem, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isInstrOpen, onOpen: onInstrOpen, onClose: onInstrClose } = useDisclosure();
  const { isOpen: isCodConfirmOpen, onOpen: onCodConfirmOpen, onClose: onCodConfirmClose } = useDisclosure();

/* =====================================
   AUTH USER
===================================== */

const [

  user,

  setUser,

] = useState(null);

/* =====================================
   TOKEN
===================================== */

const [token, setToken] = useState(
  localStorage.getItem("token")
);

useEffect(() => {

  const syncToken = () => {

    setToken(
      localStorage.getItem("token")
    );

  };

  window.addEventListener(
    "storage",
    syncToken
  );

  syncToken();

  return () => {

    window.removeEventListener(
      "storage",
      syncToken
    );

  };

}, []);
/* =====================================
   LOAD USER
===================================== */

useEffect(() => {

  if (!token)
    return;

  const fetchUser =
    async () => {

      try {

        const res =
          await fetch(

            "https://eshop-backend-y0e7.onrender.com/api/auth/me",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );
if (res.status === 401) {

  localStorage.removeItem("token");

  setUser(null);

  toast.error("Session expired");

  navigate("/sign-in");

  return;

}
        const data =
          await res.json();

        if (data.success) {

          setUser(
            data.user
          );

        }

      } catch (error) {

        console.error(
          error
        );

      }

    };

  fetchUser();

}, []);


  const [address, setAddress] = useState({
    name: '', email: '', phone: '', street: '', state: '', postcode: '', country: '',
  });
const [couponCode, setCouponCode] = useState("");

const [couponDiscount, setCouponDiscount] = useState(0);

const [finalTotal, setFinalTotal] = useState(0);
const [couponError, setCouponError] = useState("");

const [couponSuccess, setCouponSuccess] = useState("");
const [couponLoading, setCouponLoading] = useState(false);
  useEffect(() => {
    if (location) {
      setAddress(prev => ({
        ...prev,
      
name:
`${user?.firstName || ""} ${user?.lastName || ""}`,
email:
user?.email || '',
        street: location.city || location.town || location.village || location.county || '',
        state: location.state || '',
        postcode: location.postcode || '',
        country: location.country || '',
      }));
    }
  }, [location, user]);

  const totalPrice = cartItem.reduce((t, i) => t + Number(i.price) * i.quantity, 0);
  const totalAmount = totalPrice + 5;
  useEffect(() => {
  setFinalTotal(totalAmount);
}, [totalAmount]);
  const BACKEND_URL = 'https://eshop-backend-y0e7.onrender.com';
const applyCoupon = async () => {

  if (!couponCode.trim()) {

    setCouponError("Please enter a coupon code.");
    setCouponSuccess("");
    return;

  }

  try {

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");

    const res = await fetch(
      "https://eshop-backend-y0e7.onrender.com/api/coupons/apply",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          total: totalPrice,
        }),
      }
    );

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("RESPONSE:", data);

    if (!res.ok) {

  setCouponDiscount(0);
  setCouponSuccess("");
  setCouponError(data.message);

  // Show toast
  toast.error(data.message || "Failed to apply coupon");

  return;
}
    setCouponDiscount(data.discount);
    setFinalTotal(data.finalTotal + 5);

    setCouponError("");
    setCouponSuccess(data.message || "Coupon Applied Successfully");

  } catch (err) {

    console.error(err);

    setCouponDiscount(0);

    setCouponError(
      err.message || "Something went wrong."
    );

  } finally {

    setCouponLoading(false);

  }

};
  /* ── completeOrder — email required, phone optional ── */


const completeOrder = async (
  method = "Razorpay",
  paymentData = {}
) => {
    // validation
  
    if (!token || !user){
      toast.error('Please login before placing an order');
      return;
    }

    if (!address.email?.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

console.log("====================================");
console.log("COMPLETE ORDER STARTED");
console.log("USER:", user);
console.log("TOKEN:", token);
console.log("CART ITEMS:", cartItem);
console.log("====================================");

cartItem.forEach((item, index) => {

  console.log(`ITEM ${index + 1}`);

  console.log("FULL ITEM:", item);

  console.log("PRODUCT ID:", item.productId);

  console.log("TITLE:", item.title);

  console.log("PRICE:", item.price);

  console.log("QUANTITY:", item.quantity);

  console.log("--------------------------------");

});


console.log("FINAL CART ITEMS:", cartItem);

cartItem.forEach((item) => {

  console.log("ITEM:", item);

  console.log("PRODUCT ID:", item.productId);

});


    // order payload
 
const order = {

  userId: user._id,

  user: address.name,

  email: address.email,

  phone: address.phone
    ? `+91 ${address.phone}`
    : "",

  deliveryAddress: {
  customer: {
    fullName: address.name,
    phone: address.phone,
  },

  address: {
    addressLine1: address.street,
    area: address.street,
    city: location?.city || "",
    district: location?.county || "",
    state: address.state,
    postalCode: address.postcode,
    country: address.country,
  },
},
subtotal: Number(totalPrice),

shippingCharge: 5,

tax: 0,

couponCode,

couponDiscount,

total: Number(finalTotal),
  paymentMethod: method,

  paymentStatus:
    method === "COD"
      ? "Pending"
      : "Paid",

  razorpayOrderId:
    paymentData.razorpay_order_id || "",

  razorpayPaymentId:
    paymentData.razorpay_payment_id || "",

  razorpaySignature:
    paymentData.razorpay_signature || "",

  status: "Processing",

  items: cartItem.map((i) => ({
  productId: i.productId,

  title: i.title,

  image: i.image, // ADD THIS

  price: Number(i.price),

  quantity: i.quantity,
})),
};


    try {
      // save order
      const res = await fetch(`${BACKEND_URL}/api/save-order`, {
        method: 'POST',
       
headers: {

  'Content-Type':
    'application/json',

  Authorization:
    `Bearer ${token}`,

},


        body: JSON.stringify(order),
      });

     const data = await res.json();

console.log("STATUS:", res.status);
console.log("RESPONSE:", data);

if (!res.ok) {
  throw new Error(
    data.message ||
    data.error ||
    "Order failed"
  );
}
      // success toast
      if (method === 'COD') {
        toast.success('Order placed (Cash on Delivery)');
      } else {
        toast.success('Payment Successful 🎉');
      }

      // 🔊 PLAY SUCCESS SOUND
      // try {
      //   const audio = new Audio(successmusic);

      //   audio.preload = "auto";
      //   audio.volume = 0.7;

      //   // reset position
      //   audio.currentTime = 0;

      //   // attempt playback
      //   await audio.play();

      //   // optional cleanup
      //   audio.onended = () => {
      //     audio.pause();
      //   };

      // } catch (audioError) {
      //   console.log('Audio playback blocked:', audioError);
      // }

      // clear cart
      await clearCart();

      // small delay for UX
      setTimeout(() => {

  navigate("/order-success", {

    state: {

      order: {

        orderId:
          data.order?._id ||

          `ODI-${Date.now()}`,

        totalPrice: finalTotal,

        paymentMethod:
          method,

        paymentStatus:

          method === "COD"

            ? "Pending"

            : "Paid",

        deliveryType:
          "Express",

        estimatedDelivery:
          "5-7 Business Days",

        transactionId:

          data.order?.transactionId ||

          `TXN${Date.now()}`,

        shippingAddress: {

          name:
            address.name,

          address:
            address.street,

          city:
            address.state,

          state:
            address.state,

          country:
            address.country,

          postcode:
            address.postcode,

          phone:
            address.phone,

          email:
            address.email,

        },

        items:

          cartItem.map(i => ({

            name:
              i.title,

            quantity:
              i.quantity,

            price:
              Number(i.price),

            image:
              i.image,

          })),

      },

    },

  });

}, 300);

    } catch (err) {

  console.error("ORDER ERROR:", err);

  toast.error(
    err.message || "Failed to place order"
  );

}
  };

  /* ── Razorpay — no phone required ── */
  const handleRazorpayPayment = async () => {
    try {
      console.log("TOTAL:", totalAmount);
      const res = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: 'POST',

headers: {

  'Content-Type':
    'application/json',

  Authorization:
    `Bearer ${token}`,

},

        body: JSON.stringify({ amount: finalTotal }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Order creation failed ❌'); return; }
      if (!window.Razorpay) { toast.error('Razorpay not loaded'); return; }

   
console.log("CREATE ORDER RESPONSE:", data);
console.log("RAZORPAY KEY:", import.meta.env.VITE_RAZORPAY_KEY);

const rzp = new window.Razorpay({
  key: import.meta.env.VITE_RAZORPAY_KEY,

  amount: data.order.amount,

  currency: data.order.currency,

  name: "Odikart",

  description: "Order Payment",

  order_id: data.order.id,
theme: {
    color: "#4F46E5", // Indigo
  },

  handler: async (response) => {
    console.log("RAZORPAY RESPONSE:", response);

    const vRes = await fetch(
      `${BACKEND_URL}/api/verify-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(response),
      }
    );

    const vData = await vRes.json();

    if (vData.success) {
      await completeOrder(
        "Razorpay",
        response
      );
    }
  },
});
      rzp.open();
    } catch { toast.error('Payment failed ❌'); }
  };

  /* ── COD ── */
  const handleCOD = () => onCodConfirmOpen();

  const handleDecrease = (id, qty) => {
    if (qty === 1) {
      toast('Remove item from cart?', {
        description: 'Quantity will become 0.',
        action: { label: 'Remove', onClick: () => { removeFromCart(id); toast.success('Item removed'); } },
        cancel: { label: 'Cancel' },
      });
    } else { decreaseQty(id); }
  };

  /* ── validation ── */
  const canProceedStep1 = cartItem.length > 0;
  const canProceedStep2 =
    address.name.trim() &&
    address.email.includes('@') &&
    address.street.trim() &&
    address.state.trim() &&
    address.country.trim();

  /* ── email validation indicator ── */
  const emailValid = address.email && address.email.includes('@');
  const emailTouched = address.email.length > 0;
  const validateDelivery = () => {
    if (!address.name.trim()) {
      toast.error("Full Name is required");
      return false;
    }

    if (!address.email || !address.email.includes("@")) {
      toast.error("Valid Email is required");
      return false;
    }

    if (!address.phone || address.phone.length !== 10) {
      toast.error("Valid 10-digit Phone Number is required");
      return false;
    }

    if (!address.street.trim()) {
      toast.error("Street Address is required");
      return false;
    }

    if (!address.state.trim()) {
      toast.error("State is required");
      return false;
    }

    if (!address.country.trim()) {
      toast.error("Country is required");
      return false;
    }

    return true;
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --ind:  #4f46e5;
          --blue: #2563eb;
          --lt:   #eef2ff;
          --bdr:  rgba(99,102,241,0.15);
        }

        .cart-root * { font-family:'Plus Jakarta Sans',sans-serif; }
        .cart-serif  { font-family:'Clash Display',sans-serif; }

        .step-done   { background:linear-gradient(135deg,var(--ind),var(--blue)); color:white; border-color:transparent; }
        .step-active { background:white; color:var(--ind); border-color:var(--ind); box-shadow:0 0 0 3px rgba(99,102,241,0.18); }
        .step-idle   { background:#f9fafb; color:#9ca3af; border-color:#e5e7eb; }
        .connector-done { background:linear-gradient(90deg,var(--ind),var(--blue)); }
        .connector-idle { background:#e5e7eb; }

        .cart-card {
          background:rgba(255,255,255,0.82);
          backdrop-filter:blur(14px);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:20px;
          box-shadow:0 4px 24px rgba(99,102,241,0.08);
          transition:transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .cart-card:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 32px rgba(99,102,241,0.14);
          border-color:rgba(99,102,241,0.25);
        }

        .f-input {
          width:100%;
          background:#f8faff;
          border:1px solid rgba(99,102,241,0.18);
          border-radius:12px;
          padding:11px 14px 11px 40px;
          font-size:13px;
          color:#1e1b4b;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .f-input-bare {
          width:100%;
          background:#f8faff;
          border:1px solid rgba(99,102,241,0.18);
          border-radius:12px;
          padding:11px 14px;
          font-size:13px;
          color:#1e1b4b;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .f-input::placeholder, .f-input-bare::placeholder { color:#a5b4fc; }
        .f-input:focus, .f-input-bare:focus {
          outline:none; background:white;
          border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.14);
        }
        .f-input.error  { border-color:#f43f5e; box-shadow:0 0 0 3px rgba(244,63,94,0.1); }
        .f-input.valid  { border-color:#10b981; }

        /* required star badge */
        .req-badge {
          display:inline-flex;align-items:center;gap:3px;
          font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
          background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);
          color:#6366f1;padding:1px 6px;border-radius:999px;
        }
        .opt-badge {
          display:inline-flex;align-items:center;gap:3px;
          font-size:9px;font-weight:600;
          background:#f8faff;border:1px solid #e5e7eb;
          color:#9ca3af;padding:1px 6px;border-radius:999px;
        }

        .btn-primary {
          background:linear-gradient(135deg,var(--ind),var(--blue));
          color:white; font-weight:700;
          border-radius:14px;
          display:flex;align-items:center;justify-content:center;gap:8px;
          position:relative;overflow:hidden;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 10px 28px rgba(79,70,229,0.38); }
        .btn-primary:disabled { opacity:0.45;cursor:not-allowed; }
        @keyframes shimmer { 0%{background-position:-200% center;}100%{background-position:200% center;} }
        .btn-primary::after { content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);background-size:200% 100%;animation:shimmer 2.4s infinite; }

        .btn-secondary {
          background:#f0f4ff;
          border:1px solid rgba(99,102,241,0.2);
          color:var(--ind);font-weight:600;
          border-radius:14px;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition:all 0.2s;
        }
        .btn-secondary:hover { background:#e0e7ff;border-color:rgba(99,102,241,0.4);transform:translateY(-1px); }

        .qty-wrap { display:flex;align-items:center;gap:10px;background:#f8faff;border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:6px 12px; }
        .qty-btn  { width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:white;border:1px solid rgba(99,102,241,0.18);color:#6366f1;transition:all 0.18s;cursor:pointer; }
        .qty-btn:hover { background:#eef2ff;border-color:rgba(99,102,241,0.4); }

        .pay-option { display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;border-radius:14px;border:1.5px solid #e5e7eb;background:white;cursor:pointer;transition:all 0.22s; }
        .pay-option:hover { border-color:var(--ind);background:#f5f3ff;box-shadow:0 4px 16px rgba(99,102,241,0.12);transform:translateY(-1px); }
        .pay-option.selected { border-color:var(--ind);background:#eef2ff;box-shadow:0 0 0 3px rgba(99,102,241,0.12); }

        .s-row { display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#6b7280; }

        @keyframes pageIn { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        .step-panel { animation:pageIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes blobDrift {
          0%,100%{transform:translate(0,0) scale(1);border-radius:60% 40% 55% 45%/50% 60% 40% 50%;}
          40%{transform:translate(18px,-16px) scale(1.05);}
          70%{transform:translate(-10px,10px) scale(0.96);}
        }
        .blob  { animation:blobDrift 10s ease-in-out infinite; }
        .blob2 { animation:blobDrift 13s ease-in-out infinite reverse; }

        @keyframes checkIn { from{opacity:0;transform:scale(0.4);}to{opacity:1;transform:scale(1);} }
        .check-in { animation:checkIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="cart-root min-h-screen mb-9 sm:mb-0 relative overflow-x-hidden"
        style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}>

        <div className="blob pointer-events-none fixed -top-32 -left-32 w-96 h-96 opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle,#c7d2fe,transparent)" }} />
        <div className="blob2 pointer-events-none fixed -bottom-24 -right-24 w-80 h-80 opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle,#bfdbfe,transparent)" }} />
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle,#4f46e5 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">

          {/* ── EMPTY STATE ── */}
          {cartItem.length === 0 && step === 1 && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center step-panel">
              <img src={emptyCart} alt="Empty Cart" className="w-56 mb-5 opacity-90" />
              <h1 className="cart-serif text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">
                Your cart feels lonely 🛒
              </h1>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-6">
                You haven't added anything yet. Explore and find something you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/products')} className="btn-primary px-7 py-3 text-sm">
                  <GiShoppingBag size={16} /><span className="relative z-10">Start Shopping</span>
                </button>
                <button onClick={() => navigate('/order-history')} className="btn-secondary px-7 py-3 text-sm">
                  <FaHistory size={14} /> View Orders
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-4">🚚 Free delivery on all orders</p>
            </div>
          )}

          {/* ── WIZARD ── */}
          {(cartItem.length > 0 || step > 1) && (
            <>
              {/* STEPPER */}
              <div className="flex items-center justify-center mb-10">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300
                          ${s.id < step ? "step-done cursor-pointer" : s.id === step ? "step-active" : "step-idle cursor-default"}`}
                      >
                     {s.id < step ? (
  <FaCheckCircle size={16} />
) : (
  s.icon
)}
                      </button>
                      <span className={`text-xs font-semibold ${s.id === step ? "text-indigo-600" : s.id < step ? "text-indigo-400" : "text-slate-400"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-3 mb-4 rounded-full transition-all duration-500 ${step > i + 1 ? "connector-done" : "connector-idle"}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* ═══ STEP 1 — CART ═══ */}
              {step === 1 && (
                <div className="step-panel space-y-5">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="cart-serif text-2xl font-bold text-indigo-900">
                      My Cart <span className="text-indigo-400 text-lg">({cartItem.length})</span>
                    </h2>
                    <button onClick={() => navigate('/order-history')} className="btn-secondary px-4 py-2 text-xs">
                      <FaHistory size={14} /> View Orders
                    </button>
                  </div>

                  {cartItem.map((item) => (
                    <div key={item.productId} className="cart-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5">
                      <div className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => navigate(`/products/${item.productId}`)}>
                        <img src={item.image} alt={item.title}
                          className="w-20 h-20 rounded-xl object-cover border border-indigo-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors">{item.title}</p>
                          <p className="flex items-center text-indigo-600 font-bold text-base mt-1"><FaRupeeSign size={11} />{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-end">
                        <div className="qty-wrap">
                          <button className="qty-btn" onClick={e => { e.stopPropagation(); handleDecrease(item.productId, item.quantity); }}>
                            <AiOutlineMinus size={12} />
                          </button>
                          <span className="text-sm font-bold text-slate-800 w-5 text-center">{item.quantity}</span>
                          <button className="qty-btn" onClick={e => { e.stopPropagation(); increaseQty(item.productId); }}>
                            <AiOutlinePlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedItem(item.productId); onDeleteOpen(); }}
                          className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <FaRegTrashAlt size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="cart-card p-5">
                    <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4">Order Summary</p>
                    <div className="space-y-2.5">
                      <div className="s-row">
                        <span className="flex items-center gap-2">
                          🧾 Subtotal
                        </span>
                        <span className="flex items-center font-semibold text-slate-700">
                          ₹{totalPrice}
                        </span>
                      </div>

                      <div className="s-row">
                        <span className="flex items-center gap-2">
                          🚚 Delivery
                        </span>
                        <span className="text-green-600 font-semibold text-xs">
                          FREE
                        </span>
                      </div>

                      <div className="s-row">
                        <span className="flex items-center gap-2">
                          <GiShoppingBag size={13} /> Handling
                        </span>
                        <span className="flex items-center font-semibold text-slate-700">
                          ₹5
                        </span>
                      </div>

                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          Total
                        </span>

                        <span className="flex items-center font-extrabold text-lg text-indigo-600">
                           <FaRupeeSign size={13} className="mr-1" />{finalTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => canProceedStep1 && setStep(2)} disabled={!canProceedStep1}
                    className="btn-primary w-full py-4 text-sm">
                    <span className="relative z-10">Continue to Delivery</span>
                    <IoArrowForward size={16} className="relative z-10" />
                  </button>
                </div>
              )}

              {/* ═══ STEP 2 — DELIVERY ═══ */}
             {step === 2 && (
  <div className="step-panel">
    <h2 className="cart-serif text-2xl font-bold text-indigo-900 mb-6">
      <span className="flex items-center gap-2">
  <AiFillEnvironment className="text-indigo-600" />
  Delivery Information
</span>
    </h2>

    <div className="cart-card p-6 sm:p-8 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-indigo-50 pb-4 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl">
          <GiShoppingBag className="text-indigo-600" size={20} />
        </div>

        <div>
          <p className="font-bold text-indigo-900 text-sm">
            Shipping Details
          </p>

          <p className="text-xs text-slate-400">
            Where should we deliver?
          </p>
        </div>
      </div>

      {/* NAME */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
  <FaUser className="text-indigo-500" size={12} />
  Full Name
</span>
          </label>

          <span className="req-badge">Required</span>
        </div>

        <input
          className="f-input-bare"
          type="text"
          placeholder="e.g. Bom Bhole"
          value={address.name}
          onChange={e => setAddress({ ...address, name: e.target.value })}
        />
      </div>

      {/* EMAIL */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
  <FaEnvelope className="text-indigo-500" size={12} />
  Email Address
</span>
          </label>

          <span className="req-badge">Required</span>

          {emailTouched && (
            <span
              className={`check-in text-xs font-semibold flex items-center gap-1 ${
                emailValid ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {emailValid ? <>✅ Valid</> : <>❌ Invalid</>}
            </span>
          )}
        </div>

        <input
          className={`f-input-bare ${
            emailTouched && !emailValid
              ? "error"
              : emailTouched && emailValid
              ? "valid"
              : ""
          }`}
          type="email"
          placeholder="e.g. eshopcustomerinfo@gmail.com"
          value={address.email}
          onChange={e =>
            setAddress({ ...address, email: e.target.value })
          }
        />

        {emailTouched && !emailValid && (
          <p className="text-xs text-rose-500 mt-1 pl-0.5 font-medium">
            Please enter a valid email address
          </p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-xs font-semibold text-slate-600">
           <span className="flex items-center gap-1">
  <BsTelephoneFill className="text-indigo-500" size={11} />
  Phone Number
</span>
          </label>

          <span className="req-badge">Required</span>
        </div>

        <div className="flex items-center f-input-bare pr-0 pl-0 overflow-hidden">
          <span className=" text-indigo-400 text-sm font-bold flex-shrink-0 border-r border-indigo-100 mr-1">
            +91
          </span>

          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            maxLength="10"
            inputMode="numeric"
            value={address.phone}
            onInput={e => {
              e.target.value = e.target.value
                .replace(/[^0-9]/g, '')
                .slice(0, 10);
            }}
            onChange={e =>
              setAddress({
                ...address,
                phone: e.target.value
                  .replace(/[^0-9]/g, '')
                  .slice(0, 10),
              })
            }
            className="flex-1 py-1 px-1 bg-transparent text-slate-800 placeholder-indigo-200 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* STREET */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-xs font-semibold text-slate-600">
           <span className="flex items-center gap-1">
  <FaMapMarkerAlt className="text-indigo-500" size={11} />
  Street Address
</span>
          </label>

          <span className="req-badge">Required</span>
        </div>

        <input
          className="f-input-bare"
          type="text"
          placeholder="Street / City / Area"
          value={address.street}
          onChange={e =>
            setAddress({ ...address, street: e.target.value })
          }
        />
      </div>

      {/* STATE + POSTCODE */}
      <div className="grid grid-cols-2 gap-3">

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
  <MdLocationCity className="text-indigo-500" size={13} />
  State
</span>
            </label>

            <span className="req-badge">Required</span>
          </div>

          <input
            className="f-input-bare"
            type="text"
            placeholder="e.g. Maharashtra"
            value={address.state}
            onChange={e =>
              setAddress({ ...address, state: e.target.value })
            }
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-xs font-semibold text-slate-600">
           <span className="flex items-center gap-1">
  <MdMyLocation className="text-indigo-500" size={13} />
  Post Code
</span>
            </label>

            <span className="req-badge">Required</span>
          </div>

          <input
            className="f-input-bare"
            type="text"
            placeholder="e.g. 400001"
            value={address.postcode}
            onChange={e =>
              setAddress({ ...address, postcode: e.target.value })
            }
          />
        </div>
      </div>

      {/* COUNTRY */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
  <AiFillEnvironment className="text-indigo-500" size={13} />
  Country
</span>
          </label>

          <span className="req-badge">Required</span>
        </div>

        <input
          className="f-input-bare"
          type="text"
          placeholder="e.g. India"
          value={address.country}
          onChange={e =>
            setAddress({ ...address, country: e.target.value })
          }
        />
      </div>

      {/* AUTO DETECT */}
      <button
        onClick={() => {
          if (!navigator.geolocation) {
            toast.error('Geolocation not supported');
            return;
          }

          navigator.geolocation.getCurrentPosition(
            p => {
              onLocationChange(
                p.coords.latitude,
                p.coords.longitude
              );

              toast.success('Location updated');
            },
            () => toast.error('Could not get location')
          );
        }}
        className="btn-secondary w-full py-3 text-sm mt-1"
      >
      <>
  <MdMyLocation size={16} />
  Auto-detect My Location
</>
      </button>
    </div>

    <div className="flex gap-3 mt-5">

      <button
        onClick={() => setStep(1)}
        className="btn-secondary flex-1 py-4 text-sm"
      >
        <>
  <IoArrowBack size={15} />
  Back
</>
      </button>

      <button
        onClick={() => {
          if (validateDelivery()) {
            setStep(3);
          }
        }}
        className="btn-primary flex-[2] py-4 text-sm"
      >
        <span className="relative z-10">
          Continue to Payment
        </span>

       <IoArrowForward size={15} className="relative z-10" />
      </button>
    </div>
  </div>
)}

              {/* ═══ STEP 3 — PAYMENT ═══ */}
              {step === 3 && (
            <div className="step-panel space-y-6">

  {/* Header */}
  <div>
    <h2 className="text-3xl font-black tracking-tight text-slate-900">
      Payment
    </h2>

    <p className="text-slate-500 text-sm mt-1">
      Complete your purchase securely
    </p>
  </div>

  {/* ORDER SUMMARY */}
  <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-xl p-6">

    {/* gradient glow */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-30" />

    <div className="relative flex items-start justify-between gap-5">

      {/* left */}
      <div className="space-y-4">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500 mb-3">
            Order Summary
          </p>

          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <FaShoppingBag className="text-indigo-600" />
            </div>

            <div>
              <p className="font-bold text-slate-800">
                {cartItem.length} item{cartItem.length !== 1 ? "s" : ""}
              </p>

              <p className="text-xs text-slate-400">
                Ready for checkout
              </p>
            </div>
          </div>
        </div>

        {/* email */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <FaEnvelope className="text-slate-500 text-sm" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
              Email
            </p>

            <p className="text-sm font-medium text-slate-700">
              {address.email}
            </p>
          </div>
        </div>

        {/* address */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <FaMapMarkerAlt className="text-slate-500 text-sm" />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
              Delivery Address
            </p>

            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {address.street}, {address.state}
            </p>
          </div>
        </div>

      </div>

      {/* total */}
      <div className="text-right">

        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
          Total Amount
        </p>

        <div className="mt-2 inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 shadow-lg">

          <FaRupeeSign className="text-white mr-1" size={14} />

          <span className="text-2xl font-black text-white tracking-tight">
            {totalAmount}
          </span>
        </div>

      </div>
    </div>
  </div>
<div className="cart-card p-5 space-y-3">

  <h3 className="font-bold text-slate-800">
    Apply Coupon
  </h3>

  <div className="flex gap-3">

    <input
  value={couponCode}
  onChange={(e) => {

    setCouponCode(
      e.target.value.toUpperCase()
    );

    setCouponError("");

    setCouponSuccess("");

  }}

  placeholder="Enter Coupon Code"

  className={`f-input-bare flex-1 ${
    couponError
      ? "border-red-500"
      : couponSuccess
      ? "border-green-500"
      : ""
  }`}
/>

    <button
      onClick={applyCoupon}
      disabled={couponLoading}
      className="btn-primary px-6"
    >
      {couponLoading ? "Applying..." : "Apply"}
    </button>

  </div>
{couponError && (

  <div
    className="
      mt-4
      flex
      items-start
      gap-3
      rounded-2xl
      border
      border-red-200
      bg-red-50
      px-4
      py-4
    "
  >

    <div className="text-red-500 text-xl">
      ❌
    </div>

    <div>

      <h4 className="font-semibold text-red-700">
        Coupon Not Applied
      </h4>

      <p className="text-sm text-red-600 mt-1">
        {couponError}
      </p>

    </div>

  </div>

)}
  {couponDiscount > 0 && (

    <div className="rounded-xl bg-green-50 border border-green-200 p-3">

      <div className="text-green-700 font-semibold">

        Coupon Applied Successfully 🎉

      </div>

      <div className="text-sm mt-2">

        Discount: ₹{couponDiscount}

      </div>

    </div>

  )}

</div>
  {/* PAYMENT OPTIONS */}
  <div className="space-y-4">

    {/* ONLINE */}
    <button
      onClick={() => setPaymentType("razorpay")}
      className={`group relative overflow-hidden w-full rounded-3xl border p-5 transition-all duration-300
      ${
        paymentType === "razorpay"
          ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
          : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md"
      }`}
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
            <FaCreditCard className="text-white text-lg" />
          </div>

          <div className="text-left">

            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-800 text-base">
                Pay Online
              </p>

              <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wide">
                Recommended
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-1">
              UPI, Cards, Wallets & Netbanking
            </p>

            <div className="flex gap-2 mt-3">

              <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-semibold">
                Secure
              </span>

              <span className="px-2 py-1 rounded-full bg-violet-100 text-violet-600 text-[11px] font-semibold">
                Instant
              </span>

              <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-600 text-[11px] font-semibold">
                Razorpay
              </span>

            </div>

          </div>
        </div>

        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${
            paymentType === "razorpay"
              ? "border-indigo-600"
              : "border-slate-300"
          }`}
        >
          {paymentType === "razorpay" && (
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
          )}
        </div>

      </div>
    </button>

    {/* COD */}
    <button
      onClick={() => setPaymentType("cod")}
      className={`group relative overflow-hidden w-full rounded-3xl border p-5 transition-all duration-300
      ${
        paymentType === "cod"
          ? "border-amber-400 bg-amber-50 shadow-lg shadow-amber-100"
          : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-md"
      }`}
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <FaWallet className="text-white text-lg" />
          </div>

          <div className="text-left">

            <p className="font-bold text-slate-800 text-base">
              Cash on Delivery
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Pay after receiving your order
            </p>

            <div className="mt-3">
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                3–5 Business Days
              </span>
            </div>

          </div>
        </div>

        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${
            paymentType === "cod"
              ? "border-amber-500"
              : "border-slate-300"
          }`}
        >
          {paymentType === "cod" && (
            <div className="w-3 h-3 rounded-full bg-amber-500" />
          )}
        </div>

      </div>
    </button>
  </div>

  {/* INFO BOX */}
  {paymentType && (
    <div
      className={`rounded-3xl p-5 border
      ${
        paymentType === "razorpay"
          ? "bg-indigo-50 border-indigo-100"
          : "bg-amber-50 border-amber-100"
      }`}
    >

      <p
        className={`font-bold text-sm mb-4
        ${
          paymentType === "razorpay"
            ? "text-indigo-700"
            : "text-amber-700"
        }`}
      >
        {paymentType === "razorpay"
          ? "Secure Payment Instructions"
          : "Cash on Delivery Details"}
      </p>

      <div className="space-y-3">

        {(paymentType === "razorpay"
          ? [
              "Choose UPI, Card or Netbanking",
              "Complete payment in Razorpay popup",
              "Do not close payment window",
              `Confirmation sent to ${address.email}`,
            ]
          : [
              "Pay after delivery arrives",
              "Delivery within 3–5 business days",
              "Keep exact amount ready",
              `Confirmation sent to ${address.email}`,
            ]
        ).map((t) => (
          <div key={t} className="flex items-center gap-3">

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center
              ${
                paymentType === "razorpay"
                  ? "bg-indigo-100"
                  : "bg-amber-100"
              }`}
            >
              <FaCheckCircle
                size={11}
                className={
                  paymentType === "razorpay"
                    ? "text-indigo-600"
                    : "text-amber-600"
                }
              />
            </div>

            <p className="text-sm text-slate-700 font-medium">
              {t}
            </p>

          </div>
        ))}

      </div>
    </div>
  )}

  {/* footer */}
  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
    <FaShieldAlt className="text-green-500" />
    Secure checkout powered by Razorpay
  </div>

  {/* ACTION BUTTONS */}
  <div className="flex gap-4 pt-2">

    <button
      onClick={() => setStep(2)}
      className="flex-1 h-14 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-semibold text-slate-700 flex items-center justify-center gap-2"
    >
      <IoArrowBack />
      Back
    </button>

    <button
      onClick={() => {
        if (!paymentType) {
          toast.warning("Please select a payment method");
          return;
        }

        paymentType === "razorpay"
          ? onInstrOpen()
          : onCodConfirmOpen();
      }}
      disabled={!paymentType}
      className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.01] active:scale-[0.99] transition-all text-white font-bold shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {paymentType === "cod"
        ? "Confirm Order"
        : "Proceed to Pay"}

      <IoArrowForward />
    </button>

  </div>
</div>
              )}
            </>
          )}
        </div>

        {/* ══ DELETE MODAL ══ */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} placement="center" backdrop="blur" hideCloseButton>
          <ModalContent className="rounded-2xl border border-slate-200 shadow-xl bg-white max-w-sm mx-auto">
            {(onClose) => (<>
              <ModalHeader className="text-slate-800 font-bold text-base border-b border-slate-100">Remove Item</ModalHeader>
              <ModalBody className="text-slate-500 text-sm py-4">Are you sure you want to remove this item from your cart?</ModalBody>
              <ModalFooter className="gap-2 border-t border-slate-100">
                <Button variant="light" onPress={onDeleteClose} className="text-slate-500">Cancel</Button>
                <Button onPress={() => { removeFromCart(selectedItem); toast.success("Item removed"); onDeleteClose(); }}
                  className="bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600">Remove</Button>
              </ModalFooter>
            </>)}
          </ModalContent>
        </Modal>

        {/* ══ RAZORPAY INSTRUCTION MODAL ══ */}
        <Modal isOpen={isInstrOpen} onClose={onInstrClose} placement="center" backdrop="blur" hideCloseButton className="z-[9999]">
          <ModalContent className="rounded-2xl border border-indigo-100 shadow-xl bg-white max-w-sm mx-auto">
            {(onClose) => (<>
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-2xl" />
              <ModalHeader className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100">
                <MdPayments className="text-indigo-600" size={18} /> Payment Instructions
              </ModalHeader>
              <ModalBody className="py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={razorpayLogo} className="w-10 h-10 rounded-xl border" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Razorpay Payment</p>
                    <p className="text-xs text-slate-400">UPI · Cards · Netbanking · Wallets</p>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-2">
                  {["Select UPI / Card / Netbanking", "Complete payment in Razorpay popup", "Do not close the payment window", "Confirmation sent to " + address.email].map(t => (
                    <div key={t} className="flex gap-2 text-xs text-indigo-700"><FaCheckCircle className="text-indigo-500 mt-0.5 flex-shrink-0" />{t}</div>
                  ))}
                </div>
                <div className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl">🔒 256-bit SSL encrypted · Powered by Razorpay</div>
              </ModalBody>
              <ModalFooter className="gap-2 border-t border-slate-100">
                <Button variant="light" onPress={onInstrClose} className="text-slate-500 text-sm">Cancel</Button>
                <Button onPress={() => { onInstrClose(); handleRazorpayPayment(); }}
                  className="text-white font-bold rounded-xl text-sm px-6"
                  style={{ background: "linear-gradient(135deg,#4f46e5,#2563eb)" }}>
                  Continue →
                </Button>
              </ModalFooter>
            </>)}
          </ModalContent>
        </Modal>

        {/* ══ COD CONFIRM MODAL ══ */}
        <Modal isOpen={isCodConfirmOpen} onClose={onCodConfirmClose} placement="center" backdrop="blur" hideCloseButton className="z-[9999]">
          <ModalContent className="rounded-2xl border border-amber-100 shadow-xl bg-white max-w-sm mx-auto">
            {(onClose) => (<>
              <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-2xl" />
              <ModalHeader className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100">
                <FaWallet className="text-amber-500" /> Confirm COD Order
              </ModalHeader>
              <ModalBody className="py-4 space-y-2">
                <p className="text-sm text-slate-600">You selected <span className="font-bold text-slate-800">Cash on Delivery</span>.</p>
                <p className="text-xs text-slate-500">Confirmation will be sent to <span className="text-indigo-600 font-semibold">{address.email}</span></p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">💡 Keep cash ready at time of delivery</div>
              </ModalBody>
              <ModalFooter className="gap-2 border-t border-slate-100">
                <Button variant="light" onPress={onCodConfirmClose} className="text-slate-500 text-sm">Cancel</Button>
                <Button onPress={() => { completeOrder('COD'); onCodConfirmClose(); }}
                  className="text-white font-bold rounded-xl text-sm px-6 bg-amber-500 hover:bg-amber-600">
                  Confirm Order
                </Button>
              </ModalFooter>
            </>)}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default Cart;