import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Logged in successfully!");
      navigate('/account');
    } catch (error) {
      toast.error("User Not Found / check your email and password");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email to reset password");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Reset link sent! Check your email.");
      setShowResetForm(false);
    } catch (err) {
      toast.error("Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        {!showResetForm ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
            <form onSubmit={handleLogin}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border border-gray-400 rounded outline-gray-600"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border border-gray-400 rounded outline-gray-600"
              />

              <div className="text-right mb-4">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowResetForm(true)}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded button1"
              >
                Login
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm">
                Don’t have an account?{' '}
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate('/signup')}
                >
                  Register
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-400 rounded outline-gray-600"
              />
              <button
                type="submit"
                className="w-full  py-2 rounded button1"
              >
                Send Reset Link
              </button>
            </form>
            <button
              className="mt-4 text-sm text-gray-600 hover:underline block text-center"
              onClick={() => setShowResetForm(false)}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
