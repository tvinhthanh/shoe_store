// src/services/cart.service.ts
export interface CartItem {
    id_product: number;
    id_variant: number;
    quantity: number;
}

const CART_KEY = "carts";

export const cartService = {
    getCart(): CartItem[] {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    },

    saveCart(cart: CartItem[]) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    },

    add(item: CartItem) {
        const cart = this.getCart();
        const exist = cart.find((x) => x.id_variant === item.id_variant);

        if (exist) exist.quantity += item.quantity;
        else cart.push({ ...item });

        this.saveCart(cart);
    },

    update(id_variant: number, quantity: number) {
        const cart = this.getCart().map((x) =>
            x.id_variant === id_variant ? { ...x, quantity } : x
        );
        this.saveCart(cart);
    },

    remove(id_variant: number) {
        const cart = this.getCart().filter((x) => x.id_variant !== id_variant);
        this.saveCart(cart);
    },

    clear() {
        localStorage.removeItem(CART_KEY);
    },

    count(): number {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    },
};
