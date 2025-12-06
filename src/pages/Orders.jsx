// src/pages/Orders.jsx

import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs, updateDoc, doc, serverTimestamp, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [cancelData, setCancelData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [filter, setFilter] = useState('all');

const handleFilterChange = (e) => {
  setFilter(e.target.value);
};



const { user } = useAuth(); // make sure this gives you the logged-in user
      // console.log("Current User UID:", user?.uid);

useEffect(() => {
  if (!user?.uid) return;

  const fetchOrders = async () => {
    const ordersRef = collection(db, 'orders');

  const queries = [];

  // Query by user.uid if logged in with Firebase
  if (user.uid) {
    queries.push(
      query(ordersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
    );
  }

  // Also check for orders placed with just the email as ID
  if (user.phoneNumber) {
    queries.push(
      query(ordersRef, where('userId', '==', user.phoneNumber), orderBy('createdAt', 'desc'))
    );
  }

  let allOrders = [];

  for (let q of queries) {
    const snap = await getDocs(q);
    const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allOrders = [...allOrders, ...orders];
  }
    setOrders(allOrders);
  };

  fetchOrders();
}, [user]);


  const handleCancel = async (orderId) => {
    const { reason, other } = cancelData[orderId] || {};
    const finalReason = reason === 'Other' ? other : reason;

    if (!finalReason) {
      alert('Please select a reason for cancellation.');
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Cancelled',
        cancelReason: finalReason,
        cancelledAt: serverTimestamp(),
      });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Cancelled', cancelReason: finalReason, cancelledAt: new Date() } : order));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // console.error('Error cancelling order:', error);
      alert('Failed to cancel the order.');
    }
  };

  const handleCheckboxChange = (orderId, value) => {
    setCancelData({
      ...cancelData,
      [orderId]: { ...cancelData[orderId], reason: value },
    });
  };

  const handleOtherReasonChange = (orderId, value) => {
    setCancelData({
      ...cancelData,
      [orderId]: { ...cancelData[orderId], other: value },
    });
  };

  const [showReasons, setShowReasons] = useState({});

  const toggleReasons = (orderId) => {
    setShowReasons(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };
const filteredOrders = orders
  .filter(order => {
    const seconds = order?.createdAt?.seconds;
    if (typeof seconds !== 'number') return false;
    const validFilters = ['1day', '7days', '1month', '6months', 'all'];
if (!validFilters.includes(filter)) return true;

    const now = Date.now();
    const orderTime = seconds * 1000;

    switch (filter) {
      case '1day':
        return now - orderTime <= 1 * 24 * 60 * 60 * 1000;
      case '7days':
        return now - orderTime <= 7 * 24 * 60 * 60 * 1000;
      case '1month':
        return now - orderTime <= 30 * 24 * 60 * 60 * 1000;
      case '3months':
        return now - orderTime <= 90 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  })
  .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  const isWithin24Hours = (createdAt) => {
  if (!createdAt?.toDate) return false;
  const now = new Date();
  const orderDate = createdAt.toDate(); // Convert Firestore Timestamp to JS Date
  const diffInMs = now - orderDate;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours <= 24;
};

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h2>
      <div className="mb-4">
  <label className="font-medium mr-2">Filter by:</label>
  <select value={filter} onChange={handleFilterChange} className="border px-3 py-2 rounded">
    <option value="all">All Orders</option>
    <option value="1day">24 Hours</option>
    <option value="7days">Last 7 Days</option>
    <option value="1month">Last 1 Month</option>
    <option value="3months">Last 3 Months</option>
  </select>
</div>
{filteredOrders.length === 0 ? (
  <p className="text-gray-500">No orders found for this time range.</p>
) : (
  <div className="space-y-6">
    {/* order rendering... */}
  </div>
)}

      {showSuccess && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">Order cancelled successfully.</div>}
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600  py-2">Order ID: {order.id}</h3>
              <p className="text-gray-600 py-1">Name: {order.name}</p>
              <p className="text-gray-600 py-1">Phone: {order.phone}</p>
              <p className="text-gray-600 py-1">Email: {order.email}</p>
              <p className="text-gray-600 py-1">Address: {order.street},{order.area},{order.city},{order.state},{order.pincode}</p>
              <p className="text-gray-600 font-medium py-1">Products:</p>
<ul className="text-gray-600 ml-4 list-disc">
  {order.products && order.products.map((item, index) => (
  <div key={item.id || index}>
    <p className="font-semibold">{item.title}</p>
    <p>Qty: {item.qty}</p>
    <p>Price: ₹{item.price}</p>
  </div>
))}
</ul>
              <p className="text-gray-600 font-medium py-1">Amount: ₹{order.amount}</p>
              <p className="text-gray-600 py-2">
                Status: <span className={order.status === 'Cancelled' ? 'text-red-600' : 'text-green-600'}>{order.status}</span>
                
                {order.status === 'Cancelled' && order.cancelledAt && (
                  <span className="text-sm text-gray-500 ml-2">(on {new Date(order.cancelledAt.seconds * 1000).toLocaleString()})</span>
                )}
              </p>
              <p className="text-gray-600 font-light">
  Placed on: {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
</p>
              {order.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Shipped'  && isWithin24Hours(order.createdAt) && (

                <div className="mt-4">
                  {!showReasons[order.id] ? (
                    <a onClick={() => toggleReasons(order.id)} className="text-red-600 hover:underline py-2 ">
                      Cancel Order
                    </a>
                  ) : (
                    <div className="space-y-2 mt-4">
                      <label className="block">
                        <input type="checkbox" onChange={() => handleCheckboxChange(order.id, 'Found cheaper elsewhere')} checked={cancelData[order.id]?.reason === 'Found cheaper elsewhere'} className="mr-2" />
                        Found cheaper elsewhere
                      </label>
                      <label className="block">
                        <input type="checkbox" onChange={() => handleCheckboxChange(order.id, 'Order by mistake')} checked={cancelData[order.id]?.reason === 'Order by mistake'} className="mr-2" />
                        Order by mistake
                      </label>
                      <label className="block">
                        <input type="checkbox" onChange={() => handleCheckboxChange(order.id, 'Delayed delivery')} checked={cancelData[order.id]?.reason === 'Delayed delivery'} className="mr-2" />
                        Delayed delivery
                      </label>
                      <label className="block">
                        <input type="checkbox" onChange={() => handleCheckboxChange(order.id, 'Other')} checked={cancelData[order.id]?.reason === 'Other'} className="mr-2" />
                        Other
                      </label>
                      {cancelData[order.id]?.reason === 'Other' && (
                        <textarea placeholder="Enter your reason" value={cancelData[order.id]?.other || ''} onChange={(e) => handleOtherReasonChange(order.id, e.target.value)} className="w-full border rounded px-3 py-2" />
                      )}
                      <button onClick={() => handleCancel(order.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                        Confirm Cancellation
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
