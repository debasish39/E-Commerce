import React,{useEffect,useState} from "react";
import {FaCamera,FaCheck} from "react-icons/fa";
import {toast} from "react-toastify";
import {AccountShell,api,BACKEND_URL,authHeaders} from "./AccountShell";

export default function PersonalInfoPage(){
 const [user,setUser]=useState(null),[file,setFile]=useState(null),[preview,setPreview]=useState(""),[saving,setSaving]=useState(false);
 useEffect(()=>{api("/api/auth/me").then(d=>d.success&&setUser(d.user)).catch(e=>toast.error(e.message))},[]);
 if(!user)return <AccountShell title="Personal information"><div className="ok-card ok-empty">Loading...</div></AccountShell>;
 const save=async()=>{if(!user.firstName?.trim())return toast.error("First name is required");setSaving(true);try{const fd=new FormData();fd.append("firstName",user.firstName);fd.append("lastName",user.lastName||"");fd.append("phone",user.phone||"");if(file)fd.append("image",file);const r=await fetch(`${BACKEND_URL}/api/auth/update-profile`,{method:"PUT",headers:authHeaders(),body:fd});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.message||"Update failed");setUser(d.user);setFile(null);toast.success("Profile updated")}catch(e){toast.error(e.message)}finally{setSaving(false)}};
 return <AccountShell title="Personal information">
  <div className="ok-card" style={{padding:20,marginTop:90}}>
   <div style={{textAlign:"center",marginBottom:24}}>
    <img className="ok-avatar" src={preview||user.image||"https://i.pravatar.cc/200"} alt="Profile"/>
    <label className="ok-btn ok-secondary" style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:12,cursor:"pointer"}}><FaCamera/> Change photo<input hidden type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>5*1024*1024)return toast.error("Image must be under 5MB");setFile(f);setPreview(URL.createObjectURL(f))}}/></label>
   </div>
   <div className="ok-grid">
    <Field label="First name" value={user.firstName||""} onChange={v=>setUser({...user,firstName:v})}/>
    <Field label="Last name" value={user.lastName||""} onChange={v=>setUser({...user,lastName:v})}/>
   </div>
   <Field label="Email address" value={user.email||""} disabled/>
   <Field label="Phone number" value={user.phone||""} onChange={v=>setUser({...user,phone:v})}/>
   <button className="ok-btn ok-primary ok-full" disabled={saving} onClick={save}>{saving?"Saving...":"Save changes"}</button>
  </div>
 </AccountShell>
}
function Field({label,value,onChange,disabled}){return <div className="ok-field"><label>{label}</label><input className="ok-input" value={value} disabled={disabled} onChange={e=>onChange?.(e.target.value)}/></div>}
