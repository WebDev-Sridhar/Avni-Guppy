import { useState,useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';




export default function LivePlants() {
  // const [queryValue, setQuery] = useState("");
  // const { addToCart } = useCart();
  // const { categoryName } = useParams().categoryName;
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchCategoryProducts = async () => {
  //     const q = query(
  //       collection(db, 'products'),
  //       where('category', '==', categoryName)
  //     );
  //     const querySnapshot = await getDocs(q);

  //     const items = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     setProducts(items);
  //   };

  //   fetchCategoryProducts();
  // }, [categoryName]);


  // const filtered = products.filter((product) =>
  //   product.title.toLowerCase().includes(queryValue.toLowerCase())
  // );

  return (
    <div className="p-6  bg-white-50">
      {/* <h1 className="text-3xl font-bold text-center text-black-100 mb-6">
        {categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "Live Plants"}
      </h1> */}

      {/* Search Input */}
      {/* <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={queryValue}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div> */}

      {/* Products Grid */}
      {/* <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden justify-self-stretch"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                       <div className="grid grid-cols-6  md:grid-cols-3 lg:grid-cols-5">
                    <p className="text-gray-600 font-bold mb-3  line-through">
                  ₹{product.originalPrice}
                </p>
                <p className="text-black-600 font-bold mb-3">
                  ₹{product.price}
                </p>
                </div>
                 {product.flag ? (
                  <button
                  onClick={() => addToCart(product)}
                  className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 button1"
                >
                  Add to Cart
                </button>
              )
               : (
                <>
                  
                  <button
                  onClick={() => alert("This product is currently out of stock.")}
                  className="bg-gray-300 text-white px-4 py-2 rounded"
                >
                  Add to Cart
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
      </div> */}
    </div>
  );
}
