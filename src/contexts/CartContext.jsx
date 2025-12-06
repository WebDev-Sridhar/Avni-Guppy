import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [userId, setUserId] = useState(null);

  // 🔹 Generate/Assign Correct User ID (Guest or Logged User)
  useEffect(() => {
    if (user?.uid) {
      setUserId(user.uid);
    } else {
      let storedGuestId = localStorage.getItem('guestId');
      if (!storedGuestId) {
        storedGuestId = crypto.randomUUID();
        localStorage.setItem('guestId', storedGuestId);
      }
      setUserId(storedGuestId);
    }
  }, [user]);

  // 🔹 Load Cart Once User ID Is Ready
  useEffect(() => {
    if (!userId) return;

    const loadCart = async () => {
      try {
        const cartRef = doc(db, 'carts', userId);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          setCart(cartSnap.data().products || []);
        } else {
          const local = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
          setCart(local);
        }

        setCartLoaded(true);
      } catch (err) {
        console.error('Failed to load cart:', err.message);
      }
    };

    loadCart();
  }, [userId]);

  // 🔹 Sync Firebase + LocalStorage Only After Loading
  useEffect(() => {
    if (!cartLoaded || !userId) return;

    const saveCart = async () => {
      const cartRef = doc(db, 'carts', userId);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
      await setDoc(cartRef, { products: cart }, { merge: true });
    };

    saveCart();
  }, [cart, userId, cartLoaded]);

  // =====================================
  // 🔥 Cart Actions
  // =====================================

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      const inStock = product.inStock || 1;

      if (exists) {
        const newQty = exists.qty + (product.qty || 1);

        if (newQty > inStock) {
          toast.error(`Only ${inStock} in stock`);
          return prev;
        }

        toast.success(`${product.title} quantity updated`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: newQty } : item
        );
      }

      toast.success(`${product.title} added to cart`);
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(`cart_${userId}`);
  };

  const updateCartItemQuantity = (productId, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const getTotal = () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    return subtotal >= 499 ? subtotal : subtotal + 80;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
