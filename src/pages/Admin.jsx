import { Link } from "react-router-dom";
    import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebase"; 
import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";

const Admin = () => {
  const [open, setOpen] = useState(false);



const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
       newOrders: 0,
   totalOrders: 0,
  pending: 0,
  confirmed: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
});

useEffect(() => {
  const fetchStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    // Get users
    const userSnapshot = await getDocs(collection(db, "users"));
    const totalUsers = userSnapshot.size;

    // Get all orders
    const orderSnapshot = await getDocs(collection(db, "orders"));
    const orders = orderSnapshot.docs.map(doc => doc.data());

    // Count today's and old orders
    const newOrders = orders.filter(order => order.createdAt?.seconds * 1000 >= today.getTime()).length;

     const stats = {
      totalUsers,
      newOrders,
      totalOrders: orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      const status = order.status?.toLowerCase();
      if (status && stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });

    setDashboardStats(stats);
  };

  fetchStats();
}, []);

  return (
    <div>
        <section className="py-20 text-center bg-gradient-to-r from-blue-50 to-white-50  rounded-2xl bg-cover bg-center mb-8">
            <h1 className="text-6xl font-bold text-center text-green-900 mb-6">
            Admin Dashboard
            </h1>
            <p className="text-gray-700 mb-6 text-bold text-lg">
            Manage your products and orders efficiently
            </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className="bg-white p-4 rounded shadow text-center">
    <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
    <p className="text-2xl font-bold text-blue-700">{dashboardStats.totalUsers}</p>
  </div>
  <div className="bg-white p-4 rounded shadow text-center">
    <h3 className="text-lg font-semibold text-gray-700">New Orders</h3>
    <p className="text-2xl font-bold text-green-600">{dashboardStats.newOrders}</p>
  </div>
<div className="bg-white p-4 rounded shadow text-center cursor-pointer"onClick={()=> {open ? setOpen(false) : setOpen(true)}}>
  <h3 className="text-lg font-semibold text-gray-700" >Total Orders</h3>
  <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalOrders}</p>

{open && (  <div className="mt-3 space-y-1 text-sm text-gray-600">
    <p className="text-lg">Pending: <span className=" font-semibold text-yellow-600">{dashboardStats.pending}</span></p>
    <p className="text-lg">Confirmed: <span className="font-semibold text-green-600">{dashboardStats.confirmed}</span></p>
    <p className="text-lg">Shipped: <span className="font-semibold text-indigo-600">{dashboardStats.shipped}</span></p>
    <p className="text-lg">Delivered: <span className="font-semibold text-emerald-600">{dashboardStats.delivered}</span></p>
    <p className="text-lg">Cancelled: <span className="font-semibold text-red-600">{dashboardStats.cancelled}</span></p>
  </div>
  )}
</div>

</div>

             <div className="max-w-4xl mx-auto px-4 py-6 bg-gradient-to-r from-blue-50 to-white-50 rounded-lg shadow-md my-5">
            <h2 className="text-3xl font-semibold mb-6 m-auto">Admin Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link to="/admin/add-products" className="bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-700 transition ">
                Add Products
            </Link>
            <Link to="/admin/update-product" className="bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-700 transition">
                Update Products
            </Link>
            </div>
        </div>
        <AdminDashboard/>
    
   
    </div>
  )
}

export default Admin