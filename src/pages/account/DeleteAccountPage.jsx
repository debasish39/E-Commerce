import React,{useState} from "react";
import {FaTrash,FaExclamationTriangle} from "react-icons/fa";
import {toast} from "react-toastify";
import {api} from "./AccountShell";
import {AccountShell} from "./AccountShell";
export default function DeleteAccountPage(){
 const [loading,setLoading]=useState(false);
 const del=async()=>{if(!confirm("Delete your Odikart account permanently? This cannot be undone."))return;setLoading(true);try{const d=await api("/api/auth/delete-account",{method:"DELETE"});if(!d.success)throw new Error(d.message||"Delete failed");localStorage.removeItem("token");toast.success("Account deleted");setTimeout(()=>window.location.href="/sign-in",500)}catch(e){toast.error(e.message)}finally{setLoading(false)}};
 return <AccountShell title="Delete account"><div className="ok-card" style={{padding:26,textAlign:"center",marginTop:30}}><div style={{width:64,height:64,borderRadius:"50%",background:"#fee2e2",color:"#b91c1c",display:"grid",placeItems:"center",margin:"0 auto 18px"}}><FaTrash size={22}/></div><h2 style={{fontSize:21,margin:"0 0 8px"}}>Delete your account?</h2><p className="ok-muted">This permanently removes your account and personal data. This action cannot be undone.</p><div style={{textAlign:"left",background:"#fff7ed",borderRadius:14,padding:15,margin:"20px 0",fontSize:13}}><FaExclamationTriangle/> Before deleting, make sure you don't need access to your account or active purchases.</div><button className="ok-btn ok-outline ok-full" onClick={()=>window.history.back()}>Keep my account</button><button className="ok-btn ok-danger ok-full" style={{marginTop:10}} disabled={loading} onClick={del}>{loading?"Deleting...":"Delete account permanently"}</button></div></AccountShell>
}
