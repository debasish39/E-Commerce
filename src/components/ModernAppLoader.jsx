import React, { useState, useEffect } from "react"; 
const LOADER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}

.modern-loader-shell{
  position:fixed;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  z-index:9999;
  font-family:'Plus Jakarta Sans',sans-serif;

  background:
    radial-gradient(circle at top left,rgba(139,92,246,.28) 0%,transparent 45%),
    radial-gradient(circle at bottom right,rgba(59,130,246,.25) 0%,transparent 45%),
    linear-gradient(135deg,#faf5ff 0%,#eef2ff 35%,#dbeafe 70%,#ffffff 100%);
}

.modern-loader-shell::before,
.modern-loader-shell::after{
  content:"";
  position:absolute;
  border-radius:50%;
  filter:blur(90px);
  animation:float 10s ease-in-out infinite;
}

.modern-loader-shell::before{
  width:320px;height:320px;
  top:-120px;left:-100px;
  background:#8b5cf6;
  opacity:.15;
}

.modern-loader-shell::after{
  width:280px;height:280px;
  bottom:-90px;right:-70px;
  background:#3b82f6;
  opacity:.14;
  animation-delay:-4s;
}

@keyframes float{
  0%,100%{transform:translate(0,0);}
  50%{transform:translate(30px,-25px);}
}

.loader-content{
  position:relative;
  z-index:2;
  display:flex;
  flex-direction:column;
  align-items:center;
}

.logo-wrapper{
  position:relative;
  width:150px;
  height:150px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.logo-ring{
  position:absolute;
  inset:0;
  border-radius:50%;
  background:conic-gradient(#8b5cf6,#6366f1,#3b82f6,#8b5cf6);
  animation:spin 2.8s linear infinite;
  padding:4px;
}

.logo-ring::after{
  content:"";
  position:absolute;
  inset:4px;
  border-radius:50%;
  background:white;
}

.logo-image{
  position:relative;
  z-index:2;
  width:95px;
  height:95px;
  object-fit:contain;
  animation:bob 2.5s ease-in-out infinite;
}

@keyframes spin{
  to{transform:rotate(360deg);}
}

@keyframes bob{
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(-8px);}
}

.loader-title{
  margin-top:28px;
  font-size:34px;
  font-weight:800;
  background:linear-gradient(135deg,#8b5cf6,#4f46e5,#2563eb);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.loader-sub{
  margin-top:8px;
  color:#64748b;
  font-size:15px;
  font-weight:500;
}

.progress{
  width:240px;
  height:6px;
  margin-top:26px;
  border-radius:999px;
  background:rgba(99,102,241,.12);
  overflow:hidden;
}

.progress span{
  display:block;
  height:100%;
  width:40%;
  border-radius:999px;
  background:linear-gradient(90deg,#8b5cf6,#6366f1,#3b82f6);
  animation:load 1.8s ease-in-out infinite;
}

@keyframes load{
  0%{width:10%;}
  50%{width:85%;}
  100%{width:10%;}
}

@media(max-width:768px){
  .logo-wrapper{width:120px;height:120px;}
  .logo-image{width:76px;height:76px;}
  .loader-title{font-size:28px;}
  .progress{width:190px;}
}
`;

const MESSAGES=[
 "Preparing your shopping experience...",
 "Loading products...",
 "Almost ready..."
];

export default function ModernAppLoader(){
 const [index,setIndex]=useState(0);

 useEffect(()=>{
   const t=setInterval(()=>setIndex(i=>(i+1)%MESSAGES.length),1200);
   return ()=>clearInterval(t);
 },[]);

 return (
 <>
  <style>{LOADER_CSS}</style>
  <div className="modern-loader-shell">
    <div className="loader-content">
      <div className="logo-wrapper">
        <div className="logo-ring"></div>
        <img src="/logo.png" alt="Odikart" className="logo-image"/>
      </div>

      <h1 className="loader-title">Odikart</h1>
      <p className="loader-sub">{MESSAGES[index]}</p>

      <div className="progress">
        <span></span>
      </div>
    </div>
  </div>
 </>
 );
}
