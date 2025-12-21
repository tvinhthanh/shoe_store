import { createContext, useContext, useEffect, useState } from "react";
import { cartService, CartItem } from "../services/cart.service";

interface CartContextType {
    items: CartItem[];
    count: number;
    refresh: () => void;
}

const CartContext = createContext<CartContextType>({
    items: [],
    count: 0,
    refresh: () => { }
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: any) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [count, setCount] = useState(0);

    const refresh = () => {
        const list = cartService.getCart();
        setItems(list);
        setCount(list.length);
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <CartContext.Provider value={{ items, count, refresh }}>
            {children}
        </CartContext.Provider>
    );
};
