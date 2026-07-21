import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartCustomization = {
  imageUrls: string[];
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  value: number;
  quantity: number;
  freight: boolean;
  isCustomizable: boolean;
  customizableSlots?: number | null;
  imageUrl?: string;
  customization?: CartCustomization;
};

type CartState = {
  storeId: string | null;
  items: CartItem[];
  isOpen: boolean;
  setStoreId: (storeId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  updateCustomization: (id: string, customization: CartCustomization) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      storeId: null,
      items: [],
      isOpen: false,
      setStoreId: (storeId) => {
        const current = get().storeId;
        if (current && current !== storeId) {
          set({ storeId, items: [] });
          return;
        }
        set({ storeId });
      },
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (item) => {
        const id = crypto.randomUUID();
        set((s) => ({
          items: [
            ...s.items,
            {
              ...item,
              id,
              quantity: item.quantity ?? 1,
            },
          ],
          isOpen: true,
        }));
      },
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, quantity } : i,
          ),
        }));
      },
      updateCustomization: (id, customization) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, customization } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + Number(i.value) * i.quantity, 0),
    }),
    {
      name: 'cart-storage',
      partialize: (s) => ({ storeId: s.storeId, items: s.items }),
    },
  ),
);
