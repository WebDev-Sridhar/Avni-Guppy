// src/contexts/OrderContext.js
import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [finalFormData, setFinalFormData] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  return (
    <OrderContext.Provider value={{
      finalFormData,
      setFinalFormData,
      cartProducts,
      setCartProducts,
      totalAmount,
      setTotalAmount,
      subTotal,
      setSubTotal,
    }}>
      {children}
    </OrderContext.Provider>
  );
};
export default OrderProvider;
