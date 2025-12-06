import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from './contexts/AuthContext';
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./components/Spinner";
import ScrollToTop from "./components/ScrollTop";

// ✅ Lazy load all major pages
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/ShopPage"));
const Cart = lazy(() => import("./pages/Cart"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const GuppyFish = lazy(() => import("./pages/GuppyFish"));
const LiveFish = lazy(() => import("./pages/Livefish"));
const AddProducts = lazy(() => import("./components/AddProducts"));
const UpdateProducts = lazy(() => import("./components/UpdateProducts"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Payment = lazy(() => import("./pages/Payment"));

function AdminRoute({ children }) {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role !== 'admin') return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Sidebar />
      <Breadcrumbs />
      <ToastContainer position="top-right" autoClose={3000} />

      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart/checkout" element={<Checkout />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/account/orders" element={<Orders />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact us" element={<Contact />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/:categoryName" element={<GuppyFish />} />
          <Route path="/category/:categoryName" element={<LiveFish />} />
          <Route path="/admin/add-products" element={<AddProducts />} />
          <Route path="/admin/update-product" element={<UpdateProducts />} />
          <Route path="/shop/:productId" element={<ProductDetails />} />
          <Route path="/cart/checkout/payment" element={<Payment/>}/>
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
