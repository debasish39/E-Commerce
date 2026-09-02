import React,{useEffect,useState} from "react";
import {FaUser,FaMapMarkerAlt,FaShoppingBag,FaHeart,FaCreditCard,FaShieldAlt,FaBell,FaQuestionCircle,FaSignOutAlt,FaTrash,FaChevronRight,FaCheck} from "react-icons/fa";
import {AccountShell,api} from "./AccountShell";
import { MdVerified } from "react-icons/md";

const go=p=>window.location.href=p;

export default function ProfilePage(){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
 useEffect(()=>{api("/api/auth/me").then(d=>d.success&&setUser(d.user)).catch(console.error).finally(()=>setLoading(false))},[]);
 if(loading)return <AccountShell title="Account"><div className="ok-card ok-empty">Loading account...</div></AccountShell>;
 const name=[user?.firstName,user?.lastName].filter(Boolean).join(" ")||"Odikart User";
 return <AccountShell title="Account">
 <section className="ok-profile-header mt-18">
  <div className="ok-profile-image-wrap">
    <img
      className="ok-profile-image"
      src={user?.image || "https://i.pravatar.cc/200"}
      alt="Profile"
    />
  </div>

  <div className="ok-profile-info ">
    <div className="ok-profile-name-row">
      <h2>{name}</h2>

     <span
  title="Verified account"
  aria-label="Verified account"
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    borderRadius: "50%",
    // background: "#2563eb",
    color: "indigo",
    flexShrink: 0,
    // boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
  }}
>
  <MdVerified size={39} />
</span>
    </div>

    <div className="ok-muted">
      {user?.email || "No email added"}
    </div>

    <div className="ok-profile-chips">
      <span className="ok-chip">
        Odikart member
      </span>
    </div>
  </div>
</section>
  <AccountSection title="Account">
   <Tile icon={<FaUser/>} title="Personal information" sub="Name, phone number and photo" path="/account/personal-information"/>
   <Tile icon={<FaMapMarkerAlt/>} title="My addresses" sub="Manage delivery addresses" path="/account/addresses"/>
   <Tile icon={<FaShoppingBag/>} title="My orders" sub="View and track your purchases" path="/account/orders"/>
   <Tile icon={<FaHeart/>} title="Wishlist" sub="Products you saved" path="/account/wishlist"/>
  </AccountSection>
  <AccountSection title="Payments & security">
   <Tile icon={<FaCreditCard/>} title="Payment methods" sub="Manage saved payment options" path="/account/payment-methods"/>
   <Tile icon={<FaShieldAlt/>} title="Security" sub="Change your password" path="/account/security"/>
  </AccountSection>
  <AccountSection title="Preferences">
   <Tile icon={<FaBell/>} title="Notifications" sub="Manage alerts and offers" path="/account/notifications"/>
   <Tile icon={<FaQuestionCircle/>} title="Help & support" sub="Get help with Odikart" path="/account/help"/>
   <Tile icon={<FaQuestionCircle/>} title="Terms & privacy" sub="Policies and legal information" path="/account/legal"/>
  </AccountSection>
  <AccountSection title="Account actions">
   <Tile icon={<FaSignOutAlt/>} title="Sign out" sub="Sign back in anytime" onClick={()=>{localStorage.removeItem("token");go("/sign-in")}}/>
   <Tile danger icon={<FaTrash/>} title="Delete account" sub="Permanently remove your account" path="/account/delete"/>
  </AccountSection>
 </AccountShell>
}
function AccountSection({ title, children }) {
  return (
    <section className="ok-section">
      <div className="ok-label mt-9">{title}</div>

      <div className="ok-card ok-list">
        {children}
      </div>
    </section>
  );
}
function Tile({icon,title,sub,path,onClick,danger}){return <button className="ok-list-item" style={{width:"100%",textAlign:"left",border:0}} onClick={onClick||(()=>go(path))}><div className="ok-circle" style={danger?{background:"#fee2e2",color:"#b91c1c"}:{}}>{icon}</div><div className="ok-grow"><b style={{fontSize:14}}>{title}</b><div className="ok-small">{sub}</div></div><FaChevronRight size={12} color="#999"/></button>}
