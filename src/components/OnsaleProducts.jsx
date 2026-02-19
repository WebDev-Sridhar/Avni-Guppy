import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Link } from 'react-router-dom';

export default function OnSaleProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      let productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter in-stock only
      productList = productList.filter(p => p.inStock > 0);

      // Shuffle and get 15
      productList = productList.sort(() => 0.5 - Math.random()).slice(0, 15);
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  return (
    <div className="my-12 px-4 rounded-2xl py-8">
               
      <h2 className="text-2xl font-bold text-center mb-6">On Sale Products</h2>
<div className="grid grid-cols-1  gap-6">
  {/* 🐠 Left: Product Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-4">
          {products.map(product => {
            const discount = Math.round(
              ((product.originalprice - product.price) / product.originalprice) * 100
            );

            return (
              <Link
                to={`/shop/${product.id}`}
                key={product.id}
                className="flex items-center gap-4 p-2 hover:shadow-lg rounded-md relative"
              >
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br">
                  {discount}% OFF
                </div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="text-center flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{product.title}</h3>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500 line-through mr-2">₹{product.originalprice}</span>
                    <span className="text-black font-semibold">₹{product.price}</span>
                  </p>
                  {discount > 0 && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">
                      {discount}% OFF
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>


      </div>
    
    </div>
  );
}
