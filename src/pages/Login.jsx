import React, { useState } from 'react';
import { auth } from '../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const mergeGuestCart = async (userId) => {
    const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
    const userCartRef = doc(db, 'carts', userId);
    const userSnap = await getDoc(userCartRef);

    let merged = guestCart;

    if (userSnap.exists()) {
      const existing = userSnap.data().products || [];
      const productMap = {};

      // Merge quantities for same product IDs
      existing.forEach(item => productMap[item.id] = item);
      guestCart.forEach(item => {
        if (productMap[item.id]) {
          productMap[item.id].qty += item.qty;
        } else {
          productMap[item.id] = item;
        }
      });

      merged = Object.values(productMap);
    }

    // Save merged cart to Firestore
    await setDoc(userCartRef, { products: merged });

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(merged));
  };

const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('Recaptcha verified', response);
      },
    });
  }
};

  const handleSendOtp = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const formattedPhone = '+91' + phone;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setShowOtp(true);
      alert('OTP Sent!');
    } catch (err) {
      console.error("OTP Error:", err);
      alert(err.message);
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      alert('Phone Verified Successfully!');

      // Merge guest cart with this user's cart
      await mergeGuestCart(user.uid);

      // (Optional) Redirect or store user info
      // localStorage.setItem("uid", user.uid);
      // navigate('/');

    } catch (err) {
      console.error("OTP Verification Failed:", err);
      alert('Invalid OTP!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Login with Mobile</h2>

        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none"
        />

        {!showOtp && (
          <button
            onClick={handleSendOtp}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
          >
            Send OTP
          </button>
        )}

        {showOtp && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-4 mb-2 focus:outline-none"
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
