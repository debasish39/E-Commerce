import React,{useEffect,useState} from "react";
import {FaHeart,FaShoppingCart} from "react-icons/fa";
import {toast} from "react-toastify";
import {AccountShell} from "./AccountShell";
export default function WishlistPage(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true);
 useEffect(()=>{fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(r=>r.json()).then(d=>setItems(d.wishlist||d.items||d.data||[])).catch(e=>toast.error(e.message)).finally(()=>setLoading(false))},[]);
 return <AccountShell title="Wishlist"><div style={{marginTop:20}}>{loading?<div className="ok-card ok-empty">Loading wishlist...</div>:!items.length?<div className="ok-card ok-empty"><FaHeart size={30}/><h3>Your wishlist is empty</h3><p>Save products you want to buy later.</p></div>:<div className="ok-grid">{items.map((p,i)=><div className="ok-card" style={{overflow:"hidden"}} key={p._id||i}><img src={p.image||p.product?.image||"https://via.placeholder.com/400"} alt="" style={{width:"100%",aspectRatio:"1/1",objectFit:"cover"}}/><div style={{padding:13}}><b style={{display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name||p.product?.name||"Product"}</b><div style={{marginTop:5,fontWeight:800}}>₹{Number(p.price||p.product?.price||0).toLocaleString("en-IN")}</div><button className="ok-btn ok-secondary ok-full" style={{marginTop:10}}><FaShoppingCart/> Add to cart</button></div></div>)}</div>}</div></AccountShell>
}
