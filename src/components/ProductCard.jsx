import { Link } from 'react-router-dom';
import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product }) {

    const { addToCart } = useCart();


  return (
  
      <div
              key={product.id}
              className="h-90 bg-white rounded-2xl shadow hover:shadow-3xl transition overflow-hidden justify-self-stretch"
            >
                <Link to={`/shop/${product.id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="h-48 w-full object-cover rounded-2xl p-3"
                />
                   </Link>
          
              <div className="p-4">
                <h2 className="text-lg font-sans">{product.title}</h2>
                     <div className="grid grid-cols-8  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 ">
                    <p className="text-gray-600 font-light mb-3  line-through">
                  ₹{product.originalprice}
                </p>
                <p className="text-black-600 font-normol mb-3 mx-2">
                  ₹{product.price}
                </p>
                
                </div>
               
               {product.inStock > 0 ? (
                  <button
                  onClick={() => addToCart(product)}
                  className="bg-sky-600 text-white px-4 py-2 rounded  button1"
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
    
  );
}
