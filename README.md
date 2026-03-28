# 🛒 E-Commerce Web App

A modern full-stack e-commerce application built with React, Vite, Tailwind CSS, Clerk authentication, and Razorpay payments.

---

## 🚀 Features

- 🔐 Authentication with Clerk
- 🛍️ Product browsing & filtering
- 🛒 Cart & checkout system
- 💳 Razorpay payment integration
- 📦 Order management
- 🎨 Modern UI with Tailwind, MUI, and animations
- 🌍 Map integration using Leaflet
- ⚡ Fast performance with Vite
- 📱 Progressive Web App (PWA) support

---

## 🧰 Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS + DaisyUI
- Material UI (MUI)
- Framer Motion
- React Router

### Backend
- Express.js
- Axios
- CORS

### Other Tools & Libraries
- Clerk (Authentication)
- Razorpay (Payments)
- Three.js & React Three Fiber (3D UI)
- Leaflet (Maps)
- Lottie (Animations)
- jsPDF (Invoice generation)

---

## 📁 Project Structure
```text
ecommerce_web/
│
├── src/
│ ├── assets/ # Images, icons, static files
│ ├── components/ # Reusable UI components
│ ├── context/ # Global state management (React Context)
│ ├── pages/ # Page-level components (routes)
│ │
│ ├── App.jsx # Root component
│ ├── App.css # App-level styles
│ ├── index.css # Global styles
│ └── main.jsx # Entry point
│
├── public/ # Static public files
├── package.json # Project dependencies & scripts
├── vite.config.js # Vite configuration
└── README.md # Project documentation
```


---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/debasish39/E-Commerce.git
cd ecommerce_web
```
## ⚙️ Setup Instructions

### 2. Install dependencies

```bash
npm install
```
## 3. 🔐 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
VITE_CLERK_PUBLISHABLE_KEY=Enter Your
VITE_WEB3FORMS_ACCESS_KEY=Enter Your
VITE_WEB3FORMS_SUB_ACCESS_KEY=Enter Your
VITE_GEOAPIFY_API_KEY=Enter Your
VITE_RAZORPAY_KEY=Enter Your
```
### 4. Run the development server

```bash
npm run dev
```
### 5. 🌐 Application URL
```bash
http://localhost:5173
```
