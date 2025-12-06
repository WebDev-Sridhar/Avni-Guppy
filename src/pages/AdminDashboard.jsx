import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs,getDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';
import ExportOrder from '../components/ExportOrder';
import { sendOrderEmail } from '../utils/sendOrderEmail'; 

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
    const [refresh, setRefresh] = useState(false);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(data);
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();

  }, [refresh]);

const updateOrderStatus = async (id, status) => {
  try {
    const orderRef = doc(db, 'orders', id);

    // ✅ Update the status in Firestore
    await updateDoc(orderRef, { status });

    toast.success(`Order marked as ${status}`);
fetchOrders();
    // ✅ Fetch the updated order data for email
    const updatedSnap = await getDoc(orderRef);
    const updatedOrder = updatedSnap.data();

    // ✅ Trigger email if confirmed
    if (status === 'Confirmed' && updatedOrder?.email) {
      await sendOrderEmail({
        customerName: updatedOrder.name,
        customerEmail: updatedOrder.email,
        orderId: id,
        totalAmount: updatedOrder.amount,
      });
    }

    // ✅ Refresh orders
    

  } catch (err) {
    toast.error("Failed to update order");
    console.error(err);
  }
};


const filteredOrders = orders.filter(order => {
  if (activeTab === 'Received') return order.status === 'Pending';
  return order.status === activeTab;
});

  return (
   <div className="min-h-screen bg-gray-100 p-2 md:p-6">
  <h1 className="text-3xl font-bold mb-6 text-center">Admin Orders Dashboard</h1>

  <button onClick={() => setRefresh(!refresh)} className="text-xs border  hover:border-gray-300 text-gray-800 font-semibold py-1 px-2 md:py-2 md:px-4 mb-2 rounded">
    Refresh
  </button>

  <div className="flex justify-center mb-4 space-x-0.5 md:space-x-3">
    {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
      <button
        key={tab}
        className={`px-2 py-1 text-xs md:text-lg md:px-4 md:py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

  <div className="overflow-x-auto ">
    <table className="min-w-full bg-white rounded shadow-md">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-3">Customer</th>
          <th className="p-3">Phone</th>
          <th className="p-3">Address</th>
          <th className="p-3">Products</th>
          <th className="p-3">Date/Time</th>
          <th className="p-3">Amount</th>
          <th className="p-3">Txn ID</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.name}</td>
              <td className="p-3">{order.phone}</td>
              <td className="p-3">
                {order.street},{order.area}, {order.city}, {order.state} - {order.pincode}
              </td>
             <td className="p-3">
  {Array.isArray(order.products)
    ? order.products.map(p => `${p.title} - ${p.qty}`).join(', ')
    : 'No products'}
  <br />
  <span className="text-sm text-gray-500">
    Items: {Array.isArray(order.products) ? order.products.length : 0}
  </span>
</td>
              <td className="p-3">
                {order.createdAt?.toDate
                  ? new Date(order.createdAt.toDate()).toLocaleString()
                  : 'N/A'}
              </td>
              <td className="p-3">₹{order.amount}</td>
              <td className="p-3 text-sm">{order.upiTxnId || '—'}</td>
              <td className="p-3 font-semibold text-blue-700">{order.status}</td>
              <td className="p-3 space-y-2">
                {order.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                      className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 ml-1"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {order.status === 'Confirmed' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Shipped')}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Mark as Shipped
                  </button>
                )}
                {order.status === 'Shipped' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Mark as Delivered
                  </button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9" className="text-center p-6">
              No {activeTab} orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  <ExportOrder />
</div>
  );
}
