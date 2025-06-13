// src/pages/Account.jsx
import { Link } from "react-router-dom";
// src/pages/Account.jsx
import React, { useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('Logged out successfully!');
      navigate('/'); // Redirect to homepage or login
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  // Handle login redirect
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Account</h2>

        {user ? (
          <>
            <p className="text-gray-600 mb-2">Logged in as:</p>
            <p className="text-blue-700 font-medium">{user.phoneNumber}</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4">You are not logged in.</p>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

          // <Link to={"/orders"} className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          //   View Orders
          // </Link>

