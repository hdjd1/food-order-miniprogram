import { create } from 'zustand'

export interface CartItem {
  dishId: number
  dishName: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  tableNo: string
  addItem: (dish: { id: number; name: string; price: number; image: string }) => void
  removeItem: (dishId: number) => void
  updateQuantity: (dishId: number, delta: number) => void
  clearCart: () => void
  setTableNo: (no: string) => void
  totalCount: () => number
  totalAmount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tableNo: 'A01',

  addItem: (dish) => {
    set((state) => {
      const existing = state.items.find((item) => item.dishId === dish.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.dishId === dish.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            dishId: dish.id,
            dishName: dish.name,
            price: dish.price,
            quantity: 1,
            image: dish.image,
          },
        ],
      }
    })
  },

  removeItem: (dishId) => {
    set((state) => ({
      items: state.items.filter((item) => item.dishId !== dishId),
    }))
  },

  updateQuantity: (dishId, delta) => {
    set((state) => {
      const items = state.items
        .map((item) =>
          item.dishId === dishId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0)
      return { items }
    })
  },

  clearCart: () => set({ items: [] }),

  setTableNo: (no) => set({ tableNo: no }),

  totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalAmount: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}))