import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase"; // adjust your path

export default function Cart() {
  const { cart, removeFromCart, getTotal, clearCart } = useCart();

  return (
    <div className="p-6 max-w-2xl mx-auto cart-container">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between py-3">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                </div>
                <div>
                  <p className="text-right font-semibold text-black-600">
                    ₹{item.price * item.qty}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm "
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">Total: ₹{getTotal()}</p>
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
      {cart.length > 0 && (
        <div className="mt-6">
          <Link
            to="/checkout"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700"
          >
            <button className="text-white-500 text-sm hover:underline">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
