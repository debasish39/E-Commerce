import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaRegTrashAlt, FaCheckCircle, FaHistory, FaWallet, FaCreditCard, FaUser, FaMapMarkerAlt, FaRupeeSign, FaEnvelope } from 'react-icons/fa';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining, MdPayments, MdLocationCity, MdMyLocation } from 'react-icons/md';
import { GiShoppingBag } from 'react-icons/gi';
import { AiOutlinePlus, AiOutlineMinus, AiFillEnvironment } from 'react-icons/ai';
import { IoArrowForward, IoArrowBack } from 'react-icons/io5';
import { BsTelephoneFill } from 'react-icons/bs';
import { useUser } from '@clerk/clerk-react';
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
  { id: 1, label: 'Cart',     icon: <GiShoppingBag size={16}/> },
  { id: 2, label: 'Delivery', icon: <AiFillEnvironment size={16}/> },
  { id: 3, label: 'Payment',  icon: <MdPayments size={16}/> },
];

const Cart = ({ location, getLocation, onLocationChange }) => {
  const { cartItem, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const { user }                = useUser();
  const navigate                = useNavigate();
  const [step, setStep]         = useState(1);
  const [paymentType, setPaymentType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { isOpen: isDeleteOpen,     onOpen: onDeleteOpen,     onClose: onDeleteClose     } = useDisclosure();
  const { isOpen: isInstrOpen,      onOpen: onInstrOpen,      onClose: onInstrClose      } = useDisclosure();
  const { isOpen: isCodConfirmOpen, onOpen: onCodConfirmOpen, onClose: onCodConfirmClose } = useDisclosure();

  const [address, setAddress] = useState({
    name:'', email:'', phone:'', street:'', state:'', postcode:'', country:'',
  });

  useEffect(() => {
    if (location) {
      setAddress(prev => ({
        ...prev,
        name:     user?.fullName || '',
        email:    user?.primaryEmailAddress?.emailAddress || '',
        street:   location.city||location.town||location.village||location.county||'',
        state:    location.state    || '',
        postcode: location.postcode || '',
        country:  location.country  || '',
      }));
    }
  }, [location, user]);

  const totalPrice  = cartItem.reduce((t, i) => t + Number(i.price) * i.quantity, 0);
  const totalAmount = totalPrice + 5;
  const BACKEND_URL = 'https://eshop-backend-y0e7.onrender.com';

  /* ── completeOrder — email required, phone optional ── */


const completeOrder = async (method = 'Razorpay') => {
  // validation
  if (!user) {
    toast.error('Please login before placing an order');
    return;
  }

  if (!address.email?.includes('@')) {
    toast.error('Please enter a valid email address');
    return;
  }

  // order payload
  const order = {
    userId: user.id,
    user: address.name || user.fullName || 'Guest',
    email: address.email,
    phone: address.phone ? `+91 ${address.phone}` : '',
    deliveryAddress: {
      street: address.street,
      state: address.state,
      postcode: address.postcode,
      country: address.country,
    },
    total: Number(totalAmount),
    paymentMethod: method,
    paymentStatus: method === 'COD' ? 'Pending' : 'Paid',
    status: 'Processing',
    items: cartItem.map(i => ({
      title: i.title,
      price: Number(i.price),
      quantity: i.quantity
    })),
  };

  try {
    // save order
    const res = await fetch(`${BACKEND_URL}/api/save-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Order failed');
    }

    // success toast
    if (method === 'COD') {
      toast.success('Order placed (Cash on Delivery)');
    } else {
      toast.success('Payment Successful 🎉');
    }

    // 🔊 PLAY SUCCESS SOUND
    try {
      const audio = new Audio(successmusic);

      audio.preload = "auto";
      audio.volume = 0.7;

      // reset position
      audio.currentTime = 0;

      // attempt playback
      await audio.play();

      // optional cleanup
      audio.onended = () => {
        audio.pause();
      };

    } catch (audioError) {
      console.log('Audio playback blocked:', audioError);
    }

    // clear cart
    await clearCart();

    // small delay for UX
    setTimeout(() => {
      navigate('/order-success');
    }, 300);

  } catch (err) {
    console.error(err);
    toast.error('Failed to place order');
  }
};

  /* ── Razorpay — no phone required ── */
  const handleRazorpayPayment = async () => {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Order creation failed ❌'); return; }
      if (!window.Razorpay) { toast.error('Razorpay not loaded'); return; }

      const rzp = new window.Razorpay({
        key:        import.meta.env.VITE_RAZORPAY_KEY,
        amount:     data.amount,
        currency:   'INR',
        name:       'E-Shop',
        description:'Order Payment',
        order_id:   data.id,
        handler: async (response) => {
          const vRes  = await fetch(`${BACKEND_URL}/api/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const vData = await vRes.json();
          if (vData.success) completeOrder('Razorpay');
          else toast.error('Payment verification failed ❌');
        },
        prefill: { name: user?.fullName || 'Guest', email: address.email, contact: address.phone || '' },
        theme:   { color: '#6366F1' },
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
        action:  { label: 'Remove', onClick: () => { removeFromCart(id); toast.success('Item removed'); } },
        cancel:  { label: 'Cancel' },
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
        style={{ background:"linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}>

        <div className="blob pointer-events-none fixed -top-32 -left-32 w-96 h-96 opacity-30 blur-3xl"
          style={{ background:"radial-gradient(circle,#c7d2fe,transparent)" }}/>
        <div className="blob2 pointer-events-none fixed -bottom-24 -right-24 w-80 h-80 opacity-20 blur-3xl"
          style={{ background:"radial-gradient(circle,#bfdbfe,transparent)" }}/>
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">

          {/* ── EMPTY STATE ── */}
          {cartItem.length === 0 && step === 1 && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center step-panel">
              <img src={emptyCart} alt="Empty Cart" className="w-56 mb-5 opacity-90"/>
              <h1 className="cart-serif text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">
                Your cart feels lonely 🛒
              </h1>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-6">
                You haven't added anything yet. Explore and find something you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/products')} className="btn-primary px-7 py-3 text-sm">
                  <GiShoppingBag size={16}/><span className="relative z-10">Start Shopping</span>
                </button>
                <button onClick={() => navigate('/order-history')} className="btn-secondary px-7 py-3 text-sm">
                  <FaHistory size={14}/> View Orders
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
                        {s.id < step ? <FaCheckCircle size={16}/> : s.icon}
                      </button>
                      <span className={`text-xs font-semibold ${s.id === step ? "text-indigo-600" : s.id < step ? "text-indigo-400" : "text-slate-400"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-3 mb-4 rounded-full transition-all duration-500 ${step > i+1 ? "connector-done" : "connector-idle"}`}/>
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
                      <FaHistory size={12}/> Orders
                    </button>
                  </div>

                  {cartItem.map((item) => (
                    <div key={item.productId} className="cart-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5">
                      <div className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => navigate(`/products/${item.productId}`)}>
                        <img src={item.image} alt={item.title}
                          className="w-20 h-20 rounded-xl object-cover border border-indigo-100 flex-shrink-0"/>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors">{item.title}</p>
                          <p className="flex items-center text-indigo-600 font-bold text-base mt-1"><FaRupeeSign size={11}/>{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-end">
                        <div className="qty-wrap">
                          <button className="qty-btn" onClick={e => { e.stopPropagation(); handleDecrease(item.productId, item.quantity); }}>
                            <AiOutlineMinus size={12}/>
                          </button>
                          <span className="text-sm font-bold text-slate-800 w-5 text-center">{item.quantity}</span>
                          <button className="qty-btn" onClick={e => { e.stopPropagation(); increaseQty(item.productId); }}>
                            <AiOutlinePlus size={12}/>
                          </button>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedItem(item.productId); onDeleteOpen(); }}
                          className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <FaRegTrashAlt size={13}/>
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="cart-card p-5">
                    <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4">Order Summary</p>
                    <div className="space-y-2.5">
                      <div className="s-row"><span className="flex items-center gap-2"><LuNotebookText/>Items Total</span><span className="flex items-center font-semibold text-slate-700"><FaRupeeSign size={10}/>{totalPrice}</span></div>
                      <div className="s-row"><span className="flex items-center gap-2"><MdDeliveryDining/>Delivery</span><span className="text-green-600 font-semibold text-xs">FREE</span></div>
                      <div className="s-row"><span className="flex items-center gap-2"><GiShoppingBag/>Handling</span><span className="flex items-center font-semibold text-slate-700"><FaRupeeSign size={10}/>5</span></div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-2"><FaWallet/>Total</span>
                        <span className="flex items-center font-extrabold text-lg text-indigo-600"><FaRupeeSign size={13}/>{totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => canProceedStep1 && setStep(2)} disabled={!canProceedStep1}
                    className="btn-primary w-full py-4 text-sm">
                    <span className="relative z-10">Continue to Delivery</span>
                    <IoArrowForward size={16} className="relative z-10"/>
                  </button>
                </div>
              )}

              {/* ═══ STEP 2 — DELIVERY ═══ */}
              {step === 2 && (
                <div className="step-panel">
                  <h2 className="cart-serif text-2xl font-bold text-indigo-900 mb-6">Delivery Information</h2>

                  <div className="cart-card p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 border-b border-indigo-50 pb-4 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <AiFillEnvironment className="text-indigo-600" size={20}/>
                      </div>
                      <div>
                        <p className="font-bold text-indigo-900 text-sm">Shipping Details</p>
                        <p className="text-xs text-slate-400">Where should we deliver?</p>
                      </div>
                    </div>

                    {/* NAME — required */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <label className="text-xs font-semibold text-slate-600">Full Name</label>
                        <span className="req-badge">Required</span>
                      </div>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={13}/>
                        <input className="f-input" type="text" placeholder="e.g. Bom Bhole"
                          value={address.name} onChange={e => setAddress({...address, name:e.target.value})}/>
                      </div>
                    </div>

                    {/* EMAIL — required + live validation */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <label className="text-xs font-semibold text-slate-600">Email Address</label>
                        <span className="req-badge">Required</span>
                        {emailTouched && (
                          <span className={`check-in text-xs font-semibold flex items-center gap-1 ${emailValid?"text-emerald-600":"text-rose-500"}`}>
                            {emailValid
                              ? <><FaCheckCircle size={10}/>Valid</>
                              : <>✕ Invalid</>}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={13}/>
                        <input
                          className={`f-input ${emailTouched && !emailValid ? "error" : emailTouched && emailValid ? "valid" : ""}`}
                          type="email" placeholder="e.g. eshopcustomerinfo@gmail.com"
                          value={address.email}
                          onChange={e => setAddress({...address, email:e.target.value})}/>
                        {emailTouched && emailValid && (
                          <FaCheckCircle className="check-in absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" size={14}/>
                        )}
                      </div>
                      {emailTouched && !emailValid && (
                        <p className="text-xs text-rose-500 mt-1 pl-0.5 font-medium">
                          Please enter a valid email address (e.g. name@example.com)
                        </p>
                      )}
                    </div>

                    {/* PHONE — optional */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                        <span className="req-badge">Required</span>
                      </div>
                      <div className="flex items-center f-input-bare pr-0 pl-0 overflow-hidden">
                        <span className="px-3 text-indigo-400 text-sm font-bold flex-shrink-0 border-r border-indigo-100 mr-1">+91</span>
                        <input
                          type="tel" name="phone" placeholder="10-digit mobile number"
                          maxLength="10" inputMode="numeric"
                          value={address.phone}
                          onInput={e => { e.target.value = e.target.value.replace(/[^0-9]/g,'').slice(0,10); }}
                          onChange={e => setAddress({...address, phone: e.target.value.replace(/[^0-9]/g,'').slice(0,10)})}
                          className="flex-1 py-1 px-1 bg-transparent text-slate-800 placeholder-indigo-200 focus:outline-none text-sm"/>
                      </div>
                    </div>

                    {/* STREET — required */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <label className="text-xs font-semibold text-slate-600">Street Address</label>
                        <span className="req-badge">Required</span>
                      </div>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={13}/>
                        <input className="f-input" type="text" placeholder="Street / City / Area"
                          value={address.street} onChange={e => setAddress({...address, street:e.target.value})}/>
                      </div>
                    </div>

                    {/* STATE + POSTCODE */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <label className="text-xs font-semibold text-slate-600">State</label>
                          <span className="req-badge">Required</span>
                        </div>
                        <div className="relative">
                          <MdLocationCity className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={14}/>
                          <input className="f-input" type="text" placeholder="e.g. Maharashtra"
                            value={address.state} onChange={e => setAddress({...address, state:e.target.value})}/>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <label className="text-xs font-semibold text-slate-600">Post Code</label>
                          <span className="req-badge">Required</span>
                        </div>
                        <input className="f-input-bare" type="text" placeholder="e.g. 400001"
                          value={address.postcode} onChange={e => setAddress({...address, postcode:e.target.value})}/>
                      </div>
                    </div>

                    {/* COUNTRY */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <label className="text-xs font-semibold text-slate-600">Country</label>
                        <span className="req-badge">Required</span>
                      </div>
                      <input className="f-input-bare" type="text" placeholder="e.g. India"
                        value={address.country} onChange={e => setAddress({...address, country:e.target.value})}/>
                    </div>

                    {/* auto-detect */}
                    <button
                      onClick={() => {
                        if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
                        navigator.geolocation.getCurrentPosition(
                          p => { onLocationChange(p.coords.latitude, p.coords.longitude); toast.success('Location updated'); },
                          () => toast.error('Could not get location')
                        );
                      }}
                      className="btn-secondary w-full py-3 text-sm mt-1">
                      <MdMyLocation size={16}/> Auto-detect My Location
                    </button>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-4 text-sm">
                      <IoArrowBack size={15}/> Back
                    </button>
                    <button onClick={() => {
  if (validateDelivery()) {
    setStep(3);
  }
}}
                      className="btn-primary flex-[2] py-4 text-sm">
                      <span className="relative z-10">Continue to Payment</span>
                      <IoArrowForward size={15} className="relative z-10"/>
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 3 — PAYMENT ═══ */}
              {step === 3 && (
                <div className="step-panel space-y-5">
                  <div>
                    <h2 className="cart-serif text-2xl font-bold text-indigo-900 mb-1">Payment</h2>
                    <p className="text-slate-400 text-sm">Choose how you'd like to pay</p>
                  </div>

                  {/* recap */}
                  <div className="cart-card p-5">
                    <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">Order Recap</p>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-700">{cartItem.length} item{cartItem.length!==1?"s":""}</p>
                        <p className="text-xs text-slate-400">📧 {address.email}</p>
                        <p className="text-xs text-slate-400">📍 {address.street}, {address.state}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400">Total</p>
                        <p className="flex items-center text-xl font-extrabold text-indigo-600">
                          <FaRupeeSign size={13}/>{totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* payment options */}
                  <div className="space-y-3">
                    <button className={`pay-option w-full ${paymentType==="razorpay"?"selected":""}`}
                      onClick={() => setPaymentType("razorpay")}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <FaCreditCard className="text-indigo-600" size={16}/>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">Pay Online</p>
                          <div className="flex gap-1.5 mt-1">
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold border border-green-200">Secure</span>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold border border-blue-200">Instant</span>
                            <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold border border-purple-200">UPI · Cards</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${paymentType==="razorpay"?"border-indigo-500":"border-slate-300"}`}>
                        {paymentType==="razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"/>}
                      </div>
                    </button>

                    <button className={`pay-option w-full ${paymentType==="cod"?"selected":""}`}
                      onClick={() => setPaymentType("cod")}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                          <FaWallet className="text-amber-500" size={16}/>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">Cash on Delivery</p>
                          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Pay when it arrives · 3–5 days</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${paymentType==="cod"?"border-amber-500":"border-slate-300"}`}>
                        {paymentType==="cod" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500"/>}
                      </div>
                    </button>
                  </div>

                  {/* inline instructions */}
                  {paymentType && (
                    <div className={`rounded-2xl p-4 border ${paymentType==="razorpay"?"bg-indigo-50 border-indigo-200 text-indigo-700":"bg-amber-50 border-amber-200 text-amber-700"}`}>
                      <p className="font-bold text-xs uppercase tracking-wider mb-2.5">
                        {paymentType==="razorpay" ? "🔐 Razorpay — Secure Checkout" : "💵 Cash on Delivery — What to expect"}
                      </p>
                      <div className="space-y-1.5">
                        {(paymentType==="razorpay"
                          ? ["Select UPI / Card / Netbanking","Complete payment in Razorpay popup","Do not close the payment window","Confirmation sent to " + address.email]
                          : ["Pay when your order arrives","Delivery in 3–5 business days","Keep exact change ready","Order confirmation sent to " + address.email]
                        ).map(t => (
                          <div key={t} className="flex items-center gap-2 text-xs">
                            <FaCheckCircle className={`flex-shrink-0 ${paymentType==="razorpay"?"text-indigo-500":"text-amber-500"}`} size={11}/>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-center text-xs text-slate-400">🔒 Secure payments powered by Razorpay</p>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-4 text-sm">
                      <IoArrowBack size={15}/> Back
                    </button>
                    <button
                      onClick={() => {
                        if (!paymentType) { toast.warning("Please select a payment method"); return; }
                        paymentType==="razorpay" ? onInstrOpen() : onCodConfirmOpen();
                      }}
                      disabled={!paymentType}
                      className="btn-primary flex-[2] py-4 text-sm">
                      <span className="relative z-10">{paymentType==="cod" ? "Confirm Order" : "Proceed to Pay"}</span>
                      <IoArrowForward size={15} className="relative z-10"/>
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
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-2xl"/>
              <ModalHeader className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100">
                <MdPayments className="text-indigo-600" size={18}/> Payment Instructions
              </ModalHeader>
              <ModalBody className="py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={razorpayLogo} className="w-10 h-10 rounded-xl border"/>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Razorpay Payment</p>
                    <p className="text-xs text-slate-400">UPI · Cards · Netbanking · Wallets</p>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-2">
                  {["Select UPI / Card / Netbanking","Complete payment in Razorpay popup","Do not close the payment window","Confirmation sent to " + address.email].map(t=>(
                    <div key={t} className="flex gap-2 text-xs text-indigo-700"><FaCheckCircle className="text-indigo-500 mt-0.5 flex-shrink-0"/>{t}</div>
                  ))}
                </div>
                <div className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl">🔒 256-bit SSL encrypted · Powered by Razorpay</div>
              </ModalBody>
              <ModalFooter className="gap-2 border-t border-slate-100">
                <Button variant="light" onPress={onInstrClose} className="text-slate-500 text-sm">Cancel</Button>
                <Button onPress={() => { onInstrClose(); handleRazorpayPayment(); }}
                  className="text-white font-bold rounded-xl text-sm px-6"
                  style={{ background:"linear-gradient(135deg,#4f46e5,#2563eb)" }}>
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
              <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-2xl"/>
              <ModalHeader className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100">
                <FaWallet className="text-amber-500"/> Confirm COD Order
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