// components/CartIcon.jsx
import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const { cart } = useCart();

  return (
    <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:scale-105 transition-transform duration-100">
      <ShoppingCartIcon className="h-7 w-7 sm:h-6 sm:w-6" />
      {cart.length > 0 && (
        <span className="absolute left-5 top-0 bg-[#486759] text-white text-xs px-1.5 py-0.5 rounded-full">
          {cart.length}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
