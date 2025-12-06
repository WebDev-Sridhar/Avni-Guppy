import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // for hamburger & close icons
import CartIcon from './CartIcon';

export default function Navbar() {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl  mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-semibold text-teal-700 text-lg">
          Avni Guppy <span className='bg-[#486759] rounded-sm p-2 text-white text-sm'>Home</span>
        </Link>

        {/* Hamburger icon */}
        <button
          onClick={toggleMenu}
          className="text-gray-700 md:hidden text-2xl focus:outline-none"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Links */}
 <div
  className={`flex-col md:flex md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 font-semibold absolute md:static bg-white left-3.5/4 right-0   px-4 pb-2 md:px-0 rounded-lg 
  ${isOpen ? 'top-14 flex  ' : 'hidden'} md:flex items-end text-right`}
>
  <Link to="/shop" className="text-gray-700 hover:text-teal-700">Shop</Link>
  <Link to="/category" className="text-gray-700 hover:text-teal-700">Categories</Link>
  <Link to="/account" className="text-gray-700 hover:text-teal-700">Account</Link>
  {role === 'admin' && (
    <Link to="/admin" className="text-gray-700 hover:text-teal-700">Admin</Link>
  )}
  <CartIcon />
</div>
      </div>
    </nav>
  );
}
