import React from "react";
import {FaCreditCard,FaPlus,FaShieldAlt} from "react-icons/fa";
import {AccountShell} from "./AccountShell";
export default function PaymentMethodsPage(){
 return <AccountShell title="Payment methods" right={<button className="ok-icon-btn"><FaPlus/></button>}><div style={{marginTop:20}}><div className="ok-card" style={{padding:20,background:"linear-gradient(135deg,#312e81,#4f46e5)",color:"#fff"}}><FaCreditCard size={22}/><div style={{marginTop:30,fontSize:20,letterSpacing:".08em"}}>•••• •••• •••• 4242</div><div className="ok-row" style={{marginTop:18}}><span className="ok-grow">Saved payment method</span><span>Card</span></div></div><div className="ok-card" style={{padding:18,marginTop:14}}><div className="ok-row"><div className="ok-circle"><FaShieldAlt/></div><div><b>Secure payments</b><div className="ok-small">Payment details are handled securely by the payment provider.</div></div></div></div><button className="ok-btn ok-secondary ok-full" style={{marginTop:16}}><FaPlus/> Add payment method</button></div></AccountShell>
}
