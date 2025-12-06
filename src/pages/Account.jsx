import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import AccountSettings from '../components/AccountSettings';

export default function Account() {
  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

    const handleLogout = async () => {
    try {
      await logout();
      navigate('/account');
      window.location.reload();
      
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p>Please log in to view your account details.</p>
        <Link to={"/login"}><button className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded button1'>Login</button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-white-50  ">
      <div className="max-w-full mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">My Account</h2>

        <div className="space-y-3 text-gray-700">
          <p><span className="font-semibold">Name:</span> {userData.name || '-'}</p>
          <p><span className="font-semibold">Email:</span> {userData.email || '-'}</p>
          <p><span className="font-semibold">Phone:</span> {userData.phone || '-'}</p>
    {Array.isArray(userData.addresses) && userData.addresses.length > 0 && (
  <div className="space-y-3 text-gray-700">
    <p>
      <span className="font-semibold">Address:</span>{" "}
      {`${userData.addresses[0].street}, ${userData.addresses[0].area}  ${userData.addresses[0].city},- ${userData.addresses[0].state}`}
    </p>
    <p>
      <span className="font-semibold">Pincode:</span>{" "}
      {userData.addresses[0].pincode || '-'}
    </p>
  </div>
)}
          
        </div>

        <button
          onClick={() => navigate('/account/orders')}
          className="mt-6 w-52 bg-gray-300 hover:bg-gray-200 text-black py-2 px-4 rounded"
        >
          View My Orders
        </button>
      
      </div>
      {/* <AccountSettings/> */}
      <div className="mt-6 text-center">
        <button
          onClick={handleLogout}
          className="border border-gray-300 text-red-500 hover:text-red-600  py-2 px-4 rounded"
        >
          Logout
        </button>
        </div>
    </div>
  );
}
