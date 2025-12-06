import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/firebase';
import { addDoc, collection, updateDoc, doc, getDoc, setDoc, arrayRemove, } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import { useOrder } from '../contexts/OrderContext';

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [userData, setUserData] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0); // 0 = primary
const [showAllAddresses, setShowAllAddresses] = useState(false);
const [showAddressForm, setShowAddressForm] = useState(false);
const { setFinalFormData, setCartProducts, setTotalAmount, setSubTotal } = useOrder();

  const navigate = useNavigate();

        const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (!user) return;

    user?.uid  && setShowAddressForm(false); // Reset form when user changes
    if (user?.uid) {
      const loadUserAddresses = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();
        const saved = data?.addresses || [];
        setAddresses(saved);
        setUserData(data);
            setFormData({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      street: '',   
      area: '',
      city: '',
      state: '',
      pincode: ''
    });
   if (saved.length > 0) {
  setSelectedAddress(saved[0]);
  setSelectedAddressIndex(0); // ✅ sync the index
} else {
  setShowAddressForm(true);
}
      };
      loadUserAddresses();

      
    }
    
    //  setShowAddressForm(true);
  }, [user]);


  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, phone } = formData;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
  
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
  
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
  
    if (!phoneRegex.test(phone)) {
      toast.error("Invalid phone number");
      return false;
    }
  
    return true;
  };

  const saveNewAddress = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      const current = data?.addresses || [];
      const isDuplicate = current.some(addr =>
        addr.street === formData.street &&
        addr.area === formData.area &&
        addr.city === formData.city &&
        addr.pincode === formData.pincode
      );
      
      if (isDuplicate) return toast.info("Address already exists");

      const updatedAddresses = [...current, formData];
      await updateDoc(userRef, { addresses: updatedAddresses });
      toast.success("Address saved!");
      setAddresses(updatedAddresses);
      setSelectedAddress(formData);
      setSelectedAddressIndex(updatedAddresses.length - 1); // Set to the newly added address
      setShowAllAddresses(false); // Hide all addresses after saving
      setShowAddressForm(false);
      
    }
    else{
      const newAddress = [...addresses, formData]
       setAddresses(newAddress);
       setShowAllAddresses(false)
      setSelectedAddress(formData);
      setSelectedAddressIndex(newAddress.length - 1); // Set to the newly added address
      setShowAddressForm(false);
      toast.success("Address saved!");
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


const actualTotal = cart.reduce((acc, item) => {
  if (item.inStock > 0) {
    return acc + item.originalprice * item.qty;

  }
  return acc;
}, 0);

// Total you're charging user now
const currentTotal = () => {
  return cart.reduce((acc, item) => {
    if (item.inStock > 0) {
      return acc + item.price * item.qty;
    }
    return acc;
  }, 0);
};

const finalTotal = getTotal()
// Discount
const discount =  actualTotal - currentTotal();

  const deliveryDate = format(addDays(new Date(), 2), 'MMMM dd');

  const handleContinue = () => {
    if (!selectedAddress) return toast.error("Please select or enter address");
      setFinalFormData(selectedAddress);
      localStorage.setItem("checkoutAddress", JSON.stringify(selectedAddress));
  setCartProducts(cart);      
  setTotalAmount(finalTotal); 
  setSubTotal(currentTotal());;   

    navigate('/cart/checkout/payment');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ✅ Saved Address Section */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold">Delivery Address</h2>
  {/* Show primary address (first one) by default */}
{addresses.length > 0 && !showAllAddresses && (
  <div className="flex justify-between items-start border border-gray-300 p-3 rounded mb-3 relative">
    <label className="flex items-center justify-between gap-2 cursor-pointer w-full">
      <div>
        <p className="font-medium">{addresses[selectedAddressIndex]?.name}</p>
        <p>{addresses[selectedAddressIndex]?.street}</p>
        <p> {addresses[selectedAddressIndex]?.area}, {addresses[selectedAddressIndex]?.city},{addresses[selectedAddressIndex]?.state} - {addresses[selectedAddressIndex]?.pincode}</p>
      </div>
      <input
        type="checkbox"
        checked={true}
        onChange={() => {}}
        className="ml-2"
      />
    </label>
{ addresses.length > 1 && (
     <button
      className="text-blue-600 hover:underline absolute right-2 top-1"
      onClick={() => setShowAllAddresses(true)}
    >
      Change
    </button>
)}
</div>
  
)}

 
<div>
  {/* Show all saved addresses */}
  {showAllAddresses && addresses.map((addr, index) => (
    
  <div key={index} className="flex items-start border border-gray-300 p-3 rounded mb-2 justify-between">
    <label className="flex items-center gap-2 cursor-pointer w-full">
      <input
        type="radio"
        name="selectedAddress"
        checked={selectedAddressIndex === index}
        onChange={() => {
          setSelectedAddressIndex(index);
           setSelectedAddress(addr);
          setShowAllAddresses(false); // Hide all, show only selected
        }}
      />
     
      <div>
        <p className="font-medium">{addr.name}</p>
        <p>{addr.street}</p>
        <p>{addr.area}, {addr.city}, {addr.state} - {addr.pincode}</p>
      </div>
    </label>
     <button
                  onClick={() => handleDeleteAddress(addr)}
                  className=" right-2 text-red-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
    
  </div>))}
 {showAllAddresses && (<button className="px-3 py-0.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-200" onClick={()=> setShowAllAddresses(false)}>Close</button>)}
  </div>




   {!showAddressForm && (
          <button onClick={() => setShowAddressForm(true)} className="text-blue-700 hover:underline">+ Add Address</button>
        )}

        {showAddressForm && (
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h2>Add New Address</h2>
           {!user && ( <div className='space-y-2'><input name="name" onChange={handleInput} placeholder="Name" className="w-full border border-gray-400 p-2 rounded" />
            <input name="email" onChange={handleInput} placeholder="Email" className="w-full border border-gray-400 p-2 rounded" />
            <input name="phone" onChange={handleInput} placeholder="Phone" className="w-full border border-gray-400 p-2 rounded" />
           </div>)}
           <input name="street" onChange={handleInput} placeholder="D/No,Street/Area" className="w-full border border-gray-400 p-2 rounded" />
            <input name="area" onChange={handleInput} placeholder="City/Town/Village" className="w-full border border-gray-400 p-2 rounded" />
            <input name="city" onChange={handleInput} placeholder="District" className="w-full border border-gray-400 p-2 rounded" />
            {/* <input name="district" onChange={handleInput} placeholder="District" className="w-full border border-gray-400 p-2 rounded" /> */}
            <input name="state" onChange={handleInput} placeholder="State" className="w-full border border-gray-400 p-2 rounded" />
            <input name="pincode" onChange={handleInput} placeholder="Pincode" className="w-full border border-gray-400 p-2 rounded" />
            <div className="flex gap-3 mt-2">
                  <button onClick={saveNewAddress} className="button1 px-4 py-2 rounded">Save Address</button>
                <button
          onClick={() => {
           setShowAddressForm(false) // fallback to primary
          }}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </button>
            </div>
        
          </div>
        )}

        {/* ✅ Product List */}
        <h2 className="text-xl font-bold mt-6">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between  p-4 rounded bg-white shadow">
            <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded" />
            <div className="flex-1 ml-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
             
              <p className="text-sm text-gray-700">
                 <span className="line-through text-gray-400 mr-2">₹{item.originalprice}</span>₹{item.price}
              </p>
               <p className="text-sm text-green-600">Delivery by {deliveryDate}</p>
            </div>
          </div>
        ))}
        </div>

      {/* ✅ Price Summary */}
      <div className="bg-white p-4 shadow rounded space-y-3 h-fit">
        <div className="flex flex-col-reverse ">
           <div className="bg-white rounded shadow-md p-4 w-full max-w-md">
  <h2 className="font-semibold text-xl mb-4 border-b pb-2">Price Details </h2>
  
  <table className="w-full text-md">
    <tbody>
      <tr className="">
        <td className="py-2 text-gray-700">Price ({cart.length} items):</td>
        <td className="py-2 text-right text-gray-700">₹{actualTotal}</td>
      </tr>
      <tr className="">
        <td className="py-2 text-gray-700">Discount:</td>
        <td className="py-2 text-right text-green-600">− ₹{discount}</td>
      </tr>
      <tr className="">
        <td className="py-2 text-gray-700 ">Shipping Charge:</td>
        <td className="py-2 text-right text-gray-700">{currentTotal() > 499 ? <p className="text-sm text-gray-700">Free Shipping</p>: "₹40"}</td>
      </tr>
      
      <tr className="font-semibold text-black text-base">
        <td className="py-2">Total Amount:</td>
        <td className="py-2 text-right">₹{finalTotal}</td>
      </tr>
    </tbody>
  </table>
  <p className=" text-xs space tracking-wide  text-gray-600 block">{currentTotal() > 499 ? " Your order is eligible for free shipping": "Free Shipping for orders above ₹499"} </p>
  <p className="text-green-600 text-md mt-3">You save ₹{discount} on this order</p>
</div>
        </div>

        {/* ✅ Footer CTA */}
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2 button1"
        >
          Continue
        </button>
      </div>
    </div>
    
  );
}
