import React, { useState } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log("Recaptcha verified", response);
      },
    });
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
      await confirmationResult.confirm(otp);
      alert('Phone Verified Successfully!');
      // Redirect to homepage or save login status
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
