// src/pages/AddProducts.jsx
import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const ProductAddingScript = () => {
  const products = [];

  const handleAddProducts = async () => {
    const colRef = collection(db, 'products');

    for (let product of products) {
      try {
        await addDoc(colRef, product);
        console.log(`Added: ${product.title}`);
      } catch (err) {
        console.error(`Error adding ${product.title}:`, err);
      }
    }

    alert('All products added to Firestore!');
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Add Products to Firestore</h1>
      <button
        onClick={handleAddProducts}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Upload Products
      </button>
    </div>
  );
};

export default ProductAddingScript ;
