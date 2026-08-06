import React from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.sp-bg{
  position:fixed;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#f8fafc;
  z-index:9999;
  font-family:'DM Sans',sans-serif;
}

.sp-container{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:18px;
}

.sp-loader{
  width:52px;
  height:52px;
  border:4px solid #e5e7eb;
  border-top:4px solid #4f46e5;
  border-radius:50%;
  animation:spin .8s linear infinite;
}

@keyframes spin{
  to{
    transform:rotate(360deg);
  }
}

.sp-title{
  font-size:18px;
  font-weight:700;
  color:#1f2937;
  margin:0;
}

.sp-text{
  font-size:14px;
  color:#6b7280;
  margin:0;
}
`;

export default function Spinner({ message = "Loading..." }) {
  return (
    <>
      <style>{CSS}</style>

      <div className="sp-bg">
        <div className="sp-container">
          <div className="sp-loader" />

          {/* <h2 className="sp-title">
            {message}
          </h2> */}

          <p className="sp-text">
            Please wait...
          </p>
        </div>
      </div>
    </>
  );
}
