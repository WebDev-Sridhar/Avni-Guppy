// components/Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import CartIcon from './CartIcon';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
   const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top bar with toggle */}
      <div className="fixed w-full top-0 left-0 z-10 bg-white shadow-md flex justify-between items-center px-4 py-3 md:hidden">
   <div className='flex justify-between items-center  w-30'>
         <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <XMarkIcon className="h-8 w-8 text-gray-700" />
            
          ) : (
            <Bars3Icon className="h-8 w-8 text-gray-700" />
          )}
        </button>
        <CartIcon/>
        <Link to={"/account"}><i className="ri-user-line text-[22px]"></i></Link>
   </div>
           <Link to="/" className="font-semibold text-teal-700 text-lg ">
          <img 
  src="/images/logo.png" 
  alt="Avni Guppy Home Logo" 
  className="h-15 w-auto" 
/>
        </Link>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64  bg-white shadow-md z-40 transform transition-transform duration-300 ease-in-out  ${
          isOpen ? 'translate-x-0 ' : '-translate-x-full '
        } md:translate-x-0  md:h-auto  md:flex md:flex-row md:justify-between md:items-center md:px-10 md:w-full`}
      >
         <div className='hidden md:flex'>
        <Link to="/" className="font-semibold text-teal-700 text-lg ">
                  <img 
  src="/images/logo.png" 
  alt="Avni Guppy Home Logo" 
  className="h-20 w-auto" 
/>
        </Link>
        </div>

        <div className='flex flex-col justify-between h-full'>
          <div className="p-5 flex flex-col gap-4 md:flex-row">
            {isOpen && (<div className='border-b border-b-gray-300 pb-1'><h3 className='text-green-800'>Avni Guppy Home</h3><small>Explore & Shop</small></div>)}
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-green-800">Home</Link>
          <Link to="/shop" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-green-800">Shop</Link>
          <Link to="/category" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-green-800">Categories</Link>
          <Link to="/account" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-green-800">Account</Link>
          {role === 'admin' && (
          <Link to="/admin" onClick={() => setIsOpen(false)} className="text-gray-800 hover:text-green-800">Admin</Link>
          )}
          <CartIcon  />
          
        </div>
           <div className="flex flex-col h-full justify-end py-2 mx-2 md:hidden">
              
              {/* Branding */}
              <div className=''>
                <h2 className="text-md font-medium mb-1">Avni Guppy Home</h2>
                <p className="text-xs leading-relaxed text-gray-600">
                  Discover top-quality guppies, aquascaping tanks, and aquarium accessories at Avni Guppy Home.
                </p>
                <div className="flex mt-4 space-x-4 font-extralight text-sm">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
                    <FaFacebookF />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400">
                    <FaInstagram />
                  </a>
                  <a href="https://wa.me/916380614150" target="_blank" rel="noreferrer" className="hover:text-green-400">
                    <FaWhatsapp />
                  </a>
                  <a href="https://youtube.com/@avniguppyhome?si=xwhLRG3tuaejuimp" target="_blank" rel="noreferrer" className="hover:text-red-500">
                    <FaYoutube />
                  </a>
                </div>
              </div>
             
            </div>
      
            {/* Footer Bottom */}
            <div className=" text-center text-xs border-t py-2 border-gray-700 text-gray-400 md:hidden">
              © {new Date().getFullYear()} Avni Guppy Home. All rights reserved.
            </div>
        </div>
      </div>

      {/* Optional overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
   
    </>
  );
}
