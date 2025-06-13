// import { Menu, X, ShoppingCart } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   return (
//     <nav className="bg-white shadow-md px-6 py-4 fixed w-full z-50">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <div className="text-2xl font-bold text-blue-600">Guppy World</div>
//         <div className="hidden md:flex space-x-6 font-medium text-gray-700">
//                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
//         <Link to="/shop" className="text-gray-700 hover:text-blue-600">Shop</Link>
//         <Link to="/cart" className="text-gray-700 hover:text-blue-600">Cart</Link>
//         <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
//         </div>
//         <div className="flex items-center space-x-4">
//           <ShoppingCart className="w-6 h-6 text-gray-700" />
//           <button onClick={toggleMenu} className="md:hidden">
//             {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>
//       {menuOpen && (
//         <div className="md:hidden mt-2 space-y-2 text-gray-700 font-medium">
//                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
//         <Link to="/shop" className="text-gray-700 hover:text-blue-600">Shop</Link>
//         <Link to="/cart" className="text-gray-700 hover:text-blue-600">Cart</Link>
//         <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
//         </div>
//       )}
//     </nav>
//   );
// }
// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-teal-700">
          GuppyStore 
        </Link>
        <div className="space-x-4">
          <Link to="/shop" className="text-gray-700 hover:text-teal-700">Shop</Link>
          <Link to="/category" className="text-gray-700 hover:text-teal-700">Categories</Link>
          <Link to="/cart" className="text-gray-700 hover:text-teal-700">Cart</Link>
          <Link to="/account" className="text-gray-700 hover:text-teal-700">Account</Link>
        </div>
      </div>
    </nav>
  );
}
