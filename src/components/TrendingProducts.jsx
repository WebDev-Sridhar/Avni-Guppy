// components/TrendingProducts.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Link } from 'react-router-dom';

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      const q = query(collection(db, 'products'), where('category', 'in', ['guppy', 'live fish', 'fish food']));
      const querySnapshot = await getDocs(q);
      const randomProducts = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort(() => 0.5 - Math.random()) // Unordered
        .slice(0, 10);
      setProducts(randomProducts);
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="py-8">
                     <div className='grid grid-col-1 md:grid-cols-2 gap-8  my-10'>
           <div className="flex items-center justify-center md:mt-20 ">
         <Link to={"/category/guppy"}> <img
            src="/images/banner3.png"
            alt="Promotional Banner"
            className="rounded-2xl w-full h-auto object-cover"
          /></Link>
        </div>
            <div className="flex items-baseline-last md:mb-20 justify-center  rounded-md">
        <Link to={"/shop"}>  <img
            src="/images/banner2.png"
            alt="Promotional Banner"
            className="rounded-2xl w-full h-auto object-cover"
          /></Link>
        </div>
    

        
      </div>

          
      <h2 className="text-2xl font-bold mb-4 px-4 text-center">🔥 Trending Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4 ">
        {products.map(product => {
          const discount = Math.round(((product.originalprice - product.price) / product.originalprice) * 100);
          return (
         <Link to={`/shop/${product.id}`} key={product.id} className="block text-center ">
                <div className="relative ">
                  {discount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                      {discount}% OFF
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-800">{product.title}</h3>
                <p className="text-sm mt-1">
                  <span className="text-gray-500 line-through mr-2">₹{product.originalprice}</span>
                  <span className="text-black font-semibold">₹{product.price}</span>
                </p>
              </Link>
          );
        })}
      </div>
 <div className="flex items-center justify-between w-full h-20  bg-[#d5f0e6] rounded-md mt-10 px-4 md:px-10">
  <h2 className='text-lg md:text-3xl font-bold text-green-800'>Explore the New Arrivals</h2>
<Link to={"/guppy"}>  <button className='font-semibold border-2 border-green-800 text-green-800 px-4 py-2 rounded-md hover:text-green-600 cursor-pointer'>Check Now</button>
</Link>    
        </div>
    </div>
  );
}
