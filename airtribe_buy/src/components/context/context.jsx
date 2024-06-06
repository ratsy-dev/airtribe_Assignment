import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../../firebase";

const Context = createContext();

export const useData = () => useContext(Context);

export const DataProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(
    parseInt(localStorage.getItem("wishlistCount"), 10) || 0
  );
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem("cartCount"), 10) || 0
  );

  useEffect(() => {
    const fetchUserDocs = async () => {};
    fetchUserDocs();
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlistCount", wishlistCount);
  }, [wishlistCount]);

  useEffect(() => {
    localStorage.setItem("cartCount", cartCount);
  }, [cartCount]);

  return (
    <Context.Provider
      value={{
        wishlistCount,
        setWishlistCount,
        cartCount,
        setCartCount,
      }}
    >
      {children}
    </Context.Provider>
  );
};
