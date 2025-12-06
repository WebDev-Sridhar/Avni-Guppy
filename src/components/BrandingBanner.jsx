import React from 'react';
import logo from '/images/logo.png'; // Make sure the logo is imported correctly

export default function BrandingBanner() {
  return (
    <div className="w-full bg-white-50 py-8 px-4 md:px-12 shadow-sm mb-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Avni Guppy Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-teal-700">Avni Guppy Home</h1>
            <p className="text-sm md:text-base text-gray-600">Nurturing Fins, Creating Smiles</p>
          </div>
        </div>
        <div className="mt-2 md:mt-0">
          <p className="text-gray-700 text-sm md:text-base max-w-xl">
            Explore a world of vibrant guppies, live fish, and premium aquarium accessories, carefully bred, lovingly packed, and delivered fresh to your tank.
          </p>
        </div>
      </div>
    </div>
  );
}
