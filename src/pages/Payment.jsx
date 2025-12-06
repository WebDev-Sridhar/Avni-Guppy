// src/pages/Payment.jsx
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UPIQR from "/images/QR-code.jpg"; 
import gpayLogo from "/images/gpay.png";
import phonepeLogo from "/images/paytm.png";
import paytmLogo from "/images/phonepay.png";
import {FaWhatsapp  } from 'react-icons/fa';
import { useOrder } from "../contexts/OrderContext";

function Payment() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const[showApps, setShowApps] = useState(false)
  const [transectionId, setTransectionId] = useState("")
  const totalAmount = getTotal();
  const upiId = "srivj5456@oksbi"; // Replace with your real UPI ID
  const { user } = useAuth();
  const {finalFormData, setFinalFormData, subTotal} = useOrder(); 


useEffect(() => {
  const savedAddress = localStorage.getItem("checkoutAddress");

  if (savedAddress && !finalFormData) {
    setFinalFormData(JSON.parse(savedAddress));
  }

}, []);

  const handlePlaceOrder = async () => {
  // if (!user) {
  //   toast.error("You must be logged in to place an order.");
  //   return;
  // }
    if (!finalFormData) {
    toast.error("Address information is missing. Go back and select an address");
    return;
  }

  if (!transectionId) {
    toast.error("Enter Your Transaction ID");
    return;
  }

  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      userId: user?.uid || `+91${finalFormData.phone}`, // Use phone number if user is not logged in
      name: finalFormData.name,
      email: finalFormData.email,
      phone: finalFormData.phone,
      ...finalFormData, // address fields
      products: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty
      })),
      amount: totalAmount,
      paymentId: 'UPI', // Example payment ID
      status: "Pending",
      createdAt: serverTimestamp(),
      upiTxnId: transectionId,

    });

    toast.success("Order placed successfully!");
    clearCart();
    localStorage.removeItem("checkoutAddress");
    navigate("/success");
  } catch (error) {
    console.error("Error placing order:", error);
    toast.error("Failed to place order. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-white-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Payment</h1>
  

      {/* Product Summary */}
      <div className="bg-white rounded p-4 shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Your Order</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between  py-2">
            <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded" />
            <div className="flex-1 ml-4">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              <p className="text-sm text-green-700">₹{item.price} each</p>
            </div>
            <p className="font-semibold">₹{item.qty * item.price}</p>
          </div>
        ))}
        <div className="pt-4 text-right font-bold text-lg">Total: ₹{totalAmount}</div>
        <p className="text-sm text-gray-500 text-right">{subTotal >= 499 ? "Shipping Free" : "Includes ₹80 shipping"}</p>
      </div>

      {/* QR Section */}
      <div className="bg-white rounded p-4 shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Scan & Pay via UPI</h2>
        <div className="flex flex-col items-center space-y-4">
          <img src={UPIQR} alt="UPI QR Code" className="w-48 h-48" />
          <p className="font-medium">or pay to UPI ID: <span className="text-blue-600">{upiId}</span></p>

          <div className="mt-4">
            <button
              onClick={() => setShowApps(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 button1"
            >
              Pay Via UPI
            </button>
          </div>
          
          {showApps && (
            <div>
                        <p className="text-sm text-gray-600 mt-2 text-center">
  UPI payments work best on mobile apps. Scan the QR code if you're using a desktop.
</p>
                <div className="flex justify-center gap-4 mt-4">
                   
                
            <a href={`upi://pay?pa=${upiId}&pn=Avni%20Guppy%20Home&am=${totalAmount}&cu=INR`} target="_blank" rel="noreferrer">
              <img src={gpayLogo} alt="GPay" className="w-12 h-12 object-contain" />
            </a>
            <a href={`upi://pay?pa=${upiId}&pn=Avni%20Guppy%20Home&am=${totalAmount}&cu=INR`} target="_blank" rel="noreferrer">
              <img src={phonepeLogo} alt="PhonePe" className="w-12 h-12 object-contain" />
            </a>
            <a href={`upi://pay?pa=${upiId}&pn=Avni%20Guppy%20Home&am=${totalAmount}&cu=INR`} target="_blank" rel="noreferrer">
              <img src={paytmLogo} alt="Paytm" className="w-12 h-12 object-contain" />
            </a>
            </div>
            </div>
          
          
          )}

      

          {/* UPI ID & Screenshot */}
          <div className="w-full mt-4">
            <label className="block text-sm font-medium mb-1">Your Transaction ID*</label>
            <input
              type="text"
              placeholder="Enter your Transaction ID"
              className="w-full border-b px-3 py-2 outline-gray-400"
              required
              onChange={(e) => setTransectionId(e.target.value)}
            />
            <p className="text-sm mdtext-md text-gray-800 mt-2  ">
              You can also send the screenshot to our WhatsApp:  <a href="https://wa.me/917904224746" target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-400  text-2xl">
                           <span className="text-sm border-b">Click Here</span> <FaWhatsapp className="inline" /> 
                          </a> (Makes Order Confirmation Faster)
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow p-4 flex justify-between items-center">
        <p className="text-lg font-bold">Total: ₹{totalAmount }</p>
        <button
         onClick={handlePlaceOrder}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Payment;