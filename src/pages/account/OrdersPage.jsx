import React,{useEffect,useState} from "react";
import {FaShoppingBag,FaChevronRight} from "react-icons/fa";
import {toast} from "react-toastify";
import {AccountShell} from "./AccountShell";
const go=id=>window.location.href=`/account/orders/${id}`;
const statuses=["All","Processing","Shipped","Delivered","Cancelled"];
export default function OrdersPage(){
 const [orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[filter,setFilter]=useState("All");
 useEffect(()=>{fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(r=>r.json()).then(d=>setOrders(d.orders||d.data||d||[])).catch(e=>toast.error(e.message)).finally(()=>setLoading(false))},[]);
 const list=filter==="All"?orders:orders.filter(o=>String(o.status||"").toLowerCase().includes(filter.toLowerCase()));
 return <AccountShell title="My orders"><div style={{display:"flex",gap:8,overflowX:"auto",padding:"18px 0 5px"}}>{statuses.map(s=><button key={s} className={`ok-btn ${filter===s?"ok-secondary":"ok-outline"}`} onClick={()=>setFilter(s)} style={{whiteSpace:"nowrap"}}>{s}</button>)}</div>{loading?<div className="ok-card ok-empty">Loading orders...</div>:!list.length?<div className="ok-card ok-empty"><FaShoppingBag size={30}/><h3>No orders found</h3><p>Your purchases will appear here.</p></div>:<div style={{marginTop:14}}>{list.map(o=><button key={o._id} className="ok-card" style={{width:"100%",padding:17,marginBottom:12,textAlign:"left",border:"1px solid #e8e8ef",cursor:"pointer"}} onClick={()=>go(o._id)}><div className="ok-row"><div className="ok-circle"><FaShoppingBag/></div><div className="ok-grow"><b>Order #{o.orderNumber||o._id?.slice(-6)?.toUpperCase()}</b><div className="ok-small">{o.items?.length||0} item(s) • {new Date(o.createdAt||Date.now()).toLocaleDateString()}</div></div><FaChevronRight size={12}/></div><div style={{marginTop:12}}><span className={`ok-chip ${String(o.status).toLowerCase().includes("cancel")?"danger":String(o.status).toLowerCase().includes("deliver")?"success":"warn"}`}>{o.status||"Processing"}</span><b style={{float:"right"}}>₹{Number(o.totalAmount??o.total??0).toLocaleString("en-IN")}</b></div></button>)}</div>}</AccountShell>
}
