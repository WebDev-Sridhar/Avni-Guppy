import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import {

  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../utils/firebase';


export default function Cart() {
  const { cart, removeFromCart, getTotal, clearCart, updateCartItemQuantity } = useCart();
    // const inStockItems = cart.filter(item => item.flag !== false);
const deliveryDate = format(addDays(new Date(), 2), 'MMMM dd');
const [cartItems, setCartItems] = useState(cart);

useEffect(() => {
  const fetchUpdatedStock = async () => {
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        const productRef = doc(db, "products", item.id);
        const snapshot = await getDoc(productRef);

        return {
          ...item,
          latestStock: snapshot.exists() ? snapshot.data().inStock : item.inStock
        };
      })
    );

    setCartItems(updatedCart);
  };

  fetchUpdatedStock();
}, [cart]); 

// cartItems.forEach(item => console.log(item.title, item.latestStock));


// Calculate actual original total before discount
const actualTotal = cart.reduce((acc, item) => {
  if (item.inStock > 0) {
    return acc + item.originalprice * item.qty;

  }
  return acc;
}, 0);

// Total you're charging user now
const currentTotal = () => {
  return cart.reduce((acc, item) => {
    if (item.inStock > 0) {
      return acc + item.price * item.qty;
    }
    return acc;
  }, 0);
};

// Discount
const discount =  actualTotal - currentTotal();

const hasStockError = cartItems.some(item => item.latestStock !== undefined && item.qty > item.latestStock);

  return (
    <div className="p-6 max-w-full min-h-dvh m-auto bg-white-50 rounded-lg shadow-md lg:max-w-6xl">
      <h2 className="text-2xl font-bold text-green-800 mb-4 ">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-700 mb-4">Your cart is currently empty.</p>
          <Link to="/shop" className="text-white bg-green-800 hover:bg-green-950 hover:text-white px-4 py-2 rounded">
            Buy Something!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Cart Items */}
          <div className="lg:col-span-2">
            <ul className="divide-y divide-gray-200 mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="py-3">
                  <div className="flex flex-row justify-between">
                    <div className="flex gap-4">
                      <Link to={`/shop/${item.id}`}><h3 className="font-medium"></h3> <div className="w-20 h-20">
                        <img src={item.image}/>
                      </div></Link>
                      <div>
                        <Link to={`/shop/${item.id}`}><h3 className="font-medium">{item.title}</h3></Link>
                        <div className="flex flex-row gap-1.5">    
                          <p className="text-left font-md line-through text-gray-600">
                            ₹{item.originalprice}
                          </p>
                          <p className="text-left font-medium text-black-600">
                            ₹{item.price}
                          </p>
                        </div>
                        <div className="flex items-center mt-2 space-x-2 mb-2 px-4 rounded-lg w-max border border-green-900 py-2">
                          <p className="font-md text-gray-600">Quantity:</p>
                          <button
                            className=" px-2 py-0.5 rounded hover:bg-gray-200"
                            onClick={() =>
                              item.qty > 1 &&
                              updateCartItemQuantity(item.id, item.qty - 1)
                            }
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            className=" px-2 py-0.5 rounded  hover:bg-gray-200"
                            onClick={() => {
                              const stockLimit = item.latestStock ?? item.inStock;
                              if (item.qty >= stockLimit) {
                                toast.error(`Only ${stockLimit} available`);
                                return;
                              }
                              updateCartItemQuantity(item.id, item.qty + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div>
                          {item.latestStock === undefined ? (
                            <p className="text-gray-500">Checking stock...</p>
                          ) : item.latestStock > 0 ? (
                            <p className="text-green-600 text-sm">
                              In Stock ({item.latestStock})
                            </p>
                          ) : (
                            <p className="text-red-600 text-sm">Out of Stock</p>
                          )}
                          {item.latestStock > 0 && item.qty > item.latestStock && (
                            <p className="text-yellow-500 text-sm">
                              ⚠ Only {item.latestStock} left, adjust quantity
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Delivery by {deliveryDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-right font-semibold text-black-600">
                        ₹{item.price * item.qty}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm hover:cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <a
              onClick={clearCart}
              className="text-red-500 py-2 rounded hover:text-red-600 hover:underline cursor-pointer"
            >
              Clear Cart
            </a>
          </div>

          {/* Right Section - Price Details & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded shadow-md p-4 sticky top-22">
              <h2 className="font-semibold text-xl mb-4 border-b pb-2">Price Details</h2>
              <table className="w-full text-md mb-4">
                <tbody>
                  <tr className="">
                    <td className="py-2 text-gray-700">Price ({cart.length} items):</td>
                    <td className="py-2 text-right text-gray-700">₹{actualTotal}</td>
                  </tr>
                  <tr className="">
                    <td className="py-2 text-gray-700">Discount:</td>
                    <td className="py-2 text-right text-green-600">− ₹{discount}</td>
                  </tr>
                  <tr className="">
                    <td className="py-2 text-gray-700">Shipping Charge:</td>
                    <td className="py-2 text-right text-gray-700">{currentTotal() > 499 ? <p className="text-sm text-gray-700">Free Shipping</p> : "₹80"}</td>
                  </tr>
                  <tr className="font-semibold text-black text-base">
                    <td className="py-2">Total Amount:</td>
                    <td className="py-2 text-right">₹{getTotal()}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs spacing-wide text-gray-600 block mb-2">{currentTotal() > 499 ? "Your order is eligible for free shipping" : "Free Shipping for orders above ₹499"}</p>
              <p className="text-green-600 text-md mb-4">You save ₹{discount} on this order</p>
              
              {hasStockError ? (
                <>
                  <button className="bg-[#bdc2c0] text-white px-6 py-3 rounded-md font-semibold w-full cursor-not-allowed">
                    Proceed to Checkout
                  </button>
                  <p className="text-sm py-4 font-normal text-red-700">Some products are out of stock, adjust quantity or remove the item</p>
                </>
              ) : (
                <Link
                  to="/cart/checkout"
                  className="bg-[#486759] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#375b4b] block text-center"
                >
                  Proceed to Checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
