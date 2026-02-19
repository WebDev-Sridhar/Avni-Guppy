import { useState, useEffect, } from "react";
import { useCart } from "../contexts/CartContext";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import {Link} from "react-router-dom"
import { ShoppingCartIcon } from '@heroicons/react/24/outline';



export default function ShopPage() {
  const [query, setQuery] = useState("");
  const { addToCart } = useCart();
   const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 bg-white-50 ">
      <section className=" bg-linear-to-t from-[#d5f0e6] to-#d5f0e6] py-20 text-center  bg-center bg-cover rounded-2xl mb-8">
      <h1 className="text-6xl font-bold text-center text-green-900 mb-6">
        Shop
      </h1>
      <p className="text-gray-700 mb-6 text-bold text-lg">
        Explore our wide range of guppies, aquariums, plants, and accessories!
      </p>
      </section>
      

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-8 mt-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
        {filtered.length > 0 ? (
          filtered.map((product) => (

            <div
              key={product.id}
              className="bg-white relative rounded-xl shadow hover:shadow-lg transition overflow-hidden justify-self-stretch"
            >
              <Link to={`/shop/${product.id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="h-48 w-full object-cover"
                
              /></Link>
              <div className="p-4">
                <h2 className="text-lg font-sans">{product.title}</h2>
                     <div className="grid grid-cols-8  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 ">
                    <p className="text-gray-600 font-light mb-3  line-through">
                  ₹{product.originalprice}
                </p>
                <p className="text-black-600 font-normol mb-3">
                  ₹{product.price}
                </p>
                </div>
               
               {product.inStock > 0 ? (
                  <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2 absolute bottom-2 right-2 text-#000 hover:bg-green-900 hover:text-white rounded-b-lg"
                >
                 <ShoppingCartIcon className=" h-6 w-6 " />
                </button>
              )
               : (
                <>
                  
                  <button
                  onClick={() => alert("This product is currently out of stock.")}
                  className="bg-gray-300 text-white px-4 py-2 rounded absolute bottom-2 right-2"
                >
                  <ShoppingCartIcon className=" h-6 w-6 " />
                </button>
                <p className="text-gray-700 font-light mb-3">Out of Stock</p>
                </>
                  
                )}

              
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
      
  );
}
