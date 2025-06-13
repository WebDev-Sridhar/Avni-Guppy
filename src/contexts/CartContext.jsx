import { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from '../contexts/AuthContext'; // or your actual auth context path


const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, User }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth(); // gets current logged-in user
  const userId = User?.uid || 'guest';


  const cartRef = doc(db, 'carts', userId);

  // ✅ Load from Firebase, fallback to localStorage
useEffect(() => {
  async function loadCart() {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const products = cartSnap.data().products || [];
      setCart(products);
      localStorage.setItem('cart', JSON.stringify(products));
    } else {
      // fallback to localStorage if no cloud data
      const local = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(local);
    }
  }
  loadCart();
}, [userId]);

useEffect(() => {
  const cartRef = doc(db, 'carts', userId);
  localStorage.setItem('cart', JSON.stringify(cart));

  const saveToCloud = async () => {
    await setDoc(cartRef, { products: cart });
  };
  saveToCloud();
}, [cart, userId]);

  // ✅ Save to Firestore & LocalStorage whenever cart updates
  useEffect(() => {
    if (!isLoaded) return; // prevent saving before loading
    localStorage.setItem("cart", JSON.stringify(cart));
    const save = async () => {
      try {
        await setDoc(cartRef, { products: cart });
      } catch (err) {
        console.error("Error syncing cart:", err);
      }
    };
    save();
  }, [cart, isLoaded]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        alert(`Added ${product.title} to cart!`);
        return [...prev, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart.reduce((total, item) => total + item.qty * item.price, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
