import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import RelatedProducts from '../components/RelatedProducts';
import { useCart } from "../contexts/CartContext";
import BrandingBanner from '../components/BrandingBanner';



export default function ProductDetails() {
  const  {productId}  = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [currentImage, setCurrentImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const q = query(collection(db, 'products'), where('id', '==', productId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = { id: doc.id, ...doc.data() };
        setProduct(data);
        setQty(1);
        setCurrentImage(data.sliderimages?.[0]);
}
    };

    fetchProduct();
  }, [productId]);


  

  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <div className="min-h-screen bg-white-50 text-gray-800">
      <BrandingBanner/>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-8 shadow-lg">
        {/* Image Slider */}
         <div>
          <img src={currentImage} alt={product.name} className="rounded w-full h-80 object-cover " />
          <div className="flex gap-2 mt-4">
            {product.sliderimages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className={`w-16 h-16 object-cover cursor-pointer border rounded ${currentImage === img ? 'ring-1 ring-gray-300' : ''}`}
                onClick={() => setCurrentImage(img)}
              />
            ))}
          </div>
        </div> 

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
            <div className="mb-4">
              <span className="text-gray-500 line-through mr-2">₹{product.originalprice}</span>
              <span className="text-black-600 font-semibold text-xl">₹{product.price}</span>
            </div>
            <p className={`mb-4 font-medium ${product.inStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>

            {/* Quantity & Cart */}
            <div className="flex items-center gap-4 mb-6">
              <input
                type="number"
                value={qty}
                min={1}
                max={product.inStock}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border p-2 w-20 rounded"
              />
              <button
                disabled={product.inStock <= 0}
                className={`px-6 py-2 rounded text-white font-semibold ${
                  product.inStock > 0 ? "button1" : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={() => addToCart({...product, qty})}
              >
                Add to Cart
              </button>
            </div>

            {/* Category & Info */}
             <div className="mb-2 ">
              <span className="font-semibold">Category: {product.category} </span>
              {/* {product.categories.map((cat, i) => (
                <span key={i} className="inline-block bg-gray-200 text-sm px-2 py-1 rounded mr-2">
                  {cat}
                </span>
              ))} */}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Description:</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
      </div>  
      

      {/* Related Products */}
       <div className="max-w-6xl mx-auto px-4 mt-12">
         {/* <h2 className="text-xl font-bold mb-4">Related Products</h2> */}
         {product && (
  <RelatedProducts
    category={product.category}
    currentProductId={product.id}
  />
)}
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
