// import { useState } from 'react';
// import { loadScript } from '../utils/loadRazorpay';
// import { db } from '../utils/firebase';
// import { collection, addDoc, Timestamp } from 'firebase/firestore';

// export default function Checkout() {
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     phone: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handlePayment = async () => {
//     const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

//     if (!res) {
//       alert('Razorpay SDK failed to load. Are you online?');
//       return;
//     }

//     const options = {
//       key: 'YOUR_RAZORPAY_KEY',
//       currency: 'INR',
//       amount: 49900,
//       name: 'GuppyStore',
//       description: 'Thank you for shopping with us',
//       handler: async function (response) {
//         await addDoc(collection(db, 'orders'), {
//           ...formData,
//           amount: 499,
//           paymentId: response.razorpay_payment_id,
//           status: 'Paid',
//           createdAt: Timestamp.now(),
//         });
//         localStorage.setItem('lastOrderId', orderRef.id);
//         window.location.href = '/order-success';
//       },
//       prefill: {
//         name: formData.name,
//         contact: formData.phone,
//       },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
//   };

//   return (
//     <div className="max-w-xl mx-auto px-4 py-10">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>
//       <form className="space-y-6" onSubmit={(e) => e.preventDefault() || handlePayment()}>
//         <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border rounded-md px-4 py-2" required/>
//         <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full border rounded-md px-4 py-2" required/>
//         <input name="phone" type="text" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border rounded-md px-4 py-2" required/>
//         <button type="submit"className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md font-semibold">
//           Pay ₹499
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useContext } from 'react';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc} from 'firebase/firestore';

export default function Checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const [formData, setFormData] = useState({
    name: '',
    doorNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',

  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    try {
      await addDoc(collection(db, 'orders'), {
        ...formData,
        products: cart.map(item => `${item.title} - ${item.qty}`),
        amount: totalAmount,
        paymentId: 'CashOnDelivery',
        status: 'COD - Pending',
        createdAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, 'carts', userId)); // remove from Firestore
      localStorage.removeItem('cart');           // remove from localStorage
      setCart([]);                               // reset state
      window.location.href = '/success';
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>
      <form className="space-y-6">
        <label>Name</label>
        <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border rounded-md px-4 py-2" />
        <div className="space-y-2 grid grid-cols-2 gap-2" > 
          <label>Address</label>
        <input name='doorNumber' type="text" placeholder='door-no' value={formData.doorNumber} onChange={handleChange} className="w-full border rounded-md px-4 py-2 col-span-2" />
        <input name="street" type="text" placeholder="street/area" value={formData.street} onChange={handleChange} className="w-full border rounded-md px-4 py-2" />
        <input name="city" type="text" placeholder="city/town/village" value={formData.city} onChange={handleChange} className="w-full border rounded-md px-4 py-2" />
        <input name="state" type="text" placeholder="state" value={formData.state} onChange={handleChange} className="w-full border rounded-md px-4 py-2" />
        <input name="pincode" type="number" placeholder="pincode" value={formData.pincode} onChange={handleChange} className="w-full h-max border rounded-md px-4 py-2" />
        </div>
        
        <label>Phone Number</label>
        <input name="phone" type="text" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border rounded-md px-4 py-2" />
        <label>Email (optional)</label>
        <input name="email" type="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} className="w-full border rounded-md px-4 py-2" />
        <button type="button" onClick={handleOrder} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md font-semibold">
          Place Order (Cash on Delivery)
        </button>
      </form>
    </div>
  );
}