import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white-50 text-gray-700 py-10 ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        
        {/* Branding */}
        <div>
          <div className='flex flex-row justify-normal items-center '>
             <img 
  src="/images/logo.png" 
  alt="Avni Guppy Home Logo" 
  className="h-12 w-auto" 
/>
          <h2 className="text-2xl font-bold mb-3">Avni Guppy Home</h2>
          </div>
 
          <p className="text-sm leading-relaxed">
            Discover top-quality guppies, aquascaping tanks, and aquarium accessories at Avni Guppy Home.
          </p>
          <div className="flex mt-4 space-x-4">
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

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/account" className="hover:underline">My Account</Link></li>
            <li><Link to="/orders" className="hover:underline">My Orders</Link></li>
            <li><Link to="/contact us" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact</h3>
          <p className="text-sm">Email: avniguppyhomecontact@gmail.com</p>
          <p className="text-sm">Phone: +91 6380614150</p>
          <p className="text-sm">Location: Avaniyapuram, Madurai, Tamil Nadu, India</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className=" mt-4 text-center text-xs border-t border-gray-300  text-gray-500 h-5">
        <p className={"mt-6"}>© {new Date().getFullYear()} Avni Guppy Home. All rights reserved.</p>
        
      </div>
    </footer>
  );
}
