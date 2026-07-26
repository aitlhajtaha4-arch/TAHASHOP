"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  color: string;
  storage: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number, color: string) => void;
  updateQuantity: (id: number, color: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  applyCoupon: (code: string) => boolean;
  discount: number;
  couponCode: string;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
  applyCoupon: () => false,
  discount: 0,
  couponCode: "",
});

const COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SAVE20: 20,
  VIP30: 30,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.color === item.color);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.color === item.color ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: number, color: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)));
  }, []);

  const updateQuantity = useCallback((id: number, color: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.color === color ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode("");
    setDiscount(0);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const d = COUPONS[code.toUpperCase()];
    if (d) {
      setCouponCode(code.toUpperCase());
      setDiscount(d);
      return true;
    }
    return false;
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, applyCoupon, discount, couponCode }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
