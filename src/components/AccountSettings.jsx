import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import { updateEmail } from "firebase/auth";
import { auth } from '../utils/firebase'; // Make sure this points to your Firebase auth export
import { toast } from "react-toastify"; // Optional but recommended for feedback

const AccountSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({});
  const [openEditProfile, setOpenEditProfile]= useState(false);
  const [openSavedAddress, setOpenSavedAddress]= useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy]= useState(false);

  // ✅ Load user profile and addresses
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        const data = snap.data();
        setFormData({
          name: data?.name || '',
          email: data?.email || '',
          phone: data?.phone || '',
        });
        setAddresses(data?.addresses || []);
      }
    };
    fetchUserData();
  }, [user]);
const handleProfileUpdate = async () => {
  if (!user?.uid) return;

  try {
    // Update Firestore profile
    await updateDoc(doc(db, 'users', user.uid), { ...formData });

    // Update Firebase Auth email if changed
    if (auth.currentUser && formData.email && formData.email !== auth.currentUser.email) {
      await updateEmail(auth.currentUser, formData.email);
    }

    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to update profile. " + error.message);
  }
};

  const handleAddAddress = async () => {
    if (user?.uid) {
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: arrayUnion(newAddress),
      });
      setAddresses([...addresses, newAddress]);
      setNewAddress({});
    }
  };

  const handleDeleteAddress = async (addressToDelete) => {
    if (user?.uid) {
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: arrayRemove(addressToDelete),
      });
      setAddresses(addresses.filter((addr) => addr !== addressToDelete));
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
      
        return (
            openEditProfile &&(
          <div className="space-y-4">
            
            <h3 className="text-lg font-semibold">Edit Profile</h3>
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border-b rounded px-3 py-2"
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full border-b rounded px-3 py-2"
            />
        
            <button
              onClick={handleProfileUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
                       <button
          onClick={() => {
           setOpenEditProfile(false) // fallback to primary
          }}
          className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </button>
          </div>
            )
         
        );
    

      case 'addresses':
        return (
            openSavedAddress && (
          <div className="space-y-4 ">
            <h3 className="text-lg font-semibold">Saved Addresses</h3>
            {addresses.map((addr, index) => (
              <div key={index} className="border p-3 rounded relative">
                <p>
                  {addr.doorNumber}, {addr.street}, {addr.city},{' '}
                  {addr.district}, {addr.state} - {addr.pincode}
                </p>
                <button
                  onClick={() => handleDeleteAddress(addr)}
                  className="absolute top-2 right-2 text-red-600" 
                >
                  Remove
                </button>
              </div>
            ))}

            <h4 className="font-semibold mt-4">Add New Address</h4>
            <div className="grid grid-cols-2 gap-2">
              {['doorNumber', 'street', 'city', 'district', 'state', 'pincode'].map(
                (field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field}
                    value={newAddress[field] || ''}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [field]: e.target.value })
                    }
                    className="border px-2 py-1 rounded"
                  />
                )
              )}
            </div>
            <button
              onClick={handleAddAddress}
              className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
            >
              Add Address
            </button>
                          <button
          onClick={() => {
           setOpenSavedAddress(false) // fallback to primary
          }}
          className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </button>
          </div>
            )
        );

      case 'privacy':
        return (
            openPrivacyPolicy && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy Center</h3>
            <p className="text-gray-600 text-sm">
              Read our privacy policy. You can choose to deactivate or permanently delete
              your account.
            </p>
            <button className="text-red-600 hover:underline ">
              Deactivate Account
            </button>
            <button className="text-red-600 hover:underline block">
              Delete Account
            </button>
          </div>
            )
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => {setActiveTab('profile'), setOpenEditProfile(true)}}
          className={`px-4 py-2 rounded 
            ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`
          }
        >
          Edit Profile
        </button>
        <button
          onClick={() => {setActiveTab('addresses'), setOpenSavedAddress(true)}}
          className={`px-4 py-2 rounded ${
            activeTab === 'addresses' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Saved Addresses
        </button>
        <button
          onClick={() => {setActiveTab('privacy'), setOpenPrivacyPolicy(true)}}
          className={`px-4 py-2 rounded ${
            activeTab === 'privacy' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Privacy Center
        </button>

      </div>

      {renderTab()}
    </div>
  );
};

export default AccountSettings;
