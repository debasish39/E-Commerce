import React,{useEffect,useState} from "react";
import {FaCheck,FaBox,FaTruck,FaHome} from "react-icons/fa";
import {toast} from "react-toastify";
import {AccountShell} from "./AccountShell";
const steps=["Confirmed","Processing","Packed","Shipped","In Transit","Out for Delivery","Delivered"];
export default function TrackOrderPage(){
 const id=window.location.pathname.split("/").filter(Boolean).slice(-2,-1)[0], [o,setO]=useState(null);
 useEffect(()=>{fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(r=>r.json()).then(d=>setO(d.order||d.data||d)).catch(e=>toast.error(e.message))},[id]);
 if(!o)return <AccountShell title="Track order"><div className="ok-card ok-empty">Loading tracking...</div></AccountShell>;
 const current=steps.findIndex(s=>s.toLowerCase()===String(o.status||"").toLowerCase()); const idx=current<0?0:current;
 return <AccountShell title="Track order"><div style={{marginTop:20}}><div className="ok-card" style={{padding:18}}><b>Order #{o.orderNumber||o._id?.slice(-8)?.toUpperCase()}</b><div className="ok-small" style={{marginTop:4}}>Current status: {o.status||"Processing"}</div></div><div className="ok-card" style={{padding:"24px 22px",marginTop:14}}>{steps.map((s,i)=><div className="ok-row" key={s} style={{alignItems:"stretch"}}><div style={{width:38,display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:30,height:30,borderRadius:"50%",display:"grid",placeItems:"center",background:i<=idx?"#4f46e5":"#eeeef3",color:i<=idx?"#fff":"#888"}}>{i===0?<FaCheck size={11}/>:i===steps.length-1?<FaHome size={11}/>:i>=3?<FaTruck size={11}/>:<FaBox size={11}/>}</div>{i<steps.length-1&&<div style={{width:2,flex:1,minHeight:35,background:i<idx?"#4f46e5":"#e5e5ec"}}/>}</div><div style={{padding:"5px 0 25px 10px"}}><b style={{fontSize:14}}>{s}</b>{i===idx&&<div className="ok-small">Current order status</div>}</div></div>)}</div></div></AccountShell>
}
