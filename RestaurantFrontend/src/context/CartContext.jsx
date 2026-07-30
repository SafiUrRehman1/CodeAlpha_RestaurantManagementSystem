import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");

    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(menuItem) {
    setCartItems(current => {
      const existing = current.find(i => i.id === menuItem.id);

      if (existing) {
        return current.map(i =>
          i.id === menuItem.id
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        );
      }

      return [
        ...current,
        {
          ...menuItem,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setCartItems(current =>
      current.filter(i => i.id !== id)
    );
  }

  function increaseQuantity(id) {
    setCartItems(current =>
      current.map(i =>
        i.id === id
          ? {
              ...i,
              quantity: i.quantity + 1,
            }
          : i
      )
    );
  }

  function decreaseQuantity(id) {
    setCartItems(current =>
      current
        .map(i =>
          i.id === id
            ? {
                ...i,
                quantity: i.quantity - 1,
              }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}