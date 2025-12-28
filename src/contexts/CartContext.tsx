"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  hamperId: string;
  name: string;
  price: number;
  image: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (hamperId: string) => void;
  updateQuantity: (hamperId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (hamperId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (session?.user) {
      const savedCart = localStorage.getItem(`cart_${session.user.id}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to load cart:", error);
        }
      }
      setIsLoaded(true);
    }
  }, [session?.user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && session?.user) {
      localStorage.setItem(`cart_${session.user.id}`, JSON.stringify(items));
    }
  }, [items, session?.user, isLoaded]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (i) => i.hamperId === item.hamperId
      );

      if (existingItem) {
        // Increase quantity if already in cart (up to stock limit)
        return currentItems.map((i) =>
          i.hamperId === item.hamperId
            ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
            : i
        );
      } else {
        // Add new item with quantity 1
        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (hamperId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.hamperId !== hamperId)
    );
  };

  const updateQuantity = (hamperId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(hamperId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.hamperId === hamperId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (hamperId: string) => {
    return items.some((item) => item.hamperId === hamperId);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
